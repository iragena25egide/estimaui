import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Users,
  Mail,
  Plus,
  Loader2,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TeamService, { Team } from "@/services/teamService";

const Teams: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("VIEWER");
  const [sendingInvite, setSendingInvite] = useState(false);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  // Load all teams when no teamId
  const loadTeams = async () => {
    try {
      const data = await TeamService.getTeams();
      setTeams(data);
    } catch (error) {
      toast.error("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  // Load single team when teamId exists
  const loadTeam = async () => {
    if (!teamId) return;
    setLoading(true);
    try {
      const data = await TeamService.getTeam(teamId);
      setTeam(data);
    } catch (error) {
      toast.error("Failed to load team");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teamId) {
      loadTeam();
    } else {
      loadTeams();
    }
  }, [teamId]);

  const handleInvite = async () => {
    if (!teamId) return;
    if (!inviteEmail) {
      toast.warning("Please enter an email address");
      return;
    }

    setSendingInvite(true);
    try {
      await TeamService.inviteMember(teamId, inviteEmail, inviteRole);
      toast.success("Invitation sent");
      setInviteEmail("");
      setInviteRole("VIEWER");
      loadTeam(); // refresh team members
    } catch (error) {
      toast.error("Failed to send invitation");
    } finally {
      setSendingInvite(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast.warning("Please enter a team name");
      return;
    }

    setCreating(true);
    try {
      const newTeam = await TeamService.createTeam(newTeamName);
      toast.success("Team created successfully");
      setNewTeamName("");
      setOpenCreateDialog(false);
      navigate(`/dashboard/teams/${newTeam.id}`);
    } catch (error) {
      toast.error("Failed to create team");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

 
  if (!teamId) {
    return (
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-8 h-8 text-blue-600" />
              My Teams
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Select a team to manage or create a new one
            </p>
          </div>
          <Button
            onClick={() => setOpenCreateDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create Team
          </Button>
        </div>

       
        {teams.length === 0 ? (
          <Card className="border-gray-200 shadow-sm rounded-2xl">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No teams created yet</p>
              <Button
                onClick={() => setOpenCreateDialog(true)}
                variant="outline"
                className="mt-4 border-gray-200 rounded-xl"
              >
                Create your first team
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((t) => (
              <Card
                key={t.id}
                className="border-gray-200 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/dashboard/teams/${t.id}`)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {t.name}
                  </CardTitle>
                  <CardDescription>
                    {t.members?.length || 0} member{t.members?.length !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex -space-x-2 overflow-hidden">
                    {t.members?.slice(0, 4).map((member) => (
                      <div
                        key={member.id}
                        className="inline-block w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-sm ring-2 ring-white"
                        title={member.email}
                      >
                        {member.email.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {t.members && t.members.length > 4 && (
                      <div className="inline-block w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-sm ring-2 ring-white">
                        +{t.members.length - 4}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        
        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogContent className="sm:max-w-md p-0 gap-0 rounded-2xl overflow-hidden">
            <DialogHeader className="p-6 border-b border-gray-200">
              <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Create New Team
              </DialogTitle>
            </DialogHeader>
            <div className="p-6">
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                Team Name
              </label>
              <Input
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="e.g., Project Alpha"
                className="border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20"
                autoFocus
              />
            </div>
            <DialogFooter className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end gap-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenCreateDialog(false)}
                  className="border-gray-200 rounded-lg text-gray-600 hover:bg-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTeam}
                  disabled={creating}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                  {creating ? "Creating..." : "Create Team"}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

 
  if (!team) {
    return (
      <div className="p-4 md:p-6 max-w-5xl mx-auto text-center py-16 text-gray-500">
        Team not found.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
     
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-600" />
            {team.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage team members and permissions
          </p>
        </div>
        <Button
          onClick={() => setOpenCreateDialog(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Team
        </Button>
      </div>

      
      <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
       
      </Dialog>

     
      <Card className="border-gray-200 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-gray-50 border-b border-gray-200 p-6">
          <CardTitle className="text-xl font-bold text-gray-900">
            Team Members
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            {team.members?.length || 0} member{team.members?.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-5">
        
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-1">
              <UserPlus className="w-4 h-4" />
              Invite new member
            </h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 border-blue-200 focus:border-blue-400 rounded-lg"
              />
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger className="w-full sm:w-32 border-blue-200 rounded-lg">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIEWER">VIEWER</SelectItem>
                  <SelectItem value="ESTIMATOR">ESTIMATOR</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleInvite}
                disabled={sendingInvite}
                className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                {sendingInvite ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : (
                  <Mail className="w-4 h-4 mr-1" />
                )}
                {sendingInvite ? "Sending..." : "Invite"}
              </Button>
            </div>
          </div>

         
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Members</h4>
            {team.members && team.members.length > 0 ? (
              <div className="space-y-2">
                {team.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                        {member.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.email}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                    
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No members yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Teams;