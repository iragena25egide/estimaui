import API from "../context/axios";

class DrawingService {

  // ==========================
  // CREATE DRAWING (WITH FILE)
  // ==========================
  static async createDrawing(projectId: string, data: any) {

    const formData = new FormData();

    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    try {
      const res = await API.post(
        `/projects/${projectId}/drawings`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      return res.data;

    } catch (error) {
      console.error("Create drawing error", error);
      throw error;
    }
  }


 
  static async getDrawings(projectId: string) {
    try {
      const res = await API.get(
        `/projects/${projectId}/drawings`
      );

      return res.data;

    } catch (error) {
      console.error("Get drawings error", error);
      throw error;
    }
  }


  
  static async getDrawingById(projectId: string, id: string) {
    try {
      const res = await API.get(
        `/projects/${projectId}/drawings/${id}`
      );

      return res.data;

    } catch (error) {
      console.error("Get drawing error", error);
      throw error;
    }
  }


  
  static async updateDrawing(
    projectId: string,
    id: string,
    data: any
  ) {

    const formData = new FormData();

    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    try {

      const res = await API.put(
        `/projects/${projectId}/drawings/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      return res.data;

    } catch (error) {
      console.error("Update drawing error", error);
      throw error;
    }
  }


  
  static async deleteDrawing(projectId: string, id: string) {
    try {

      const res = await API.delete(
        `/projects/${projectId}/drawings/${id}`
      );

      return res.data;

    } catch (error) {
      console.error("Delete drawing error", error);
      throw error;
    }
  }

}

export default DrawingService;