import { AccidentReport } from "../api/interface";

export function exportToCSV(data: AccidentReport[]) {
  const headers = [
    "Report ID",
    "Report Number",
    "Severity",
    "Reporter Name",
    "Reporter Contact",
    "Location",
    "Barangay",
    "Municipality",
    "Status",
    "Date Reported",
    "Notes",
  ];

  const csvRows = [headers.join(",")];

  data.forEach((row) => {
    const values = [
      row.id,
      row.report_number,
      row.severity,
      row.reporter_name,
      row.reporter_contact,
      `"${row.location_address}"`,
      row.barangay || "",
      row.municipality || "",
      row.status,
      new Date(row.created_at).toLocaleString(),
      `"${row.reporter_notes}"`,
    ];
    csvRows.push(values.join(","));
  });

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `accident_reports_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
