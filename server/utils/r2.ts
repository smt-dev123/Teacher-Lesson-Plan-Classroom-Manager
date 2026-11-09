import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * Returns true if Cloudflare R2 environment variables are configured.
 */
export const isR2Configured = (): boolean => {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  );
};

/**
 * Creates and returns an S3 client configured for Cloudflare R2.
 */
export const getR2Client = (): S3Client | null => {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
};

/**
 * Uploads a file buffer to Cloudflare R2 bucket and returns its public URL.
 */
export const uploadToR2 = async ({
  fileBuffer,
  filename,
  contentType,
}: {
  fileBuffer: Buffer | Uint8Array;
  filename: string;
  contentType: string;
}): Promise<string> => {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME;
  const publicDomain = process.env.R2_PUBLIC_DOMAIN;

  if (!client || !bucket) {
    throw new Error("Cloudflare R2 is not fully configured in environment variables.");
  }

  // Generate safe unique key
  const ext = filename.includes(".") ? filename.split(".").pop() : "png";
  const cleanExt = (ext || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const key = `uploads/${Date.now()}-${crypto.randomUUID()}.${cleanExt}`;

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    })
  );

  // Construct public URL
  if (publicDomain && publicDomain.trim()) {
    let domain = publicDomain.trim().replace(/\/+$/, "");
    if (!domain.startsWith("http://") && !domain.startsWith("https://")) {
      domain = `https://${domain}`;
    }
    return `${domain}/${key}`;
  }

  // Fallback endpoint if public domain is not set
  return `https://${bucket}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;
};
