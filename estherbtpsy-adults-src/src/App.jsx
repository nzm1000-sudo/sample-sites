import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

import RotatingText from './reactbits/RotatingText.jsx';
import CircularText from './reactbits/CircularText.jsx';
import ScrollFloat from './reactbits/ScrollFloat.jsx';
import SplitText from './reactbits/SplitText.jsx';
import Magnet from './reactbits/Magnet.jsx';
import A11yWidget, { useA11yPrefs } from './A11yWidget.jsx';
import ContactForm from './ContactForm.jsx';
import LogoMark from './LogoMark.jsx';
import { RemoteIllustration, ServiceIcon } from './Icons.jsx';
import {
  EMAIL, FAQ, INSTAGRAM, METHODS, NAV, PHONE_HREF, PHONE_TEXT, ROTATING, SERVICES, STEPS, TOPICS, WA_LINK
} from './content.jsx';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, useGSAP);

const ASSET = (name) => `./assets/${name}`;
const NEW_TAB = <span className="visually-hidden"> (נפתח בחלון חדש)</span>;
const pad = (n) => String(n).padStart(2, '0');

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
    const lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.85 });
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

function Arrow() {
  return <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" /></svg>;
}

function Label({ num, children }) {
  return (
    <p className="label">
      {num && <span className="label-num" aria-hidden="true">{num}</span>}
      <span>{children}</span>
    </p>
  );
}

/* Section heading: React Bits ScrollFloat when motion is on, plain heading otherwise. */
function Heading({ id, children, motion, className = '' }) {
  return motion ? (
    <ScrollFloat id={id} containerClassName={`h2 ${className}`} ease="power3.out" stagger={0.012}
      scrollStart="top bottom-=8%" scrollEnd="top 62%">
      {children}
    </ScrollFloat>
  ) : (
    <h2 id={id} className={`h2 ${className}`}>{children}</h2>
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
  const mobileNav = useMediaQuery('(max-width: 1080px)');
  const motion = !reducedMotion && !prefs.still;
  const lenisRef = useLenis(motion);

  const rootRef = useRef(null);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);
  const navRef = useRef(null);
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      setPastHero(window.scrollY > window.innerHeight * 0.8);
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
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      setNavOpen(false);
      const toTop = hash === '#top';
      const focusTarget = () => {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      };
      const offset = -((headerRef.current?.offsetHeight || 80) + 12);
      requestAnimationFrame(() => {
        if (lenisRef.current) {
          lenisRef.current.start();
          lenisRef.current.scrollTo(toTop ? 0 : target, { offset, duration: 1.5, onComplete: focusTarget });
        } else {
          window.scrollTo({ top: toTop ? 0 : target.getBoundingClientRect().top + window.scrollY + offset });
          focusTarget();
        }
      });
      history.replaceState(null, '', hash);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [lenisRef]);

  // Full-screen menu on smaller screens: lock scroll, trap focus, close on Escape
  useEffect(() => {
    const root = document.documentElement;
    const overlay = navOpen && mobileNav;
    root.classList.toggle('menu-open', overlay);
    if (!overlay) { lenisRef.current?.start(); return undefined; }
    lenisRef.current?.stop();
    navRef.current.querySelector('a')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { setNavOpen(false); toggleRef.current?.focus(); return; }
      if (e.key !== 'Tab') return;
      const items = [toggleRef.current, ...navRef.current.querySelectorAll('a')];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); root.classList.remove('menu-open'); };
  }, [navOpen, mobileNav, lenisRef]);

  useGSAP(() => {
    if (!motion) return;
    const mm = gsap.matchMedia();

    gsap.to('.progress-rail span', { scaleY: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

    // Hero intro
    const intro = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 });
    intro
      .from('.site-header .header-inner > *', { y: -16, opacity: 0, duration: 1, stagger: 0.08 })
      .from('.hero .label', { y: 20, opacity: 0, duration: 1 }, 0.15)
      .fromTo('.hero-media', { clipPath: 'inset(0% 0% 100% 0% round 240px 24px 240px 24px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 240px 24px 240px 24px)', duration: 1.8, ease: 'expo.inOut' }, 0.1)
      .from('.hero-media img', { scale: 1.4, duration: 2.4 }, 0.4)
      .from('.breath', { scale: 0, opacity: 0, duration: 1.6, ease: 'back.out(1.4)' }, 1)
      .from('.hero .lead', { y: 24, opacity: 0, duration: 1.2 }, 0.9)
      .from('.hero-actions > *', { y: 24, opacity: 0, duration: 1.1, stagger: 0.1 }, 1)
      .from('.hero-foot > *', { y: 16, opacity: 0, duration: 1, stagger: 0.08 }, 1.2);

    // Breathing guide: 4s in, 4s out
    gsap.timeline({ repeat: -1, delay: 2.4 })
      .to('.breath-core', { scale: 1.18, duration: 4, ease: 'sine.inOut' })
      .to('.breath-core', { scale: 0.86, duration: 4, ease: 'sine.inOut' });

    gsap.to('.hero-media img', {
      yPercent: 12, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.hero-copy', {
      yPercent: -8, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // Generic reveal
    gsap.set('.reveal', { opacity: 0, y: 40 });
    ScrollTrigger.batch('.reveal', {
      start: 'top 90%', once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1, overwrite: true })
    });

    // Topic rows: a hairline draws across, then the row rises in
    gsap.utils.toArray('.topic').forEach((row) => {
      gsap.from(row.querySelector('.topic-line'), {
        scaleX: 0, duration: 1.4, ease: 'expo.inOut',
        scrollTrigger: { trigger: row, start: 'top 92%', once: true }
      });
      gsap.from(row.querySelectorAll('.topic-num, .topic-title, .topic-text'), {
        y: 30, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: row, start: 'top 90%', once: true }
      });
    });

    // Icons and illustration draw in
    gsap.utils.toArray('.line-icon, .remote-illustration').forEach((svg) => {
      gsap.from(svg.querySelectorAll('.draw'), {
        drawSVG: 0, duration: 1.8, ease: 'power2.inOut', stagger: 0.12,
        scrollTrigger: { trigger: svg, start: 'top 90%', once: true }
      });
    });

    // Desktop: services travel sideways while the section is pinned
    mm.add('(min-width: 1024px) and (min-height: 680px)', () => {
      const track = document.querySelector('.services-track');
      const distance = () => track.scrollWidth - track.parentElement.clientWidth;
      const tween = gsap.to(track, {
        x: () => distance(), ease: 'none',
        scrollTrigger: {
          trigger: '.services', start: 'top top', end: () => `+=${distance()}`,
          pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1
        }
      });
      gsap.utils.toArray('.service-panel').forEach((panel) => {
        gsap.from(panel.querySelector('.service-inner'), {
          y: 60, opacity: 0.2, ease: 'none',
          scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'right left', end: 'center center', scrub: true }
        });
      });
      gsap.to('.services-count span', {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: '.services', start: 'top top', end: () => `+=${distance()}`, scrub: true }
      });
    });
    mm.add('(max-width: 1023px), (max-height: 679px)', () => {
      gsap.utils.toArray('.service-panel').forEach((panel) => {
        gsap.from(panel, {
          y: 50, opacity: 0, duration: 1.1, ease: 'expo.out',
          scrollTrigger: { trigger: panel, start: 'top 88%', once: true }
        });
      });
    });

    // Process: the path draws as you scroll and each step lights up
    gsap.fromTo('.process-line span', { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: '.steps', start: 'top 70%', end: 'bottom 60%', scrub: true }
    });
    gsap.utils.toArray('.step').forEach((step) => {
      gsap.fromTo(step, { opacity: 0.25 }, {
        opacity: 1, ease: 'none',
        scrollTrigger: { trigger: step, start: 'top 80%', end: 'top 55%', scrub: true }
      });
      ScrollTrigger.create({
        trigger: step, start: 'top 62%',
        onEnter: () => step.classList.add('is-on'),
        onLeaveBack: () => step.classList.remove('is-on')
      });
    });

    // About portrait
    gsap.fromTo('.about-photo', { clipPath: 'inset(12% 12% 12% 12% round 32px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 32px)', ease: 'none',
      scrollTrigger: { trigger: '.about-photo', start: 'top 95%', end: 'top 40%', scrub: true }
    });
    gsap.fromTo('.about-photo img', { yPercent: -8, scale: 1.15 }, {
      yPercent: 8, scale: 1.15, ease: 'none',
      scrollTrigger: { trigger: '.about-photo', start: 'top bottom', end: 'bottom top', scrub: true }
    });
    gsap.from('.about-block', {
      xPercent: 18, ease: 'none',
      scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'center center', scrub: true }
    });

    // Experience: rings expand like a slow exhale
    gsap.fromTo('.ring', { scale: 0.4, opacity: 0 }, {
      scale: 1, opacity: 1, stagger: 0.12, ease: 'none',
      scrollTrigger: { trigger: '.experience', start: 'top bottom', end: 'center center', scrub: true }
    });

    // Location images
    gsap.utils.toArray('.place-media').forEach((m) => {
      gsap.fromTo(m, { clipPath: 'inset(0% 0% 100% 0% round 20px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: 1.4, ease: 'expo.inOut',
        scrollTrigger: { trigger: m, start: 'top 88%', once: true }
      });
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, { scope: rootRef, dependencies: [motion], revertOnUpdate: true });

  const headerClass = ['site-header', scrolled && 'is-scrolled', navOpen && 'nav-is-open'].filter(Boolean).join(' ');

  return (
    <div ref={rootRef} className={motion ? 'has-motion' : 'no-motion'}>
      <a className="skip-link" href="#main">דילוג לתוכן הראשי</a>
      <div className="progress-rail" aria-hidden="true"><span /></div>

      <header ref={headerRef} className={headerClass} id="top">
        <div className="container header-inner">
          <a className="brand" href="#top">
            <LogoMark className="brand-mark" />
            <span className="brand-text">
              <span className="brand-name">אסתר ברבי טרבלסי</span>
              <span className="brand-role">פסיכולוגית חינוכית מומחית</span>
            </span>
          </a>

          <nav ref={navRef} id="site-nav" className={`site-nav${navOpen ? ' is-open' : ''}`} aria-label="ניווט ראשי">
            <ul>
              {NAV.map(([href, label], i) => (
                <li key={href} style={{ '--i': i }}>
                  <a href={href} aria-current={activeId === href.slice(1) ? 'true' : undefined}>
                    <span className="nav-num" aria-hidden="true">{pad(i + 1)}</span>{label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="nav-foot">
              <a className="btn btn-solid" href="#contact">לקביעת שיחת היכרות</a>
              <p className="nav-contact">
                <a href={PHONE_HREF} dir="ltr">{PHONE_TEXT}</a>
                <a href={`mailto:${EMAIL}`} dir="ltr">{EMAIL}</a>
              </p>
            </div>
          </nav>

          <div className="header-actions">
            <MagneticLink motion={motion && finePointer} className="btn btn-solid btn-sm header-cta" href="#contact">שיחת היכרות</MagneticLink>
            <button ref={toggleRef} className="menu-toggle" type="button" aria-expanded={navOpen} aria-controls="site-nav" onClick={() => setNavOpen((o) => !o)}>
              <span className="menu-toggle-text">{navOpen ? 'סגירה' : 'תפריט'}</span>
              <span className="menu-toggle-icon" aria-hidden="true"><span /><span /></span>
            </button>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        {/* HERO */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="container hero-grid">
            <div className="hero-copy">
              <Label>פסיכולוגית · מבוגרים, צעירים והורים</Label>
              <h1 id="hero-title" className="hero-title">
                <span className="visually-hidden">מקום לנשום, גם בתוך העומס, השינוי והלחץ</span>
                <span aria-hidden="true" className="hero-title-visual">
                  <span className="hero-line">מקום לנשום</span>
                  <span className="hero-line">
                    <span>גם בתוך </span>
                    {motion ? (
                      <RotatingText
                        texts={ROTATING}
                        mainClassName="rotator"
                        splitBy="words"
                        rotationInterval={2600}
                        initial={{ y: '110%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '-110%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                      />
                    ) : (
                      <span className="rotator">{ROTATING[0]}</span>
                    )}
                  </span>
                </span>
              </h1>
              <p className="lead">
                ליווי פסיכולוגי מקצועי ושקט לתקופות של לחץ, משבר, אובדן או שינוי – ומקום לחזור לעצמך.
                בקליניקה בתל אביב, בנגב המערבי או מרחוק.
              </p>
              <div className="hero-actions">
                <MagneticLink motion={motion && finePointer} className="btn btn-solid btn-lg" href={WA_LINK} target="_blank" rel="noopener">
                  <WhatsAppIcon />לשיחת היכרות{NEW_TAB}
                </MagneticLink>
                <MagneticLink motion={motion && finePointer} className="btn btn-line btn-lg" href={PHONE_HREF}>
                  <PhoneIcon /><span dir="ltr">{PHONE_TEXT}</span>
                </MagneticLink>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-media">
                <img src={ASSET('session.jpg')} width="1400" height="931" fetchPriority="high"
                  alt="פגישה טיפולית: מטפלת רושמת במחברת מול מטופלת שיושבת על ספה" />
              </div>
              <div className="breath" aria-hidden="true">
                <div className="breath-core" />
                {motion
                  ? <CircularText text="נשימה · מרחב · הקשבה · צמיחה · " spinDuration={36} onHover="slowDown" className="breath-ring" />
                  : <div className="breath-ring breath-ring-static" />}
              </div>
            </div>
          </div>
          <div className="container hero-foot">
            <span>תל אביב · כיכר מסריק</span>
            <span>מושב שרשרת · נגב מערבי</span>
            <span>טיפול מרחוק</span>
          </div>
        </section>

        {/* INTRO */}
        <section className="intro" aria-labelledby="intro-title">
          <div className="container narrow">
            <Heading id="intro-title" motion={motion} className="intro-title">לפעמים הצעד הראשון הוא לעצור ולהקשיב.</Heading>
            <p className="intro-text reveal">
              לא צריך לחכות למשבר כדי לפנות לטיפול. לפעמים זו תחושה שמשהו לא מסתדר, עייפות שלא עוברת, או רצון
              להבין את עצמך טוב יותר. טיפול הוא מרחב בטוח לעשות את זה – בקצב שלך.
            </p>
          </div>
        </section>

        {/* TOPICS */}
        <section className="section topics" id="topics" aria-labelledby="topics-title">
          <div className="container">
            <div className="section-head">
              <Label num="01">עם מה מגיעים</Label>
              <Heading id="topics-title" motion={motion}>מה שמביא אנשים אליי</Heading>
            </div>
            <ol className="topic-list">
              {TOPICS.map(([title, text], i) => (
                <li className="topic" key={title}>
                  <span className="topic-line" aria-hidden="true" />
                  <span className="topic-num" aria-hidden="true">{pad(i + 1)}</span>
                  <h3 className="topic-title">{title}</h3>
                  <p className="topic-text">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* SERVICES: horizontal on desktop */}
        <section className="services" id="services" aria-labelledby="services-title">
          <div className="services-head container">
            <div>
              <Label num="02">תחומי טיפול</Label>
              <h2 id="services-title" className="h2 light">ארבע דרכים לעבוד יחד</h2>
            </div>
            <div className="services-count" aria-hidden="true"><span /></div>
          </div>
          <div className="services-viewport">
            <ul className="services-track">
              {SERVICES.map((s, i) => (
                <li className="service-panel" key={s.title}>
                  <div className="service-inner">
                    <span className="service-num" aria-hidden="true">{pad(i + 1)}</span>
                    <span className="service-icon"><ServiceIcon name={s.icon} /></span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* PROCESS */}
        <section className="section process" id="process" aria-labelledby="process-title">
          <div className="container process-grid">
            <div className="section-head sticky-head">
              <Label num="03">איך זה עובד</Label>
              <Heading id="process-title" motion={motion}>תהליך פשוט, בלי לחץ</Heading>
              <p className="section-sub reveal">כל תהליך מתחיל בשיחה. משם בונים יחד את מה שנכון לך.</p>
            </div>
            <div className="steps">
              <span className="process-line" aria-hidden="true"><span /></span>
              <ol>
                {STEPS.map(([title, text], i) => (
                  <li className="step" key={title}>
                    <span className="step-dot" aria-hidden="true">{i + 1}</span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="section about" id="about" aria-labelledby="about-title">
          <div className="container about-grid">
            <div className="about-visual">
              <span className="about-block" aria-hidden="true" />
              <div className="about-photo">
                <img src={ASSET('esther-portrait.jpg')} width="896" height="1024" loading="lazy"
                  alt="אסתר ברבי טרבלסי, פסיכולוגית חינוכית מומחית" />
              </div>
            </div>
            <div className="about-copy">
              <Label num="04">עליי</Label>
              <Heading id="about-title" motion={motion}>נעים מאוד, אני אסתר</Heading>
              <div className="prose">
                <p className="reveal">
                  אני פסיכולוגית חינוכית מומחית, ומלווה מבוגרים, צעירים והורים בתהליכי טיפול – בקליניקה בתל אביב,
                  בנגב המערבי ומרחוק.
                </p>
                <p className="reveal">
                  שנות העבודה שלי בשירות הפסיכולוגי-חינוכי בדרום הארץ (באר שבע, מרחבים ולהבים), לצד ילדים, בני נוער
                  ומבוגרים במצבי חירום וטראומה, לימדו אותי כמה חשוב מרחב יציב, גמיש ומדויק – במיוחד כשהמציאות לא יציבה.
                </p>
                <p className="reveal">
                  אני משלבת טיפול דינמי עם גישות מבוססות מחקר, ומתאימה את התהליך לכל אדם – מתוך הקשבה, כבוד וסקרנות.
                </p>
              </div>
              <ul className="methods reveal" aria-label="גישות טיפול">
                {METHODS.map(([m, latin]) => (
                  <li key={m} {...(latin ? { lang: 'en', dir: 'ltr' } : {})}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section className="experience" aria-label="ניסיון מהשטח">
          <div className="rings" aria-hidden="true">
            <span className="ring" /><span className="ring" /><span className="ring" /><span className="ring" />
          </div>
          <div className="container narrow experience-inner">
            <Label>ניסיון מהשטח</Label>
            {motion ? (
              <SplitText text="ניסיון מקצועי שנבנה במציאות משתנה" tag="h2" className="h2 light exp-title"
                splitType="words" delay={70} duration={1.2} ease="expo.out"
                from={{ opacity: 0, y: 40 }} to={{ opacity: 1, y: 0 }} textAlign="center" />
            ) : (
              <h2 className="h2 light exp-title">ניסיון מקצועי שנבנה במציאות משתנה</h2>
            )}
            <p className="reveal">
              העבודה כפסיכולוגית בדרום הארץ, באזור המאופיין באתגרי ביטחון, העמיקה את ההבנה שלי בטראומה ובתגובות דחק –
              ובחשיבות של גמישות, יציבות ונוכחות בתוך הטיפול.
            </p>
          </div>
        </section>

        {/* LOCATIONS */}
        <section className="section locations" id="locations" aria-labelledby="locations-title">
          <div className="container">
            <div className="section-head">
              <Label num="05">איפה נפגשים</Label>
              <Heading id="locations-title" motion={motion}>שלוש אפשרויות, אותה תשומת לב</Heading>
            </div>
            <ul className="places">
              <li className="place reveal">
                <div className="place-media remote">
                  <RemoteIllustration />
                </div>
                <div className="place-body">
                  <span className="place-tag">מכל מקום</span>
                  <h3>טיפול מרחוק</h3>
                  <p>בחלק מהמקרים ניתן לתאם טיפול בשיחת וידאו – מהבית, מהעבודה או מכל מקום שקט.</p>
                  <a className="text-link" href="#contact">לבירור התאמה <Arrow /></a>
                </div>
              </li>
              <li className="place reveal">
                <div className="place-media">
                  <img src={ASSET('clinic-tel-aviv.jpg')} width="1024" height="924" loading="lazy" alt="חדר הטיפולים בתל אביב" />
                </div>
                <div className="place-body">
                  <span className="place-tag">מרכז</span>
                  <h3>תל אביב</h3>
                  <p>סמוך לכיכר מסריק.</p>
                  <a className="text-link" href="https://www.google.com/maps/search/?api=1&query=%D7%9B%D7%99%D7%9B%D7%A8+%D7%9E%D7%A1%D7%A8%D7%99%D7%A7+%D7%AA%D7%9C+%D7%90%D7%91%D7%99%D7%91" target="_blank" rel="noopener">פתיחה במפות{NEW_TAB} <Arrow /></a>
                </div>
              </li>
              <li className="place reveal">
                <div className="place-media">
                  <img src={ASSET('clinic-south.jpg')} width="1024" height="921" loading="lazy" alt="חדר הטיפולים במושב שרשרת" />
                </div>
                <div className="place-body">
                  <span className="place-tag">דרום</span>
                  <h3>מושב שרשרת</h3>
                  <p>בנגב המערבי.</p>
                  <a className="text-link" href="https://www.google.com/maps/search/?api=1&query=%D7%A9%D7%A8%D7%A9%D7%A8%D7%AA" target="_blank" rel="noopener">פתיחה במפות{NEW_TAB} <Arrow /></a>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="section faq-section" id="faq" aria-labelledby="faq-title">
          <div className="container faq-grid">
            <div className="section-head sticky-head">
              <Label num="06">שאלות</Label>
              <Heading id="faq-title" motion={motion}>לפני שמתחילים</Heading>
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
        <section className="contact" id="contact" aria-labelledby="contact-title">
          <div className="container contact-grid">
            <div className="contact-copy">
              <Label num="07">יצירת קשר</Label>
              <h2 id="contact-title" className="h2 light contact-title">בואו נתחיל<br />בשיחה.</h2>
              <p className="reveal">שיחת היכרות קצרה, בלי התחייבות – כדי להבין יחד אם ואיך אוכל לעזור.</p>
              <ul className="contact-list">
                <li className="reveal"><span>נייד</span><a href={PHONE_HREF} dir="ltr">{PHONE_TEXT}</a></li>
                <li className="reveal"><span>דוא"ל</span><a href={`mailto:${EMAIL}`} dir="ltr">{EMAIL}</a></li>
                <li className="reveal"><span>אינסטגרם</span><a href={INSTAGRAM} target="_blank" rel="noopener">לעמוד האינסטגרם{NEW_TAB}</a></li>
              </ul>
            </div>
            <ContactForm className="reveal" />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <a className="brand footer-brand" href="#top">
            <LogoMark className="brand-mark" />
            <span className="brand-text">
              <span className="brand-name">אסתר ברבי טרבלסי</span>
              <span className="brand-role">פסיכולוגית חינוכית מומחית</span>
            </span>
          </a>
          <nav aria-label="קישורים בתחתית העמוד">
            <ul className="footer-links">
              {NAV.map(([href, label]) => <li key={href}><a href={href}>{label}</a></li>)}
              <li><a href="./accessibility.html">הצהרת נגישות</a></li>
              <li><a href="./privacy.html">מדיניות פרטיות</a></li>
            </ul>
          </nav>
          <p className="copyright">© {new Date().getFullYear()} אסתר ברבי טרבלסי. כל הזכויות שמורות.</p>
        </div>
      </footer>

      <div className={`mobile-cta${pastHero ? ' is-shown' : ''}`}>
        <a className="mobile-cta-main" href={WA_LINK} target="_blank" rel="noopener">
          <WhatsAppIcon />לשיחת היכרות{NEW_TAB}
        </a>
        <a className="mobile-cta-call" href={PHONE_HREF} aria-label={`חיוג ל-${PHONE_TEXT}`}><PhoneIcon /></a>
      </div>

      <A11yWidget prefs={prefs} setPrefs={setPrefs} />
    </div>
  );
}
