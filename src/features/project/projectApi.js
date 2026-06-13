import client from '../../app/client';

export const getProjectApi = (id) => client.get(`/projects/${id}`);
export const updateProjectApi = (id, payload) => client.patch(`/projects/${id}`, payload);
export const archiveProjectApi = (id) => client.delete(`/projects/${id}`);
export const getMessagesApi = (projectId, params) =>
  client.get(`/projects/${projectId}/messages`, { params });
export const submitGenerationApi = (projectId, payload) =>
  client.post(`/projects/${projectId}/messages`, payload);