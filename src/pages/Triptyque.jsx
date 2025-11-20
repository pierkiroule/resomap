import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '../components/Box.jsx';
import TriptyqueViewer from '../components/TriptyqueViewer.jsx';
import { useFlow } from '../context/FlowContext.jsx';

const Triptyque = () => {
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
      onClick={() => navigate('/audiomix')}
    >
      Vers l'audio
    </button>
  );

  return (
    <Box title="Triptyque" footer={footer}>
      <TriptyqueViewer
        emoji1={selections.dissonance}
        emoji2={selections.profondeur}
        emoji3={selections.mojonance}
        experienceId={experienceId}
      />
    </Box>
  );
};

export default Triptyque;
