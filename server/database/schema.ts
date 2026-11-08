import { pgTable, text, timestamp, integer, jsonb, varchar } from "drizzle-orm/pg-core";

export const lessonPlans = pgTable("lesson_plans", {
  id: varchar("id", { length: 64 }).primaryKey(),
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

export type LessonPlanRecord = typeof lessonPlans.$inferSelect;
export type InsertLessonPlan = typeof lessonPlans.$inferInsert;
export type UserRecord = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
