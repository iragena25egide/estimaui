import React from "react";

const Drawings: React.FC = () => {
  const mock = [
    { id: 'd1', drawingNo: 'A-101', title: 'Site Plan', discipline: 'ARCH', issueDate: '2026-01-10' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Drawings</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600 border-b">
              <th className="py-2">Drawing No</th>
              <th className="py-2">Title</th>
              <th className="py-2">Discipline</th>
              <th className="py-2">Issue Date</th>
            </tr>
          </thead>
          <tbody>
            {mock.map(d => (
              <tr key={d.id} className="border-b hover:bg-slate-50">
                <td className="py-3">{d.drawingNo}</td>
                <td className="py-3">{d.title}</td>
                <td className="py-3">{d.discipline}</td>
                <td className="py-3">{d.issueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Drawings;
