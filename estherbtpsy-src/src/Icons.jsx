/* Thin-line icon set; paths with class "draw" are stroked in by GSAP DrawSVG. */

const ICONS = {
  children: (
    <>
      <path className="draw" d="M24 41V22" />
      <path className="draw" d="M24 29c-7.5 0-12-5.2-12-12.5 7.5 0 12 4.8 12 12.5Z" />
      <path className="draw" d="M24 24.5c0-7.6 4.6-12.5 12-12.5 0 7.5-4.6 12.5-12 12.5Z" />
      <path className="draw accent" d="M14 41h20" />
    </>
  ),
  teens: (
    <>
      <path className="draw" d="M12 41c0-8 24-6.5 24-15.5 0-6-7-8.5-12-6" />
      <path className="draw accent" d="M24 6.5l1.6 3.7 3.9.4-3 2.6.9 3.9-3.4-2-3.4 2 .9-3.9-3-2.6 3.9-.4Z" />
      <circle className="draw" cx="12" cy="41" r="1.2" />
    </>
  ),
  parents: (
    <>
      <path className="draw" d="M8 41V25a16 16 0 0 1 32 0v16" />
      <path className="draw accent" d="M18 41v-7a6 6 0 0 1 12 0v7" />
      <path className="draw" d="M5 41h38" />
    </>
  ),
  trauma: (
    <>
      <path className="draw accent" d="M14 31a10 10 0 0 1 20 0" />
      <path className="draw" d="M24 13v3M12.3 18.3l2.1 2.1M35.7 18.3l-2.1 2.1M7 31h3M38 31h3" />
      <path className="draw" d="M6 37c3-2.4 6-2.4 9 0s6 2.4 9 0 6-2.4 9 0 6 2.4 9 0" />
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
      <defs>
        <radialGradient id="remote-sun" cx="35%" cy="35%" r="70%">
          <stop offset="0" stopColor="#f6ead0" />
          <stop offset="1" stopColor="#d8b874" />
        </radialGradient>
      </defs>
      <circle className="remote-sun" cx="222" cy="78" r="30" fill="url(#remote-sun)" />
      <path className="draw" d="M98 212V112a62 62 0 0 1 124 0v100" />
      <path className="draw" d="M50 212h220" />
      <rect className="draw" x="122" y="124" width="76" height="50" rx="6" />
      <path className="draw" d="M110 186h100l-8-12h-84Z" />
      <circle className="draw accent" cx="160" cy="142" r="7.5" />
      <path className="draw accent" d="M147 163c2.6-7 7.4-10 13-10s10.4 3 13 10" />
      <path className="draw accent" d="M236 104a16 16 0 0 1 0 22M246 96a30 30 0 0 1 0 38" />
      <path className="draw" d="M74 212c0-22 6-36 20-46" />
      <path className="draw" d="M80 188c-9-1-14-7-15-15 9 0 14 6 15 15Z" />
      <path className="draw" d="M86 176c1-9 7-14 15-14 0 9-6 14-15 14Z" />
    </svg>
  );
}

export function Ornament() {
  return (
    <svg className="ornament" viewBox="0 0 120 12" aria-hidden="true" focusable="false">
      <path className="draw" d="M2 6h46" />
      <circle className="draw accent" cx="60" cy="6" r="3.5" />
      <path className="draw" d="M72 6h46" />
    </svg>
  );
}
