import api from "./api";

// Get all projects
export const getProjects = async () => {
  const response = await api.get("/projects");
  return response.data;
};

// Get one project
export const getProject = async (projectId) => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
};

// Create project
export const createProject = async (projectData) => {
  const response = await api.post(
    "/projects",
    projectData
  );

  return response.data;
};

// Update project
export const updateProject = async (
  projectId,
  projectData
) => {
  const response = await api.put(
    `/projects/${projectId}`,
    projectData
  );

  return response.data;
};

// Delete project
export const deleteProject = async (projectId) => {
  const response = await api.delete(
    `/projects/${projectId}`
  );

  return response.data;
};
export const getDashboardData = async () => {
  const projects = await getProjects();

  const sitesByProject = await Promise.all(
    projects.map(async (project) => {
      try {
        const sites = await getSitesForProject(project.id);

        return {
          project,
          sites,
        };
      } catch {
        return {
          project,
          sites: [],
        };
      }
    })
  );

  const allSites = sitesByProject.flatMap(
    (item) => item.sites
  );

  const totalArea = allSites.reduce(
    (total, site) => total + (site.area || 0),
    0
  );

  return {
    projects,
    sites: allSites,
    totalArea,
  };
};

const getSitesForProject = async (projectId) => {
  const response = await api.get(
    `/projects/${projectId}/sites`
  );

  return response.data;
};