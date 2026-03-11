import API from "../context/axios";

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

class TeamService {
  // Get all teams for the current user
  static async getTeams(): Promise<Team[]> {
    try {
      const res = await API.get("/teams");
      return res.data;
    } catch (error) {
      console.error("Get teams error:", error);
      throw error;
    }
  }

  // Create a new team
  static async createTeam(name: string): Promise<Team> {
    try {
      const res = await API.post("/teams", { name });
      return res.data;
    } catch (error) {
      console.error("Create team error:", error);
      throw error;
    }
  }

  // Invite a member to a team
  static async inviteMember(teamId: string, email: string, role: string = "VIEWER"): Promise<any> {
    try {
      const res = await API.post(`/teams/${teamId}/invite`, { email, role });
      return res.data;
    } catch (error) {
      console.error("Invite member error:", error);
      throw error;
    }
  }

  // Remove a member from a team
  static async removeMember(teamId: string, memberId: string): Promise<void> {
    try {
      await API.delete(`/teams/${teamId}/members/${memberId}`);
    } catch (error) {
      console.error("Remove member error:", error);
      throw error;
    }
  }

  // Optionally delete a team (if needed)
  static async deleteTeam(teamId: string): Promise<void> {
    try {
      await API.delete(`/teams/${teamId}`);
    } catch (error) {
      console.error("Delete team error:", error);
      throw error;
    }
  }
}

export default TeamService;
export type { Team, TeamMember };