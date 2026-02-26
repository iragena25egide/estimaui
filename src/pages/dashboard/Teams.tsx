import React, { useEffect, useState } from "react";
import API from "../../context/axios";

interface TeamMember {
  id: string;
  email: string;
  role: string;
}

interface Team {
  id: string;
  name: string;
  members: TeamMember[];
}

const Teams: React.FC = () => {

  const [teams, setTeams] = useState<Team[]>([]);
  const [teamName, setTeamName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  // =============================
  // LOAD TEAMS FROM BACKEND
  // =============================
  const loadTeams = async () => {
    try {
      const res = await API.get("/teams");
      setTeams(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  // =============================
  // CREATE TEAM
  // =============================
  const createTeam = async () => {
    if (!teamName) return;

    await API.post("/teams", {
      name: teamName
    });

    setTeamName("");
    loadTeams();
  };

  // =============================
  // INVITE MEMBER
  // =============================
  const inviteMember = async (teamId: string) => {

    if (!inviteEmail) return;

    await API.post(`/teams/${teamId}/invite`, {
      email: inviteEmail,
      role: "VIEWER"
    });

    alert("Invitation sent!");
    setInviteEmail("");
  };

  // =============================
  // REMOVE MEMBER
  // =============================
  const removeMember = async (teamId: string, memberId: string) => {
    if (!confirm("Remove member?")) return;

    await API.delete(`/teams/${teamId}/members/${memberId}`);

    loadTeams();
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">Teams</h2>
        <p className="text-slate-500 text-sm">
          Manage team collaboration
        </p>
      </div>

      {/* CREATE TEAM */}
      <div className="flex gap-3">
        <input
          className="border rounded-lg px-3 py-2"
          placeholder="Team name"
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
        />

        <button
          onClick={createTeam}
          className="bg-blue-600 text-white px-4 rounded-lg"
        >
          Create Team
        </button>
      </div>

      {/* TEAMS LIST */}
      {teams.map(team => (
        <div
          key={team.id}
          className="bg-white border rounded-2xl p-5 space-y-4"
        >

          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">{team.name}</h3>
              <p className="text-xs text-slate-500">
                {team.members?.length || 0} Members
              </p>
            </div>

            <div className="flex gap-2">
              <input
                placeholder="Invite email"
                value={selectedTeam === team.id ? inviteEmail : ""}
                onChange={e => {
                  setSelectedTeam(team.id);
                  setInviteEmail(e.target.value);
                }}
                className="border rounded-lg px-3 py-1 text-sm"
              />

              <button
                onClick={() => inviteMember(team.id)}
                className="bg-green-600 text-white px-3 rounded-lg text-sm"
              >
                Invite
              </button>
            </div>
          </div>

          {/* MEMBERS */}
          <div className="space-y-2">
            {team.members?.map(m => (
              <div
                key={m.id}
                className="flex justify-between bg-slate-50 p-2 rounded"
              >
                <span>
                  {m.email}
                  <span className="text-xs ml-2 text-slate-500">
                    ({m.role})
                  </span>
                </span>

                <button
                  onClick={() => removeMember(team.id, m.id)}
                  className="text-red-500 text-xs"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

        </div>
      ))}

    </div>
  );
};

export default Teams;