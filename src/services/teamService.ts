import API from "../context/axios";

/* ================= TYPES ================= */

export interface TeamMember {
  id: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
}

export interface CreateTeamDTO {
  name: string;
}

export interface InviteMemberDTO {
  email: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
}

/* ================= SERVICE ================= */

class TeamService {

  /* ---------- GET ALL TEAMS ---------- */
  static async getTeams(): Promise<Team[]> {
    try {
      const res = await API.get("/teams");
      return res.data;
    } catch (error) {
      console.error("Error fetching teams:", error);
      throw error;
    }
  }

  /* ---------- CREATE TEAM ---------- */
  static async createTeam(data: CreateTeamDTO): Promise<Team> {
    try {
      const res = await API.post("/teams", data);
      return res.data;
    } catch (error) {
      console.error("Error creating team:", error);
      throw error;
    }
  }

  /* ---------- DELETE TEAM ---------- */
  static async deleteTeam(teamId: string): Promise<void> {
    try {
      await API.delete(`/teams/${teamId}`);
    } catch (error) {
      console.error("Error deleting team:", error);
      throw error;
    }
  }

  /* ---------- INVITE MEMBER ---------- */
  static async inviteMember(
    teamId: string,
    data: InviteMemberDTO
  ): Promise<any> {
    try {
      const res = await API.post(`/teams/${teamId}/invite`, data);
      return res.data;
    } catch (error) {
      console.error("Error inviting member:", error);
      throw error;
    }
  }

  /* ---------- REMOVE MEMBER ---------- */
  static async removeMember(
    teamId: string,
    memberId: string
  ): Promise<void> {
    try {
      await API.delete(`/teams/${teamId}/members/${memberId}`);
    } catch (error) {
      console.error("Error removing member:", error);
      throw error;
    }
  }

  /* ---------- ACCEPT INVITATION ---------- */
  static async acceptInvite(token: string): Promise<any> {
    try {
      const res = await API.get(`/teams/accept?token=${token}`);
      return res.data;
    } catch (error) {
      console.error("Error accepting invite:", error);
      throw error;
    }
  }
}

export default TeamService;