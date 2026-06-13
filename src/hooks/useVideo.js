import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectVideo } from '../features/content/contentSlice';
import { setVideo } from '../features/content/contentSlice';
import { getVideoApi } from '../features/jobs/jobsApi';

export const useVideo = (jobId) => {
  const dispatch = useDispatch();
  const video = useSelector(selectVideo(jobId));

  useEffect(() => {
    if (!jobId || video) return;
    getVideoApi(jobId)
      .then((res) => {
        if (res?.data) dispatch(setVideo({ jobId, video: res.data }));
      })
      .catch(() => {});
  }, [jobId, video, dispatch]);

  return video;
};