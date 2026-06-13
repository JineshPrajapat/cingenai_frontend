import { Stepper, Step, StepLabel, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import {AccessTime as AccessTimeIcon} from '@mui/icons-material';
import {Description as DescriptionIcon} from '@mui/icons-material';
import {Mic as MicIcon} from '@mui/icons-material';
import {Image as ImageIcon} from '@mui/icons-material';
import {Movie as MovieIcon} from '@mui/icons-material';
import {CheckCircle as CheckCircleIcon} from '@mui/icons-material';
import { PIPELINE_STEPS, STATUS_CONFIG } from '../../utils/statusConfig';

const SpinningBox = styled(Box)(() => ({
  '@keyframes spin': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  animation: 'spin 1.2s linear infinite',
  display: 'flex',
  alignItems: 'center',
}));

const STEP_ICONS = [AccessTimeIcon, DescriptionIcon, MicIcon, ImageIcon, MovieIcon];

const CustomStepIcon = ({ active, completed, icon }) => {
  const index = Number(icon) - 1;
  const Icon = STEP_ICONS[index] || AccessTimeIcon;

  if (completed) {
    return <CheckCircleIcon sx={{ color: 'success.main', fontSize: 22 }} />;
  }

  if (active) {
    return (
      <SpinningBox>
        <Icon sx={{ color: 'secondary.main', fontSize: 22 }} />
      </SpinningBox>
    );
  }

  return <Icon sx={{ color: 'text.disabled', fontSize: 22 }} />;
};

const PipelineTracker = ({ status }) => {
  const config = STATUS_CONFIG[status];
  const activeStep = config?.step ?? 0;
  const isComplete = status === 'COMPLETE';

  return (
    <Stepper
      activeStep={isComplete ? 5 : activeStep}
      alternativeLabel
      sx={{ mt: 1, mb: 1 }}
    >
      {PIPELINE_STEPS.map((step, i) => (
        <Step key={step.label} completed={isComplete ? true : i < activeStep}>
          <StepLabel StepIconComponent={CustomStepIcon} sx={{ '& .MuiStepLabel-label': { fontSize: 11 } }}>
            {step.label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default PipelineTracker;