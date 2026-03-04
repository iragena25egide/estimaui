import React, { useEffect, useState } from "react";
import API from "../../context/axios";
import { Users, Mail, Trash2, Plus } from "lucide-react";

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
  const [inviteInputs, setInviteInputs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  /* ================= LOAD TEAMS ================= */

  const loadTeams = async () => {
    setLoading(true);
    try {
      const res = await API.get("/teams");
      setTeams(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  /* ================= CREATE TEAM ================= */

  const createTeam = async () => {
    if (!teamName.trim()) return;

    try {
      setCreating(true);
      await API.post("/teams", { name: teamName });
      setTeamName("");
      loadTeams();
    } catch (err) {
      console.error(err);
      alert("Failed to create team");
    } finally {
      setCreating(false);
    }
  };

  /* ================= INVITE MEMBER ================= */

  const inviteMember = async (teamId: string) => {
    const email = inviteInputs[teamId];
    if (!email) return;

    try {
      await API.post(`/teams/${teamId}/invite`, {
        email,
        role: "VIEWER",
      });

      alert("Invitation sent!");
      setInviteInputs((prev) => ({ ...prev, [teamId]: "" }));
      loadTeams();
    } catch (err) {
      console.error(err);
      alert("Failed to invite member");
    }
  };

  /* ================= REMOVE MEMBER ================= */

  const removeMember = async (teamId: string, memberId: string) => {
    if (!confirm("Remove member?")) return;

    try {
      await API.delete(`/teams/${teamId}/members/${memberId}`);
      loadTeams();
    } catch (err) {
      console.error(err);
      alert("Failed to remove member");
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          Teams
        </h2>
        <p className="text-slate-500 text-sm">
          Manage team collaboration and permissions
        </p>
      </div>

      {/* CREATE TEAM */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border flex gap-4 items-center">
        <input
          className="flex-1 border rounded-xl px-4 py-2"
          placeholder="Enter team name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />

        <button
          onClick={createTeam}
          disabled={creating}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          {creating ? "Creating..." : "Create Team"}
        </button>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="text-center text-slate-500">Loading teams...</div>
      )}

      {/* EMPTY STATE */}
      {!loading && teams.length === 0 && (
        <div className="text-center bg-white p-10 rounded-2xl border">
          <Users className="mx-auto w-10 h-10 text-slate-300 mb-3" />
          <p className="text-slate-500">No teams created yet</p>
        </div>
      )}

      {/* TEAMS LIST */}
      {!loading &&
        teams.map((team) => (
          <div
            key={team.id}
            className="bg-white border rounded-2xl p-6 shadow-sm space-y-5"
          >
           
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{team.name}</h3>
                <p className="text-xs text-slate-500">
                  {team.members?.length || 0} Members
                </p>
              </div>

             
              <div className="flex gap-2">
                <input
                  placeholder="Invite by email"
                  value={inviteInputs[team.id] || ""}
                  onChange={(e) =>
                    setInviteInputs((prev) => ({
                      ...prev,
                      [team.id]: e.target.value,
                    }))
                  }
                  className="border rounded-xl px-3 py-1 text-sm"
                />

                <button
                  onClick={() => inviteMember(team.id)}
                  className="bg-green-600 text-white px-4 rounded-xl text-sm flex items-center gap-1 hover:bg-green-700"
                >
                  <Mail className="w-4 h-4" />
                  Invite
                </button>
              </div>
            </div>

           
            <div className="space-y-2">
              {team.members?.map((m) => (
                <div
                  key={m.id}
                  className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded-xl"
                >
                  <div>
                    <span className="font-medium">{m.email}</span>
                    <span className="ml-2 text-xs text-slate-500">
                      {m.role}
                    </span>
                  </div>

                  <button
                    onClick={() => removeMember(team.id, m.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
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