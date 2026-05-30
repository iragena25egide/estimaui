import API from "../context/axios";

class RateLibraryService {
  static async importCSV(csvContent: string) {
    try {
      const res = await API.post(`/rate-library/import`, { csv: csvContent });
      return res.data;
    } catch (error) {
      console.error("Bulk import rates booklet error:", error);
      throw error;
    }
  }

  static async lookup(query: string) {
    try {
      const res = await API.get(`/rate-library/lookup?q=${encodeURIComponent(query)}`);
      return res.data;
    } catch (error) {
      console.error("Autocomplete rate lookup error:", error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const res = await API.get(`/rate-library`);
      return res.data;
    } catch (error) {
      console.error("List all rates booklet error:", error);
      throw error;
    }
  }
}

export default RateLibraryService;
