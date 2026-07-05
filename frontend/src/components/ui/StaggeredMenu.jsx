import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './StaggeredMenu.css';

export const StaggeredMenu = ({
  position              = 'right',
  colors                = ['#23263A', '#6366f1'],
  items                 = [],
  socialItems           = [],
  displaySocials        = true,
  displayItemNumbering  = true,
  className,
  logoText              = 'Workforce.io',
  menuButtonColor       = '#c7d1db',
  openMenuButtonColor   = '#c7d1db',
  accentColor           = '#6366f1',
  changeMenuColorOnOpen = true,
  isFixed               = false,
  closeOnClickAway      = true,
  onMenuOpen,
  onMenuClose,
}) => {
  const navigate = useNavigate();

  const [open, setOpen]           = useState(false);
  const openRef                   = useRef(false);
  const panelRef                  = useRef(null);
  const preLayersRef              = useRef(null);
  const preLayerElsRef            = useRef([]);
  const plusHRef                  = useRef(null);
  const plusVRef                  = useRef(null);
  const iconRef                   = useRef(null);
  const textInnerRef              = useRef(null);
  const textWrapRef               = useRef(null);
  const [textLines, setTextLines] = useState(['Menu', 'Close']);
  const openTlRef                 = useRef(null);
  const closeTweenRef             = useRef(null);
  const spinTweenRef              = useRef(null);
  const textCycleAnimRef          = useRef(null);
  const colorTweenRef             = useRef(null);
  const toggleBtnRef              = useRef(null);
  const busyRef                   = useRef(false);
  const itemEntranceTweenRef      = useRef(null);

  // ── Initial GSAP setup ──────────────────────────────────────
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel      = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH      = plusHRef.current;
      const plusV      = plusVRef.current;
      const icon       = iconRef.current;
      const textInner  = textInnerRef.current;
      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      const preLayers = preContainer
        ? Array.from(preContainer.querySelectorAll('.sm-prelayer'))
        : [];
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
      if (preContainer) gsap.set(preContainer, { xPercent: 0, opacity: 1 });
      gsap.set(plusH,      { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusV,      { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon,       { rotate: 0, transformOrigin: '50% 50%' });
      gsap.set(textInner,  { yPercent: 0 });
      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  // ── Build open timeline ─────────────────────────────────────
  const buildOpenTimeline = useCallback(() => {
    const panel  = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;
    openTlRef.current?.kill();
    closeTweenRef.current?.kill();
    closeTweenRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const itemEls     = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const numberEls   = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
    const offscreen   = position === 'left' ? -100 : 100;

    if (itemEls.length)   gsap.set(itemEls,   { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 });
    if (socialTitle)      gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layers.forEach((el, i) => {
      tl.fromTo(el,
        { xPercent: offscreen },
        { xPercent: 0, duration: 0.5, ease: 'power4.out' },
        i * 0.07
      );
    });

    const lastTime       = layers.length ? (layers.length - 1) * 0.07 : 0;
    const panelStart     = lastTime + (layers.length ? 0.08 : 0);
    const panelDuration  = 0.65;

    tl.fromTo(panel,
      { xPercent: offscreen },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelStart
    );

    if (itemEls.length) {
      const itemsStart = panelStart + panelDuration * 0.15;
      tl.to(itemEls, {
        yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out',
        stagger: { each: 0.1, from: 'start' },
      }, itemsStart);
      if (numberEls.length) {
        tl.to(numberEls, {
          duration: 0.6, ease: 'power2.out', '--sm-num-opacity': 1,
          stagger: { each: 0.08, from: 'start' },
        }, itemsStart + 0.1);
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelStart + panelDuration * 0.4;
      if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
      if (socialLinks.length) {
        tl.to(socialLinks, {
          y: 0, opacity: 1, duration: 0.55, ease: 'power3.out',
          stagger: { each: 0.08, from: 'start' },
          onComplete: () => gsap.set(socialLinks, { clearProps: 'opacity' }),
        }, socialsStart + 0.04);
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => { busyRef.current = false; });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();
    const panel  = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;
    const offscreen = position === 'left' ? -100 : 100;
    closeTweenRef.current?.kill();
    closeTweenRef.current = gsap.to([...layers, panel], {
      xPercent: offscreen, duration: 0.32, ease: 'power3.in', overwrite: 'auto',
      onComplete: () => {
        const itemEls     = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        const numberEls   = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        const socialTitle = panel.querySelector('.sm-socials-title');
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
        if (itemEls.length)     gsap.set(itemEls,   { yPercent: 140, rotate: 10 });
        if (numberEls.length)   gsap.set(numberEls, { '--sm-num-opacity': 0 });
        if (socialTitle)        gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
        busyRef.current = false;
      },
    });
  }, [position]);

  const animateIcon = useCallback(opening => {
    const icon = iconRef.current;
    if (!icon) return;
    spinTweenRef.current?.kill();
    spinTweenRef.current = gsap.to(icon, {
      rotate:   opening ? 225 : 0,
      duration: opening ? 0.8 : 0.35,
      ease:     opening ? 'power4.out' : 'power3.inOut',
      overwrite: 'auto',
    });
  }, []);

  const animateColor = useCallback(opening => {
    const btn = toggleBtnRef.current;
    if (!btn) return;
    colorTweenRef.current?.kill();
    if (changeMenuColorOnOpen) {
      colorTweenRef.current = gsap.to(btn, {
        color: opening ? openMenuButtonColor : menuButtonColor,
        delay: 0.18, duration: 0.3, ease: 'power2.out',
      });
    } else {
      gsap.set(btn, { color: menuButtonColor });
    }
  }, [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]);

  const animateText = useCallback(opening => {
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();
    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel  = opening ? 'Close' : 'Menu';
    const cycles = 3;
    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);
    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });
    const finalShift = ((seq.length - 1) / seq.length) * 100;
    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift, duration: 0.5 + seq.length * 0.07, ease: 'power4.out',
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);
    if (target) { onMenuOpen?.();  playOpen();  }
    else        { onMenuClose?.(); playClose(); }
    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  const closeMenu = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setOpen(false);
    onMenuClose?.();
    playClose();
    animateIcon(false);
    animateColor(false);
    animateText(false);
  }, [playClose, animateIcon, animateColor, animateText, onMenuClose]);

  // Click-away listener
  React.useEffect(() => {
    if (!closeOnClickAway || !open) return;
    const handleClickOutside = e => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        toggleBtnRef.current && !toggleBtnRef.current.contains(e.target)
      ) closeMenu();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeOnClickAway, open, closeMenu]);

  // ── Navigate helper ─────────────────────────────────────────
  function handleItemClick(e, path) {
    e.preventDefault();
    closeMenu();
    // Small delay so the close animation starts before route change
    setTimeout(() => navigate(path), 120);
  }

  // ── Colour layers ───────────────────────────────────────────
  const rawColors = colors && colors.length ? colors.slice(0, 4) : ['#23263A', '#6366f1'];
  let layerColors = [...rawColors];
  if (layerColors.length >= 3) {
    const mid = Math.floor(layerColors.length / 2);
    layerColors.splice(mid, 1);
  }

  return (
    <div
      className={`${className ? className + ' ' : ''}staggered-menu-wrapper${isFixed ? ' fixed-wrapper' : ''}`}
      style={accentColor ? { '--sm-accent': accentColor } : undefined}
      data-position={position}
      data-open={open || undefined}
    >
      {/* ── Staggered under-layers ── */}
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {layerColors.map((c, i) => (
          <div key={i} className="sm-prelayer" style={{ background: c }} />
        ))}
      </div>

      {/* ── Toggle button (sits in the header row rendered by Topbar) ── */}
      <button
        ref={toggleBtnRef}
        className="sm-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="staggered-menu-panel"
        onClick={toggleMenu}
        type="button"
      >
        <span ref={textWrapRef} className="sm-toggle-textWrap" aria-hidden="true">
          <span ref={textInnerRef} className="sm-toggle-textInner">
            {textLines.map((l, i) => (
              <span className="sm-toggle-line" key={i}>{l}</span>
            ))}
          </span>
        </span>
        <span ref={iconRef} className="sm-icon" aria-hidden="true">
          <span ref={plusHRef} className="sm-icon-line" />
          <span ref={plusVRef} className="sm-icon-line" />
        </span>
      </button>

      {/* ── Slide-in panel ── */}
      <aside
        id="staggered-menu-panel"
        ref={panelRef}
        className="staggered-menu-panel"
        aria-hidden={!open}
      >
        {/* Brand in panel */}
        <div className="sm-panel-brand">
          <div className="sm-panel-brand__icon">W</div>
          <span className="sm-panel-brand__name">{logoText}</span>
        </div>

        <div className="sm-panel-inner">
          <ul
            className="sm-panel-list"
            role="list"
            data-numbering={displayItemNumbering || undefined}
          >
            {items.length > 0 ? (
              items.map((it, idx) => (
                <li className="sm-panel-itemWrap" key={it.label + idx}>
                  <a
                    className="sm-panel-item"
                    href={it.link}
                    aria-label={it.ariaLabel}
                    data-index={idx + 1}
                    onClick={(e) => handleItemClick(e, it.link)}
                  >
                    <span className="sm-panel-itemLabel">{it.label}</span>
                  </a>
                </li>
              ))
            ) : (
              <li className="sm-panel-itemWrap" aria-hidden="true">
                <span className="sm-panel-item">
                  <span className="sm-panel-itemLabel">No items</span>
                </span>
              </li>
            )}
          </ul>

          {displaySocials && socialItems.length > 0 && (
            <div className="sm-socials" aria-label="Social links">
              <h3 className="sm-socials-title">Socials</h3>
              <ul className="sm-socials-list" role="list">
                {socialItems.map((s, i) => (
                  <li key={s.label + i} className="sm-socials-item">
                    <a
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sm-socials-link"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default StaggeredMenu;
