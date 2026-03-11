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

  static async getTeams(): Promise<Team[]> {
    try {
      const res = await API.get("/team/my-team"); 
      return res.data;
    } catch (error) {
      console.error("Get teams error:", error);
      throw error;
    }
  }
 
  static async createTeam(name: string): Promise<Team> {
    try {
      const res = await API.post("/team", { name });
      return res.data;
    } catch (error) {
      console.error("Create team error:", error);
      throw error;
    }
  }

 
  static async getTeam(teamId: string): Promise<Team> {
    try {
      const res = await API.get(`/team/${teamId}`);
      return res.data;
    } catch (error) {
      console.error("Get team error:", error);
      throw error;
    }
  }


  static async inviteMember(teamId: string, email: string, role: string = "VIEWER"): Promise<any> {
    try {
      const res = await API.post(`/team/${teamId}/invite`, { email, role });
      return res.data;
    } catch (error) {
      console.error("Invite member error:", error);
      throw error;
    }
  }

 
  static async acceptInvitation(token: string): Promise<any> {
    try {
      const res = await API.post("/team/accept-invite", { token });
      return res.data;
    } catch (error) {
      console.error("Accept invitation error:", error);
      throw error;
    }
  }

  
}

export default TeamService;
export type { Team, TeamMember };