import { useMemo } from 'react';
import d1 from '../assets/images/dissonance-1.svg';
import d2 from '../assets/images/dissonance-2.svg';
import d3 from '../assets/images/dissonance-3.svg';
import p1 from '../assets/images/profondeur-1.svg';
import p2 from '../assets/images/profondeur-2.svg';
import p3 from '../assets/images/profondeur-3.svg';
import m1 from '../assets/images/mojonance-1.svg';
import m2 from '../assets/images/mojonance-2.svg';
import m3 from '../assets/images/mojonance-3.svg';

const pools = {
  dissonance: [d1, d2, d3],
  profondeur: [p1, p2, p3],
  mojonance: [m1, m2, m3],
};

const TriptyqueViewer = ({ emoji1, emoji2, emoji3, experienceId }) => {
  const emojis = [emoji1, emoji2, emoji3];
  const categories = ['dissonance', 'profondeur', 'mojonance'];
  const signature = `${emoji1 ?? ''}-${emoji2 ?? ''}-${emoji3 ?? ''}`;

  const triptyque = useMemo(() => {
    return categories.map((category, index) => {
      const set = pools[category];
      const image = set[Math.floor(Math.random() * set.length)];
      return {
        category,
        emoji: emojis[index],
        image,
      };
    });
  }, [experienceId, signature]);

  return (
    <div className="triptyque-grid">
      {triptyque.map(({ category, emoji, image }) => (
        <div key={category} className="triptyque-card">
          <img src={image} alt={`${category} visuel`} />
          <span>{emoji}</span>
        </div>
      ))}
    </div>
  );
};

export default TriptyqueViewer;
