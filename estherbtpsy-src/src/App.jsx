import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

import SplitText from './reactbits/SplitText.jsx';
import ScrollReveal from './reactbits/ScrollReveal.jsx';
import SpotlightCard from './reactbits/SpotlightCard.jsx';
import Magnet from './reactbits/Magnet.jsx';
import A11yWidget, { useA11yPrefs } from './A11yWidget.jsx';
import ContactForm from './ContactForm.jsx';
import {
  EMAIL, FAQ, INSTAGRAM, METHODS, NAV, PHONE_HREF, PHONE_TEXT, SERVICES, TOPICS, WA_LINK
} from './content.jsx';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ASSET = (name) => `./assets/${name}`;
const NEW_TAB = <span className="visually-hidden"> (נפתח בחלון חדש)</span>;

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

function useLenis(enabled) {
  const lenisRef = useRef(null);
  useEffect(() => {
    if (!enabled) return undefined;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);
  return lenisRef;
}

function WhatsAppIcon() {
  return (
    <svg className="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" /></svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z" /></svg>
  );
}

/* Headline words animate in via React Bits SplitText; the h1 keeps a plain-text name for assistive tech. */
function HeroTitle({ motion }) {
  const line = (text, className) =>
    motion ? (
      <SplitText
        text={text}
        tag="span"
        className={`hero-line ${className || ''}`}
        splitType="words"
        delay={90}
        duration={1.1}
        ease="power4.out"
        from={{ opacity: 0, y: 60, filter: 'blur(8px)' }}
        to={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        threshold={0}
        rootMargin="0px"
        textAlign="start"
      />
    ) : (
      <span className={`hero-line ${className || ''}`}>{text}</span>
    );
  return (
    <h1 id="hero-title" className="hero-title">
      <span className="visually-hidden">מרחב בטוח להתבוננות, חיבור וצמיחה</span>
      <span aria-hidden="true">
        {line('מרחב בטוח')}
        {line('להתבוננות,')}
        {line('חיבור וצמיחה', 'accent')}
      </span>
    </h1>
  );
}

function MagneticLink({ motion, children, ...props }) {
  return (
    <Magnet disabled={!motion} padding={60} magnetStrength={5}>
      <a {...props}>{children}</a>
    </Magnet>
  );
}

export default function App() {
  const [prefs, setPrefs] = useA11yPrefs();
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const motion = !reducedMotion && !prefs.still;
  const lenisRef = useLenis(motion);

  const rootRef = useRef(null);
  const headerRef = useRef(null);
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [fabShown, setFabShown] = useState(false);
  const [activeId, setActiveId] = useState('');

  // Header state, floating button, current section
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      setFabShown(y > window.innerHeight * 0.8);
      if (y > 240 && y > lastY + 2) setHeaderHidden(true);
      else if (y < lastY - 2 || y <= 240) setHeaderHidden(false);
      lastY = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    NAV.forEach(([href]) => { const s = document.querySelector(href); if (s) io.observe(s); });
    return () => { window.removeEventListener('scroll', onScroll); io.disconnect(); };
  }, []);

  // In-page anchors: smooth scroll through Lenis and move focus to the target
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute('href');
      const target = hash === '#top' ? document.getElementById('top') : document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      setNavOpen(false);
      const focusTarget = () => {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      };
      const offset = -((headerRef.current?.offsetHeight || 76) + 12);
      if (lenisRef.current) {
        lenisRef.current.scrollTo(hash === '#top' ? 0 : target, { offset, duration: 1.3, onComplete: focusTarget });
      } else {
        window.scrollTo({ top: hash === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY + offset });
        focusTarget();
      }
      history.replaceState(null, '', hash);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [lenisRef]);

  useEffect(() => {
    if (!navOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setNavOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navOpen]);

  useGSAP(() => {
    if (!motion) return;
    const mm = gsap.matchMedia();

    gsap.to('.scroll-progress', {
      scaleX: 1, ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
    });

    // Hero intro
    const intro = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.15 });
    intro
      .from('.hero .eyebrow', { y: 20, opacity: 0, duration: 0.8 })
      .fromTo('.portrait-frame', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' }, 0)
      .from('.portrait-frame img', { scale: 1.3, duration: 1.8, ease: 'expo.out' }, 0.35)
      .from('.hero-portrait .deco', { scale: 0, opacity: 0, duration: 1.2, stagger: 0.15, ease: 'back.out(1.6)' }, 0.8)
      .from('.hero .lead', { y: 30, opacity: 0, duration: 1 }, 0.7)
      .from('.hero-actions > *', { y: 30, opacity: 0, duration: 0.9, stagger: 0.1 }, 0.85)
      .from('.hero-meta li', { y: 16, opacity: 0, duration: 0.7, stagger: 0.08 }, 1)
      .from('.portrait-badge', { x: 40, opacity: 0, duration: 1 }, 1.1);

    gsap.to('.deco-orb', { y: -18, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.deco-ring', { rotate: 360, duration: 40, repeat: -1, ease: 'none' });

    gsap.to('.hero-portrait', {
      yPercent: -10, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.hero-copy', {
      yPercent: 12, opacity: 0.2, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'center 40%', end: 'bottom top', scrub: true }
    });

    // Marquee, nudged by scroll velocity
    const marquee = gsap.to('.marquee-track', { xPercent: 50, duration: 38, ease: 'none', repeat: -1 });
    ScrollTrigger.create({
      trigger: '.marquee',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 5);
        gsap.to(marquee, { timeScale: boost, duration: 0.2, overwrite: true });
        gsap.to(marquee, { timeScale: 1, duration: 1.2, delay: 0.2, overwrite: false });
      }
    });

    // Generic reveal
    gsap.set('.reveal', { opacity: 0, y: 48 });
    ScrollTrigger.batch('.reveal', {
      start: 'top 88%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12, overwrite: true })
    });

    gsap.utils.toArray('.section-head h2').forEach((h) => {
      gsap.from(h, {
        clipPath: 'inset(0% 0% 100% 0%)', y: 30, duration: 1.1, ease: 'power4.out',
        scrollTrigger: { trigger: h, start: 'top 88%', once: true }
      });
    });

    // Experience band grows from a rounded card into a full-bleed panel
    gsap.fromTo('.band', { clipPath: 'inset(0% 6% round 40px)' }, {
      clipPath: 'inset(0% 0% round 0px)', ease: 'none',
      scrollTrigger: { trigger: '.band', start: 'top 90%', end: 'top 30%', scrub: true }
    });
    gsap.from('.band-inner > *', {
      y: 40, opacity: 0, stagger: 0.15, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.band', start: 'top 60%', once: true }
    });

    // Location photos parallax
    gsap.utils.toArray('.location-media img').forEach((img) => {
      gsap.fromTo(img, { yPercent: -8, scale: 1.18 }, {
        yPercent: 8, scale: 1.18, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // Desktop: pin the approach section and step through the methods
    mm.add('(min-width: 1024px) and (min-height: 700px)', () => {
      const items = gsap.utils.toArray('.method');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.approach',
          start: 'top top+=60',
          end: `+=${items.length * 55}%`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1
        }
      });
      tl.fromTo('.methods-progress span', { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: items.length }, 0);
      items.forEach((item, i) => {
        tl.fromTo(item, { opacity: 0.25, x: -30 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }, i);
      });
    });
    mm.add('(max-width: 1023px), (max-height: 699px)', () => {
      gsap.from('.method', {
        opacity: 0, y: 30, stagger: 0.12, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.methods', start: 'top 85%', once: true }
      });
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, { scope: rootRef, dependencies: [motion], revertOnUpdate: true });

  const headerClass = ['site-header', scrolled && 'is-scrolled', headerHidden && !navOpen && 'is-hidden'].filter(Boolean).join(' ');

  return (
    <div ref={rootRef} className={motion ? 'has-motion' : 'no-motion'}>
      <a className="skip-link" href="#main">דילוג לתוכן הראשי</a>
      <div className="scroll-progress" aria-hidden="true" />

      <header ref={headerRef} className={headerClass} id="top">
        <div className="container header-inner">
          <a className="brand" href="#top">
            <img src={ASSET('logo-icon.png')} alt="" width="44" height="44" />
            <span className="brand-text">
              <span className="brand-name">אסתר ברבי טרבלסי</span>
              <span className="brand-role">פסיכולוגית חינוכית מומחית</span>
            </span>
          </a>

          <button className="nav-toggle" type="button" aria-expanded={navOpen} aria-controls="site-nav" onClick={() => setNavOpen((o) => !o)}>
            <span className="nav-toggle-bars" aria-hidden="true" />
            <span className="visually-hidden">תפריט ראשי</span>
          </button>

          <nav id="site-nav" className={`site-nav${navOpen ? ' is-open' : ''}`} aria-label="ניווט ראשי">
            <ul>
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a href={href} aria-current={activeId === href.slice(1) ? 'true' : undefined}>{label}</a>
                </li>
              ))}
            </ul>
            <MagneticLink motion={motion && finePointer} className="btn btn-primary btn-sm" href="#contact">לשיחת היכרות</MagneticLink>
          </nav>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        {/* HERO */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-bg" aria-hidden="true">
            <span className="blob blob-a" />
            <span className="blob blob-b" />
          </div>
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">טיפול פסיכולוגי לילדים, מתבגרים והורים</p>
              <HeroTitle motion={motion} />
              <p className="lead">
                ליווי מקצועי, חם ומותאם אישית לילדים, לבני נוער ולהורים – בקליניקה בתל אביב, בנגב המערבי או מרחוק.
              </p>
              <div className="hero-actions">
                <MagneticLink motion={motion && finePointer} className="btn btn-primary btn-lg" href={WA_LINK} target="_blank" rel="noopener">
                  <WhatsAppIcon />
                  לשיחת היכרות בוואטסאפ
                  {NEW_TAB}
                </MagneticLink>
                <MagneticLink motion={motion && finePointer} className="btn btn-ghost btn-lg" href={PHONE_HREF}>
                  <PhoneIcon />
                  <span dir="ltr">{PHONE_TEXT}</span>
                </MagneticLink>
              </div>
              <ul className="hero-meta" aria-label="אפשרויות טיפול">
                <li>תל אביב · ליד כיכר מסריק</li>
                <li>מושב שרשרת · נגב מערבי</li>
                <li>טיפול מרחוק</li>
              </ul>
            </div>

            <figure className="hero-portrait">
              <span className="deco deco-ring" aria-hidden="true" />
              <span className="deco deco-orb" aria-hidden="true" />
              <div className="portrait-frame">
                <img src={ASSET('esther-portrait.jpg')} width="896" height="1024" fetchPriority="high"
                  alt="אסתר ברבי טרבלסי, פסיכולוגית חינוכית מומחית, מחייכת בעדינות" />
              </div>
              <figcaption className="portrait-badge">
                <strong>פסיכולוגית חינוכית מומחית</strong>
                <span>ניסיון בשירות הפסיכולוגי-חינוכי ובקליניקה פרטית</span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <ul className="marquee-group" key={copy}>
                {TOPICS.map((t) => <li key={t}>{t}</li>)}
              </ul>
            ))}
          </div>
        </div>
        <p className="visually-hidden">תחומי התמודדות: {TOPICS.join(', ')}.</p>

        {/* ABOUT */}
        <section className="section" id="about" aria-labelledby="about-title">
          <div className="container about-grid">
            <div className="section-head">
              <p className="eyebrow">קצת עליי</p>
              <h2 id="about-title">נעים מאוד, אני אסתר</h2>
            </div>
            <div className="prose">
              <p className="reveal">
                אני פסיכולוגית חינוכית מומחית, עם ניסיון רב בעבודה עם ילדים, בני נוער והורים – הן במסגרת השירות
                הפסיכולוגי-חינוכי (באר שבע, מרחבים ולהבים) והן בקליניקה פרטית.
              </p>
              <p className="reveal">
                במהלך השנים ליוויתי ילדים ובני נוער בהתמודדות עם מגוון קשיים, ובהם חרדה, דיכאון, קשיים בוויסות רגשי
                והתנהגותי, קשיים חברתיים, משברי זהות בגיל ההתבגרות והתמודדות עם טראומה.
              </p>
              <p className="reveal">
                לצד העבודה עם ילדים ובני נוער, אני מלווה הורים בתהליכי הדרכה וטיפול בהורות.
              </p>
              <p className="signature reveal">מוזמנים ליצור קשר – ונצא יחד למסע של התבוננות, חיבור וצמיחה.</p>
            </div>
          </div>
        </section>

        {/* STATEMENT (React Bits ScrollReveal) */}
        <section className="statement" aria-label="תפיסת עולם">
          <div className="container narrow">
            {motion ? (
              <ScrollReveal as="blockquote" containerClassName="statement-quote" baseOpacity={0.12} baseRotation={2} blurStrength={6}>
                אני מאמינה שהקשר בין הורה לילד הוא מרכיב משמעותי בהתפתחות הרגשית והנפשית, ולכן חשוב לטפח אותו כחלק מהתהליך הטיפולי.
              </ScrollReveal>
            ) : (
              <blockquote className="scroll-reveal statement-quote">
                <p className="scroll-reveal-text">
                  אני מאמינה שהקשר בין הורה לילד הוא מרכיב משמעותי בהתפתחות הרגשית והנפשית, ולכן חשוב לטפח אותו כחלק מהתהליך הטיפולי.
                </p>
              </blockquote>
            )}
          </div>
        </section>

        {/* SERVICES (React Bits SpotlightCard) */}
        <section className="section section-tinted" id="services" aria-labelledby="services-title">
          <div className="container">
            <div className="section-head center">
              <p className="eyebrow">תחומי טיפול</p>
              <h2 id="services-title">במה אני יכולה לעזור</h2>
            </div>
            <ul className="cards">
              {SERVICES.map((s, i) => (
                <li key={s.title} className="reveal">
                  <SpotlightCard theme="light" spotlightColor="#1e5d8c" intensity={0.5} spotlightSize={260} borderGlow={0.9} className="card">
                    <span className="card-num" aria-hidden="true">0{i + 1}</span>
                    <span className="card-icon" aria-hidden="true"><svg viewBox="0 0 24 24">{s.icon}</svg></span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </SpotlightCard>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* APPROACH (GSAP pinned timeline on desktop) */}
        <section className="section approach" id="approach" aria-labelledby="approach-title">
          <div className="container approach-grid">
            <div className="section-head">
              <p className="eyebrow">גישה טיפולית</p>
              <h2 id="approach-title">טיפול שמותאם לאדם, לא לשיטה</h2>
              <div className="prose">
                <p>
                  אני משלבת טיפול פסיכולוגי דינמי עם גישות מבוססות מחקר. שילוב הגישות מאפשר להתאים את הטיפול לכל
                  מטופל ומטופלת, מתוך הקשבה והתבוננות.
                </p>
                <p>
                  האדם הוא חלק ממעגלים משמעותיים בחייו – ובמיוחד ילדים ובני נוער. לכן, בהתאם לצורך, אני משלבת את
                  ההורים בתהליך, תוך התאמה מתמדת לצרכים המשתנים ולהתפתחות האישית.
                </p>
              </div>
            </div>
            <div className="methods-wrap">
              <span className="methods-progress" aria-hidden="true"><span /></span>
              <ul className="methods" aria-label="שיטות טיפול">
                {METHODS.map(([name, desc, latin]) => (
                  <li className="method" key={name}>
                    <strong {...(latin ? { lang: 'en', dir: 'ltr' } : {})}>{name}</strong>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* EXPERIENCE BAND */}
        <section className="band" aria-labelledby="exp-title">
          <div className="container band-inner">
            <p className="eyebrow eyebrow-light">ניסיון מהשטח</p>
            <h2 id="exp-title">ניסיון מקצועי מותאם למציאות משתנה</h2>
            <p>
              כפסיכולוגית חינוכית בדרום הארץ צברתי ניסיון מעמיק בטיפול במצבי חירום וטראומה. העבודה באזור המאופיין
              באתגרי ביטחון העמיקה את הבנתי בחשיבות הגמישות הטיפולית והיכולת להתאים את המענה למציאות המשתנה.
            </p>
          </div>
        </section>

        {/* WHEN */}
        <section className="section" id="when" aria-labelledby="when-title">
          <div className="container">
            <div className="section-head center">
              <p className="eyebrow">מתי מומלץ לפנות?</p>
              <h2 id="when-title">אין צורך לחכות למשבר</h2>
              <p className="section-sub">
                טיפול פסיכולוגי מתאים לכל מי שמתמודד עם מצוקה רגשית, תסכול, קושי בהסתגלות – או רוצה לערוך שינוי
                משמעותי בחייו.
              </p>
            </div>
            <div className="when-grid">
              <article className="when-card reveal">
                <h3>סימנים אצל ילדים ובני נוער</h3>
                <ul className="checklist">
                  {['הסתגרות או נסיגה חברתית', 'התפרצויות זעם', 'בכי ממושך', 'תחושת בדידות', 'דאגה חריגה'].map((t) => <li key={t}>{t}</li>)}
                </ul>
                <p>אצל ילדים, זיהוי הצורך נעשה פעמים רבות בשיתוף ההורים – והקשר איתם הוא חלק מרכזי בהבנה ובתמיכה.</p>
              </article>
              <article className="when-card reveal">
                <h3>להורים</h3>
                <ul className="checklist">
                  {['תסכול וחוסר אונים', 'קושי ביצירת קשר עם הילד', 'תחושת אובדן שליטה במערכת היחסים', 'רצון להבין דפוסים הוריים ולשנות אותם'].map((t) => <li key={t}>{t}</li>)}
                </ul>
                <p>מעבר להפחתת הסימפטומים, הטיפול מציע מרחב להתחבר מחדש לאופן שבו תרצו ללוות את ילדיכם.</p>
              </article>
            </div>
            <blockquote className="pull-quote reveal">
              <p>פנייה לטיפול היא צעד משמעותי להתבוננות ושינוי.</p>
            </blockquote>
          </div>
        </section>

        {/* LOCATIONS */}
        <section className="section section-tinted" id="locations" aria-labelledby="locations-title">
          <div className="container">
            <div className="section-head center">
              <p className="eyebrow">איפה נפגשים</p>
              <h2 id="locations-title">שתי קליניקות, ואפשרות לטיפול מרחוק</h2>
            </div>
            <ul className="locations">
              <li className="location reveal">
                <div className="location-media">
                  <img src={ASSET('clinic-tel-aviv.jpg')} width="1024" height="924" loading="lazy"
                    alt="חדר הטיפולים בתל אביב: ספה בהירה, כורסה צהובה ומדפים עם ספרים" />
                </div>
                <div className="location-body">
                  <h3>הקליניקה במרכז</h3>
                  <p>סמוך לכיכר מסריק, תל אביב</p>
                  <a className="text-link" href="https://www.google.com/maps/search/?api=1&query=%D7%9B%D7%99%D7%9B%D7%A8+%D7%9E%D7%A1%D7%A8%D7%99%D7%A7+%D7%AA%D7%9C+%D7%90%D7%91%D7%99%D7%91" target="_blank" rel="noopener">פתיחה במפות{NEW_TAB}</a>
                </div>
              </li>
              <li className="location reveal">
                <div className="location-media">
                  <img src={ASSET('clinic-south.jpg')} width="1024" height="921" loading="lazy" alt="חדר הטיפולים במושב שרשרת" />
                </div>
                <div className="location-body">
                  <h3>הקליניקה בדרום</h3>
                  <p>מושב שרשרת, נגב מערבי</p>
                  <a className="text-link" href="https://www.google.com/maps/search/?api=1&query=%D7%A9%D7%A8%D7%A9%D7%A8%D7%AA" target="_blank" rel="noopener">פתיחה במפות{NEW_TAB}</a>
                </div>
              </li>
              <li className="location location-remote reveal">
                <div className="location-media remote-visual" aria-hidden="true">
                  <svg viewBox="0 0 64 64"><rect x="8" y="12" width="48" height="32" rx="4" /><path d="M24 52h16M32 44v8" /><circle cx="32" cy="26" r="5" /><path d="M23 38c1.5-4 5-6 9-6s7.5 2 9 6" /></svg>
                </div>
                <div className="location-body">
                  <h3>מכל מקום</h3>
                  <p>בחלק מהמקרים ניתן לתאם טיפול מרחוק, בשיחת וידאו.</p>
                  <a className="text-link" href="#contact">לבירור התאמה</a>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" id="faq" aria-labelledby="faq-title">
          <div className="container narrow">
            <div className="section-head center">
              <p className="eyebrow">שאלות נפוצות</p>
              <h2 id="faq-title">לפני שמתחילים</h2>
            </div>
            <div className="faq">
              {FAQ.map(([q, a]) => (
                <details key={q} className="reveal">
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="section contact" id="contact" aria-labelledby="contact-title">
          <div className="container contact-grid">
            <div className="contact-copy">
              <div className="section-head">
                <p className="eyebrow">יצירת קשר</p>
                <h2 id="contact-title">לשיחת ייעוץ</h2>
              </div>
              <p className="reveal">מחפשים ליווי מקצועי, או רוצים לשמוע עוד? אני כאן בשבילכם.</p>
              <ul className="contact-list">
                <li className="reveal"><span className="contact-label">נייד</span><a href={PHONE_HREF} dir="ltr">{PHONE_TEXT}</a></li>
                <li className="reveal"><span className="contact-label">דוא"ל</span><a href={`mailto:${EMAIL}`} dir="ltr">{EMAIL}</a></li>
                <li className="reveal"><span className="contact-label">אינסטגרם</span><a href={INSTAGRAM} target="_blank" rel="noopener">לעמוד האינסטגרם{NEW_TAB}</a></li>
              </ul>
            </div>
            <ContactForm className="reveal" />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p className="footer-cta">מוכנים להתחיל? <a href="#contact">בואו נדבר</a></p>
          <div className="footer-brand">
            <img src={ASSET('logo-icon.png')} alt="" width="40" height="40" />
            <div>
              <p className="brand-name">אסתר ברבי טרבלסי</p>
              <p className="brand-role">פסיכולוגית חינוכית מומחית</p>
            </div>
          </div>
          <nav aria-label="קישורים בתחתית העמוד">
            <ul className="footer-links">
              <li><a href="#about">אודות</a></li>
              <li><a href="#services">תחומי טיפול</a></li>
              <li><a href="#locations">קליניקות</a></li>
              <li><a href="#contact">יצירת קשר</a></li>
              <li><a href="./accessibility.html">הצהרת נגישות</a></li>
              <li><a href="./privacy.html">מדיניות פרטיות</a></li>
            </ul>
          </nav>
          <p className="copyright">© {new Date().getFullYear()} אסתר ברבי טרבלסי. כל הזכויות שמורות.</p>
        </div>
      </footer>

      <a className={`fab-whatsapp${fabShown ? ' is-shown' : ''}`} href={WA_LINK} target="_blank" rel="noopener" aria-label="שליחת הודעה בוואטסאפ (נפתח בחלון חדש)">
        <WhatsAppIcon />
      </a>

      <A11yWidget prefs={prefs} setPrefs={setPrefs} />
    </div>
  );
}
