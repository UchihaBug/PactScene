import type { ReactNode } from "react";

export interface QueryPreviewColumn<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
}

interface QueryPreviewTableProps<T> {
  title: string;
  rows: T[];
  columns: QueryPreviewColumn<T>[];
}

export function QueryPreviewTable<T extends Record<string, unknown>>({ title, rows, columns }: QueryPreviewTableProps<T>) {
  return (
    <section className="asw-query-preview" aria-label={title}>
      <div className="asw-section-title">
        <span>{title}</span>
        <strong>{rows.length} rows</strong>
      </div>
      <div className="asw-table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={String(row.id || index)}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render ? column.render(row) : String(row[column.key as keyof T] ?? "")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
