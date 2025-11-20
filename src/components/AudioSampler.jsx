import { useEffect, useMemo, useRef, useState } from 'react';
import { emojis as emojiCatalog } from '../data/emojis.js';
import dissonance1 from '../assets/sounds/dissonance-1.wav';
import dissonance2 from '../assets/sounds/dissonance-2.wav';
import dissonance3 from '../assets/sounds/dissonance-3.wav';
import profondeur1 from '../assets/sounds/profondeur-1.wav';
import profondeur2 from '../assets/sounds/profondeur-2.wav';
import profondeur3 from '../assets/sounds/profondeur-3.wav';
import mojonance1 from '../assets/sounds/mojonance-1.wav';
import mojonance2 from '../assets/sounds/mojonance-2.wav';
import mojonance3 from '../assets/sounds/mojonance-3.wav';

const soundPools = {
  dissonance: [dissonance1, dissonance2, dissonance3],
  profondeur: [profondeur1, profondeur2, profondeur3],
  mojonance: [mojonance1, mojonance2, mojonance3],
};

const emojiSoundMap = Object.entries(emojiCatalog).reduce((acc, [category, list]) => {
  const pool = soundPools[category] || [];
  list.forEach((emoji, index) => {
    acc[emoji] = pool[index % pool.length];
  });
  return acc;
}, {});

const order = ['dissonance', 'profondeur', 'mojonance'];

const AudioSampler = ({ emojis, experienceId }) => {
  const audioRefs = useRef([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const playlist = useMemo(() => {
    if (!emojis) return [];
    return order
      .map((category, index) => {
        const emoji = emojis[category];
        if (!emoji) return null;
        return {
          category,
          emoji,
          src: emojiSoundMap[emoji] || soundPools[category]?.[0],
          offset: index * 400,
        };
      })
      .filter(Boolean);
  }, [emojis, experienceId]);

  useEffect(() => {
    audioRefs.current.forEach((audio) => audio?.pause());
    audioRefs.current = playlist.map(({ src }) => {
      const audio = new Audio(src);
      audio.loop = false;
      audio.preload = 'auto';
      audio.volume = 0.7;
      return audio;
    });

    return () => {
      audioRefs.current.forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, [playlist]);

  const play = async () => {
    setIsPlaying(true);
    await Promise.all(
      audioRefs.current.map((audio, idx) => {
        if (!audio) return Promise.resolve();
        audio.currentTime = 0;
        return new Promise((resolve) => {
          const start = () => {
            audio.play().catch(() => null);
            resolve();
          };
          if (idx === 0) {
            start();
          } else {
            setTimeout(start, idx * 400);
          }
        });
      })
    );
  };

  const stop = () => {
    audioRefs.current.forEach((audio) => {
      if (!audio) return;
      audio.pause();
      audio.currentTime = 0;
    });
    setIsPlaying(false);
  };

  return (
    <div className="audio-sampler">
      <p>Chaque emoji déclenche un motif sonore. Superposez-les en un clic.</p>
      <ul>
        {playlist.map(({ emoji, category }) => (
          <li key={category}>
            {emoji} · {category}
          </li>
        ))}
      </ul>
      <div className="box-actions">
        <button type="button" className="primary-btn" onClick={play} disabled={!playlist.length}>
          {isPlaying ? 'Rejouer' : 'Lecture'}
        </button>
        <button type="button" className="primary-btn" onClick={stop} disabled={!playlist.length}>
          Stop
        </button>
      </div>
    </div>
  );
};

export default AudioSampler;
