import { formatDistanceToNow, format } from 'date-fns';

export const relativeDate = (iso) => {
  if (!iso) return '—';
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return iso;
  }
};

export const absoluteDate = (iso) => {
  if (!iso) return '—';
  try {
    return format(new Date(iso), 'MMM d, yyyy · h:mm a');
  } catch {
    return iso;
  }
};

export const duration = (seconds) => {
  if (!seconds && seconds !== 0) return '—';
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
};

export const filesize = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};