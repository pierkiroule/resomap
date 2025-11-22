import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AudioMix from './pages/AudioMix.jsx';
import Cosmoji from './pages/Cosmoji.jsx';
import Haiku from './pages/Haiku.jsx';
import Home from './pages/Home.jsx';
import Tirage from './pages/Tirage.jsx';
import Triptyque from './pages/Triptyque.jsx';
import VideoMix from './pages/VideoMix.jsx';
import HaemojiPage from './components/HaemojiPage.jsx';
import { FlowProvider } from './context/FlowContext.jsx';
import './App.css';

function App() {
  return (
    <FlowProvider>
      <Router>
        <div className="app-shell">
          <header className="app-header">
            <div>
              <p className="eyebrow">Rituel tactile</p>
              <h1>Resomap</h1>
              <p className="lede">
                Compose ton haïku sensoriel avec trois archétypes. Chaque écran débloque la suite : tirage, haïku, triptyque,
                audio, vidéo, puis Cosmoji.
              </p>
            </div>
          </header>

          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tirage" element={<Tirage />} />
              <Route path="/haiku" element={<Haiku />} />
              <Route path="/triptyque" element={<Triptyque />} />
              <Route path="/audiomix" element={<AudioMix />} />
              <Route path="/videomix" element={<VideoMix />} />
              <Route path="/cosmoji" element={<Cosmoji />} />
              <Route path="/haimoji" element={<HaemojiPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </FlowProvider>
  );
}

export default App;
