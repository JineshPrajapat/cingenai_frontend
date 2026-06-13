import client from '../../app/client';

export const listJobsApi = (projectId, params) =>
  client.get(`/projects/${projectId}/jobs`, { params });
export const getJobApi = (jobId) => client.get(`/jobs/${jobId}`);
export const cancelJobApi = (jobId) => client.delete(`/jobs/${jobId}`);
export const getScriptApi = (jobId) => client.get(`/content/jobs/${jobId}/script`);
export const getAudioFilesApi = (jobId) => client.get(`/content/jobs/${jobId}/audio`);
export const getImageFilesApi = (jobId) => client.get(`/content/jobs/${jobId}/images`);
export const getVideoApi = (jobId) => client.get(`/content/jobs/${jobId}/video`);
export const retryJobApi = (jobId) => client.post(`/jobs/${jobId}/retry`)