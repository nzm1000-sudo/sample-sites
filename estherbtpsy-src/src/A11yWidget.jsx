import { useCallback, useEffect, useRef, useState } from 'react';

const OPTIONS = [
  ['contrast', 'ניגודיות גבוהה'],
  ['links', 'הדגשת קישורים'],
  ['readable', 'גופן קריא'],
  ['still', 'עצירת אנימציות']
];
const SCALES = [
  [0, 'טקסט בגודל רגיל', ''],
  [1, 'טקסט גדול', 'a11y-a2'],
  [2, 'טקסט גדול מאוד', 'a11y-a3']
];

function readPrefs() {
  try { return JSON.parse(localStorage.getItem('a11y') || '{}'); } catch { return {}; }
}

export function useA11yPrefs() {
  const [prefs, setPrefs] = useState(readPrefs);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('a11y-scale-1', 'a11y-scale-2');
    if (prefs.scale) root.classList.add(`a11y-scale-${prefs.scale}`);
    OPTIONS.forEach(([k]) => root.classList.toggle(`a11y-${k}`, !!prefs[k]));
    try { localStorage.setItem('a11y', JSON.stringify(prefs)); } catch { /* storage unavailable */ }
  }, [prefs]);
  return [prefs, setPrefs];
}

export default function A11yWidget({ prefs, setPrefs }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  const close = useCallback((returnFocus) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    panelRef.current?.querySelector('button')?.focus();
    const onKey = (e) => { if (e.key === 'Escape') close(true); };
    const onClick = (e) => { if (!rootRef.current?.contains(e.target)) close(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [open, close]);

  return (
    <div className="a11y" ref={rootRef}>
      <button
        ref={toggleRef}
        className="a11y-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="a11y-panel"
        onClick={() => setOpen((o) => !o)}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="4" r="2" /><path d="M4 8l8 1.5L20 8M12 9.5V15m0 0-3 6m3-6 3 6" /></svg>
        <span className="visually-hidden">הגדרות נגישות</span>
      </button>
      <div className="a11y-panel" id="a11y-panel" role="group" aria-labelledby="a11y-title" hidden={!open} ref={panelRef} data-lenis-prevent>
        <p className="a11y-title" id="a11y-title">הגדרות נגישות</p>
        <div className="a11y-row" role="group" aria-label="גודל טקסט">
          {SCALES.map(([value, label, cls]) => (
            <button
              key={value}
              type="button"
              className={cls}
              aria-label={label}
              aria-pressed={(prefs.scale || 0) === value}
              onClick={() => setPrefs((p) => ({ ...p, scale: value }))}
            >A</button>
          ))}
        </div>
        {OPTIONS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={!!prefs[key]}
            onClick={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))}
          >{label}</button>
        ))}
        <button type="button" className="a11y-reset" onClick={() => setPrefs({})}>איפוס הגדרות</button>
        <a className="a11y-statement" href="./accessibility.html">הצהרת נגישות</a>
      </div>
    </div>
  );
}
