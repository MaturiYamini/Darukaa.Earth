import api from "./api";

export const getSites = async (projectId) => {
  const response = await api.get(
    `/projects/${projectId}/sites`
  );

  return response.data;
};

export const getSite = async (siteId) => {
  const response = await api.get(
    `/sites/${siteId}`
  );

  return response.data;
};

export const createSite = async (
  projectId,
  siteData
) => {
  const response = await api.post(
    `/projects/${projectId}/sites`,
    siteData
  );

  return response.data;
};

export const updateSite = async (
  siteId,
  siteData
) => {
  const response = await api.put(
    `/sites/${siteId}`,
    siteData
  );

  return response.data;
};

export const deleteSite = async (siteId) => {
  const response = await api.delete(
    `/sites/${siteId}`
  );

  return response.data;
};