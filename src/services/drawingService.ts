import API from "../context/axios";

class DrawingService {

  
 static async createDrawing(data: {
    projectId: string;
    drawingNo: string;
    title: string;
    discipline: string;
    revision: string;
    issueDate: string;
    scale: string;
    status: string;
    fileType: string;
    file: File;
  }) {

    const formData = new FormData();

    formData.append("file", data.file);
    formData.append("projectId", data.projectId);
    formData.append("drawingNo", data.drawingNo);
    formData.append("title", data.title);
    formData.append("discipline", data.discipline);
    formData.append("revision", data.revision);
    formData.append("issueDate", data.issueDate);
    formData.append("scale", data.scale);
    formData.append("status", data.status);
    formData.append("fileType", data.fileType);

    try {
      const res = await API.post(
        "/drawing/upload",  
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
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

  static async getDrawingSummary() {
    try {

      const res = await API.get(`/projects/drawing-summary`);

      return res.data;

    } catch (error) {
      console.error("Get drawing summary error", error);
      throw error;
    }
  }


  static async getByProject(projectId: string) {
  const res = await API.get(`/drawing/project/${projectId}`);
  return res.data;
}

static async delete(id: string) {
  return API.delete(`/drawings/${id}`);
}

static async update(id: string, data: any) {
  return API.patch(`/drawings/${id}`, data);
}

}

export default DrawingService;