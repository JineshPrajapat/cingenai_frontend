// import { useEffect, useState } from 'react';
// import {
//   Box, Typography, Stack, IconButton, Tabs, Tab, Button,
//   Paper, Table, TableBody, TableRow, TableCell, Skeleton,
// } from '@mui/material';
// import {ArrowBack as ArrowBackIcon} from '@mui/icons-material';
// import {Download as DownloadIcon} from '@mui/icons-material';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { getJobApi } from '../features/jobs/jobsApi';
// import { getScriptApi, getAudioFilesApi, getImageFilesApi, getVideoApi } from '../features/jobs/jobsApi';
// import { setJob, selectJob } from '../features/jobs/jobsSlice';
// import {
//   setScript, setAudioFiles, setImageFiles, setVideo,
//   selectScript, selectAudioFiles, selectImageFiles, selectVideo,
// } from '../features/content/contentSlice';
// import StatusBadge from '../components/shared/StatusBadge';
// import PipelineTracker from '../components/job/PipelineTracker';
// import VideoPlayer from '../components/content/VideoPlayer';
// import ScriptViewer from '../components/content/ScriptViewer';
// import SceneGrid from '../components/content/SceneGrid';
// import { useJobEvents } from '../hooks/useJobEvents';
// import { absoluteDate, duration } from '../utils/formatters';
// import { isActive } from '../utils/statusConfig';
// import ActiveJobSummary from '../components/job/ActiveJobSummary';
// import { useNotify } from '../hooks';

// const TabPanel = ({ children, value, index }) =>
//   value === index ? <Box pt={2}>{children}</Box> : null;

// const JobDetail = () => {
//   const { jobId } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const notify = useNotify();
//   const job = useSelector(selectJob);
//   const script = useSelector(selectScript(jobId));
//   const audioFiles = useSelector(selectAudioFiles(jobId)) || [];
//   const imageFiles = useSelector(selectImageFiles(jobId)) || [];
//   const video = useSelector(selectVideo(jobId));
//   const [tab, setTab] = useState(0);
//   const [loading, setLoading] = useState(true);

//   const { status } = useJobEvents(jobId);
//   const effectiveStatus = status || job?.status;

//   useEffect(() => {
//     setLoading(true);
//     getJobApi(jobId)
//       .then((r) => { if (r?.data) dispatch(setJob(r.data)); })
//       .catch((err) => notify.error(err.message))
//       .finally(() => setLoading(false));
//   }, [jobId, dispatch]);

//   useEffect(() => {
//     if (!effectiveStatus) return;
//     const hasScript = ['VOICING', 'IMAGING', 'RENDERING', 'COMPLETE'].includes(effectiveStatus);
//     const hasImages = ['IMAGING', 'RENDERING', 'COMPLETE'].includes(effectiveStatus);

//     if (hasScript && !script) {
//       getScriptApi(jobId).then((r) => { if (r?.data) dispatch(setScript({ jobId, script: r.data })); }).catch(() => {});
//     }
//     if (hasImages) {
//       if (!imageFiles.length) getImageFilesApi(jobId).then((r) => { if (r?.data) dispatch(setImageFiles({ jobId, files: r.data })); }).catch(() => {});
//       if (!audioFiles.length) getAudioFilesApi(jobId).then((r) => { if (r?.data) dispatch(setAudioFiles({ jobId, files: r.data })); }).catch(() => {});
//     }
//     if (effectiveStatus === 'COMPLETE' && !video) {
//       getVideoApi(jobId).then((r) => { if (r?.data) dispatch(setVideo({ jobId, video: r.data })); }).catch(() => {});
//     }
//   }, [effectiveStatus, jobId]);

//   if (loading) {
//     return (
//       <Box p={3} maxWidth={800} mx="auto">
//         <Skeleton variant="rounded" height={80} sx={{ mb: 2 }} />
//         <Skeleton variant="rounded" height={60} sx={{ mb: 2 }} />
//         <Skeleton variant="rounded" height={300} />
//       </Box>
//     );
//   }

//   const scenes = script?.scenes || [];
//   const hasScript = scenes.length > 0;
//   const hasImages = imageFiles.length > 0;
//   const isJobActive = isActive(effectiveStatus);

//   return (
//     <Box p={3} maxWidth={800} mx="auto">
//       {/* Section 1: Header */}
//       <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={2}>
//         <Stack direction="row" alignItems="center" gap={1}>
//           <IconButton onClick={() => navigate(-1)} size="small">
//             <ArrowBackIcon />
//           </IconButton>
//           <Box>
//             <Typography variant="h5" fontWeight={700}>{job?.title || 'Untitled Job'}</Typography>
//             <Typography variant="body2" color="text.secondary">
//               Created: {absoluteDate(job?.created_at)}
//               {job?.duration_s ? ` · ${duration(job.duration_s)}` : ''}
//               {job?.scene_count ? ` · ${job.scene_count} scenes` : ''}
//             </Typography>
//           </Box>
//         </Stack>
//         <Stack direction="row" gap={1} alignItems="center">
//           <StatusBadge status={effectiveStatus} />
//           {effectiveStatus === 'COMPLETE' && video?.file_url && (
//             <Button
//               variant="outlined"
//               size="small"
//               startIcon={<DownloadIcon />}
//               component="a"
//               href={video.file_url}
//               download
//             >
//               Download
//             </Button>
//           )}
//         </Stack>
//       </Stack>

//       <PipelineTracker status={effectiveStatus} />

//       {/* Section 2: Video or Live View */}
//       <Paper elevation={0} sx={{ p: 2, my: 2, border: '1px solid', borderColor: 'divider' }}>
//         {effectiveStatus === 'COMPLETE' && video ? (
//           <VideoPlayer video={video} />
//         ) : isJobActive ? (
//           <Box>
//             <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
//               Generation in progress…
//             </Typography>
//           </Box>
//         ) : (
//           <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
//             {effectiveStatus === 'FAILED' ? 'Generation failed. No video available.' : 'Video not available.'}
//           </Typography>
//         )}
//       </Paper>

//       {/* Section 3: Tabs */}
//       <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
//         <Tab label="Script" disabled={!hasScript} sx={{ textTransform: 'none', fontWeight: 500 }} />
//         <Tab label="Scenes" disabled={!hasImages} sx={{ textTransform: 'none', fontWeight: 500 }} />
//         <Tab label="Details" sx={{ textTransform: 'none', fontWeight: 500 }} />
//       </Tabs>

//       <TabPanel value={tab} index={0}>
//         <ScriptViewer scenes={scenes} />
//       </TabPanel>

//       <TabPanel value={tab} index={1}>
//         <SceneGrid scenes={scenes} imageFiles={imageFiles} audioFiles={audioFiles} />
//       </TabPanel>

//       <TabPanel value={tab} index={2}>
//         <Table size="small">
//           <TableBody>
//             {[
//               ['Job ID', job?.cj_id],
//               ['Status', <StatusBadge status={effectiveStatus} key="s" />],
//               ['Created', absoluteDate(job?.created_at)],
//               ['Failed at', job?.failed_at_step ?? '—'],
//               ['Retry Count', job?.retry_count ?? '—'],
//               ['Updated', absoluteDate(job?.updated_at)],
//               // ['Duration', duration(job?.duration_s)],
//               // ['Scenes', job?.scene_count ?? '—'],
//               // ['Resolution', video?.resolution ?? '—'],
//             ].map(([label, value]) => (
//               <TableRow key={label}>
//                 <TableCell sx={{ color: 'text.secondary', fontWeight: 500, width: 140, border: 'none', pl: 0 }}>
//                   {label}
//                 </TableCell>
//                 <TableCell sx={{ border: 'none' }}>{value ?? '—'}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TabPanel>
//     </Box>
//   );
// };

// export default JobDetail;



















import { useEffect, useState } from 'react';
import {
  Box, Typography, Stack, IconButton, Tabs, Tab, Button, Paper,
  Table, TableBody, TableRow, TableCell, Skeleton, LinearProgress,
  Chip, Tooltip, Divider, alpha, CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { Cancel as CancelIcon } from '@mui/icons-material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJobApi, cancelJobApi, retryJobApi } from '../features/jobs/jobsApi';
import { getScriptApi, getAudioFilesApi, getImageFilesApi, getVideoApi } from '../features/jobs/jobsApi';
import { setJob, selectJob } from '../features/jobs/jobsSlice';
import {
  setScript, setAudioFiles, setImageFiles, setVideo,
  selectScript, selectAudioFiles, selectImageFiles, selectVideo,
} from '../features/content/contentSlice';
import { optimisticCancelJob } from '../features/ws/wsSlice';
import StatusBadge from '../components/shared/StatusBadge';
import PipelineTracker from '../components/job/PipelineTracker';
import VideoPlayer from '../components/content/VideoPlayer';
import ScriptViewer from '../components/content/ScriptViewer';
import SceneGrid from '../components/content/SceneGrid';
import { useJobEvents } from '../hooks/useJobEvents';
import { absoluteDate, duration } from '../utils/formatters';
import { isActive, isTerminal, STATUS_CONFIG } from '../utils/statusConfig';
import { useNotify } from '../hooks';
import {
  HourglassEmpty,
  Edit,
  Mic,
  Image,
  Movie,
  CheckCircle,
  Error,
  Cancel,
} from "@mui/icons-material";

// ── Live step log bar ────────────────────────────────────────────────────
const STEP_MESSAGES = {
  QUEUED: { icon: <HourglassEmpty color="warning" />, label: 'Waiting in queue…', desc: 'Your job is queued and will start shortly.' },
  SCRIPTING: { icon: <Edit color="primary" />, label: 'Writing script…', desc: 'AI is crafting your video script and scene breakdowns.' },
  VOICING: { icon: <Mic color="secondary" />, label: 'Generating audio…', desc: 'Voice narration is being synthesised for each scene.' },
  IMAGING: { icon: <Image color="info" />, label: 'Creating visuals…', desc: 'AI is generating images for every scene.' },
  RENDERING: { icon: <Movie color="primary" />, label: 'Assembling video…', desc: 'Scenes are being composited into the final video.' },
  COMPLETE: { icon: <CheckCircle color="success" />, label: 'Complete!', desc: 'Your video is ready to view and download.' },
  FAILED: { icon: <Error color="error" />, label: 'Generation failed', desc: 'An error occurred during generation.' },
  CANCELLED: { icon: <Cancel color="disabled" />, label: 'Cancelled', desc: 'This job was cancelled.' },
};

const LiveStatusBanner = ({ status, progress, message, sceneProgress, jobId, onCancel }) => {
  const meta = STEP_MESSAGES[status] || STEP_MESSAGES.QUEUED;
  const active = isActive(status);
  const failed = status === 'FAILED';
  const complete = status === 'COMPLETE';

  const bgColor = complete ? alpha('#10b981', 0.06)
    : failed ? alpha('#ef4444', 0.06)
      : alpha('#7c3aed', 0.05);
  const borderColor = complete ? '#10b981' : failed ? '#ef4444' : '#7c3aed';

  return (
    <Box sx={{ border: '1px solid', borderColor, borderRadius: 2, bgcolor: bgColor, p: 2.5, mb: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={active ? 1.5 : 0}>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Typography fontSize={22}>{meta.icon}</Typography>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>{meta.label}</Typography>
            <Typography variant="caption" color="text.secondary">{message || meta.desc}</Typography>
            {sceneProgress && (
              <Typography variant="caption" color="secondary.main" fontWeight={600} display="block">
                Scene {sceneProgress.current} of {sceneProgress.total}
              </Typography>
            )}
          </Box>
        </Stack>
        <Stack direction="row" gap={1} alignItems="center">
          {active && (
            <Tooltip title="Cancel job">
              <IconButton size="small" color="error" onClick={onCancel}>
                <CancelIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <StatusBadge status={status} />
        </Stack>
      </Stack>
      {active && (
        <LinearProgress
          variant="determinate"
          value={progress}
          color="secondary"
          sx={{ borderRadius: 1, height: 6 }}
        />
      )}
    </Box>
  );
};

// ── User prompt viewer ─────────────────────────────────────────────────
const PromptViewer = ({ prompt }) => {
  const [expanded, setExpanded] = useState(false);
  const notify = useNotify();
  const isLong = prompt && prompt.length > 200;
  const displayText = !isLong || expanded ? prompt : prompt.slice(0, 200) + '…';

  const copy = () => {
    navigator.clipboard.writeText(prompt);
    notify.success('Prompt copied to clipboard');
  };

  return (
    <Box
      sx={{
        bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider',
        borderRadius: 2, p: 2, mb: 3,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
        <Typography variant="caption" fontWeight={700} color="text.secondary" letterSpacing={0.5}>
          YOUR PROMPT
        </Typography>
        <Tooltip title="Copy prompt">
          <IconButton size="small" onClick={copy} sx={{ mt: -0.5 }}>
            <ContentCopyIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
      </Stack>
      <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap', textAlign:'justify' }}>
        {displayText}
      </Typography>
      {isLong && (
        <Button
          size="small" onClick={() => setExpanded((e) => !e)}
          endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{ mt: 1, p: 0, textTransform: 'none', color: 'secondary.main', fontWeight: 600 }}
        >
          {expanded ? 'Show less' : 'Show full prompt'}
        </Button>
      )}
    </Box>
  );
};

// ── Tab panel ────────────────────────────────────────────────────────────
const TabPanel = ({ children, value, index }) =>
  value === index ? <Box pt={2}>{children}</Box> : null;

// ── Main JobDetail page ──────────────────────────────────────────────────
const JobDetail = () => {
  const { jobId, projectId: paramProjectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notify = useNotify();

  const job = useSelector(selectJob);
  const script = useSelector(selectScript(jobId));
  const audioFiles = useSelector(selectAudioFiles(jobId)) || [];
  const imageFiles = useSelector(selectImageFiles(jobId)) || [];
  const video = useSelector(selectVideo(jobId));

  const [tab, setTab] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  const { status, progress, message, sceneProgress } = useJobEvents(jobId);
  const effectiveStatus = status || job?.status;
  const projectId = paramProjectId || job?.projectId || job?.p_id;

  console.log("effectiveStatus", effectiveStatus)

  // Cancel handler
  const handleCancel = async () => {
    dispatch(optimisticCancelJob(jobId));
    try { await cancelJobApi(jobId); }
    catch (err) { notify.error(err.message); }
  };

  // Retry handler
  const handleRetry = async () => {
    if (!job?.user_prompt || !projectId) return;
    setRetrying(true);
    try {
      const res = await retryJobApi(jobId);
      const raw = res?.data;
      if (res?.data) {
        await loadJob(jobId);
      }
    } catch (err) {
      notify.error(err.message || 'Retry failed');
    } finally {
      setRetrying(false);
    }
  };

  const loadJob = async (jobId) => {
    if (!jobId) return;

    setPageLoading(true);
    try {
      const r = await getJobApi(jobId);
      if (r?.data) {
        dispatch(setJob(r.data));
        return r.data;
      }
    } catch (err) {
      notify.error(err.message || 'Failed to load job');
    } finally {
      setPageLoading(false);
    }
  };

  // Load job
  useEffect(() => {
    loadJob(jobId)
  }, [jobId, dispatch]);

  // Load content based on status
  useEffect(() => {
    if (!effectiveStatus) return;
    const hasScript = ['VOICING', 'IMAGING', 'RENDERING', 'COMPLETE', 'FAILED'].includes(effectiveStatus);
    const hasImages = ['IMAGING', 'RENDERING', 'COMPLETE', 'FAILED'].includes(effectiveStatus);

    if (hasScript && !script) {
      getScriptApi(jobId)
        .then((r) => { if (r?.data) dispatch(setScript({ jobId, script: r.data })); })
        .catch(() => { });
    }
    if (hasImages) {
      if (!imageFiles.length)
        getImageFilesApi(jobId).then((r) => { if (r?.data) dispatch(setImageFiles({ jobId, files: r.data })); }).catch(() => { });
      if (!audioFiles.length)
        getAudioFilesApi(jobId).then((r) => { if (r?.data) dispatch(setAudioFiles({ jobId, files: r.data })); }).catch(() => { });
    }
    if (effectiveStatus === 'COMPLETE' && !video) {
      getVideoApi(jobId).then((r) => { if (r?.data) dispatch(setVideo({ jobId, video: r.data })); }).catch(() => { });
    }
  }, [effectiveStatus, jobId]);

  const scenes = script?.scenes || [];
  const isJobActive = isActive(effectiveStatus);
  const isFailed = effectiveStatus === 'FAILED';
  const isComplete = effectiveStatus === 'COMPLETE';

  if (pageLoading) {
    return (
      <Box p={3} maxWidth={860} mx="auto">
        <Skeleton variant="rounded" height={56} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={90} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={70} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={300} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: 'calc(100vh - 64px)',
        overflow: 'auto',
        '&::-webkit-scrollbar': { width: 6 },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 3 },
      }}
    >
      <Box maxWidth={1080} mx="auto" px={3} py={3}>

        {/* ── Header ── */}
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={3}>
          <Stack direction="row" alignItems="center" gap={1.5}>
            <IconButton onClick={() => navigate(projectId ? `/projects/${projectId}` : -1)} size="small"
              sx={{ bgcolor: 'action.hover', borderRadius: 1.5 }}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {job?.title || 'Video Generation'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {absoluteDate(job?.created_at)}
                {job?.duration_s ? ` · ${duration(job.duration_s)}` : ''}
                {scenes.length ? ` · ${scenes.length} scenes` : ''}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" gap={1} alignItems="center" flexShrink={0}>
            {isFailed && job?.user_prompt && (
              <Button
                variant="outlined"
                size="small"
                startIcon={retrying ? <CircularProgress size={14} /> : <RefreshIcon />}
                onClick={handleRetry}
                disabled={retrying}
                color="warning"
              >
                Retry
              </Button>
            )}
            {isComplete && video?.file_url && (
              <Button
                variant="contained"
                size="small"
                startIcon={<DownloadIcon />}
                component="a"
                href={video.file_url}
                download
              >
                Download
              </Button>
            )}
          </Stack>
        </Stack>

        {/* ── Live status banner ── */}
        <LiveStatusBanner
          status={effectiveStatus}
          progress={progress}
          message={message}
          sceneProgress={sceneProgress}
          jobId={jobId}
          onCancel={handleCancel}
        />

        {/* ── Pipeline stepper ── */}
        <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <PipelineTracker status={effectiveStatus} />
        </Paper>

        {/* ── User prompt ── */}
        {job?.user_prompt && <PromptViewer prompt={job.user_prompt} />}

        {/* ── Video player (on complete) ── */}
        {isComplete && video && (
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>Generated Video</Typography>
            <VideoPlayer video={video} />
          </Paper>
        )}

        {/* ── Tabs: Script / Scenes / Details ── */}
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              px: 2, borderBottom: '1px solid', borderColor: 'divider',
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, minHeight: 48 },
            }}
          >
            <Tab label="Details" />
            {/* <Tab label={`Script${scenes.length ? ` (${scenes.length})` : ''}`} disabled={!scenes.length} /> */}
            {/* <Tab label={`Scenes${imageFiles.length ? ` (${imageFiles.length})` : ''}`} disabled={!imageFiles.length} /> */}
            
          </Tabs>

          <Box p={2.5}>
            <TabPanel value={tab} index={0}>
              {/* Error info */}
              {isFailed && job?.error_message && (
                <Box
                  sx={{
                    p: 2, mb: 2, bgcolor: alpha('#ef4444', 0.05), border: '1px solid',
                    borderColor: alpha('#ef4444', 0.2), borderRadius: 1.5
                  }}
                >
                  <Typography variant="caption" fontWeight={700} color="error.main" display="block" mb={0.5}>
                    ERROR DETAILS
                  </Typography>
                  <Typography variant="body2" color="error.dark">{job.error_message}</Typography>
                  {job.failed_at_step && (
                    <Chip label={`Failed at: ${job.failed_at_step}`} size="small" color="error" variant="outlined" sx={{ mt: 1 }} />
                  )}
                </Box>
              )}

              <Table size="small">
                <TableBody>
                  {[
                    ['Job ID', job?.id || job?.cj_id],
                    ['Project ID', job?.projectId || job?.p_id],
                    ['Status', <StatusBadge status={effectiveStatus} key="s" />],
                    ['Created', absoluteDate(job?.created_at)],
                    ['Updated', absoluteDate(job?.updated_at)],
                    // ['Duration', duration(job?.duration_s)],
                    // ['Scenes', scenes.length || job?.scene_count || '—'],
                    ['Step', `${job?.current_step ?? 0} / ${job?.total_steps ?? 5}`],
                    ['Retries', job?.retry_count ?? 0],
                    ['Resolution', video?.resolution ?? '—'],
                  ].map(([label, value]) => (
                    <TableRow key={label} sx={{ '&:last-child td': { border: 0 } }}>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 500, width: 140, borderColor: 'divider', pl: 0, fontSize: 13 }}>
                        {label}
                      </TableCell>
                      <TableCell sx={{ borderColor: 'divider', fontSize: 13 }}>{value ?? '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabPanel>

            <TabPanel value={tab} index={1}>
              <ScriptViewer scenes={scenes} />
            </TabPanel>

            <TabPanel value={tab} index={2}>
              <SceneGrid scenes={scenes} imageFiles={imageFiles} audioFiles={audioFiles} />
            </TabPanel>
          </Box>
        </Paper>

        <Box height={32} />
      </Box>
    </Box>
  );
};

export default JobDetail;
