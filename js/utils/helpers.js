export function exportCSV(data) {
  const header = ["Name", "Email", "Role", "Department"];
  const rows = data.map(e =>
    [e.name, e.email, e.role, e.department]
  );

  const csv = [header, ...rows]
    .map(r => r.join(","))
    .join("\n");

  download(csv, "employees.csv", "text/csv");
}

export function exportJSON(data) {
  download(JSON.stringify(data, null, 2),
    "employees.json",
    "application/json");
}

function download(content, filename, type) {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
