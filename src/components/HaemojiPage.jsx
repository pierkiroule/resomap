import { useMemo, useState } from 'react';
import EmojiSelector from './EmojiSelector.jsx';

const thoughtOptions = ['😢', '😡', '😰', '😶', '🤯', '😔', '😤', '🤔', '🙄', '😴', '💔', '🌧️', '🌪️', '😵‍💫', '😬'];
const bodyOptions = ['🤢', '🤮', '🤕', '🤒', '😖', '😣', '😫', '😵‍💫', '💣', '💥', '💫', '💦', '😮‍💨', '😓', '🫨'];
const mojoOptions = ['✨', '😊', '😌', '😎', '🌈', '☀️', '🌱', '🕊️', '🐦', '💪', '🧘', '🎧', '🤝', '💫', '🎈'];

const mojoAffirmations = {
  '✨': 'Tu rallumes déjà une petite étincelle intérieure.',
  '😊': 'Ton sourire commence à revenir, même timidement.',
  '😌': 'Un soupir plus doux s’installe dans ton corps.',
  '😎': 'Tu reprends un peu de confiance dans ta façon unique de gérer.',
  '🌈': 'Tu te rappelles que la pluie finit toujours par s’arrêter.',
  '☀️': 'Une éclaircie se dessine, rien qu’en te posant ici.',
  '🌱': 'Quelque chose de neuf pousse discrètement en toi.',
  '🕊️': 'Tu mérites cette paix lente qui arrive petit à petit.',
  '🐦': 'Ton horizon s’élargit d’un battement d’ailes.',
  '💪': 'Tu recontactes ta force, pas besoin qu’elle soit parfaite.',
  '🧘': 'Ton souffle devient un peu plus ample.',
  '🎧': 'Tu peux baisser le volume des pensées quand tu veux.',
  '🤝': 'Tu n’es pas obligé·e de porter ça seul·e.',
  '💫': 'Même les tours de montagnes russes finissent par ralentir.',
  '🎈': 'Il y a une part de toi qui peut flotter au-dessus du bruit.',
};

const STEP_LABELS = {
  0: 'Préparation',
  1: 'Étape 1 sur 4',
  2: 'Étape 2 sur 4',
  3: 'Étape 3 sur 4',
  4: 'Étape finale',
};

function HaemojiPage() {
  const [step, setStep] = useState(0);
  const [thoughtEmoji, setThoughtEmoji] = useState('');
  const [bodyEmoji, setBodyEmoji] = useState('');
  const [mojoEmoji, setMojoEmoji] = useState('');

  const supportiveLine = useMemo(() => {
    if (!mojoEmoji) {
      return 'Ton Haïmoji peut évoluer aussi souvent que tu en as besoin.';
    }
    return mojoAffirmations[mojoEmoji] ?? 'Ton futur toi respire un peu mieux, ici et maintenant.';
  }, [mojoEmoji]);

  const goToStep = (nextStep) => {
    setStep(nextStep);
  };

  const resetFlow = () => {
    setThoughtEmoji('');
    setBodyEmoji('');
    setMojoEmoji('');
    setStep(1);
  };

  const readyForSummary = Boolean(thoughtEmoji && bodyEmoji && mojoEmoji);

  const renderIntro = () => (
    <section className="haemoji-step" key="intro">
      <p className="step-eyebrow">Étape 0 — Accueil</p>
      <h1>Haïmoji</h1>
      <p className="quote">« Un émoji comme un rayon de soleil dans ton nuage de problème. »</p>
      <p className="step-body">
        Pense à un truc qui te prend la tête en ce moment. On va juste le regarder de loin, comme un nuage à l’horizon.
        Tu n’as rien à écrire, juste choisir des émojis.
      </p>
      <button className="primary-btn" type="button" onClick={() => goToStep(1)}>
        Commencer
      </button>
    </section>
  );

  const renderThoughtStep = () => (
    <section className="haemoji-step" key="thought">
      <p className="step-eyebrow">Étape 1 — Tes pensées</p>
      <h2>Émoji des pensées</h2>
      <p className="step-body">
        Pense à ton problème ou ton bad mood. Imagine-le comme un nuage qui flotte au loin. Choisis l’émoji qui ressemble
        aux pensées qui tournent dans ta tête quand tu y penses.
      </p>
      <EmojiSelector
        label="Tes pensées"
        description="Tapote l’émoji qui décrit le mieux ton mental du moment."
        emojis={thoughtOptions}
        selectedEmoji={thoughtEmoji}
        onSelect={setThoughtEmoji}
      />
      <div className="step-actions">
        <button className="ghost-btn" type="button" onClick={() => goToStep(0)}>
          Retour
        </button>
        <button className="primary-btn" type="button" disabled={!thoughtEmoji} onClick={() => goToStep(2)}>
          Suivant
        </button>
      </div>
    </section>
  );

  const renderBodyStep = () => (
    <section className="haemoji-step" key="body">
      <p className="step-eyebrow">Étape 2 — Ton corps</p>
      <h2>Émoji du corps</h2>
      <p className="step-body">
        Pense à ton corps quand ce soucis débarque. Où ça serre ? Où ça chauffe ? Choisis l’émoji qui ressemble à ce que
        ton corps ressent.
      </p>
      <EmojiSelector
        label="Ton corps"
        description="Tapote l’émoji qui colle à la sensation corporelle."
        emojis={bodyOptions}
        selectedEmoji={bodyEmoji}
        onSelect={setBodyEmoji}
      />
      <div className="step-actions">
        <button className="ghost-btn" type="button" onClick={() => goToStep(1)}>
          Retour
        </button>
        <button className="primary-btn" type="button" disabled={!bodyEmoji} onClick={() => goToStep(3)}>
          Suivant
        </button>
      </div>
    </section>
  );

  const renderMojoStep = () => (
    <section className="haemoji-step" key="mojo">
      <p className="step-eyebrow">Étape 3 — Ton futur mojo</p>
      <h2>Émoji du futur mojo</h2>
      <p className="step-body">
        Imagine que ce problème commence à se débloquer, même un tout petit peu. Choisis l’émoji qui ressemble à la
        sensation positive que tu ressentirais.
      </p>
      <EmojiSelector
        label="Ton futur mojo"
        description="Choisis l’émoji qui donne la couleur du petit mieux."
        emojis={mojoOptions}
        selectedEmoji={mojoEmoji}
        onSelect={setMojoEmoji}
      />
      <div className="step-actions">
        <button className="ghost-btn" type="button" onClick={() => goToStep(2)}>
          Retour
        </button>
        <button
          className="primary-btn"
          type="button"
          disabled={!mojoEmoji}
          onClick={() => goToStep(4)}
        >
          Voir mon Haïmoji
        </button>
      </div>
    </section>
  );

  const renderSummary = () => (
    <section className="haemoji-step summary" key="summary">
      <p className="step-eyebrow">Étape 4 — Résumé</p>
      <h2>Ton Haïmoji du moment</h2>
      <p className="step-body">
        Tu viens de faire un pas en arrière pour regarder ton problème. Tu as repéré ce que ça te fait penser, ce que ça
        fait dans ton corps, et à quoi ça pourrait ressembler quand ça ira un peu mieux.
      </p>
      {readyForSummary && (
        <div className="summary-grid" aria-live="polite">
          <div className="summary-item">
            <span className="summary-label">Tes pensées</span>
            <span className="summary-icon">🧠</span>
            <span className="summary-emoji">{thoughtEmoji}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Ton corps</span>
            <span className="summary-icon">🫀</span>
            <span className="summary-emoji">{bodyEmoji}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Ton futur mojo</span>
            <span className="summary-icon">🌟</span>
            <span className="summary-emoji">{mojoEmoji}</span>
          </div>
        </div>
      )}
      <p className="supportive-line">{supportiveLine}</p>
      <p className="supportive-paragraph">
        Ce trio d’émojis, c’est ton Haïmoji du moment. Tu peux simplement le garder en tête, l’écrire quelque part ou
        refaire un tirage quand tu veux. Reviens dès que tu as besoin d’un autre pas de côté.
      </p>
      <div className="step-actions">
        <button className="primary-btn" type="button" onClick={resetFlow}>
          Refaire un Haïmoji
        </button>
        <button className="ghost-btn placeholder" type="button" disabled>
          Plus tard : sauver ce Haïmoji
        </button>
      </div>
    </section>
  );

  const renderStep = () => {
    if (step === 0) return renderIntro();
    if (step === 1) return renderThoughtStep();
    if (step === 2) return renderBodyStep();
    if (step === 3) return renderMojoStep();
    return renderSummary();
  };

  return (
    <div className="haemoji-shell">
      <div className="haemoji-card">
        <div className="haemoji-card-header">
          <div>
            <p className="badge">Haïmoji</p>
            <p className="helper-text">Un mini rituel emoji pour prendre un peu de recul.</p>
          </div>
          <span className="step-indicator">{STEP_LABELS[step]}</span>
        </div>
        {renderStep()}
      </div>
    </div>
  );
}

export default HaemojiPage;
