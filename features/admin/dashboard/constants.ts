export const COLORS = {
  blue: "#2563eb",
  red: "#dc2626",
  amber: "#d97706",
  green: "#16a34a",
  purple: "#7c3aed",
  teal: "#0d9488",
  slate: "#64748b",
  rose: "#e11d48",
  yellow: "#eab308",
  orange: "#f97316",
  indigo: "#6366f1",
  gray: "#94a3b8",
};

export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const SEVERITY_COLORS: Record<string, string> = {
  Minor: COLORS.blue,
  Moderate: COLORS.yellow,
  Serious: COLORS.orange,
  Fatal: COLORS.red,
};

export const TOD_COLORS: Record<string, string> = {
  Morning: COLORS.yellow,
  Afternoon: COLORS.orange,
  Evening: COLORS.blue,
  Night: COLORS.red,
};

export const DAY_ORDER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DAY_MAP: Record<string, string> = {
  Sunday: "Sun",
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
};

export const LIGHTING_COLORS: Record<string, string> = {
  Day: COLORS.amber,
  Night: COLORS.indigo,
  Dawn: COLORS.rose,
  Dusk: COLORS.orange,
  Unknown: COLORS.gray,
};

export const severityData = [
  { name: "Minor", value: 460, color: COLORS.green },
  { name: "Moderate", value: 67, color: COLORS.amber },
  { name: "Fatal", value: 42, color: COLORS.red },
  { name: "Serious", value: 37, color: COLORS.purple },
];

export const monthData = [
  { month: "Jan", incidents: 49 },
  { month: "Feb", incidents: 50 },
  { month: "Mar", incidents: 59 },
  { month: "Apr", incidents: 55 },
  { month: "May", incidents: 59 },
  { month: "Jun", incidents: 70 },
  { month: "Jul", incidents: 41 },
  { month: "Aug", incidents: 40 },
  { month: "Sep", incidents: 52 },
  { month: "Oct", incidents: 46 },
  { month: "Nov", incidents: 41 },
  { month: "Dec", incidents: 44 },
];

export const hourData = [
  { hour: "12am", incidents: 11 },
  { hour: "1am", incidents: 7 },
  { hour: "2am", incidents: 9 },
  { hour: "3am", incidents: 11 },
  { hour: "4am", incidents: 14 },
  { hour: "5am", incidents: 7 },
  { hour: "6am", incidents: 13 },
  { hour: "7am", incidents: 32 },
  { hour: "8am", incidents: 18 },
  { hour: "9am", incidents: 30 },
  { hour: "10am", incidents: 25 },
  { hour: "11am", incidents: 34 },
  { hour: "12pm", incidents: 16 },
  { hour: "1pm", incidents: 23 },
  { hour: "2pm", incidents: 34 },
  { hour: "3pm", incidents: 34 },
  { hour: "4pm", incidents: 45 },
  { hour: "5pm", incidents: 49 },
  { hour: "6pm", incidents: 47 },
  { hour: "7pm", incidents: 48 },
  { hour: "8pm", incidents: 29 },
  { hour: "9pm", incidents: 25 },
  { hour: "10pm", incidents: 16 },
  { hour: "11pm", incidents: 10 },
];

export const dowData = [
  { day: "Mon", incidents: 55 },
  { day: "Tue", incidents: 75 },
  { day: "Wed", incidents: 81 },
  { day: "Thu", incidents: 81 },
  { day: "Fri", incidents: 85 },
  { day: "Sat", incidents: 93 },
  { day: "Sun", incidents: 136 },
];

export const todData = [
  { name: "Morning", value: 159, color: COLORS.amber },
  { name: "Afternoon", value: 152, color: COLORS.blue },
  { name: "Evening", value: 144, color: COLORS.rose },
  { name: "Night", value: 132, color: COLORS.purple },
];

export const barangayData = [
  { name: "Payasan", incidents: 99, fatal: 5 },
  { name: "Poblacion", incidents: 98, fatal: 2 },
  { name: "Diatagon", incidents: 65, fatal: 3 },
  { name: "Ganayon", incidents: 56, fatal: 9 },
  { name: "St. Christine", incidents: 53, fatal: 4 },
  { name: "Anibongan", incidents: 51, fatal: 5 },
  { name: "Banahao", incidents: 47, fatal: 4 },
  { name: "Baucawe", incidents: 46, fatal: 4 },
  { name: "Ban-as", incidents: 30, fatal: 0 },
  { name: "Liatimco", incidents: 22, fatal: 4 },
  { name: "San Pedro", incidents: 20, fatal: 1 },
  { name: "Manyayay", incidents: 15, fatal: 1 },
];

export const lightingData = [
  { name: "Day", value: 352, color: COLORS.amber },
  { name: "Night", value: 213, color: COLORS.purple },
  { name: "Dusk", value: 22, color: COLORS.rose },
  { name: "Unknown", value: 17, color: COLORS.slate },
  { name: "Dawn", value: 2, color: COLORS.teal },
];

export const roadTypeData = [
  { name: "Barangay Road", value: 445 },
  { name: "National Highway", value: 80 },
  { name: "Intersection", value: 79 },
  { name: "Bridge", value: 1 },
  { name: "Highway", value: 1 },
];

export const severityByBrgy = [
  { name: "Payasan", Minor: 75, Moderate: 12, Serious: 7, Fatal: 5 },
  { name: "Poblacion", Minor: 86, Moderate: 8, Serious: 2, Fatal: 2 },
  { name: "Diatagon", Minor: 56, Moderate: 3, Serious: 3, Fatal: 3 },
  { name: "Ganayon", Minor: 36, Moderate: 8, Serious: 3, Fatal: 9 },
  { name: "St. Christine", Minor: 40, Moderate: 4, Serious: 5, Fatal: 4 },
  { name: "Anibongan", Minor: 35, Moderate: 7, Serious: 4, Fatal: 5 },
  { name: "Banahao", Minor: 32, Moderate: 9, Serious: 2, Fatal: 4 },
  { name: "Baucawe", Minor: 29, Moderate: 7, Serious: 6, Fatal: 4 },
];

