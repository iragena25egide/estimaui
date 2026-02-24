import React, { useState } from "react";

interface Member {
  id: string;
  name: string;
  role: string;
}

interface Team {
  id: string;
  name: string;
  members: Member[];
}

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamName, setTeamName] = useState("");

  const addTeam = () => {
    if (!teamName) return;
    setTeams(prev => [...prev, { id: Date.now().toString(), name: teamName, members: [] }]);
    setTeamName("");
  };

  const addMember = (teamId: string) => {
    const name = prompt("Member Name");
    if (!name) return;

    setTeams(prev =>
      prev.map(t =>
        t.id === teamId
          ? { ...t, members: [...t.members, { id: Date.now().toString(), name, role: "Member" }] }
          : t
      )
    );
  };

  const removeMember = (teamId: string, memberId: string) => {
    setTeams(prev =>
      prev.map(t =>
        t.id === teamId
          ? { ...t, members: t.members.filter(m => m.id !== memberId) }
          : t
      )
    );
  };

  const deleteTeam = (id: string) => {
    if (!confirm("Delete team?")) return;
    setTeams(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Teams</h2>

      <div className="flex gap-3 mb-4">
        <input
          className="border p-2 rounded w-64"
          placeholder="New Team Name"
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
        />
        <button onClick={addTeam} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
          Add Team
        </button>
      </div>

      {teams.map(team => (
        <div key={team.id} className="bg-white rounded-2xl shadow-sm border p-4 mb-4">
          <div className="flex justify-between mb-3">
            <div>
              <h3 className="font-semibold">{team.name}</h3>
              <p className="text-xs text-slate-500">{team.members.length} Members</p>
            </div>
            <div className="space-x-3">
              <button onClick={() => addMember(team.id)} className="text-blue-600 text-xs">
                Add Member
              </button>
              <button onClick={() => deleteTeam(team.id)} className="text-red-600 text-xs">
                Delete
              </button>
            </div>
          </div>

          <ul className="space-y-2">
            {team.members.map(member => (
              <li key={member.id} className="flex justify-between text-sm bg-slate-50 p-2 rounded">
                <span>{member.name} ({member.role})</span>
                <button onClick={() => removeMember(team.id, member.id)} className="text-red-500 text-xs">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Teams;