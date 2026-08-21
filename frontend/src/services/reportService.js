export const reportService = {
  toCsv: (headers, rows) =>
    [
      headers.join(","),
      ...rows.map((row) =>
        row.map((value) => String(value ?? "").replaceAll(",", " ")).join(","),
      ),
    ].join("\n"),
};
