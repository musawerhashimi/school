import apiClient from "./api";

// Academic Year Interface
export interface AcademicYear {
  id: number;
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  isActive: boolean;
  createdAt: string;
}

// Create Academic Year Data
export interface CreateAcademicYearData {
  name: string;
  start_date: string;
  end_date: string;
}

// Update Academic Year Data
export interface UpdateAcademicYearData {
  name?: string;
  start_date?: string;
  end_date?: string;
}

// Academic Year Service
export const academicYearService = {
  // Get all academic years
  getAcademicYears: () =>
    apiClient.get<AcademicYear[]>("/mis/academic-years/"),

  // Get single academic year
  getAcademicYear: (id: number) =>
    apiClient.get<AcademicYear>(`/mis/academic-years/${id}/`),

  // Create new academic year
  createAcademicYear: (data: CreateAcademicYearData) =>
    apiClient.post<AcademicYear>("/mis/academic-years/", data),

  // Update academic year
  updateAcademicYear: (id: number, data: UpdateAcademicYearData) =>
    apiClient.patch<AcademicYear>(`/mis/academic-years/${id}/`, data),

  // Delete academic year
  deleteAcademicYear: (id: number) =>
    apiClient.delete(`/mis/academic-years/${id}/`),

  // Set active academic year
  setActiveYear: (id: number) =>
    apiClient.post(`/mis/academic-years/${id}/set-active/`),
};

export default academicYearService;
