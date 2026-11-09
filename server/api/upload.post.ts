import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { uploadToR2, isR2Configured } from "../utils/r2";

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);

  if (!form || form.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "សូមជ្រើសរើស File រូបភាពដើម្បី Upload",
    });
  }

  // Find the file item in the form
  const file = form.find((item) => item.name === "file" || item.filename);
  if (!file || !file.data) {
    throw createError({
      statusCode: 400,
      statusMessage: "មិនមានទិន្នន័យរូបភាពត្រឹមត្រូវឡើយ",
    });
  }

  const rawFilename = file.filename || `image-${Date.now()}.png`;
  const originalContentType = file.type || "image/png";

  // Validate mime type
  if (!originalContentType.startsWith("image/")) {
    throw createError({
      statusCode: 400,
      statusMessage: "អនុញ្ញាតតែឯកសារប្រភេទរូបភាពប៉ុណ្ណោះ (image/*)",
    });
  }

  // Validate size (10MB max)
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.data.length > MAX_SIZE) {
    throw createError({
      statusCode: 400,
      statusMessage: "ទំហំរូបភាពមិនត្រូវលើសពី 10MB ឡើយ",
    });
  }

  // Convert image to WebP with auto-rotation (unless SVG)
  let processedBuffer: Buffer = file.data;
  let finalContentType = originalContentType;
  let finalFilename = rawFilename;

  if (originalContentType === "image/svg+xml") {
    // Keep SVG as vector
    finalContentType = "image/svg+xml";
  } else {
    try {
      processedBuffer = await sharp(file.data)
        .rotate() // Auto-orient using EXIF orientation tag
        .webp({ quality: 82, effort: 4 })
        .toBuffer();

      finalContentType = "image/webp";
      const nameWithoutExt = rawFilename.replace(/\.[^/.]+$/, "");
      finalFilename = `${nameWithoutExt}.webp`;
    } catch (err: any) {
      console.warn("Sharp WebP conversion skipped or failed:", err?.message);
    }
  }

  let fileUrl = "";

  // 1. If Cloudflare R2 is configured, upload to R2
  if (isR2Configured()) {
    try {
      fileUrl = await uploadToR2({
        fileBuffer: processedBuffer,
        filename: finalFilename,
        contentType: finalContentType,
      });
    } catch (err: any) {
      console.error("Cloudflare R2 upload error:", err);
      throw createError({
        statusCode: 500,
        statusMessage: `ការ Upload ទៅ Cloudflare R2 មានបញ្ហា: ${err.message || ""}`,
      });
    }
  } else {
    // 2. Fallback: Save to local public/uploads directory
    try {
      const publicUploadsDir = path.resolve(process.cwd(), "public/uploads");
      await fs.mkdir(publicUploadsDir, { recursive: true });

      const ext = finalFilename.includes(".") ? finalFilename.split(".").pop() : "webp";
      const cleanExt = (ext || "webp").toLowerCase().replace(/[^a-z0-9]/g, "");
      const safeName = `${Date.now()}-${crypto.randomUUID()}.${cleanExt}`;
      const filePath = path.join(publicUploadsDir, safeName);

      await fs.writeFile(filePath, processedBuffer);
      fileUrl = `/uploads/${safeName}`;
    } catch (err: any) {
      console.error("Local disk upload fallback error:", err);
      throw createError({
        statusCode: 500,
        statusMessage: "មិនអាចរក្សាទុករូបភាពនៅលើម៉ាស៊ីនបម្រើបានឡើយ",
      });
    }
  }

  // Format compatible with WangEditor and standard JSON APIs
  return {
    errno: 0,
    success: true,
    data: {
      url: fileUrl,
      alt: finalFilename,
      href: fileUrl,
    },
    url: fileUrl,
  };
});
