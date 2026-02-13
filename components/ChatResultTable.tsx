"use client";

type Props = {
  data: any[];
};

export default function ChatResultTable({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="text-sm text-gray-500 mt-2">
        No records found.
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="mt-3 overflow-x-auto border rounded-lg shadow-sm">
      <table className="min-w-full text-xs border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-3 py-2 text-left font-semibold text-gray-700 border-b whitespace-nowrap"
              >
                {col.replace(/_/g, " ").toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
            >
              {columns.map((col) => (
                <td
                  key={col}
                  className="px-3 py-2 border-b whitespace-nowrap"
                >
                  {row[col] ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
