import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '../components/Box.jsx';
import VideoSampler from '../components/VideoSampler.jsx';
import { useFlow } from '../context/FlowContext.jsx';

const VideoMix = () => {
  const navigate = useNavigate();
  const { selections, haiku, hasCompleteSelection, experienceId } = useFlow();

  useEffect(() => {
    if (!hasCompleteSelection) {
      navigate('/tirage', { replace: true });
    } else if (!haiku) {
      navigate('/haiku', { replace: true });
    }
  }, [haiku, hasCompleteSelection, navigate]);

  if (!hasCompleteSelection || !haiku) return null;

  const footer = (
    <button
      type="button"
      className="primary-btn"
      onClick={() => navigate('/cosmoji')}
    >
      Vers Cosmoji
    </button>
  );

  return (
    <Box title="Video Mix" footer={footer}>
      <VideoSampler emojis={selections} experienceId={experienceId} />
    </Box>
  );
};

export default VideoMix;
