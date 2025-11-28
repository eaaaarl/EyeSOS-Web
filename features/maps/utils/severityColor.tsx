export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical": return "bg-red-600";
    case "high": return "bg-orange-600";
    case "moderate": return "bg-yellow-500";
    case "minor": return "bg-green-600";
    default: return "bg-gray-500";
  }
};