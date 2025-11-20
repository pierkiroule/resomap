import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '../components/Box.jsx';
import AudioSampler from '../components/AudioSampler.jsx';
import { useFlow } from '../context/FlowContext.jsx';

const AudioMix = () => {
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
      onClick={() => navigate('/videomix')}
    >
      Vers la vidéo
    </button>
  );

  return (
    <Box title="Audio Mix" footer={footer}>
      <AudioSampler emojis={selections} experienceId={experienceId} />
    </Box>
  );
};

export default AudioMix;
