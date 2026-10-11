/* Thin-line icons; paths with class "draw" are stroked in by GSAP DrawSVG. */

const ICONS = {
  adult: (
    <>
      <path className="draw" d="M12 26v-6a12 12 0 0 1 24 0v6" />
      <path className="draw" d="M9 26h30v8H9Z" />
      <path className="draw" d="M13 34v6M35 34v6" />
      <circle className="draw accent" cx="24" cy="13" r="2.5" />
    </>
  ),
  trauma: (
    <>
      <path className="draw" d="M5 24c4-6 8-6 12 0s8 6 12 0 8-6 12 0" />
      <path className="draw accent" d="M5 32c4-4 8-4 12 0s8 4 12 0 8-4 12 0" />
      <circle className="draw" cx="24" cy="12" r="4" />
    </>
  ),
  young: (
    <>
      <path className="draw" d="M8 40C14 30 22 30 24 22s8-14 16-14" />
      <circle className="draw accent" cx="40" cy="8" r="2.5" />
      <path className="draw" d="M8 40h32" />
    </>
  ),
  parents: (
    <>
      <circle className="draw" cx="18" cy="24" r="12" />
      <circle className="draw accent" cx="31" cy="27" r="7" />
    </>
  )
};

export function ServiceIcon({ name }) {
  return (
    <svg className="line-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      {ICONS[name]}
    </svg>
  );
}

export function RemoteIllustration() {
  return (
    <svg className="remote-illustration" viewBox="0 0 320 240" aria-hidden="true" focusable="false">
      <circle className="remote-sun" cx="226" cy="76" r="28" />
      <rect className="draw" x="86" y="70" width="148" height="96" rx="10" />
      <path className="draw" d="M134 196h52M160 166v30" />
      <circle className="draw accent" cx="160" cy="106" r="11" />
      <path className="draw accent" d="M140 142c4-11 11-16 20-16s16 5 20 16" />
      <path className="draw" d="M60 212h200" />
    </svg>
  );
}
