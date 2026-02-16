import React from "react";

const Teams: React.FC = () => {
  const mock = [
    { id: 't1', name: 'Estimators Team', members: 5 }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Teams</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600 border-b">
              <th className="py-2">Team</th>
              <th className="py-2">Members</th>
            </tr>
          </thead>
          <tbody>
            {mock.map(t => (
              <tr key={t.id} className="border-b hover:bg-slate-50">
                <td className="py-3">{t.name}</td>
                <td className="py-3">{t.members}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Teams;
