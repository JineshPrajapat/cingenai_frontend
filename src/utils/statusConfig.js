export const ACTIVE_STATUSES = ['QUEUED', 'SCRIPTING', 'VOICING', 'IMAGING', 'RENDERING'];
export const TERMINAL_STATUSES = ['COMPLETE', 'FAILED', 'CANCELLED'];

export const STATUS_CONFIG = {
  QUEUED: { label: 'Queued', color: 'default', icon: 'AccessTime', step: 0, progress: 0 },
  SCRIPTING: { label: 'Writing Script', color: 'info', icon: 'Description', step: 1, progress: 15 },
  VOICING: { label: 'Generating Audio', color: 'secondary', icon: 'Mic', step: 2, progress: 35 },
  IMAGING: { label: 'Creating Visuals', color: 'warning', icon: 'Image', step: 3, progress: 60 },
  RENDERING: { label: 'Assembling Video', color: 'error', icon: 'Movie', step: 4, progress: 85 },
  COMPLETE: { label: 'Complete', color: 'success', icon: 'CheckCircle', step: 5, progress: 100 },
  FAILED: { label: 'Failed', color: 'error', icon: 'Cancel', step: 0, progress: 0 },
  CANCELLED: { label: 'Cancelled', color: 'default', icon: 'Block', step: 0, progress: 0 },
};

export const PIPELINE_STEPS = [
  { label: 'Queued', status: 'QUEUED' },
  { label: 'Script', status: 'SCRIPTING' },
  { label: 'Audio', status: 'VOICING' },
  { label: 'Visuals', status: 'IMAGING' },
  { label: 'Video', status: 'RENDERING' },
];

export const isActive = (status) => ACTIVE_STATUSES.includes(status);
export const isTerminal = (status) => TERMINAL_STATUSES.includes(status);