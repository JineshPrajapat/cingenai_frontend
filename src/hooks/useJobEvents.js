import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectJobEvent, selectWSConnected } from '../features/ws/wsSlice';
import { getJobApi } from '../features/jobs/jobsApi';
import { handleWSEvent } from '../features/ws/wsSlice';
import { isActive, isTerminal } from '../utils/statusConfig';

const POLL_INTERVAL = 5000;

export const useJobEvents = (jobId) => {
  const dispatch = useDispatch();
  const event = useSelector(selectJobEvent(jobId));
  const wsConnected = useSelector(selectWSConnected);
  const pollTimerRef = useRef(null);

  const status = event?.status;
  const currentStep = event?.current_step ?? 0;
  const totalSteps = event?.total_steps ?? 5;
  const progress = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;
  const message = event?.message ?? null;
  const sceneProgress =
    event?.scene_current && event?.scene_total
      ? { current: event.scene_current, total: event.scene_total }
      : null;

  const poll = useCallback(async () => {
    if (!jobId) return;
    try {
      const res = await getJobApi(jobId);
      if (res?.data) {
        dispatch(
          handleWSEvent({
            event: 'job_status',
            job_id: res.data.id,
            project_id: res.data.project_id,
            status: res.data.status,
            current_step: res.data.current_step ?? 0,
            total_steps: res.data.total_steps ?? 5,
            message: res.data.message ?? null,
            scene_current: res.data.scene_current ?? null,
            scene_total: res.data.scene_total ?? null,
            video_url: res.data.video_url ?? null,
            failed_at_step: res.data.failed_at_step ?? null,
            error_message: res.data.error_message ?? null,
            timestamp: new Date().toISOString(),
          })
        );
      }
    } catch (err) {
      console.warn('[Poll] Failed to fetch job', jobId, err);
    }
  }, [jobId, dispatch]);

  useEffect(() => {
    if (!jobId) return;
    const shouldPoll = !wsConnected && status && isActive(status);

    if (shouldPoll) {
      pollTimerRef.current = setInterval(poll, POLL_INTERVAL);
    } else {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    }

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [jobId, wsConnected, status, poll]);

  return { event, status, progress, message, sceneProgress };
};