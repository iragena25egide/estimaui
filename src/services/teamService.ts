import API from "../context/axios";

class TeamService {

  // =========================
  // TEAMS
  // =========================

  static async getTeams() {
    const res = await API.get("/teams");
    return res.data;
  }

  static async createTeam(data: { name: string }) {
    const res = await API.post("/teams", data);
    return res.data;
  }

  static async deleteTeam(teamId: string) {
    const res = await API.delete(`/teams/${teamId}`);
    return res.data;
  }

  // =========================
  // MEMBERS
  // =========================

  static async inviteMember(
    teamId: string,
    data: { email: string; role: string }
  ) {
    const res = await API.post(
      `/teams/${teamId}/invite`,
      data
    );

    return res.data;
  }

  static async removeMember(teamId: string, memberId: string) {
    const res = await API.delete(
      `/teams/${teamId}/members/${memberId}`
    );

    return res.data;
  }

  static async acceptInvite(token: string) {
    const res = await API.get(`/teams/accept?token=${token}`);
    return res.data;
  }

}

export default TeamService;