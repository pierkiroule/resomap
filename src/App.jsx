import { useState } from 'react';
import Step1 from './pages/Step1.jsx';
import Step2 from './pages/Step2.jsx';
import Step3 from './pages/Step3.jsx';
import Summary from './pages/Summary.jsx';
import { FUTURE_EMOJIS, NEED_EMOJIS, PROBLEM_EMOJIS } from './data/haimojiSets.js';
import './App.css';

function App() {
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({
    problem: '',
    need: '',
    future: '',
  });

  const updateSelection = (key) => (emoji) => {
    setSelections((prev) => ({
      ...prev,
      [key]: emoji,
    }));
  };

  const resetFlow = () => {
    setSelections({
      problem: '',
      need: '',
      future: '',
    });
    setStep(1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1
            options={PROBLEM_EMOJIS}
            selected={selections.problem}
            onSelect={updateSelection('problem')}
            onNext={() => setStep(2)}
          />
        );
      case 2:
        return (
          <Step2
            options={NEED_EMOJIS}
            selected={selections.need}
            onSelect={updateSelection('need')}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        );
      case 3:
        return (
          <Step3
            options={FUTURE_EMOJIS}
            selected={selections.future}
            onSelect={updateSelection('future')}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        );
      case 4:
      default:
        return <Summary selections={selections} onRestart={resetFlow} />;
    }
  };

  return (
    <div className="app-shell">
      <div className="haimoji-frame">
        <header className="app-header">
          <div>
            <p className="logo">HAIMOJI</p>
            <h1>Nommer · Décoder · Futuriser</h1>
            <p className="header-subtitle">
              Un trio d’emojis pour extérioriser ton problème, ton besoin caché et la sensation future que tu cherches.
            </p>
          </div>
          <span className="step-tag">{step < 4 ? `Étape ${step} / 3` : 'Résultat'}</span>
        </header>
        {renderStep()}
      </div>
    </div>
  );
}

export default App;
