import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

import SplitText from './reactbits/SplitText.jsx';
import ScrollReveal from './reactbits/ScrollReveal.jsx';
import SpotlightCard from './reactbits/SpotlightCard.jsx';
import Magnet from './reactbits/Magnet.jsx';
import A11yWidget, { useA11yPrefs } from './A11yWidget.jsx';
import ContactForm from './ContactForm.jsx';
import LogoMark from './LogoMark.jsx';
import { Ornament, RemoteIllustration, ServiceIcon } from './Icons.jsx';
import {
  EMAIL, FAQ, INSTAGRAM, METHODS, NAV, PHONE_HREF, PHONE_TEXT, SERVICES, TOPICS, WA_LINK
} from './content.jsx';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, useGSAP);

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
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
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

function Eyebrow({ num, children, light }) {
  return (
    <p className={`eyebrow${light ? ' eyebrow-light' : ''}`}>
      {num && <span className="eyebrow-num" aria-hidden="true">{num}</span>}
      {children}
    </p>
  );
}

/* Headline words animate in via React Bits SplitText; the h1 keeps a plain-text name for assistive tech. */
function HeroTitle({ motion, delay }) {
  const line = (text, className = '') =>
    motion ? (
      <SplitText
        text={text}
        tag="span"
        className={`hero-line ${className}`}
        splitType="words"
        delay={110}
        duration={1.3}
        ease="power4.out"
        from={{ opacity: 0, y: 70, filter: 'blur(10px)' }}
        to={{ opacity: 1, y: 0, filter: 'blur(0px)', delay }}
        threshold={0}
        rootMargin="0px"
        textAlign="start"
      />
    ) : (
      <span className={`hero-line ${className}`}>{text}</span>
    );
  return (
    <h1 id="hero-title" className="hero-title">
      <span className="visually-hidden">מרחב בטוח להתבוננות, חיבור וצמיחה</span>
      <span aria-hidden="true">
        {line('מרחב בטוח')}
        {line('להתבוננות,')}
        {line('חיבור וצמיחה', 'accent')}
        <svg className="accent-swash" viewBox="0 0 300 16" preserveAspectRatio="none" focusable="false">
          <path className="draw" d="M298 9C230 2 170 14 110 8S30 5 2 11" />
        </svg>
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
  const mobileNav = useMediaQuery('(max-width: 1080px)');
  const motion = !reducedMotion && !prefs.still;
  const lenisRef = useLenis(motion);

  const [showLoader] = useState(() => {
    try { return !sessionStorage.getItem('intro-seen'); } catch { return true; }
  });
  const [loaderDone, setLoaderDone] = useState(false);
  const loaderActive = showLoader && motion && !loaderDone;

  const rootRef = useRef(null);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);
  const navRef = useRef(null);
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      setPastHero(y > window.innerHeight * 0.8);
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
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      setNavOpen(false);
      const toTop = hash === '#top';
      const focusTarget = () => {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      };
      const offset = -((headerRef.current?.offsetHeight || 76) + 12);
      requestAnimationFrame(() => {
        if (lenisRef.current) {
          lenisRef.current.start();
          lenisRef.current.scrollTo(toTop ? 0 : target, { offset, duration: 1.4, onComplete: focusTarget });
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

  // Full-screen mobile menu: lock scroll, trap focus, close on Escape
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
    const hasLoader = !!document.querySelector('.preloader');

    gsap.to('.scroll-progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

    // Intro curtain (first visit per session), then the hero
    const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
    if (hasLoader) {
      intro
        .from('.preloader-mark', { scale: 0.6, opacity: 0, duration: 1, ease: 'expo.out' })
        .from('.preloader-name', { y: 16, opacity: 0, duration: 0.8 }, 0.35)
        .to('.preloader-inner', { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' }, 1.35)
        .to('.preloader', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, 1.55)
        .call(() => {
          try { sessionStorage.setItem('intro-seen', '1'); } catch { /* storage unavailable */ }
          setLoaderDone(true);
        });
    }
    const h = hasLoader ? 2.0 : 0.15;
    intro
      .from('.hero .eyebrow', { y: 20, opacity: 0, duration: 0.9 }, h)
      .fromTo('.portrait-frame', { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 32px 32px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 32px 32px)', duration: 1.6, ease: 'expo.inOut' }, h - 0.1)
      .from('.portrait-frame img', { scale: 1.35, duration: 2.2, ease: 'expo.out' }, h + 0.3)
      .from('.hero-arch .draw', { drawSVG: 0, duration: 2, ease: 'power2.inOut' }, h + 0.4)
      .from('.accent-swash .draw', { drawSVG: 0, duration: 1.4, ease: 'power3.inOut' }, h + 1.1)
      .from('.deco-orb', { scale: 0, opacity: 0, duration: 1.3, ease: 'back.out(1.6)' }, h + 0.9)
      .from('.hero .lead', { y: 30, opacity: 0, duration: 1.1 }, h + 0.7)
      .from('.hero-actions > *', { y: 30, opacity: 0, duration: 1, stagger: 0.1 }, h + 0.85)
      .from('.hero-meta li', { y: 16, opacity: 0, duration: 0.8, stagger: 0.08 }, h + 1)
      .from('.portrait-badge', { x: 40, opacity: 0, duration: 1.1 }, h + 1.15)
      .from('.scroll-cue', { opacity: 0, duration: 1 }, h + 1.4)
      .call(() => {
        gsap.to('.portrait-frame img', { scale: 1.07, duration: 14, ease: 'sine.inOut', repeat: -1, yoyo: true });
      });

    gsap.to('.deco-orb', { y: -16, duration: 3.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    gsap.to('.hero-portrait', {
      yPercent: -10, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    mm.add('(min-width: 901px)', () => {
      gsap.to('.hero-copy', {
        yPercent: 10, opacity: 0.25, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'center 40%', end: 'bottom top', scrub: true }
      });
    });

    // Marquee frame draws open from the centre, then text drifts (faster with scroll velocity)
    gsap.fromTo('.marquee-frame', { scaleX: 0 }, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'top 55%', scrub: true }
    });
    gsap.from('.marquee-diamond', {
      rotate: -135, scale: 0, duration: 1.2, ease: 'back.out(2)',
      scrollTrigger: { trigger: '.marquee', start: 'top 85%', once: true }
    });
    const marquee = gsap.to('.marquee-track', { xPercent: 50, duration: 42, ease: 'none', repeat: -1 });
    ScrollTrigger.create({
      trigger: '.marquee', start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => {
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 260, 4);
        gsap.to(marquee, { timeScale: boost, duration: 0.2, overwrite: true });
        gsap.to(marquee, { timeScale: 1, duration: 1.4, delay: 0.2, overwrite: false });
      }
    });

    // Generic reveal
    gsap.set('.reveal', { opacity: 0, y: 48 });
    ScrollTrigger.batch('.reveal', {
      start: 'top 90%', once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12, overwrite: true })
    });

    gsap.utils.toArray('.section-head h2').forEach((el) => {
      gsap.from(el, {
        clipPath: 'inset(0% 0% 100% 0%)', y: 34, duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
    });

    // Line art draws itself in (DrawSVG)
    gsap.utils.toArray('.line-icon, .remote-illustration, .ornament').forEach((svg) => {
      gsap.from(svg.querySelectorAll('.draw'), {
        drawSVG: 0, duration: 1.8, ease: 'power2.inOut', stagger: 0.1,
        scrollTrigger: { trigger: svg, start: 'top 88%', once: true }
      });
    });
    gsap.from('.remote-sun', {
      scale: 0, transformOrigin: '50% 50%', duration: 1.6, ease: 'expo.out',
      scrollTrigger: { trigger: '.remote-illustration', start: 'top 88%', once: true }
    });
    gsap.to('.remote-sun', { y: -7, duration: 3.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    gsap.fromTo('.band', { clipPath: 'inset(0% 5% round 40px)' }, {
      clipPath: 'inset(0% 0% round 0px)', ease: 'none',
      scrollTrigger: { trigger: '.band', start: 'top 92%', end: 'top 30%', scrub: true }
    });
    gsap.from('.band-inner > *', {
      y: 40, opacity: 0, stagger: 0.15, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.band', start: 'top 60%', once: true }
    });
    gsap.fromTo('.band-mark', { rotate: -8, scale: 0.9 }, {
      rotate: 8, scale: 1.05, ease: 'none',
      scrollTrigger: { trigger: '.band', start: 'top bottom', end: 'bottom top', scrub: true }
    });

    // Photos open like a curtain, then drift
    gsap.utils.toArray('.location-media').forEach((m) => {
      gsap.fromTo(m, { clipPath: 'inset(14% 10% 14% 10% round 28px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
        scrollTrigger: { trigger: m, start: 'top 96%', end: 'top 50%', scrub: true }
      });
      const img = m.querySelector('img');
      if (img) {
        gsap.fromTo(img, { yPercent: -7, scale: 1.18 }, {
          yPercent: 7, scale: 1.18, ease: 'none',
          scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      }
    });

    // Desktop: pin the approach section and step through the methods
    mm.add('(min-width: 1024px) and (min-height: 700px)', () => {
      const items = gsap.utils.toArray('.method');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.approach', start: 'top top+=60', end: `+=${items.length * 55}%`, pin: true, scrub: 0.6, anticipatePin: 1 }
      });
      tl.fromTo('.methods-progress span', { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: items.length }, 0);
      items.forEach((item, i) => {
        tl.fromTo(item, { opacity: 0.25, x: -30 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }, i);
      });
    });

    // Phones and tablets: methods light up as they cross the screen
    mm.add('(max-width: 1023px), (max-height: 699px)', () => {
      gsap.utils.toArray('.method').forEach((m) => {
        gsap.fromTo(m, { opacity: 0.3, scale: 0.96 }, {
          opacity: 1, scale: 1, ease: 'none',
          scrollTrigger: { trigger: m, start: 'top 90%', end: 'top 60%', scrub: true }
        });
      });
      gsap.fromTo('.methods-progress span', { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '.methods', start: 'top 80%', end: 'bottom 60%', scrub: true }
      });
    });

    // Phones: service cards stack on top of each other
    mm.add('(max-width: 767px)', () => {
      const cards = gsap.utils.toArray('.cards > li');
      cards.forEach((li, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(li.querySelector('.card'), {
          scale: 0.92, opacity: 0.6, ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 30%', scrub: true }
        });
      });
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, { scope: rootRef, dependencies: [motion], revertOnUpdate: true });

  const headerClass = ['site-header', scrolled && 'is-scrolled', headerHidden && !navOpen && 'is-hidden', navOpen && 'nav-is-open']
    .filter(Boolean).join(' ');

  return (
    <div ref={rootRef} className={motion ? 'has-motion' : 'no-motion'}>
      {loaderActive && (
        <div className="preloader" aria-hidden="true">
          <div className="preloader-inner">
            <LogoMark className="preloader-mark" />
            <p className="preloader-name">אסתר ברבי טרבלסי</p>
          </div>
        </div>
      )}
      <a className="skip-link" href="#main">דילוג לתוכן הראשי</a>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <header ref={headerRef} className={headerClass} id="top">
        <div className="container header-inner">
          <a className="brand" href="#top">
            <LogoMark className="brand-mark" />
            <span className="brand-text">
              <span className="brand-name">אסתר ברבי טרבלסי</span>
              <span className="brand-role">פסיכולוגית חינוכית מומחית</span>
            </span>
          </a>

          <button ref={toggleRef} className="nav-toggle" type="button" aria-expanded={navOpen} aria-controls="site-nav" onClick={() => setNavOpen((o) => !o)}>
            <span className="nav-toggle-bars" aria-hidden="true" />
            <span className="visually-hidden">תפריט ראשי</span>
          </button>

          <nav ref={navRef} id="site-nav" className={`site-nav${navOpen ? ' is-open' : ''}`} aria-label="ניווט ראשי">
            <ul>
              {NAV.map(([href, label], i) => (
                <li key={href} style={{ '--i': i }}>
                  <a href={href} aria-current={activeId === href.slice(1) ? 'true' : undefined}>
                    <span className="nav-num" aria-hidden="true">0{i + 1}</span>{label}
                  </a>
                </li>
              ))}
            </ul>
            <MagneticLink motion={motion && finePointer} className="btn btn-primary btn-sm" href="#contact">לשיחת היכרות</MagneticLink>
            <p className="nav-contact">
              <a href={PHONE_HREF} dir="ltr">{PHONE_TEXT}</a>
              <a href={`mailto:${EMAIL}`} dir="ltr">{EMAIL}</a>
            </p>
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
              <Eyebrow>טיפול פסיכולוגי לילדים, מתבגרים והורים</Eyebrow>
              <HeroTitle motion={motion} delay={loaderActive ? 2.1 : 0.25} />
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
              <svg className="hero-arch" viewBox="0 0 440 520" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                <path className="draw" d="M8 512V220C8 103 103 8 220 8s212 95 212 212v292" />
              </svg>
              <span className="deco-orb" aria-hidden="true" />
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
          <a className="scroll-cue" href="#about">
            <span className="visually-hidden">גלילה לתוכן</span>
            <span className="scroll-cue-line" aria-hidden="true" />
          </a>
        </section>

        {/* MARQUEE */}
        <div className="marquee" aria-hidden="true">
          <span className="marquee-frame top"><span className="marquee-diamond" /></span>
          <div className="marquee-viewport">
            <div className="marquee-track">
              {[0, 1].map((copy) => (
                <ul className="marquee-group" key={copy}>
                  {TOPICS.map((t) => <li key={t}>{t}</li>)}
                </ul>
              ))}
            </div>
          </div>
          <span className="marquee-frame bottom"><span className="marquee-diamond" /></span>
        </div>
        <p className="visually-hidden">תחומי התמודדות: {TOPICS.join(', ')}.</p>

        {/* ABOUT */}
        <section className="section" id="about" aria-labelledby="about-title">
          <div className="container about-grid">
            <div className="section-head">
              <Eyebrow num="01">קצת עליי</Eyebrow>
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
              <p className="reveal">לצד העבודה עם ילדים ובני נוער, אני מלווה הורים בתהליכי הדרכה וטיפול בהורות.</p>
              <p className="signature reveal">מוזמנים ליצור קשר – ונצא יחד למסע של התבוננות, חיבור וצמיחה.</p>
            </div>
          </div>
        </section>

        {/* STATEMENT (React Bits ScrollReveal) */}
        <section className="statement" aria-label="תפיסת עולם">
          <div className="container narrow">
            <LogoMark className="statement-mark" />
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
              <Eyebrow num="02">תחומי טיפול</Eyebrow>
              <h2 id="services-title">במה אני יכולה לעזור</h2>
              <Ornament />
            </div>
            <ul className="cards">
              {SERVICES.map((s, i) => (
                <li key={s.title} className="reveal" style={{ '--i': i }}>
                  <SpotlightCard
                    theme="light"
                    spotlightColor="#b8924a"
                    intensity={0.55}
                    spotlightSize={280}
                    borderGlow={1}
                    ambient={!finePointer}
                    className="card"
                  >
                    <span className="card-num" aria-hidden="true">0{i + 1}</span>
                    <span className="card-icon"><ServiceIcon name={s.icon} /></span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </SpotlightCard>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* APPROACH */}
        <section className="section approach" id="approach" aria-labelledby="approach-title">
          <div className="container approach-grid">
            <div className="section-head">
              <Eyebrow num="03">גישה טיפולית</Eyebrow>
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
          <LogoMark className="band-mark" />
          <div className="container band-inner">
            <Eyebrow light>ניסיון מהשטח</Eyebrow>
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
              <Eyebrow num="04">מתי מומלץ לפנות?</Eyebrow>
              <h2 id="when-title">אין צורך לחכות למשבר</h2>
              <p className="section-sub">
                טיפול פסיכולוגי מתאים לכל מי שמתמודד עם מצוקה רגשית, תסכול, קושי בהסתגלות – או רוצה לערוך שינוי
                משמעותי בחייו.
              </p>
              <Ornament />
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
              <Eyebrow num="05">איפה נפגשים</Eyebrow>
              <h2 id="locations-title">שתי קליניקות, ואפשרות לטיפול מרחוק</h2>
              <Ornament />
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
                <div className="location-media remote-visual">
                  <RemoteIllustration />
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
              <Eyebrow num="06">שאלות נפוצות</Eyebrow>
              <h2 id="faq-title">לפני שמתחילים</h2>
              <Ornament />
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
                <Eyebrow num="07">יצירת קשר</Eyebrow>
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
          <LogoMark className="footer-mark" />
          <p className="footer-cta">מוכנים להתחיל? <a href="#contact">בואו נדבר</a></p>
          <div className="footer-brand">
            <p className="brand-name">אסתר ברבי טרבלסי</p>
            <p className="brand-role">פסיכולוגית חינוכית מומחית</p>
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

      <a className={`fab-whatsapp${pastHero ? ' is-shown' : ''}`} href={WA_LINK} target="_blank" rel="noopener" aria-label="שליחת הודעה בוואטסאפ (נפתח בחלון חדש)">
        <WhatsAppIcon />
      </a>

      <div className={`mobile-cta${pastHero ? ' is-shown' : ''}`}>
        <a className="mobile-cta-main" href={WA_LINK} target="_blank" rel="noopener">
          <WhatsAppIcon />לשיחת היכרות{NEW_TAB}
        </a>
        <a className="mobile-cta-call" href={PHONE_HREF} aria-label={`חיוג ל-${PHONE_TEXT}`}>
          <PhoneIcon />
        </a>
      </div>

      <A11yWidget prefs={prefs} setPrefs={setPrefs} />
    </div>
  );
}
