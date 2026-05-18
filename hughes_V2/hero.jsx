/* global React */
const { useEffect, useRef, useState } = React;

// ---------- Layered Hero ----------
// Four real planes, stacked with elevation. Each plane has its own parallax
// amount on mousemove so depth reads even when nothing else is moving:
//   Plane 1  photo block        — top-left, deepest, smallest drift
//   Plane 2  yellow slab        — bottom-right, overlaps the photo seam
//   Plane 3  title card         — centred, biggest shadow + biggest drift
//   Plane 4  fine print mono    — top-right, weightless above everything
// Marquee sits below the stage on its own bottom plane.

const HERO_PHOTOS = [
"assets/photo_07_interventions.jpg",
"assets/photo_08_coach.jpg",
"assets/photo_09_atelier.jpg",
"assets/photo_10_conference.jpg",
"assets/photo_11_individual.jpg"];


// Verbs that pulse through the centre of the headline. Each cycle, the yellow
// accent restarts its swipe-in animation so the type feels alive without ever
// settling. All forms are 3rd-person singular so they agree with "ON".
const ROTATING_VERBS = [
"bouge",
"transpire",
"respire",
"progresse",
"gagne"];


// Crossfading stack of photos — all images mounted, only one visible at a
// time. Used inside the photo plane.
function PhotoStack({ activeIdx }) {
  return (
    <React.Fragment>
      {HERO_PHOTOS.map((src, i) =>
      <img
        key={src}
        src={src}
        alt=""
        className="hero-photo"
        style={{
          opacity: i === activeIdx ? 1 : 0,
          transform: i === activeIdx ? "scale(1)" : "scale(1.06)", padding: "0px", margin: "0px"
        }}
        draggable="false" />

      )}
    </React.Fragment>);

}

function HeroMarquee() {
  const items = [
  "BOOTCAMP",
  "TEAM BUILDING",
  "COACHING COLLECTIF",
  "ATELIERS MOBILITÉ",
  "CONFÉRENCE",
  "COACHING INDIVIDUEL",
  "ÉCHAUFFEMENT MATINAL",
  "CHALLENGE INTER-ÉQUIPES"];

  const seq = [...items, ...items];
  return (
    <div className="hero-marquee" aria-hidden="true">
      <div className="hero-marquee__track">
        {seq.map((it, i) =>
        <span key={i} className="hero-marquee__item">
            <span className="hero-marquee__dot">■</span>
            {it}
          </span>
        )}
      </div>
    </div>);

}

function Hero({ accent }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [verbIdx, setVerbIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPhotoIdx((i) => (i + 1) % HERO_PHOTOS.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setVerbIdx((i) => (i + 1) % ROTATING_VERBS.length);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  // --- Differential parallax ---------------------------------------------
  // Title drifts the most (foreground), yellow medium, photo barely. The
  // brain reads the spread as 3D depth even though everything is flat.
  const titleRef = useRef(null);
  const yellowRef = useRef(null);
  const photoRef = useRef(null);

  useEffect(() => {
    const stage = titleRef.current?.parentElement;
    if (!stage) return;

    const apply = (el, x, y, depth) => {
      if (!el) return;
      el.style.transform = `translate3d(${x * depth * -1}px, ${y * depth * -0.7}px, 0)`;
    };

    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      apply(titleRef.current, x, y, 18);
      apply(yellowRef.current, x, y, 10);
      apply(photoRef.current, x, y, 4);
    };
    const onLeave = () => {
      [titleRef, yellowRef, photoRef].forEach((r) => {
        if (r.current) r.current.style.transform = "translate3d(0,0,0)";
      });
    };
    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", onLeave);
    return () => {
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section className="hero" data-screen-label="01 Hero">
      <div className="hero__inner">

        <div className="hero__stage">
          {/* Plane 1 — big photo, top-left */}
          <div className="hero__plane hero__plane--photo" ref={photoRef}>
            <PhotoStack activeIdx={photoIdx} />
            <div className="hero__plane-photo-tag">
              <span>{String(photoIdx + 1).padStart(2, "0")}</span>
              <span className="hero__plane-photo-tag-sep">/</span>
              <span>{String(HERO_PHOTOS.length).padStart(2, "0")}</span>
            </div>
            <span className="hero__plane-photo-crosshair" />
          </div>

          {/* Plane 2 — yellow slab, bottom-right, overlaps photo seam */}
          <div
            className="hero__plane hero__plane--yellow"
            ref={yellowRef}
            style={{ background: accent }}>

            <span className="hero__plane-yellow-plus">+</span>
            <span className="hero__plane-yellow-label">HC / CW</span>
          </div>

          {/* Plane 4 — fine print, top-right, weightless */}
          <div className="hero__finemark">
            <span>50.7093° N · 4.4080° E</span>
            <span className="hero__finemark-sub">WATERLOO</span>
          </div>

          {/* Plane 3 — title card, top of stack */}
          <div className="hero__overlay" ref={titleRef}>
            <div className="hero__card">
              <div className="hero__eyebrow">
                <span className="hero__eyebrow-static">Coaching sportif en entreprise</span>
              </div>

              <h1 className="hero__title">
                <span className="hero__title-l1">ON</span>
                <span className="hero__title-l2">
                  <span className="hero__title-verb" aria-live="polite">
                    {/* Stacked rotating verbs — each occupies the same grid
                              cell so the container width snaps to the widest word
                              and the layout never reflows mid-rotation. */}
                    {ROTATING_VERBS.map((v, i) =>
                    <em
                      key={v}
                      className={`hero__title-verb-word ${i === verbIdx ? "is-active" : ""}`}>
                      
                        {v}
                      </em>
                    )}
                    {/* key={verbIdx} restarts the swipe animation on each
                              rotation, so the yellow bar re-strokes the new verb. */}
                    <span
                      key={verbIdx}
                      className="hero__title-accent"
                      style={{ background: accent }} />

                  </span>
                </span>
                <span className="hero__title-l3">ENSEMBLE<span className="hero__title-dot" style={{ color: accent }}>.</span></span>
              </h1>

              <p className="hero__sub">
                Bootcamps, team building et coaching collectif livrés à votre bureau. <strong>
Une heure</strong> pour ressouder une équipe et recharger une semaine.
              </p>

              <div className="hero__cta">
                <a href="#contact" className="btn btn--solid">
                  RÉSERVER UNE INTERVENTION
                  <span className="btn__arrow">→</span>
                </a>
                <a href="#formats" className="btn btn--ghost">
                  VOIR LES FORMATS
                </a>
              </div>
            </div>
          </div>
        </div>

        <HeroMarquee />
      </div>

      <div className="hero__corner hero__corner--bl">
        <span>SCROLL</span>
        <span className="hero__corner-arrow">↓</span>
      </div>
    </section>);
}

window.Hero = Hero;