export type BillStage =
  | "introduced"
  | "committee"
  | "passed_chamber"
  | "other_chamber"
  | "conference"
  | "presented"
  | "law";

export const STAGES: { key: BillStage; label: string; short: string }[] = [
  { key: "introduced", label: "Introduced", short: "Intro" },
  { key: "committee", label: "In committee", short: "Cmte" },
  { key: "passed_chamber", label: "Passed chamber", short: "Pass" },
  { key: "other_chamber", label: "Other chamber", short: "Other" },
  { key: "conference", label: "Conference", short: "Conf" },
  { key: "presented", label: "Presented to President", short: "Pres" },
  { key: "law", label: "Signed into law", short: "Law" },
];

export function stageIndex(stage: BillStage): number {
  return STAGES.findIndex((s) => s.key === stage);
}

export function stageProgress(stage: BillStage): number {
  // 0..1 along the pipeline
  return stageIndex(stage) / (STAGES.length - 1);
}
