import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

export const schools = pgTable("schools", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  code: text("code").default(""),
  level: text("level").default("វិទ្យាល័យ"),
  province: text("province").default("រាជធានីភ្នំពេញ"),
  district: text("district").default(""),
  phone: text("phone").default(""),
  email: text("email").default(""),
  logo: text("logo").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const academicYears = pgTable("academic_years", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(), // e.g. "2024 - 2025"
  code: text("code").notNull(), // e.g. "2024-2025"
  startDate: text("start_date").default(""),
  endDate: text("end_date").default(""),
  isCurrent: boolean("is_current").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subjects = pgTable("subjects", {
  id: varchar("id", { length: 64 }).primaryKey(),
  schoolId: varchar("school_id", { length: 64 }).default("sch-1"),
  name: text("name").notNull(), // ឧ. រូបវិទ្យា
  code: text("code").default(""), // ឧ. PHY
  grades: jsonb("grades").default([]), // ["ថ្នាក់ទី៧", "ថ្នាក់ទី៨", "ថ្នាក់ទី៩", "ថ្នាក់ទី១០", "ថ្នាក់ទី១១", "ថ្នាក់ទី១២"]
  color: text("color").default("#0284c7"),
  description: text("description").default(""),
  totalHours: integer("total_hours").default(60),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const lessonPlans = pgTable("lesson_plans", {
  id: varchar("id", { length: 64 }).primaryKey(),
  schoolId: varchar("school_id", { length: 64 }).default("sch-1"),
  academicYear: text("academic_year").default("2024-2025").notNull(),
  subject: text("subject").notNull(),
  grade: text("grade").notNull(),
  chapter: text("chapter").default(""),
  topic: text("topic").notNull(),
  date: text("date").notNull(),
  duration: text("duration").default("៥០ នាទី"),
  objKnowledge: text("obj_knowledge").default(""),
  objSkills: text("obj_skills").default(""),
  objAttitude: text("obj_attitude").default(""),
  materials: text("materials").default(""),
  references: text("references").default(""),
  step1Teacher: text("step1_teacher").default(""),
  step1Student: text("step1_student").default(""),
  step2Teacher: text("step2_teacher").default(""),
  step2Student: text("step2_student").default(""),
  step3Content: text("step3_content").default(""),
  step3Teacher: text("step3_teacher").default(""),
  step3Student: text("step3_student").default(""),
  step4Teacher: text("step4_teacher").default(""),
  step4Student: text("step4_student").default(""),
  step5Teacher: text("step5_teacher").default(""),
  step5Student: text("step5_student").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  schoolId: varchar("school_id", { length: 64 }).default("sch-1"),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").default(""),
  role: text("role").default("គ្រូបង្រៀន"),
  subject: text("subject").default(""),
  status: text("status").default("សកម្ម"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const assignments = pgTable("assignments", {
  id: varchar("id", { length: 64 }).primaryKey(),
  schoolId: varchar("school_id", { length: 64 }).default("sch-1"),
  academicYear: text("academic_year").default("2024-2025"),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  grade: text("grade").notNull(),
  due: text("due").default(""),
  total: integer("total").default(0),
  submitted: integer("submitted").default(0),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  type: text("type").notNull(),
  subject: text("subject").notNull(),
  grade: text("grade").notNull(),
  chapter: text("chapter").default(""),
  difficulty: text("difficulty").default("medium"),
  content: text("content").notNull(),
  options: jsonb("options"),
  correctAnswer: text("correct_answer").default(""),
  explanation: text("explanation").default(""),
  points: integer("points").default(1),
  tags: jsonb("tags"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SchoolRecord = typeof schools.$inferSelect;
export type InsertSchool = typeof schools.$inferInsert;
export type AcademicYearRecord = typeof academicYears.$inferSelect;
export type InsertAcademicYear = typeof academicYears.$inferInsert;
export type SubjectRecord = typeof subjects.$inferSelect;
export type InsertSubject = typeof subjects.$inferInsert;
export type LessonPlanRecord = typeof lessonPlans.$inferSelect;
export type InsertLessonPlan = typeof lessonPlans.$inferInsert;
export type UserRecord = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
