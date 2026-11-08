import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  VerticalAlign,
  UnderlineType,
} from "docx";
import type { LessonPlan } from "~/types";

const KHMER_FONT_BODY = "Khmer OS Battambang";
const KHMER_FONT_MUOL = "Khmer OS Muol Light";
const Tacteing = "Tacteing";

const borderThin = {
  style: BorderStyle.SINGLE,
  size: 4,
  color: "94a3b8",
};

const borderNone = {
  style: BorderStyle.NONE,
  size: 0,
  color: "auto",
};

const tableBordersThin = {
  top: borderThin,
  bottom: borderThin,
  left: borderThin,
  right: borderThin,
  insideHorizontal: borderThin,
  insideVertical: borderThin,
};

const tableBordersNone = {
  top: borderNone,
  bottom: borderNone,
  left: borderNone,
  right: borderNone,
  insideHorizontal: borderNone,
  insideVertical: borderNone,
};

interface TextRunOption {
  bold?: boolean;
  italics?: boolean;
  underline?: boolean;
  color?: string;
}

/**
 * Recursively extracts TextRun elements from a DOM node preserving bold, italic, underline and line breaks.
 */
function extractRunsFromNode(
  node: Node,
  state: TextRunOption = {},
  fontSize = 20,
): TextRun[] {
  const runs: TextRun[] = [];

  if (node.nodeType === 3) {
    // TEXT_NODE
    const text = node.textContent;
    if (text) {
      runs.push(
        new TextRun({
          text,
          bold: state.bold,
          italics: state.italics,
          underline: state.underline
            ? { type: UnderlineType.SINGLE }
            : undefined,
          font: KHMER_FONT_BODY,
          size: fontSize,
          color: state.color,
        }),
      );
    }
    return runs;
  }

  if (node.nodeType === 1) {
    // ELEMENT_NODE
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (tag === "br") {
      runs.push(new TextRun({ break: 1 }));
      return runs;
    }

    const nextState: TextRunOption = {
      bold: state.bold || tag === "strong" || tag === "b",
      italics: state.italics || tag === "em" || tag === "i",
      underline: state.underline || tag === "u",
      color: state.color,
    };

    for (const child of Array.from(el.childNodes)) {
      runs.push(...extractRunsFromNode(child, nextState, fontSize));
    }
  }

  return runs;
}

/**
 * Converts HTML string (such as WangEditor output) into an array of docx Paragraphs.
 */
export function htmlToDocxParagraphs(
  html: string | undefined | null,
  options?: {
    fontSize?: number;
    afterSpacing?: number;
    lineSpacing?: number;
    bulletIndent?: number;
    prefixRun?: TextRun;
    fallbackText?: string;
  },
): Paragraph[] {
  const fontSize = options?.fontSize ?? 20; // 10pt by default
  const afterSpacing = options?.afterSpacing ?? 60;
  const lineSpacing = options?.lineSpacing ?? 260;
  const fallback = options?.fallbackText ?? "- គ្មានសកម្មភាព";

  if (!html || !html.trim()) {
    const children: TextRun[] = [];
    if (options?.prefixRun) children.push(options.prefixRun);
    children.push(
      new TextRun({
        text: fallback,
        italics: true,
        font: KHMER_FONT_BODY,
        size: fontSize,
        color: "94a3b8",
      }),
    );
    return [
      new Paragraph({
        children,
        spacing: { after: afterSpacing, line: lineSpacing },
      }),
    ];
  }

  // SSR or environment without DOMParser
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    const clean = html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const children: TextRun[] = [];
    if (options?.prefixRun) children.push(options.prefixRun);
    children.push(
      new TextRun({
        text: clean || fallback,
        font: KHMER_FONT_BODY,
        size: fontSize,
      }),
    );
    return [
      new Paragraph({
        children,
        spacing: { after: afterSpacing, line: lineSpacing },
      }),
    ];
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const body = doc.body;

  const paragraphs: Paragraph[] = [];
  let isFirstParagraph = true;

  function processBlocks(parent: HTMLElement) {
    for (const child of Array.from(parent.childNodes)) {
      if (child.nodeType === 3) {
        // Plain text node
        const text = child.textContent?.trim();
        if (text) {
          const children: TextRun[] = [];
          if (isFirstParagraph && options?.prefixRun) {
            children.push(options.prefixRun);
            isFirstParagraph = false;
          }
          children.push(
            new TextRun({
              text,
              font: KHMER_FONT_BODY,
              size: fontSize,
            }),
          );
          paragraphs.push(
            new Paragraph({
              children,
              spacing: { after: afterSpacing, line: lineSpacing },
            }),
          );
        }
      } else if (child.nodeType === 1) {
        // Element node
        const el = child as HTMLElement;
        const tag = el.tagName.toLowerCase();

        if (tag === "ul" || tag === "ol") {
          const isOrdered = tag === "ol";
          let num = 1;
          for (const li of Array.from(el.children)) {
            if (li.tagName.toLowerCase() === "li") {
              const marker = isOrdered ? `${num}. ` : "• ";
              const runs = extractRunsFromNode(li, {}, fontSize);
              paragraphs.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: marker,
                      bold: true,
                      font: KHMER_FONT_BODY,
                      size: fontSize,
                    }),
                    ...runs,
                  ],
                  indent: { left: options?.bulletIndent ?? 360 },
                  spacing: { after: 40, line: lineSpacing },
                }),
              );
              num++;
            }
          }
        } else if (
          tag === "p" ||
          tag === "div" ||
          tag.startsWith("h") ||
          tag === "blockquote"
        ) {
          const runs = extractRunsFromNode(el, {}, fontSize);
          if (runs.length > 0) {
            const children: TextRun[] = [];
            if (isFirstParagraph && options?.prefixRun) {
              children.push(options.prefixRun);
              isFirstParagraph = false;
            }
            children.push(...runs);
            paragraphs.push(
              new Paragraph({
                children,
                spacing: { after: afterSpacing, line: lineSpacing },
              }),
            );
          }
        } else {
          processBlocks(el);
        }
      }
    }
  }

  processBlocks(body);

  if (paragraphs.length === 0) {
    const raw = body.textContent?.trim();
    const children: TextRun[] = [];
    if (options?.prefixRun) children.push(options.prefixRun);
    children.push(
      new TextRun({
        text: raw || fallback,
        italics: !raw,
        font: KHMER_FONT_BODY,
        size: fontSize,
        color: !raw ? "94a3b8" : undefined,
      }),
    );
    paragraphs.push(
      new Paragraph({
        children,
        spacing: { after: afterSpacing, line: lineSpacing },
      }),
    );
  }

  return paragraphs;
}

/**
 * Generates and downloads a .docx file for the given lesson plan.
 */
export async function exportLessonPlanToDocx(plan: LessonPlan): Promise<void> {
  const steps = [
    {
      stepName: "ជំហានទី១",
      title: "ពិនិត្យវត្តមាន & សណ្តាប់ធ្នាប់",
      teacher: plan.step1Teacher,
      student: plan.step1Student,
      description: "ពិនិត្យអនាម័យ សណ្តាប់ធ្នាប់ និងវត្តមានសិស្សក្នុងថ្នាក់",
      contentHtml: null,
    },
    {
      stepName: "ជំហានទី២",
      title: "រំលឹកមេរៀនចាស់",
      teacher: plan.step2Teacher,
      student: plan.step2Student,
      description: "សួរសំណួររំលឹកចំណុចសំខាន់ៗនៃមេរៀនមុន",
      contentHtml: null,
    },
    {
      stepName: "ជំហានទី៣",
      title: "មេរៀនថ្មី & ខ្លឹមសារ",
      teacher: plan.step3Teacher,
      student: plan.step3Student,
      description: "ខ្លឹមសារ និងទ្រឹស្តីគន្លឹះនៃមេរៀនថ្មី",
      contentHtml: plan.step3Content,
    },
    {
      stepName: "ជំហានទី៤",
      title: "ពង្រឹងចំណេះដឹង (ពង្រឹងពុទ្ធិ)",
      teacher: plan.step4Teacher,
      student: plan.step4Student,
      description: "សំណួរ និងលំហាត់អនុវត្តពង្រឹងការយល់ដឹង",
      contentHtml: null,
    },
    {
      stepName: "ជំហានទី៥",
      title: "បណ្តាំផ្ញើ & កិច្ចការផ្ទះ",
      teacher: plan.step5Teacher,
      student: plan.step5Student,
      description: "ដាក់កិច្ចការស្រាវជ្រាវ និងការរំលឹកឱ្យសិស្សមើលមេរៀនបន្ត",
      contentHtml: null,
    },
  ];

  // Table rows for the 5-step teaching process
  const stepRows: TableRow[] = steps.map((step) => {
    // 1. Column: Teacher activities
    const teacherParagraphs = htmlToDocxParagraphs(step.teacher, {
      fontSize: 20,
      afterSpacing: 40,
    });

    // 2. Column: Lesson Content (Step title + detailed content / description)
    const middleParagraphs: Paragraph[] = [
      new Paragraph({
        children: [
          new TextRun({
            text: `${step.stepName}៖ ${step.title}`,
            bold: true,
            font: KHMER_FONT_BODY,
            size: 20,
            color: "0c4a6e",
          }),
        ],
        spacing: { after: 60, line: 260 },
      }),
    ];

    if (step.contentHtml) {
      const contentParas = htmlToDocxParagraphs(step.contentHtml, {
        fontSize: 20,
        afterSpacing: 40,
      });
      middleParagraphs.push(...contentParas);
    } else {
      middleParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: step.description,
              font: KHMER_FONT_BODY,
              size: 19,
              color: "475569",
            }),
          ],
          spacing: { after: 40, line: 260 },
        }),
      );
    }

    // 3. Column: Student activities
    const studentParagraphs = htmlToDocxParagraphs(step.student, {
      fontSize: 20,
      afterSpacing: 40,
    });

    const cellPadding = { top: 120, bottom: 120, left: 140, right: 140 };

    return new TableRow({
      children: [
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          verticalAlign: VerticalAlign.TOP,
          margins: cellPadding,
          children: teacherParagraphs,
        }),
        new TableCell({
          width: { size: 40, type: WidthType.PERCENTAGE },
          verticalAlign: VerticalAlign.TOP,
          margins: cellPadding,
          shading: { fill: "f8fafc" },
          children: middleParagraphs,
        }),
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          verticalAlign: VerticalAlign.TOP,
          margins: cellPadding,
          children: studentParagraphs,
        }),
      ],
    });
  });

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: KHMER_FONT_BODY,
            size: 22,
            color: "0f172a",
          },
          paragraph: {
            spacing: {
              line: 276,
              after: 80,
            },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              bottom: 1000,
              left: 1000,
              right: 1000,
            },
          },
        },
        children: [
          // Kingdom Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: "ព្រះរាជាណាចក្រកម្ពុជា",
                bold: true,
                font: KHMER_FONT_MUOL,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: "ជាតិ សាសនា ព្រះមហាក្សត្រ",
                bold: true,
                font: KHMER_FONT_MUOL,
                size: 22,
              }),
            ],
          }),
          // Decorative Symbol / Divider
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: "7",
                font: Tacteing,
                size: 40,
                color: "000000",
              }),
            ],
          }),

          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 180 },
            children: [
              new TextRun({
                text: "កិច្ចតែងការបង្រៀន",
                bold: true,
                font: KHMER_FONT_MUOL,
                size: 28,
                color: "0c4a6e",
              }),
            ],
          }),

          // Metadata Table (Subject, Grade, Date, Duration, Chapter, Topic)
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBordersNone,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "មុខវិជ្ជា៖ ", bold: true }),
                          new TextRun({ text: plan.subject || "" }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "ថ្នាក់ទី៖ ", bold: true }),
                          new TextRun({ text: plan.grade || "" }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "កាលបរិច្ឆេទ៖ ", bold: true }),
                          new TextRun({ text: plan.date || "" }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "រយៈពេល៖ ", bold: true }),
                          new TextRun({ text: plan.duration || "" }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    columnSpan: 2,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "ជំពូក៖ ", bold: true }),
                          new TextRun({ text: plan.chapter || "" }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    columnSpan: 2,
                    children: [
                      new Paragraph({
                        spacing: { after: 120 },
                        children: [
                          new TextRun({ text: "ចំណងជើងមេរៀន៖ ", bold: true }),
                          new TextRun({
                            text: plan.topic || "",
                            bold: true,
                            color: "0c4a6e",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Section I: Objectives
          new Paragraph({
            spacing: { before: 100, after: 60 },
            children: [
              new TextRun({
                text: "I. វត្ថុបំណង",
                bold: true,
                underline: { type: UnderlineType.SINGLE },
                color: "0f172a",
                size: 22,
              }),
            ],
          }),
          ...htmlToDocxParagraphs(plan.objKnowledge, {
            prefixRun: new TextRun({ text: "១. ចំណេះដឹង៖ ", bold: true }),
            fontSize: 21,
            afterSpacing: 40,
          }),
          ...htmlToDocxParagraphs(plan.objSkills, {
            prefixRun: new TextRun({ text: "២. បំណិន៖ ", bold: true }),
            fontSize: 21,
            afterSpacing: 40,
          }),
          ...htmlToDocxParagraphs(plan.objAttitude, {
            prefixRun: new TextRun({ text: "៣. ឥរិយាបថ៖ ", bold: true }),
            fontSize: 21,
            afterSpacing: 80,
          }),

          // Section II & III: Materials & References
          new Paragraph({
            spacing: { before: 80, after: 40 },
            children: [
              new TextRun({ text: "II. សម្ភារឧបទេស៖ ", bold: true }),
              new TextRun({
                text: plan.materials || "សៀវភៅពុម្ព, ក្តារខៀន, ឧបករណ៍ពិសោធន៍",
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 40, after: 120 },
            children: [
              new TextRun({ text: "III. ឯកសារយោង៖ ", bold: true }),
              new TextRun({
                text:
                  plan.references || "សៀវភៅគ្រូ និងសៀវភៅសិក្សាគោលក្រសួងអប់រំ",
              }),
            ],
          }),

          // Section IV: Teaching Process Table
          new Paragraph({
            spacing: { before: 100, after: 80 },
            children: [
              new TextRun({
                text: "IV. ដំណើរបង្រៀន (៥ ជំហានគរុកោសល្យ)",
                bold: true,
                underline: { type: UnderlineType.SINGLE },
                color: "0f172a",
                size: 22,
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBordersThin,
            rows: [
              // Header Row
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { fill: "e2e8f0" },
                    margins: { top: 120, bottom: 120, left: 100, right: 100 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "សកម្មភាពគ្រូ",
                            bold: true,
                            font: KHMER_FONT_BODY,
                            size: 20,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    shading: { fill: "e2e8f0" },
                    margins: { top: 120, bottom: 120, left: 100, right: 100 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "ខ្លឹមសារមេរៀន",
                            bold: true,
                            font: KHMER_FONT_BODY,
                            size: 20,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { fill: "e2e8f0" },
                    margins: { top: 120, bottom: 120, left: 100, right: 100 },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "សកម្មភាពសិស្ស",
                            bold: true,
                            font: KHMER_FONT_BODY,
                            size: 20,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              ...stepRows,
            ],
          }),

          // Signatures Section
          new Paragraph({ spacing: { before: 200 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBordersNone,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "បានឃើញ និងឯកភាព" })],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "នាយកសាលា / គណៈគ្រប់គ្រង",
                            bold: true,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 800, after: 40 },
                        children: [
                          new TextRun({
                            text: "....................................................",
                            color: "94a3b8",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "........ថ្ងៃទី...... ខែ...... ឆ្នាំ ២០.....",
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "ហត្ថលេខាគ្រូបង្រៀន",
                            bold: true,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 800, after: 40 },
                        children: [
                          new TextRun({
                            text: "....................................................",
                            color: "94a3b8",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  // Trigger browser download
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const rawSubject = (plan.subject || "មេរៀន").trim();
    const rawGrade = (plan.grade || "").trim();
    const rawTopic = (plan.topic || "គ្មានចំណងជើង")
      .trim()
      .replace(/[/\\?%*:|"<>]/g, "_");

    const filename = `កិច្ចតែងការ_${rawSubject}_${rawGrade}_${rawTopic}.docx`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
