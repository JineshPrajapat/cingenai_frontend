import client from '../../app/client';

export const listProjectsApi = (params) => client.get('/projects', { params });
export const createProjectApi = (payload) => client.post('/projects', payload);
// Response: { data: { jobs: [...], total, page, limit } }
export const listProjectJobsApi = (projectId, params) =>
  client.get(`/projects/${projectId}/jobs`, { params });

export const submitProjectJobApi = (projectId, payload) =>
  client.post(`/projects/${projectId}/messages`, payload);

