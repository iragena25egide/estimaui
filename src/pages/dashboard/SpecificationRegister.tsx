import React from "react";

const SpecificationRegister: React.FC = () => {
  const mock = [
    { id: 's1', specSection: '01', description: 'General requirements', discipline: 'ARCH' }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Specification Register</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600 border-b">
              <th className="py-2">Section</th>
              <th className="py-2">Description</th>
              <th className="py-2">Discipline</th>
            </tr>
          </thead>
          <tbody>
            {mock.map(s => (
              <tr key={s.id} className="border-b hover:bg-slate-50">
                <td className="py-3">{s.specSection}</td>
                <td className="py-3">{s.description}</td>
                <td className="py-3">{s.discipline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SpecificationRegister;
