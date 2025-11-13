export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "Critical": return "bg-red-600";
    case "High": return "bg-orange-600";
    case "Moderate": return "bg-yellow-500";
    case "Low": return "bg-green-600";
    default: return "bg-gray-500";
  }
};