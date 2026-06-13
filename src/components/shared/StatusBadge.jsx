import { Chip } from '@mui/material';
import {AccessTime as AccessTimeIcon} from '@mui/icons-material';
import {Description as DescriptionIcon} from '@mui/icons-material';
import {Mic as MicIcon} from '@mui/icons-material';
import {Image as ImageIcon} from '@mui/icons-material';
import {Movie as MovieIcon} from '@mui/icons-material';
import {CheckCircle as CheckCircleIcon} from '@mui/icons-material';
import {Cancel as CancelIcon} from '@mui/icons-material';
import {Block as BlockIcon} from '@mui/icons-material';
import { STATUS_CONFIG } from '../../utils/statusConfig';

const ICONS = {
  AccessTime: AccessTimeIcon,
  Description: DescriptionIcon,
  Mic: MicIcon,
  Image: ImageIcon,
  Movie: MovieIcon,
  CheckCircle: CheckCircleIcon,
  Cancel: CancelIcon,
  Block: BlockIcon,
};

const StatusBadge = ({ status, size = 'small' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.QUEUED;
  const IconComponent = ICONS[config.icon];

  return (
    <Chip
      size={size}
      label={config.label}
      color={config.color}
      icon={IconComponent ? <IconComponent fontSize="small" /> : undefined}
      sx={{ fontWeight: 600 }}
    />
  );
};

export default StatusBadge;