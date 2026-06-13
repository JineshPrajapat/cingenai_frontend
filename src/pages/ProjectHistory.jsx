import { useEffect, useCallback, useRef, useState } from 'react';
import { Box, ToggleButtonGroup, ToggleButton, Typography, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectJobs, selectJobsLoading, selectJobsHasMore,
  setJobs, appendJobs, setLoading, setPage, setHasMore,
} from '../features/jobs/jobsSlice';
import { listJobsApi } from '../features/jobs/jobsApi';
import { submitGenerationApi } from '../features/project/projectApi';
import { setActiveJobId } from '../features/project/projectSlice';
import { optimisticQueueJob } from '../features/ws/wsSlice';
import JobCard from '../components/job/JobCard';
import PageHeader from '../components/shared/PageHeader';
import EmptyState from '../components/shared/EmptyState';
import {History as HistoryIcon} from '@mui/icons-material';
import { useNotify } from '../hooks';

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'COMPLETE', label: 'Complete' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'QUEUED', label: 'Queued' },
];

const PAGE_SIZE = 15;

const ProjectHistory = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const notify = useNotify();
  const jobs = useSelector(selectJobs);
  const loading = useSelector(selectJobsLoading);
  const hasMore = useSelector(selectJobsHasMore);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const loaderRef = useRef(null);

  const fetchJobs = useCallback(async (page, reset = false) => {
    dispatch(setLoading(true));
    try {
      const params = { page, limit: PAGE_SIZE };
      if (filter !== 'all') {
        if (filter === 'active') params.status_group = 'active';
        else params.status = filter;
      }
      const res = await listJobsApi(projectId, params);
      if (res?.data) {
        const items = res.data;
        if (reset) dispatch(setJobs(items));
        else dispatch(appendJobs(items));
        dispatch(setHasMore(items.length === PAGE_SIZE));
      }
    } catch (err) {
      notify.error(err.message);
      dispatch(setLoading(false));
    }
  }, [projectId, filter, dispatch, notify]);

  useEffect(() => {
    setCurrentPage(1);
    fetchJobs(1, true);
  }, [filter, projectId]);

  // Infinite scroll observer
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchJobs(nextPage);
      }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, currentPage, fetchJobs]);

  const handleRetry = async (job) => {
    if (!job.user_prompt) return;
    try {
      const res = await retryJobApi(job.cj_id);
      if (res?.data) {
        dispatch(optimisticQueueJob({ job_id: res.data.cj_id, project_id: projectId }));
        dispatch(setActiveJobId(res.data.cj_id));
        notify.success('Generation restarted');
      }
    } catch (err) {
      notify.error(err.message);
    }
  };

  return (
    <Box p={3} maxWidth={720} mx="auto">
      <PageHeader title="History" subtitle="All video generations for this project" />

      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(_, v) => v && setFilter(v)}
        size="small"
        sx={{ mb: 2.5, '& .MuiToggleButton-root': { textTransform: 'none', fontWeight: 500 } }}
      >
        {FILTER_OPTIONS.map((opt) => (
          <ToggleButton key={opt.value} value={opt.value}>{opt.label}</ToggleButton>
        ))}
      </ToggleButtonGroup>

      {!loading && jobs.length === 0 ? (
        <EmptyState icon={HistoryIcon} title="No jobs found" description="No generations match your filter." />
      ) : (
        <>
          {jobs.length > 0 &&  jobs.map((job) => (
            <JobCard key={job.id} job={job} onRetry={() => handleRetry(job)} />
          ))}
          <Box ref={loaderRef} display="flex" justifyContent="center" py={2}>
            {loading && <CircularProgress size={24} />}
            {!loading && !hasMore && jobs.length > 0 && (
              <Typography variant="caption" color="text.secondary">No more jobs</Typography>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ProjectHistory;