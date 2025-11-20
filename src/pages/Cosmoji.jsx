import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '../components/Box.jsx';
import CosmojiGraph from '../components/Cosmoji.jsx';
import { useFlow } from '../context/FlowContext.jsx';

const Cosmoji = () => {
  const navigate = useNavigate();
  const { selections, haiku, hasCompleteSelection, resetFlow, refreshExperience } = useFlow();

  useEffect(() => {
    if (!hasCompleteSelection) {
      navigate('/tirage', { replace: true });
    } else if (!haiku) {
      navigate('/haiku', { replace: true });
    }
  }, [haiku, hasCompleteSelection, navigate]);

  if (!hasCompleteSelection || !haiku) return null;

  const handleReplay = () => {
    refreshExperience();
    navigate('/haiku');
  };

  const footer = (
    <>
      <button type="button" className="primary-btn" onClick={handleReplay}>
        Rejouer
      </button>
      <Link className="secondary-btn" to="/" onClick={resetFlow}>
        Recommencer
      </Link>
    </>
  );

  return (
    <Box title="Cosmoji" footer={footer}>
      <p>Résumé cosmique de votre trajectoire.</p>
      <CosmojiGraph emojis={selections} haiku={haiku} />
    </Box>
  );
};

export default Cosmoji;
