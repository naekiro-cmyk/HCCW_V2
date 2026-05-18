/* global React */
const { useEffect, useRef, useState } = React;

// ---------- Animated Hero ----------
// Brutalist 8×4 square grid behind a large editorial title.
// Cells cycle through 4 photo slots; one accent (yellow) tile breathes
// and migrates around the grid. Bottom service marquee on a third plane.

const HERO_PHOTOS = [
"assets/photo_07_interventions.jpg",
"assets/photo_08_coach.jpg",
"assets/photo_09_atelier.jpg",
"assets/photo_10_conference.jpg",
"assets/photo_11_individual.jpg"];

// Words that cycle through the hero eyebrow to keep it alive.
const ROTATING_FORMATS = [
"Bootcamp",
"Team Building",
"Coaching collectif",
"Atelier mobilité",
"Conférence santé"];


// Grid is 8 cols × 5 rows. Each entry is the cell index (col-1 + (row-1)*8).
// Tiles: { id, col, row, span, kind: 'photo'|'fill'|'label'|'mono'|'accent', content }
const TILE_LAYOUT = [
// top row — system bar
{ id: "id-corner", col: 1, row: 1, span: [1, 1], kind: "label", content: "01" },
{ id: "id-coords", col: 7, row: 1, span: [2, 1], kind: "mono", content: "50.7093° N / 4.4080° E" },

// upper-left photo block (2x2)
{ id: "ph-1", col: 1, row: 2, span: [2, 2], kind: "photo", photo: 0 },

// top-right yellow accent
{ id: "ac-1", col: 7, row: 2, span: [2, 1], kind: "accent" },

// mid-right photo (1x2)
{ id: "ph-2", col: 7, row: 3, span: [2, 2], kind: "photo", photo: 1 },

// lower-left mono badge
{ id: "lb-1", col: 1, row: 4, span: [1, 1], kind: "mono", content: ["BOOTCAMP", "TEAM BUILDING", "COACHING", "CONFÉRENCE"] },

// bottom photo block (2x1)
{ id: "ph-3", col: 2, row: 4, span: [2, 1], kind: "photo", photo: 2 },

// bottom mono / system
{ id: "lb-2", col: 7, row: 5, span: [2, 1], kind: "mono", content: "INDEX // 2026" }];


function HeroTile({ tile, photoIndex, accent }) {
  const baseStyle = {
    gridColumn: `${tile.col} / span ${tile.span[0]}`,
    gridRow: `${tile.row} / span ${tile.span[1]}`,
    position: "relative",
    overflow: "hidden"
  };

  if (tile.kind === "photo") {
    return (
      <div className="hero-tile hero-tile--photo" style={baseStyle}>
        {HERO_PHOTOS.map((src, i) =>
        <img
          key={src}
          src={src}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "grayscale(1) contrast(1.05)",
            opacity: i === photoIndex ? 1 : 0,
            transform: i === photoIndex ? "scale(1)" : "scale(1.05)",
            transition: "opacity 1.2s ease, transform 6s ease-out"
          }}
          draggable="false" />

        )}
        {/* hairline frame */}
        <span className="hero-tile__crosshair hero-tile__crosshair--tl" />
        <span className="hero-tile__crosshair hero-tile__crosshair--br" />
      </div>);

  }

  if (tile.kind === "accent") {
    return (
      <div
        className="hero-tile hero-tile--accent"
        style={{
          ...baseStyle,
          background: accent
        }}>
        
        <div className="hero-tile__accent-inner">
          <div className="hero-tile__accent-num">+</div>
          <div className="hero-tile__accent-label">HC / CW</div>
        </div>
      </div>);

  }

  if (tile.kind === "label") {
    return (
      <div className="hero-tile hero-tile--label" style={baseStyle}>
        <span className="hero-tile__bigchar">{tile.content}</span>
      </div>);

  }

  if (tile.kind === "mono") {
    const isList = Array.isArray(tile.content);
    return (
      <div className={`hero-tile hero-tile--mono${isList ? " hero-tile--mono-list" : ""}`} style={baseStyle}>
        {isList ? (
          <ul className="hero-tile__list">
            {tile.content.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        ) : (
          <span>{tile.content}</span>
        )}
      </div>);

  }

  return <div className="hero-tile" style={baseStyle} />;
}

function HeroMarquee() {
  const items = [
  "BOOTCAMP",
  "TEAM BUILDING",
  "COACHING COLLECTIF",
  "ATELIERS MOBILITÉ",
  "CONFÉRENCE SANTÉ",
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
  // Rotate each photo tile through HERO_PHOTOS, offset so they never match.
  const [photoOffsets, setPhotoOffsets] = useState([0, 1, 2]);
  const [rotIdx, setRotIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPhotoOffsets((prev) => prev.map((p, i) => (p + 1) % HERO_PHOTOS.length));
    }, 4200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setRotIdx((i) => (i + 1) % ROTATING_FORMATS.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  // Compute current photo index per photo tile
  const photoTiles = TILE_LAYOUT.filter((t) => t.kind === "photo");
  const photoIndexById = {};
  photoTiles.forEach((t, i) => {
    photoIndexById[t.id] = (t.photo + photoOffsets[i % photoOffsets.length]) % HERO_PHOTOS.length;
  });

  // Parallax — small mouse-based drift for the title plane
  const titleRef = useRef(null);
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.parentElement.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `translate3d(${x * -12}px, ${y * -8}px, 0)`;
    };
    const onLeave = () => {
      el.style.transform = "translate3d(0,0,0)";
    };
    const parent = el.parentElement;
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section className="hero" data-screen-label="01 Hero">
      <div className="hero__inner">
        {/* Top system bar */}
        <div className="hero__topbar">
          <div className="hero__topbar-left">
            <span className="hero__chip">HC / CORPORATE WELLNESS</span>
            <span className="hero__chip hero__chip--ghost">EST. 2026 — WATERLOO</span>
          </div>
          <div className="hero__topbar-right">
            <a href="#formats">FORMATS</a>
            <a href="#coach">LE COACH</a>
            <a href="#process">PROCESSUS</a>
            <a href="#contact" className="hero__cta-inline">
              RÉSERVER<span className="hero__cta-arrow">→</span>
            </a>
          </div>
        </div>

        {/* ----- Stage holds grid (back) + title (front) ----- */}
        <div className="hero__stage">
          <div className="hero__grid">
            {TILE_LAYOUT.map((t) =>
            <HeroTile
              key={t.id}
              tile={t}
              photoIndex={photoIndexById[t.id] ?? 0}
              accent={accent} />

            )}
          </div>

          {/* ----- Title plane (front) ----- */}
          <div className="hero__overlay" ref={titleRef}>
            <div className="hero__card">
              <div className="hero__eyebrow">
                <span className="hero__eyebrow-static">COACHING SPORTIF</span>
                <span className="hero__eyebrow-sep">/</span>
                <span className="hero__eyebrow-rotator" aria-live="polite">
                  {ROTATING_FORMATS.map((w, i) =>
                  <span
                    key={w}
                    className={`hero__eyebrow-word ${i === rotIdx ? "is-active" : ""}`}>
                    
                      {w}
                    </span>
                  )}
                </span>
              </div>

              <h1 className="hero__title">
                <span className="hero__title-l1">BOUGEZ</span>
                <span className="hero__title-l2">
                  <em>ensemble</em>
                  <span className="hero__title-accent" style={{ background: accent }} />
                </span>
                <span className="hero__title-l3">AU TRAVAIL</span>
              </h1>

              <p className="hero__sub">Bootcamps, team building et coaching collectif animés dans vos bureaux pour des équipes plus énergiques, plus soudées, et qui transpirent ensemble.


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

        {/* ----- Marquee (back plane) ----- */}
        <HeroMarquee />
      </div>

      {/* Corner crops */}
      <div className="hero__corner hero__corner--bl">
        <span>SCROLL</span>
        <span className="hero__corner-arrow">↓</span>
      </div>
    </section>);

}

window.Hero = Hero;