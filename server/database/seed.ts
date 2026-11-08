import {
  db,
  lessonPlans,
  users,
  assignments,
  schools,
  academicYears,
  subjects,
} from "./index";

export async function seedDatabase() {
  console.log("Seeding database...");

  // 1. Seed School
  const existingSchools = await db.select().from(schools);
  if (existingSchools.length === 0) {
    await db.insert(schools).values({
      id: "sch-1",
      name: "វិទ្យាល័យ ហ៊ុន សែន មិត្តភាព",
      code: "HSM",
      level: "វិទ្យាល័យ",
      province: "រាជធានីភ្នំពេញ",
      district: "ខណ្ឌ៧មករា",
      phone: "023 880 990",
      email: "info@mittapheap.edu.kh",
      logo: "",
    });
  }

  // 2. Seed Academic Years
  const existingYears = await db.select().from(academicYears);
  if (existingYears.length === 0) {
    await db.insert(academicYears).values([
      {
        id: "ay-2023-2024",
        name: "2023 - 2024",
        code: "2023-2024",
        startDate: "2023-10-01",
        endDate: "2024-07-31",
        isCurrent: false,
      },
      {
        id: "ay-2024-2025",
        name: "2024 - 2025",
        code: "2024-2025",
        startDate: "2024-10-01",
        endDate: "2025-07-31",
        isCurrent: true,
      },
      {
        id: "ay-2025-2026",
        name: "2025 - 2026",
        code: "2025-2026",
        startDate: "2025-10-01",
        endDate: "2026-07-31",
        isCurrent: false,
      },
      {
        id: "ay-2026-2027",
        name: "2026 - 2027",
        code: "2026-2027",
        startDate: "2026-10-01",
        endDate: "2027-07-31",
        isCurrent: false,
      },
    ]);
  }

  // 3. Seed Subjects
  const existingSubjects = await db.select().from(subjects);
  if (existingSubjects.length === 0) {
    await db.insert(subjects).values([
      {
        id: "sub-1",
        schoolId: "sch-1",
        name: "រូបវិទ្យា",
        code: "PHY",
        grades: [
          "ថ្នាក់ទី៧",
          "ថ្នាក់ទី៨",
          "ថ្នាក់ទី៩",
          "ថ្នាក់ទី១០",
          "ថ្នាក់ទី១១",
          "ថ្នាក់ទី១២",
        ],
        color: "#0284c7",
        description: "មុខវិជ្ជាសិក្សាអំពីកម្លាំង ចលនា ថាមពល និងបាតុភូតរូបវន្ត",
        totalHours: 60,
      },
      {
        id: "sub-2",
        schoolId: "sch-1",
        name: "គណិតវិទ្យា",
        code: "MATH",
        grades: [
          "ថ្នាក់ទី៧",
          "ថ្នាក់ទី៨",
          "ថ្នាក់ទី៩",
          "ថ្នាក់ទី១០",
          "ថ្នាក់ទី១១",
          "ថ្នាក់ទី១២",
        ],
        color: "#16a34a",
        description: "ពិជគណិត ធរណីមាត្រ ត្រីកោណមាត្រ និងគណិតវិភាគ",
        totalHours: 120,
      },
      {
        id: "sub-3",
        schoolId: "sch-1",
        name: "គីមីវិទ្យា",
        code: "CHEM",
        grades: ["ថ្នាក់ទី៨", "ថ្នាក់ទី៩", "ថ្នាក់ទី១០", "ថ្នាក់ទី១១", "ថ្នាក់ទី១២"],
        color: "#ea580c",
        description: "សិក្សាអំពីធាតុគីមី សមាសធាតុ ប្រតិកម្មគីមី និងការពិសោធន៍",
        totalHours: 60,
      },
      {
        id: "sub-4",
        schoolId: "sch-1",
        name: "ជីវវិទ្យា",
        code: "BIO",
        grades: [
          "ថ្នាក់ទី៧",
          "ថ្នាក់ទី៨",
          "ថ្នាក់ទី៩",
          "ថ្នាក់ទី១០",
          "ថ្នាក់ទី១១",
          "ថ្នាក់ទី១២",
        ],
        color: "#059669",
        description: "សិក្សាអំពីកោសិកា សរីរាង្គ មេរៀនសត្វ រុក្ខជាតិ និងបរិស្ថាន",
        totalHours: 60,
      },
      {
        id: "sub-5",
        schoolId: "sch-1",
        name: "ភាសាខ្មែរ",
        code: "KHM",
        grades: [
          "ថ្នាក់ទី៧",
          "ថ្នាក់ទី៨",
          "ថ្នាក់ទី៩",
          "ថ្នាក់ទី១០",
          "ថ្នាក់ទី១១",
          "ថ្នាក់ទី១២",
        ],
        color: "#9333ea",
        description: "វេយ្យាករណ៍ខ្មែរ អក្សរសិល្ប៍ ការតែងសេចក្តី និងវប្បធម៌ទូទៅ",
        totalHours: 90,
      },
      {
        id: "sub-6",
        schoolId: "sch-1",
        name: "ប្រវត្តិវិទ្យា",
        code: "HIS",
        grades: [
          "ថ្នាក់ទី៧",
          "ថ្នាក់ទី៨",
          "ថ្នាក់ទី៩",
          "ថ្នាក់ទី១០",
          "ថ្នាក់ទី១១",
          "ថ្នាក់ទី១២",
        ],
        color: "#d97706",
        description: "ប្រវត្តិសាស្ត្រខ្មែរគ្រប់សម័យកាល និងប្រវត្តិសាស្ត្រពិភពលោក",
        totalHours: 45,
      },
      {
        id: "sub-7",
        schoolId: "sch-1",
        name: "ភូមិវិទ្យា",
        code: "GEO",
        grades: [
          "ថ្នាក់ទី៧",
          "ថ្នាក់ទី៨",
          "ថ្នាក់ទី៩",
          "ថ្នាក់ទី១០",
          "ថ្នាក់ទី១១",
          "ថ្នាក់ទី១២",
        ],
        color: "#0891b2",
        description: "ភូមិវិទ្យាកម្ពុជា ធនធានធម្មជាតិ និងអាកាសធាតុផែនដី",
        totalHours: 45,
      },
      {
        id: "sub-8",
        schoolId: "sch-1",
        name: "ភាសាអង់គ្លេស",
        code: "ENG",
        grades: [
          "ថ្នាក់ទី៧",
          "ថ្នាក់ទី៨",
          "ថ្នាក់ទី៩",
          "ថ្នាក់ទី១០",
          "ថ្នាក់ទី១១",
          "ថ្នាក់ទី១២",
        ],
        color: "#4f46e5",
        description: "ភាសាអង់គ្លេសទូទៅ ការសន្ទនា ការអាន និងវេយ្យាករណ៍",
        totalHours: 60,
      },
      {
        id: "sub-9",
        schoolId: "sch-1",
        name: "ព័ត៌មានវិទ្យា",
        code: "ICT",
        grades: [
          "ថ្នាក់ទី៧",
          "ថ្នាក់ទី៨",
          "ថ្នាក់ទី៩",
          "ថ្នាក់ទី១០",
          "ថ្នាក់ទី១១",
          "ថ្នាក់ទី១២",
        ],
        color: "#0d9488",
        description: "មូលដ្ឋានកុំព្យូទ័រ កម្មវិធីការិយាល័យ និងការសរសេរកូដសាមញ្ញ",
        totalHours: 45,
      },
    ]);
  }

  // 4. Update existing lesson plans with academicYear and schoolId if not set
  await db
    .update(lessonPlans)
    .set({
      schoolId: "sch-1",
      academicYear: "2024-2025",
    });

  // 5. Update existing users with schoolId
  await db
    .update(users)
    .set({
      schoolId: "sch-1",
    });

  console.log("Seeding finished successfully!");
}

if (import.meta.main) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seed error:", err);
      process.exit(1);
    });
}
