import { db, lessonPlans, users, assignments, questions } from "./index";

export async function seedDatabase() {
  // Check if already seeded
  const existingPlans = await db.select().from(lessonPlans);
  if (existingPlans.length > 0) {
    console.log("Database already has data, skipping seed.");
    return;
  }

  console.log("Seeding database...");

  // Seed Users
  await db.insert(users).values([
    {
      id: "user-1",
      name: "លោកគ្រូ សុខ ចាន់ថន",
      email: "chanthorn.sok@school.edu.kh",
      phone: "012 345 678",
      role: "គ្រូបង្រៀន",
      subject: "រូបវិទ្យា",
      status: "សកម្ម",
    },
    {
      id: "user-2",
      name: "អ្នកគ្រូ កែវ មុនីរ័ត្ន",
      email: "moniroth.keo@school.edu.kh",
      phone: "098 765 432",
      role: "គ្រូបង្រៀន",
      subject: "គណិតវិទ្យា",
      status: "សកម្ម",
    },
    {
      id: "user-3",
      name: "លោកគ្រូ ហេង វិបុល",
      email: "vibol.heng@school.edu.kh",
      phone: "011 223 344",
      role: "ប្រធានដេប៉ាតឺម៉ង់",
      subject: "គីមីវិទ្យា",
      status: "សកម្ម",
    },
    {
      id: "user-4",
      name: "អ្នកគ្រូ ឈិន ស្រីលក្ខណ៍",
      email: "sreyleak.chhin@school.edu.kh",
      phone: "077 889 900",
      role: "អ្នកគ្រប់គ្រង",
      subject: "ទូទៅ",
      status: "សកម្ម",
    },
  ]);

  // Seed Lesson Plans
  await db.insert(lessonPlans).values([
    {
      id: "plan-1",
      subject: "រូបវិទ្យា",
      grade: "ថ្នាក់ទី៩",
      chapter: "ជំពូកទី ២៖ កម្លាំង និងចលនា",
      topic: "ច្បាប់ទី២ញូតុន (F = ma)",
      date: "2026-11-06",
      duration: "៥០ នាទី",
      objKnowledge:
        "<p>សិស្សអាចថ្លែងពី<strong>និយមន័យនៃច្បាប់ទី២ញូតុន</strong> និងទាញយករូបមន្ត <code>F = m · a</code> បានត្រឹមត្រូវ។</p>",
      objSkills:
        "<p>សិស្សអាចគណនាកម្លាំង ម៉ាស ឬសំទុះ តាមលំហាត់គំរូជាក់ស្តែងបានដោយឥតខុសឆ្គង។</p>",
      objAttitude:
        "<p>បណ្តុះស្មារតីសង្កេត ចង់ចេះចង់ដឹង និងការសហការបំពេញការងារជាក្រុម។</p>",
      materials: "រទេះពិសោធន៍, ឌីណាម៉ូម៉ែត្រ, ផ្ទាំងរូបភាពរូបមន្ត",
      references: "សៀវភៅពុម្ពទំព័រ ៥០ ដល់ ៥៤",
      step1Teacher: "<p>ពិនិត្យអនាម័យ ឯកសណ្ឋានសិស្ស និងកត់ត្រាវត្តមាន</p>",
      step1Student: "<p>ប្រធានថ្នាក់រាយការណ៍វត្តមាន</p>",
      step2Teacher: "<p>សួរ៖ តើច្បាប់ទី១ញូតុនចែងដូចម្តេច?</p>",
      step2Student: "<p>សិស្សឡើងឆ្លើយនិយមន័យច្បាប់និចលភាព</p>",
      step3Content:
        "<p><strong>រូបមន្តគន្លឹះ៖</strong> <code>F = m · a</code></p><ul><li><strong>F</strong>: កម្លាំងគិតជា ញូតុន (N)</li><li><strong>m</strong>: ម៉ាសគិតជា គីឡូក្រាម (kg)</li><li><strong>a</strong>: សំទុះគិតជា (m/s²)</li></ul>",
      step3Teacher: "<p>បង្ហាញការពិសោធន៍ទាញរទេះដោយកម្លាំងខុសៗគ្នា</p>",
      step3Student: "<p>សង្កេត ពិភាក្សាជាដៃគូ កត់ត្រារូបមន្ត</p>",
      step4Teacher: "<p>ដាក់លំហាត់៖ ម៉ាស 5kg រងកម្លាំង 20N រកសំទុះ?</p>",
      step4Student: "<p>អនុវត្តគណនាក្នុងសៀវភៅព្រាង</p>",
      step5Teacher: "<p>សង្ខេបចំណុចសំខាន់ ដាក់លំហាត់ផ្ទះទំព័រ ៥៥</p>",
      step5Student: "<p>កត់ត្រាកិច្ចការផ្ទះ</p>",
    },
    {
      id: "plan-2",
      subject: "គណិតវិទ្យា",
      grade: "ថ្នាក់ទី១០",
      chapter: "ជំពូកទី ១៖ អនុគមន៍ដឺក្រេទី២",
      topic: "សមីការដឺក្រេទី២ មានមួយអថេរ (ax² + bx + c = 0)",
      date: "2026-11-08",
      duration: "៥០ នាទី",
      objKnowledge:
        "<p>សិស្សអាចចងចាំរូបមន្តឌីសគ្រីមីណង់ <strong>Δ = b² - 4ac</strong> និងលក្ខខណ្ឌឬសនៃសមីការ។</p>",
      objSkills:
        "<p>សិស្សចេះគណនា discriminant Δ និងទាញរកឬសនៃសមីការដឺក្រេទី២ បានត្រឹមត្រូវ។</p>",
      objAttitude:
        "<p>បណ្តុះទម្លាប់ផ្ទៀងផ្ទាត់ចម្លើយ និងការគិតប្រកបដោយហេតុផល។</p>",
      materials: "ក្តារខៀន, បន្ទាត់, ស្លាយរូបមន្ត",
      references: "សៀវភៅសិក្សាគោលគណិតវិទ្យាថ្នាក់ទី១០ ទំព័រ ៧៥",
      step1Teacher: "<p>ពិនិត្យវត្តមាន និងសណ្តាប់ធ្នាប់ក្នុងថ្នាក់</p>",
      step1Student: "<p>ចូលរៀនទាន់ពេលវេលា និងរាយការណ៍វត្តមាន</p>",
      step2Teacher: "<p>រំលឹកការដាក់ជាផលគុណកត្តា (x - a)(x - b) = 0</p>",
      step2Student: "<p>ឡើងដោះស្រាយលំហាត់រំលឹកលើក្តារខៀន</p>",
      step3Content:
        "<p><strong>រូបមន្តឌីសគ្រីមីណង់៖</strong></p><p><code>Δ = b² - 4ac</code></p><ul><li>បើ <strong>Δ > 0</strong>៖ សមីការមានឬសពីរផ្សេងគ្នា</li><li>បើ <strong>Δ = 0</strong>៖ សមីការមានឬសឌុប x = -b / 2a</li><li>បើ <strong>Δ < 0</strong>៖ សមីការគ្មានឬសក្នុង ℝ</li></ul>",
      step3Teacher: "<p>ពន្យល់ទ្រឹស្តី និងដោះស្រាយលំហាត់គំរូ</p>",
      step3Student: "<p>ស្តាប់ការបកស្រាយ និងកត់ត្រា</p>",
      step4Teacher: "<p>ដាក់លំហាត់អនុវត្ត៖ x² - 5x + 6 = 0</p>",
      step4Student: "<p>ធ្វើការជាដៃគូដើម្បីស្វែងរកចម្លើយ</p>",
      step5Teacher: "<p>ដាក់កិច្ចការផ្ទះលំហាត់លេខ ៣ និង ៤</p>",
      step5Student: "<p>កត់ត្រាកិច្ចការផ្ទះ</p>",
    },
    {
      id: "plan-3",
      subject: "គីមីវិទ្យា",
      grade: "ថ្នាក់ទី៨",
      chapter: "ជំពូកទី ៣៖ ធាតុគីមី និងសមាសធាតុ",
      topic: "ទម្រង់អាតូម និងអេឡិចត្រុង",
      date: "2026-11-09",
      duration: "៥០ នាទី",
      objKnowledge:
        "<p>សិស្សអាចរៀបរាប់ពីភាគល្អិតគ្រឹះរបស់អាតូម (ប្រូតុង ណឺត្រុង អេឡិចត្រុង)។</p>",
      objSkills:
        "<p>សិស្សអាចគូសប្លង់ទម្រង់អាតូមសាមញ្ញបាន។</p>",
      objAttitude:
        "<p>ស្រឡាញ់ការស្រាវជ្រាវវិទ្យាសាស្ត្រ និងការពិសោធន៍។</p>",
      materials: "គំរូទម្រង់អាតូម 3D, តារាងខួបនៃធាតុគីមី",
      references: "សៀវភៅគីមីវិទ្យាថ្នាក់ទី៨",
      step1Teacher: "<p>ពិនិត្យវត្តមានសិស្ស</p>",
      step1Student: "<p>អង្គុយតាមតុរៀបរយ</p>",
      step2Teacher: "<p>សួរ៖ តើសារធាតុផ្សំឡើងពីអ្វី?</p>",
      step2Student: "<p>សិស្សឆ្លើយតាមចំណេះដឹងមុន</p>",
      step3Content:
        "<p><strong>ទម្រង់អាតូម៖</strong></p><ul><li>ណ្វៃយ៉ូ៖ ផ្ទុកប្រូតុង (+) និង ណឺត្រុង (0)</li><li>ស្រទាប់អេឡិចត្រុង៖ ផ្ទុកអេឡិចត្រុង (-) វិលជុំវិញ</li></ul>",
      step3Teacher: "<p>បង្ហាញគំរូអាតូមប័រ (Bohr model)</p>",
      step3Student: "<p>សង្កេត និងគូររូបចូលសៀវភៅ</p>",
      step4Teacher: "<p>សួរសំណួរពង្រឹងការចងចាំ</p>",
      step4Student: "<p>ឆ្លើយសំណួរជាបុគ្គល</p>",
      step5Teacher: "<p>រំលឹកឱ្យសិស្សមើលតារាងខួបសម្រាប់ម៉ោងក្រោយ</p>",
      step5Student: "<p>កត់ចំណាំ</p>",
    },
  ]);

  // Seed Assignments
  await db.insert(assignments).values([
    {
      id: "assign-1",
      title: "លំហាត់ច្បាប់ទី២ញូតុន",
      subject: "រូបវិទ្យា",
      grade: "ថ្នាក់ទី៩",
      due: "2026-11-12",
      total: 35,
      submitted: 28,
      status: "pending",
    },
    {
      id: "assign-2",
      title: "កិច្ចការសមីការដឺក្រេទី២",
      subject: "គណិតវិទ្យា",
      grade: "ថ្នាក់ទី១០",
      due: "2026-11-15",
      total: 40,
      submitted: 40,
      status: "completed",
    },
  ]);

  console.log("Seeding completed successfully!");
}

if (import.meta.main) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seed error:", err);
      process.exit(1);
    });
}
