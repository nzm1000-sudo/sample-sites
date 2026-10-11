'use client';

import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollFloat.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollFloat = ({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
  as: Tag = 'h2',
  id
}) => {
  const containerRef = useRef(null);

  const text = typeof children === 'string' ? children : '';
  const splitText = useMemo(() => {
    let n = 0;
    return text.split(' ').map((word, w, words) => (
      <span className="word" key={w}>
        {word.split('').map((char) => (
          <span className="char" key={n++}>{char}</span>
        ))}
        {w < words.length - 1 && <span className="char">{'\u00A0'}</span>}
      </span>
    ));
  }, [text]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    const charElements = el.querySelectorAll('.char');

    const tween = gsap.fromTo(
      charElements,
      {
        willChange: 'opacity, transform',
        opacity: 0,
        yPercent: 120,
        scaleY: 2.3,
        scaleX: 0.7,
        transformOrigin: '50% 0%'
      },
      {
        duration: animationDuration,
        ease: ease,
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger: stagger,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: true
        }
      }
    );
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger]);

  return (
    <Tag ref={containerRef} id={id} className={`scroll-float ${containerClassName}`}>
      <span className="visually-hidden">{text}</span>
      <span className={`scroll-float-text ${textClassName}`} aria-hidden="true">{splitText}</span>
    </Tag>
  );
};

export default ScrollFloat;
