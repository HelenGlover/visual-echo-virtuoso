import type { BillStage } from "./stages";

export type Chamber = "house" | "senate";
export type BillType = "HR" | "S" | "HJRES" | "SJRES" | "HCONRES" | "SCONRES";

export type TopicTag = {
  id: string;
  name: string;
  matches: number;
};

export type BillVersion = {
  id: string;
  label: string; // e.g. "Introduced", "Engrossed", "Enrolled"
  date: string;
  text: string; // raw bill text (mock)
  isBase?: boolean;
  isNew?: boolean;
};

export type Amendment = {
  id: string;
  number: string;
  sponsor: string;
  party: "D" | "R" | "I";
  date: string;
  status: "Proposed" | "Adopted" | "Rejected";
  text: string;
};

export type Bill = {
  id: string;
  number: string; // e.g. HR-2024
  title: string;
  shortTitle: string;
  congress: number;
  chamber: Chamber;
  billType: BillType;
  sponsor: string;
  introduced: string;
  status: string;
  stage: BillStage;
  summary: string;
  relatedBillId?: string;
  previousYearBillId?: string;
  versions: BillVersion[];
  topics: TopicTag[];
  amendments: Amendment[];
};

export type Note = {
  id: string;
  billId?: string;
  title: string;
  excerpt: string;
  date: string;
};

const v1Text = `SECTION 1. SHORT TITLE.
This Act may be cited as the "Defense Modernization and Accountability Act of 2025".

SEC. 2. FINDINGS.
Congress finds the following:
(1) The Department of Defense requires sustained investment in next-generation systems.
(2) Existing oversight frameworks must be modernized to ensure accountability.
(3) Allied partnerships are central to deterrence in the Indo-Pacific.

SEC. 3. AUTHORIZATION OF APPROPRIATIONS.
There are authorized to be appropriated to the Secretary of Defense $812,000,000,000 for fiscal year 2025 to carry out the activities described in this Act.

SEC. 4. REPORTING REQUIREMENTS.
The Secretary shall submit an annual report to the Committees on Armed Services of the House and Senate.`;

const v2Text = `SECTION 1. SHORT TITLE.
This Act may be cited as the "Defense Modernization, Accountability, and Innovation Act of 2025".

SEC. 2. FINDINGS.
Congress finds the following:
(1) The Department of Defense requires sustained investment in next-generation systems, including artificial intelligence and autonomous platforms.
(2) Existing oversight frameworks must be modernized to ensure accountability and transparency for the American taxpayer.
(3) Allied partnerships are central to deterrence in the Indo-Pacific and the Euro-Atlantic.

SEC. 3. AUTHORIZATION OF APPROPRIATIONS.
There are authorized to be appropriated to the Secretary of Defense $847,000,000,000 for fiscal year 2025 to carry out the activities described in this Act.

SEC. 4. REPORTING REQUIREMENTS.
The Secretary shall submit a semiannual report to the Committees on Armed Services of the House and Senate, including a classified annex.

SEC. 5. SMALL BUSINESS INNOVATION.
Not less than 5 percent of funds appropriated under this Act shall be reserved for awards to small businesses headquartered in the United States.`;

export const mockBills: Bill[] = [
  {
    id: "hr-2024",
    number: "H.R. 2024",
    title: "Defense Modernization and Accountability Act of 2025",
    shortTitle: "Defense Modernization Act",
    congress: 119,
    chamber: "house",
    billType: "HR",
    sponsor: "Rep. J. Carter (R-TX)",
    introduced: "2025-02-14",
    status: "Reported by Committee",
    stage: "committee",
    summary:
      "Authorizes appropriations for Department of Defense activities and modernizes oversight frameworks.",
    relatedBillId: "s-998",
    previousYearBillId: "hr-1834",
    versions: [
      { id: "v1", label: "Introduced", date: "2025-02-14", text: v1Text, isBase: true },
      { id: "v2", label: "Reported", date: "2025-04-02", text: v2Text, isNew: true },
    ],
    topics: [
      { id: "t1", name: "Defense spending for Maryland", matches: 3 },
      { id: "t2", name: "AI & autonomous systems", matches: 2 },
    ],
    amendments: [
      {
        id: "a1",
        number: "Amdt. 14",
        sponsor: "Rep. M. Alvarez (D-CA)",
        party: "D",
        date: "2025-03-21",
        status: "Adopted",
        text: "Strike '$847,000,000,000' and insert '$835,000,000,000' and require quarterly GAO audit.",
      },
    ],
  },
  {
    id: "s-998",
    number: "S. 998",
    title: "Civil Liberties Protection and Surveillance Reform Act",
    shortTitle: "Civil Liberties Reform",
    congress: 119,
    chamber: "senate",
    billType: "S",
    sponsor: "Sen. R. Patel (D-NJ)",
    introduced: "2025-03-04",
    status: "Introduced",
    stage: "introduced",
    summary:
      "Reforms federal surveillance authorities and strengthens judicial review of intelligence requests.",
    versions: [
      { id: "v1", label: "Introduced", date: "2025-03-04", text: v1Text, isBase: true },
    ],
    topics: [{ id: "t1", name: "Money for ACLU", matches: 1 }],
    amendments: [],
  },
  {
    id: "hr-1450",
    number: "H.R. 1450",
    title: "Rural Broadband Acceleration Act",
    shortTitle: "Rural Broadband Act",
    congress: 119,
    chamber: "house",
    billType: "HR",
    sponsor: "Rep. L. Nguyen (D-WA)",
    introduced: "2025-01-29",
    status: "Passed House",
    stage: "other_chamber",
    summary: "Expands broadband infrastructure grants to rural and tribal communities.",
    versions: [
      { id: "v1", label: "Introduced", date: "2025-01-29", text: v1Text, isBase: true },
      { id: "v2", label: "Engrossed", date: "2025-03-15", text: v2Text, isNew: true },
    ],
    topics: [],
    amendments: [],
  },
  {
    id: "hr-742",
    number: "H.R. 742",
    title: "Coastal Resilience and Flood Mitigation Act",
    shortTitle: "Coastal Resilience Act",
    congress: 119,
    chamber: "house",
    billType: "HR",
    sponsor: "Rep. T. Brooks (D-FL)",
    introduced: "2024-11-12",
    status: "Signed into law",
    stage: "law",
    summary:
      "Funds coastal infrastructure resilience projects and updates FEMA flood mitigation programs.",
    versions: [
      { id: "v1", label: "Introduced", date: "2024-11-12", text: v1Text, isBase: true },
      { id: "v2", label: "Enrolled", date: "2025-02-28", text: v2Text, isNew: true },
    ],
    topics: [],
    amendments: [],
  },
];

export const mockNotes: Note[] = [
  {
    id: "n1",
    billId: "hr-2024",
    title: "Comparison vs FY24 NDAA",
    excerpt: "Defense topline up 4.3%. Reporting cadence shifted to semiannual.",
    date: "2025-04-03",
  },
  {
    id: "n2",
    billId: "s-998",
    title: "Coalition stakeholders",
    excerpt: "ACLU, EFF supportive. Concerns from intelligence community on §4.",
    date: "2025-03-10",
  },
];

export function getBill(id: string): Bill | undefined {
  return mockBills.find((b) => b.id === id);
}
