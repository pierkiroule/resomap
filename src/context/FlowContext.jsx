import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { generateHaiku } from '../components/HaikuGenerator.jsx';

const STORAGE_KEY = 'resomap_flow';

const createEmptySelections = () => ({
  dissonance: null,
  profondeur: null,
  mojonance: null,
});

const FlowContext = createContext(undefined);

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const FlowProvider = ({ children }) => {
  const [selections, setSelections] = useState(() => createEmptySelections());
  const [haiku, setHaiku] = useState(null);
  const [experienceId, setExperienceId] = useState(() => Date.now());
  const isHydrated = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const payload = raw ? safeParse(raw) : null;
    if (payload?.selections) {
      setSelections((prev) => ({
        ...prev,
        ...payload.selections,
      }));
    }
    if (payload?.haiku) {
      setHaiku(payload.haiku);
    }
    if (payload?.experienceId) {
      setExperienceId(payload.experienceId);
    }
    isHydrated.current = true;
  }, []);

  useEffect(() => {
    if (!isHydrated.current || typeof window === 'undefined') return;
    const data = JSON.stringify({ selections, haiku, experienceId });
    sessionStorage.setItem(STORAGE_KEY, data);
  }, [experienceId, haiku, selections]);

  const updateSelection = useCallback((category, emoji) => {
    if (!category) return;
    setSelections((prev) => ({
      ...prev,
      [category]: emoji,
    }));
  }, []);

  const refreshExperience = useCallback(() => {
    const nextHaiku = generateHaiku();
    setHaiku(nextHaiku);
    setExperienceId(Date.now());
    return nextHaiku;
  }, []);

  const resetFlow = useCallback(() => {
    setSelections(createEmptySelections());
    setHaiku(null);
    setExperienceId(Date.now());
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({
      selections,
      haiku,
      updateSelection,
      refreshExperience,
      resetFlow,
      experienceId,
      hasCompleteSelection: Object.values(selections || {}).every(Boolean),
    }),
    [experienceId, haiku, refreshExperience, resetFlow, selections, updateSelection]
  );

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
};

export const useFlow = () => {
  const context = useContext(FlowContext);
  if (context === undefined) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
};
