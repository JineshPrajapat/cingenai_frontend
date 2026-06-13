import client from '../../app/client';

export const getScriptApi = (jobId) => client.get(`/jobs/${jobId}/script`);
export const getAudioFilesApi = (jobId) => client.get(`/jobs/${jobId}/audio`);
export const getImageFilesApi = (jobId) => client.get(`/jobs/${jobId}/images`);
export const getVideoApi = (jobId) => client.get(`/jobs/${jobId}/video`);