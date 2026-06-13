// import { useEffect, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import {
//   Box, Typography, Stack, Chip, Divider, LinearProgress,
//   CircularProgress,
// } from '@mui/material';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   selectProject, selectMessages, selectActiveJobId, selectMessagesLoading,
//   setProject, setMessages, setActiveJobId, appendMessage,
//   replaceOptimisticMessage, removeMessage, setLoading, setMessagesLoading,
// } from '../features/project/projectSlice';
// import { getProjectApi, getMessagesApi, submitGenerationApi } from '../features/project/projectApi';
// import { cancelJobApi } from '../features/jobs/jobsApi';
// import { selectJobEvent, optimisticQueueJob, optimisticCancelJob } from '../features/ws/wsSlice';
// import { selectAllEvents } from '../features/ws/wsSlice';
// import { useNotify } from '../hooks';
// import { isActive, isTerminal, ACTIVE_STATUSES } from '../utils/statusConfig';
// import ChatThread from '../components/studio/ChatThread';
// import PromptBar from '../components/studio/PromptBar';
// import PipelineTracker from '../components/job/PipelineTracker';
// import ScriptViewer from '../components/content/ScriptViewer';
// import SceneGrid from '../components/content/SceneGrid';
// import StatusBadge from '../components/shared/StatusBadge';
// import { useJobEvents } from '../hooks/useJobEvents';
// import { getScriptApi, getAudioFilesApi, getImageFilesApi } from '../features/jobs/jobsApi';
// import { setScript, setAudioFiles, setImageFiles } from '../features/content/contentSlice';
// import { selectScript, selectAudioFiles, selectImageFiles } from '../features/content/contentSlice';

// // Active job right panel
// const ActiveJobPanel = ({ jobId }) => {
//   const dispatch = useDispatch();
//   const { status, progress, message, sceneProgress } = useJobEvents(jobId);
//   const script = useSelector(selectScript(jobId));
//   const audioFiles = useSelector(selectAudioFiles(jobId)) || [];
//   const imageFiles = useSelector(selectImageFiles(jobId)) || [];

//   useEffect(() => {
//     if (!jobId || !status) return;
//     const step = ['VOICING','IMAGING','RENDERING','COMPLETE'].includes(status);
//     if (step && !script) {
//       getScriptApi(jobId).then((r) => { if (r?.data) dispatch(setScript({ jobId, script: r.data })); }).catch(() => {});
//     }
//     if (['IMAGING','RENDERING','COMPLETE'].includes(status)) {
//       getImageFilesApi(jobId).then((r) => { if (r?.data) dispatch(setImageFiles({ jobId, files: r.data })); }).catch(() => {});
//       getAudioFilesApi(jobId).then((r) => { if (r?.data) dispatch(setAudioFiles({ jobId, files: r.data })); }).catch(() => {});
//     }
//   }, [status, jobId, script, dispatch]);

//   return (
//     <Box p={2} display="flex" flexDirection="column" gap={2} overflow="auto">
//       <Typography variant="h6" fontWeight={700}>Generating</Typography>
//       <PipelineTracker status={status} />
//       <LinearProgress variant="determinate" value={progress} color="secondary" sx={{ borderRadius: 1 }} />
//       {message && <Typography variant="body2" color="text.secondary">{message}</Typography>}
//       {sceneProgress && (
//         <Typography variant="caption" color="secondary.main" fontWeight={600}>
//           Scene {sceneProgress.current} of {sceneProgress.total}
//         </Typography>
//       )}
//       {script?.scenes && (
//         <Box>
//           <Typography variant="overline" color="text.secondary" fontWeight={600} display="block" mb={1}>Script</Typography>
//           <ScriptViewer scenes={script.scenes} />
//         </Box>
//       )}
//       {imageFiles.length > 0 && (
//         <Box>
//           <Typography variant="overline" color="text.secondary" fontWeight={600} display="block" mb={1}>Scenes</Typography>
//           <SceneGrid scenes={script?.scenes || []} imageFiles={imageFiles} audioFiles={audioFiles} />
//         </Box>
//       )}
//     </Box>
//   );
// };

// // Idle right panel showing project context
// const ProjectContextPanel = ({ project }) => {
//   if (!project) return null;
//   const topics = project.context_memory?.past_topics || [];
//   const videoCount = project.video_count ?? 0;

//   return (
//     <Box p={2.5} overflow="auto">
//       <Typography variant="h6" fontWeight={700} mb={2}>{project.title}</Typography>
//       <Stack spacing={1.5} mb={2}>
//         {project.genre && (
//           <Box>
//             <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">GENRE</Typography>
//             <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{project.genre}</Typography>
//           </Box>
//         )}
//         {project.target_audience && (
//           <Box>
//             <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">AUDIENCE</Typography>
//             <Typography variant="body2">{project.target_audience}</Typography>
//           </Box>
//         )}
//         {project.style_notes && (
//           <Box>
//             <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">STYLE</Typography>
//             <Typography variant="body2">{project.style_notes}</Typography>
//           </Box>
//         )}
//       </Stack>

//       {topics.length > 0 && (
//         <>
//           <Divider sx={{ mb: 2 }} />
//           <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>
//             TOPICS COVERED
//           </Typography>
//           <Stack direction="row" flexWrap="wrap" gap={0.75}>
//             {topics.map((t, i) => <Chip key={i} label={t} size="small" variant="outlined" />)}
//           </Stack>
//         </>
//       )}

//       <Divider sx={{ my: 2 }} />
//       <Typography variant="caption" color="text.secondary">
//         {videoCount} video{videoCount !== 1 ? 's' : ''}
//       </Typography>
//     </Box>
//   );
// };

// const Studio = () => {
//   const { projectId } = useParams();
//   const dispatch = useDispatch();
//   const notify = useNotify();

//   const project = useSelector(selectProject);
//   const messages = useSelector(selectMessages);
//   const activeJobId = useSelector(selectActiveJobId);
//   const messagesLoading = useSelector(selectMessagesLoading);
//   const allEvents = useSelector(selectAllEvents);

//   console.log("messages", messages)

//   // Determine if any job is currently active
//   const activeEvent = activeJobId ? allEvents[activeJobId] : null;
//   const jobIsActive = activeEvent ? isActive(activeEvent.status) : false;

//   // Watch for job completion to reload messages
//   useEffect(() => {
//     if (!activeJobId || !allEvents[activeJobId]) return;
//     const ev = allEvents[activeJobId];
//     if (isTerminal(ev.status)) {
//       // Refresh messages to get the result card
//       getMessagesApi(projectId).then((r) => {
//         if (r?.data) dispatch(setMessages(r.data));
//       }).catch(() => {});
//       if (ev.status === 'COMPLETE') {
//         dispatch(setActiveJobId(null));
//       } else if (ev.status === 'FAILED' || ev.status === 'CANCELLED') {
//         dispatch(setActiveJobId(null));
//       }
//     }
//   }, [allEvents, activeJobId, projectId, dispatch]);

//   useEffect(() => {
//     if (!projectId) return;
//     dispatch(setLoading(true));
//     dispatch(setMessagesLoading(true));
//     Promise.all([
//       getProjectApi(projectId),
//       getMessagesApi(projectId),
//     ]).then(([projRes, msgsRes]) => {
//       if (projRes?.data) dispatch(setProject(projRes.data));
//       if (msgsRes?.data) dispatch(setMessages(msgsRes.data));
//     }).catch((err) => {
//       notify.error(err.message || 'Failed to load project');
//     });
//   }, [projectId, dispatch]);

//   const handleSubmit = useCallback(async (prompt) => {
//     const tempMsgId = `optimistic-${Date.now()}`;
//     const tempJobId = `optimistic-job-${Date.now()}`;

//     // Optimistic: user bubble
//     dispatch(appendMessage({
//       id: tempMsgId,
//       role: 'user',
//       message_type: 'generation_request',
//       content: prompt,
//       sequence_order: messages.length + 1,
//       created_at: new Date().toISOString(),
//     }));

//     // Optimistic: queued job event
//     dispatch(optimisticQueueJob({ job_id: tempJobId, project_id: projectId }));
//     dispatch(setActiveJobId(tempJobId));

//     try {
//       const res = await submitGenerationApi(projectId, { user_prompt: prompt });
//       if (res?.data) {
//         const { message: newMsg, job } = res.data;
//         // Replace temp message
//         if (newMsg) dispatch(replaceOptimisticMessage({ tempId: tempMsgId, message: newMsg }));
//         // Replace temp job id with real one
//         if (job) {
//           dispatch(optimisticQueueJob({ job_id: job.id, project_id: projectId }));
//           dispatch(setActiveJobId(job.id));
//         }
//       }
//     } catch (err) {
//       dispatch(removeMessage(tempMsgId));
//       dispatch(setActiveJobId(null));
//       notify.error(err.message || 'Failed to submit generation');
//     }
//   }, [projectId, messages.length, dispatch, notify]);

//   const handleCancelJob = useCallback(async (jobId) => {
//     dispatch(optimisticCancelJob(jobId));
//     dispatch(setActiveJobId(null));
//     try {
//       await cancelJobApi(jobId);
//     } catch {
//       // revert handled gracefully — job status will self-correct on next WS event
//     }
//   }, [dispatch]);

//   return (
//     <Box display="flex" height="calc(100vh - 64px)" overflow="hidden">
//       {/* Left: Chat panel */}
//       <Box
//         flex="0 0 75%"
//         display="flex"
//         flexDirection="column"
//         borderRight="1px solid"
//         borderColor="divider"
//         overflow="hidden"
//       >
//         <ChatThread
//           messages={messages}
//           activeJobId={jobIsActive ? activeJobId : null}
//           activeJobTitle={project?.title}
//           onCancelJob={handleCancelJob}
//           loading={messagesLoading}
//         />
//         <PromptBar onSubmit={handleSubmit} disabled={jobIsActive} />
//       </Box>

//       {/* Right: Context / Active job panel */}
//       <Box
//         flex="0 0 25%"
//         overflow="hidden"
//         bgcolor="background.default"
//         display="flex"
//         flexDirection="column"
//       >
//         {jobIsActive ? (
//           <ActiveJobPanel jobId={activeJobId} />
//         ) : (
//           <ProjectContextPanel project={project} />
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default Studio;








/**
 * Studio — /projects/:projectId
 *
 * V2: Job-based video generation dashboard.
 *   - Centered prompt input (ChatGPT-style) creates a new generation job.
 *   - On submit → POST /projects/:id/messages → redirect to /projects/:id/jobs/:jobId
 *   - Right panel shows recent jobs for this project.
 *
 * V1 Chat system is preserved below (commented out) for future conversation-based refinement.
 */
import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Stack, Chip, Divider, Card, CardActionArea,
  CardContent, LinearProgress, IconButton, Tooltip, Skeleton,
  CircularProgress, alpha,
} from '@mui/material';
import {SendRounded as SendRoundedIcon} from '@mui/icons-material';
import {AutoAwesome as AutoAwesomeIcon} from '@mui/icons-material';
import {VideoLibrary as VideoLibraryIcon} from '@mui/icons-material';
import {History as HistoryIcon} from '@mui/icons-material';
import {Settings as SettingsIcon} from '@mui/icons-material';
import {Add as AddIcon} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { selectProject, setProject } from '../features/project/projectSlice';
import { getProjectApi } from '../features/project/projectApi';
import {
  selectProjectJobs, selectProjectJobsLoading,
  setProjectJobs, setJobsLoading, prependProjectJob,
} from '../features/projects/projectsSlice';
import { listProjectJobsApi, submitProjectJobApi } from '../features/projects/projectsApi';
import { selectAllEvents } from '../features/ws/wsSlice';
import { useNotify } from '../hooks';
import { isActive, STATUS_CONFIG } from '../utils/statusConfig';
import { relativeDate } from '../utils/formatters';
import StatusBadge from '../components/shared/StatusBadge';

// ── Suggestion chips ────────────────────────────────────────────────────
const SUGGESTIONS = [
  'Product launch ad for a mobile app',
  'Educational explainer on climate change',
  'Fitness motivation reel, 60 seconds',
  'Business pitch for B2B SaaS product',
];

// ── Status progress bar colours ──────────────────────────────────────────
const PROGRESS_COLORS = {
  QUEUED: 'inherit', SCRIPTING: 'info', VOICING: 'secondary',
  IMAGING: 'warning', RENDERING: 'error', COMPLETE: 'success',
  FAILED: 'error', CANCELLED: 'inherit',
};

// ── Recent job card in right panel ─────────────────────────────────────
const RecentJobCard = ({ job, wsEvent, onClick }) => {
  const liveStatus = wsEvent?.status || job.status;
  const liveStep   = wsEvent?.current_step ?? job.current_step ?? 0;
  const totalSteps = wsEvent?.total_steps  ?? job.total_steps  ?? 5;
  const progress   = isActive(liveStatus)
    ? Math.round((liveStep / totalSteps) * 100)
    : liveStatus === 'COMPLETE' ? 100 : 0;

  return (
    <Card
      onClick={onClick}
      sx={{
        mb: 1.25, cursor: 'pointer', transition: 'all 0.15s',
        '&:hover': { borderColor: 'secondary.main', boxShadow: '0 0 0 1px #7c3aed22' },
        ...(isActive(liveStatus) && { borderColor: 'secondary.light' }),
      }}
    >
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={0.75}>
          <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 200, lineHeight: 1.3 }}>
            {job.title || 'Untitled'}
          </Typography>
          <StatusBadge status={liveStatus} size="small" />
        </Stack>

        {isActive(liveStatus) && (
          <LinearProgress
            variant="determinate"
            value={progress}
            color={PROGRESS_COLORS[liveStatus]}
            sx={{ mb: 0.75, borderRadius: 1, height: 4 }}
          />
        )}

        {/* User prompt preview */}
        {job.user_prompt && (
          <Typography variant="caption" color="text.secondary"
            sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
            {job.user_prompt}
          </Typography>
        )}

        <Typography variant="caption" color="text.disabled" display="block" mt={0.5}>
          {relativeDate(job.created_at)}
        </Typography>
      </CardContent>
    </Card>
  );
};

// ── Prompt textarea ─────────────────────────────────────────────────────
const MIN_CHARS = 5;
const MAX_CHARS = 2000;

const PromptInput = ({ onSubmit, disabled }) => {
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const ref = useRef(null);
  const canSubmit = value.trim().length >= MIN_CHARS && !disabled && !submitting;

  const doSubmit = useCallback(async () => {
    if (!canSubmit) return;
    const prompt = value.trim();
    setValue('');
    setSubmitting(true);
    try { await onSubmit(prompt); }
    finally { setSubmitting(false); ref.current?.focus(); }
  }, [canSubmit, value, onSubmit]);

  const onKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); doSubmit(); }
  };

  return (
    <Box
      sx={{
        border: '1.5px solid',
        borderColor: disabled ? 'divider' : 'primary.main',
        borderRadius: 3,
        bgcolor: 'background.paper',
        boxShadow: disabled ? 'none' : '0 4px 24px rgba(26,26,46,0.08)',
        transition: 'all 0.2s',
        overflow: 'hidden',
      }}
    >
      <Box
        component="textarea"
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, MAX_CHARS))}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder="Describe your video idea in detail…"
        rows={4}
        sx={{
          width: '100%', border: 'none', outline: 'none', resize: 'none',
          fontFamily: '"DM Sans", sans-serif', fontSize: 15, lineHeight: 1.65,
          color: 'text.primary', bgcolor: 'transparent', p: 2,
          '&::placeholder': { color: 'text.disabled' },
          '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
          display: 'block',
        }}
      />
      <Box
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 2, pb: 1.5, pt: 0,
        }}
      >
        <Typography variant="caption" color="text.disabled">
          {value.length >= 1800 ? `${value.length}/${MAX_CHARS}` : '⌘↵ to generate'}
        </Typography>
        <Tooltip title={disabled ? 'Generating…' : 'Generate video (⌘↵)'}>
          <span>
            <IconButton
              onClick={doSubmit}
              disabled={!canSubmit}
              size="medium"
              sx={{
                bgcolor: canSubmit ? 'primary.main' : 'action.disabledBackground',
                color: canSubmit ? 'white' : 'text.disabled',
                borderRadius: 2,
                width: 40, height: 40,
                '&:hover': { bgcolor: canSubmit ? 'primary.dark' : 'action.disabledBackground' },
                transition: 'all 0.2s',
              }}
            >
              {submitting
                ? <CircularProgress size={18} color="inherit" />
                : <SendRoundedIcon fontSize="small" />
              }
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};

// ── Main Studio page ────────────────────────────────────────────────────
const Studio = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notify = useNotify();

  const project = useSelector(selectProject);
  const jobs = useSelector(selectProjectJobs(projectId));
  const jobsLoading = useSelector(selectProjectJobsLoading(projectId));
  const allEvents = useSelector(selectAllEvents);

  const hasActiveJob = jobs.some((j) => {
    const ev = allEvents[j.cj_id];
    return isActive(ev?.status || j.status);
  });

  // Load project + jobs
  useEffect(() => {
    if (!projectId) return;
    if (!project || project.p_id !== projectId) {
      getProjectApi(projectId)
        .then((r) => { if (r?.data) dispatch(setProject(r.data)); })
        .catch(() => {});
    }
    dispatch(setJobsLoading({ projectId, loading: true }));
    listProjectJobsApi(projectId, { page: 1, limit: 20 })
      .then((r) => {
        const raw = r?.data?.jobs || [];
        dispatch(setProjectJobs({ projectId, jobs: raw }));
      })
      .catch(() => dispatch(setJobsLoading({ projectId, loading: false })));
  }, [projectId, dispatch]);


  const handleSubmit = useCallback(async (prompt) => {
    try {
      const res = await submitProjectJobApi(projectId, { user_prompt: prompt });
      // Backend returns job under res.data.job or res.data
      const raw = res?.data?.job || res?.data;
      if (raw) {
        const job = raw;
        dispatch(prependProjectJob({ projectId, job }));
        // Expand project in sidebar to show new job
        navigate(`/projects/${projectId}/jobs/${job.cj_id}`);
      }
    } catch (err) {
      notify.error(err.message || 'Failed to start generation');
    }
  }, [projectId, dispatch, navigate, notify]);

  const handleSuggestion = (text) => handleSubmit(text);

  return (
    <Box display="flex" height="calc(100vh - 64px)" overflow="hidden">

      {/* ── Left: Prompt area ─────────────────────────────── */}
      <Box
        flex="1 1 60%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        px={{ xs: 3, md: 6 }}
        py={4}
        overflow="auto"
        sx={{ bgcolor: 'background.default' }}
      >
        {/* Project header */}
        <Box width="100%" maxWidth={640} mb={4}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              {project ? (
                <>
                  <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
                    {project?.title}
                  </Typography>
                  {project.genre && (
                    <Chip
                      label={project.genre}
                      size="small"
                      sx={{ mt: 0.5, textTransform: 'capitalize', bgcolor: 'secondary.light', color: 'secondary.dark', fontWeight: 600, fontSize: 11 }}
                    />
                  )}
                </>
              ) : (
                <Skeleton width={200} height={36} />
              )}
            </Box>
            <Stack direction="row" gap={0.5}>
              <Tooltip title="History">
                <IconButton onClick={() => navigate(`/projects/${projectId}/history`)}>
                  <HistoryIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Settings">
                <IconButton onClick={() => navigate(`/projects/${projectId}/settings`)}>
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
          {project?.description && (
            <Typography variant="body2" color="text.secondary" mt={0.75}>
              {project.description}
            </Typography>
          )}
        </Box>

        {/* Hero prompt area */}
        <Box width="100%" maxWidth={640}>
          <Stack direction="row" alignItems="center" gap={1} mb={2}>
            <AutoAwesomeIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
            <Typography variant="h6" fontWeight={700} fontSize={16}>
              Generate a new video
            </Typography>
          </Stack>

          <PromptInput onSubmit={handleSubmit} disabled={false} />

          {/* Suggestion chips */}
          {/* <Box mt={2.5}>
            <Typography variant="caption" color="text.disabled" fontWeight={600} letterSpacing={0.5}>
              TRY AN EXAMPLE
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
              {SUGGESTIONS.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  size="small"
                  variant="outlined"
                  onClick={() => handleSuggestion(s)}
                  sx={{
                    cursor: 'pointer', borderRadius: 2, fontSize: 12,
                    '&:hover': { bgcolor: 'secondary.light', borderColor: 'secondary.main', color: 'secondary.dark' },
                  }}
                />
              ))}
            </Stack>
          </Box> */}

          {/* Context info */}
          {project && (project.target_audience || project.style_notes) && (
            <Box
              mt={3} p={2} borderRadius={2}
              sx={{ bgcolor: alpha('#7c3aed', 0.04), border: '1px solid', borderColor: alpha('#7c3aed', 0.12) }}
            >
              <Typography variant="caption" color="secondary.main" fontWeight={700} letterSpacing={0.5}>
                PROJECT CONTEXT
              </Typography>
              {project.target_audience && (
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  <strong>Audience:</strong> {project.target_audience}
                </Typography>
              )}
              {project.style_notes && (
                <Typography variant="body2" color="text.secondary" mt={0.25}>
                  <strong>Style:</strong> {project.style_notes}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Right: Recent jobs panel ──────────────────────── */}
      <Box
        flex="0 0 340px"
        display="flex"
        flexDirection="column"
        borderLeft="1px solid"
        borderColor="divider"
        bgcolor="background.paper"
        overflow="hidden"
      >
        <Box px={2.5} py={2} borderBottom="1px solid" sx={{ borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1" fontWeight={700}>Recent Jobs</Typography>
            <Tooltip title="View all">
              <IconButton size="small" onClick={() => navigate(`/projects/${projectId}/history`)}>
                <HistoryIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} in this project
          </Typography>
        </Box>

        <Box flexGrow={1} overflow="auto" px={2} py={1.5}
          sx={{ '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 2 } }}>
          {jobsLoading ? (
            <Stack spacing={1.25}>
              {[1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={90} />)}
            </Stack>
          ) : jobs.length === 0 ? (
            <Box textAlign="center" py={6}>
              <VideoLibraryIcon sx={{ fontSize: 44, color: 'divider', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No jobs yet. Write a prompt to generate your first video.
              </Typography>
            </Box>
          ) : (
            jobs.map((job) => (
              <RecentJobCard
                key={job.cj_id}
                job={job}
                wsEvent={allEvents[job.cj_id]}
                onClick={() => navigate(`/projects/${projectId}/jobs/${job.cj_id}`)}
              />
            ))
          )}
        </Box>

        {jobs.length > 0 && (
          <Box px={2} py={1.5} borderTop="1px solid" sx={{ borderColor: 'divider' }}>
            <Typography
              variant="caption" color="secondary.main" fontWeight={600}
              sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              onClick={() => navigate(`/projects/${projectId}/history`)}
            >
              View full history →
            </Typography>
          </Box>
        )}
      </Box>

      {/* ─────────────────────────────────────────────────────────────────────
        V1 CHAT SYSTEM — commented out, reserved for V2 conversation-based
        video refinement (see components/studio/ChatThread, PromptBar,
        MessageBubble, LiveJobCard).
      ─────────────────────────────────────────────────────────────────────
      <Box flex="0 0 55%" display="flex" flexDirection="column" borderRight="1px solid" borderColor="divider" overflow="hidden">
        <ChatThread messages={messages} activeJobId={jobIsActive ? activeJobId : null}
          activeJobTitle={project?.title} onCancelJob={handleCancelJob} loading={messagesLoading} />
        <PromptBar onSubmit={handleSubmitV1} disabled={jobIsActive} />
      </Box>
      <Box flex="0 0 45%" overflow="hidden" bgcolor="background.default" display="flex" flexDirection="column">
        {jobIsActive ? <ActiveJobPanel jobId={activeJobId} /> : <ProjectContextPanel project={project} />}
      </Box>
      ───────────────────────────────────────────────────────────────────── */}
    </Box>
  );
};

export default Studio;
