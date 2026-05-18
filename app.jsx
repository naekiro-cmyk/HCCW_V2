/* global React, Hero, TweaksPanel, useTweaks, TweakSection, TweakColor */
const { useEffect, useRef, useState } = React;

// ============== SITE HEADER (sticky) ==============
// Persistent top bar across the whole site: logo + name + section nav + CTA.
// Compacts on scroll. Mobile collapses the chapter links and keeps the CTA.
const NAV_LINKS = [
{ href: "#manifeste", label: "Constat" },
{ href: "#formats", label: "Formats" },
{ href: "#coach", label: "Le coach" },
{ href: "#process", label: "Processus" }];


function SiteHeader({ accent }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on link click
  const onLink = () => setMenuOpen(false);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`} data-screen-label="00 Header" style={{ opacity: "1", backgroundColor: "rgb(14, 14, 16)" }}>
      <div className="site-header__inner">
        <a href="#top" className="site-header__brand" onClick={onLink}>
          <span className="site-header__logo">
            <img src={window.__resources.headerLogo} alt="" draggable="false" />
          </span>
          <span className="site-header__name" style={{ fontSize: "20px" }}>HC Corporate Wellness</span>
        </a>

        <nav className="site-header__nav">
          {NAV_LINKS.map((l) =>
          <a key={l.href} href={l.href}>{l.label}</a>
          )}
        </nav>

        <a href="#contact" className="site-header__cta" style={{ background: accent }}>
          Réserver
          <span className="site-header__cta-arrow">→</span>
        </a>

        {/* Mobile burger — only shown on narrow viewports via CSS */}
        <button
          type="button"
          className={`site-header__burger ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={menuOpen}>
          
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`site-header__drawer ${menuOpen ? "is-open" : ""}`}>
        <nav className="site-header__drawer-nav">
          {NAV_LINKS.map((l) =>
          <a key={l.href} href={l.href} onClick={onLink}>{l.label}</a>
          )}
          <a href="#contact" className="site-header__drawer-cta" onClick={onLink} style={{ background: accent }}>
            Réserver une intervention →
          </a>
        </nav>
      </div>
    </header>);

}

// ============== SECTION: MANIFESTO ==============
function Manifesto() {
  return (
    <section className="bloc bloc--manifesto" id="manifeste" data-screen-label="02 Manifeste">
      <div className="wrap">
        <div className="h-eyebrow">
          <span className="h-eyebrow__num">02</span>
          <span className="h-eyebrow__dash" />
          <span>Constat</span>
        </div>

        <div className="manif__grid">
          <div className="manif__text">
            <h2 className="display-xl">
               <em></em> Fatigue, stress, hyper-connexion
              <br />
              <span className="display-xl__heavy">vos équipes traversent une période exigeante</span>
            </h2>
            <p className="lede">
              Vos collaborateurs passent en moyenne <strong>7h41 assis</strong> par jour. Les
              webinaires sur la méditation ne changeront pas ça. Le sport, si.
            </p>
          </div>

          <div className="manif__stats">
            <Stat n="83%" label="se disent stressés au bureau" src="OMS · 2024" />
            <Stat n="7h41" label="sédentarité moyenne / jour" src="INSERM" />
            <Stat n="+27%" label="d'énergie après 8 séances" src="HCCW · Étude clients" />
            <Stat n="–41%" label="d'absentéisme moyen" src="Harvard Business Review" />
          </div>
        </div>
      </div>
    </section>);

}

function Stat({ n, label, src }) {
  return (
    <div className="stat">
      <div className="stat__n">{n}</div>
      <div className="stat__label">{label}</div>
      <div className="stat__src">↗ {src}</div>
    </div>);

}

// ============== SECTION: FORMATS ==============
const FORMATS = [
{
  id: "F01",
  name: "Bootcamp",
  duration: "45 min",
  intensity: "Élevée",
  size: "10–40 pers.",
  desc: "Circuit training cardio + renfo, au pied de vos bureaux ou en extérieur. Le format signature pour réveiller une équipe.",
  tag: "LE PLUS DEMANDÉ"
},
{
  id: "F02",
  name: "Team Building Sport",
  duration: "2h",
  intensity: "Modérée",
  size: "20–80 pers.",
  desc: "Tournois, challenges inter-équipes et épreuves chronométrées. Sport + stratégie + cohésion, sur une demi-journée."
},
{
  id: "F03",
  name: "Coaching Collectif",
  duration: "60 min / hebdo",
  intensity: "Adaptée",
  size: "8–20 pers.",
  desc: "Programme suivi sur 8 à 12 semaines. Séances régulières, progression mesurée, esprit d'équipe construit dans la durée."
},
{
  id: "F04",
  name: "Atelier Mobilité",
  duration: "30 min",
  intensity: "Douce",
  size: "5–25 pers.",
  desc: "Mobilité, étirements et posture pour les métiers de bureau. À glisser entre deux réunions."
},
{
  id: "F05",
  name: "Conférence Santé",
  duration: "1h",
  intensity: "—",
  size: "30–300 pers.",
  desc: "Sommeil, nutrition de l'effort, gestion de la fatigue. Une intervention claire, applicable, sans slide ennuyeuse."
},
{
  id: "F06",
  name: "Coaching Individuel",
  duration: "Sur mesure",
  intensity: "Sur mesure",
  size: "1 pers.",
  desc: "Accompagnement pour vos dirigeants ou cadres clés. Suivi physique, mental et nutritionnel personnalisé."
}];


function Formats({ accent }) {
  const [hover, setHover] = useState(null);
  return (
    <section className="bloc bloc--formats" id="formats" data-screen-label="03 Formats">
      <div className="wrap">
        <div className="formats__head">
          <div>
            <div className="h-eyebrow">
              <span className="h-eyebrow__num">03</span>
              <span className="h-eyebrow__dash" />
              <span>Formats d'intervention</span>
            </div>
            <h2 className="display-xl">
              Six manières
              <br />
              <span className="display-xl__heavy">de les remettre en mouvement.</span>
            </h2>
          </div>
          <p className="formats__lede">
            Chaque format est ajusté à vos contraintes : taille d'équipe, niveau, créneau, espace
            disponible. Pas de salle de sport ? On vient avec le matériel.
          </p>
        </div>

        <div className="formats__table" onMouseLeave={() => setHover(null)}>
          {FORMATS.map((f, i) =>
          <div
            key={f.id}
            className={`fmt-row ${hover === i ? "is-hover" : ""}`}
            onMouseEnter={() => setHover(i)}>
            
              <div className="fmt-row__id">{f.id}</div>
              <div className="fmt-row__main">
                <div className="fmt-row__top">
                  <h3 className="fmt-row__name">
                    {f.name}
                    {f.tag &&
                  <span className="fmt-row__pin" style={{ background: accent }}>
                        {f.tag}
                      </span>
                  }
                  </h3>
                  <div className="fmt-row__meta">
                    <span>{f.duration}</span>
                    <span className="dot">•</span>
                    <span>{f.size}</span>
                    <span className="dot">•</span>
                    <span>Intensité {f.intensity}</span>
                  </div>
                </div>
                <p className="fmt-row__desc">{f.desc}</p>
              </div>
              <div className="fmt-row__arrow" style={{ color: hover === i ? accent : undefined }}>
                →
              </div>
            </div>
          )}
        </div>

        {/* "À noter" — anti-package note. Reframes the format list as
                   starting points rather than fixed menu items, and sends users to
                   the audit CTA. Sits flush with the table so it reads as the
                   table's epilogue, not a new section. */}
        <aside className="formats__note">
          <div className="formats__note-tag">
            <span className="formats__note-tag-bar" style={{ background: accent }} />
            <span>À noter</span>
          </div>
          <div className="formats__note-body">
            <p className="formats__note-lead">
              Un seul format ne convient pas à toutes les équipes.
            </p>
            <p className="formats__note-text">
              Le bon point de départ, c'est un échange de <strong>30 minutes</strong> pour
              cerner le contexte, les enjeux et la maturité de vos équipes,
              avant de proposer quoi que ce soit.
            </p>
            <a href="#contact" className="btn btn--solid formats__note-cta">
              PRENDRE 30 MINUTES
              <span className="btn__arrow">→</span>
            </a>
          </div>
        </aside>
      </div>
    </section>);

}

// ============== SECTION: COACH ==============
function Coach({ accent }) {
  return (
    <section className="bloc bloc--coach bloc--dark" id="coach" data-screen-label="04 Coach">
      <div className="wrap">
        <div className="coach__grid">
          <div className="coach__media-wrap">
            <div className="coach__media">
              <img src={window.__resources.coachPhoto} alt="Le coach HC" className="coach__img" />
              <div className="coach__media-tag" style={{ background: accent }}>
                <span>HC|CW</span>
              </div>

              <div className="coach__media-meta">
                <div>
                  <span className="mono-label">FONDATEUR</span>
                  <span className="coach__media-name">Hughes Clara</span>
                </div>
                <div>
                  <span className="mono-label">EXP.</span>
                  <span className="coach__media-name">12 ans</span>
                </div>
              </div>
            </div>

            {/* EREPS certification stamp — sibling of photo (not clipped) */}
            <div className="coach__ereps" title="Certifié EREPS EQF Level 4 — Personal Trainer">
              <img src={window.__resources.erepsBadge} alt="EREPS EQF Level 4 — Personal Trainer" />
            </div>
          </div>

          <div className="coach__text">
            <div className="h-eyebrow h-eyebrow--inv">
              <span className="h-eyebrow__num">04</span>
              <span className="h-eyebrow__dash" />
              <span>Le coach</span>
            </div>
            <h2 className="display-xl display-xl--inv">
              Pas un consultant.
              <br />
              <span className="display-xl__heavy">
                Un <em style={{ color: accent }}>coach sportif</em>.
              </span>
            </h2>

            <p className="coach__quote">
              « Le bien-être en entreprise, ça ne se règle pas avec une appli. Ça se règle en
              faisant transpirer les équipes ensemble — et en les voyant revenir le lundi
              suivant. »
            </p>

            <ul className="coach__creds">
              <li>
                <span className="mono-label">CERTIFIÉ</span>
                <span>
                  <strong>EREPS — EQF Level 4 · Personal Trainer</strong>
                  <span className="coach__creds-sub">
                    Registre européen des professionnels du sport
                  </span>
                </span>
              </li>
              <li>
                <span className="mono-label">FORMÉ</span>
                <span>Préparation physique · Coaching collectif · Nutrition de l'effort</span>
              </li>
              <li>
                <span className="mono-label">EXPÉRIENCE</span>
                <span>
                  <strong>12 ans de coaching sportif</strong>
                  <span className="coach__creds-sub">DÉSORMAIS EN ENTREPRISE

                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>);

}

// ============== SECTION: PROCESS ==============
const STEPS = [
{
  n: "01",
  title: "Audit",
  sub: "30 min · gratuit",
  body: "On parle de vos équipes, vos locaux, vos contraintes. Sans engagement."
},
{
  n: "02",
  title: "Programme",
  sub: "Sur-mesure",
  body: "Format(s), créneaux et progression. Un devis clair, en deux pages."
},
{
  n: "03",
  title: "Intervention",
  sub: "Chez vous",
  body: "Le coach et son matériel arrivent. Les équipes se changent. Ça commence."
},
{
  n: "04",
  title: "Bilan",
  sub: "Après 8 séances",
  body: "Rapport d'énergie, présence, retours équipe. On ajuste pour la suite."
}];


function Process({ accent }) {
  return (
    <section className="bloc bloc--process" id="process" data-screen-label="05 Process">
      <div className="wrap">
        <div className="h-eyebrow">
          <span className="h-eyebrow__num">05</span>
          <span className="h-eyebrow__dash" />
          <span>Le processus</span>
        </div>
        <h2 className="display-xl process__title">
          De l'appel à la première séance,
          <br />
          <span className="display-xl__heavy">moins de 10 jours.</span>
        </h2>

        <div className="process__grid">
          {STEPS.map((s, i) =>
          <div key={s.n} className="step">
              <div className="step__head">
                <span className="step__n">{s.n}</span>
                <span className="step__dot" style={{ background: accent }} />
              </div>
              <h3 className="step__title">{s.title}</h3>
              <div className="step__sub">{s.sub}</div>
              <p className="step__body">{s.body}</p>
              {i < STEPS.length - 1 && <span className="step__connector">→</span>}
            </div>
          )}
        </div>
      </div>
    </section>);

}

// ============== SECTION: PROOF / CLIENTS ==============
// Plain typographic client wall — names only, on a tight grid. Cleaner and
// more editorial than fading real logos behind text.
const CLIENTS = [
"Le Pain quotidien",
"Isoproject",
"Engie",
"Proximus",
"Belfius",
"Smals",
"ERA",
"Bpost"];


function Proof() {
  return (
    <section className="bloc bloc--proof" data-screen-label="06 Proof">
      <div className="wrap">
        <div className="proof__head">
          <span className="mono-label">CLIENTS QUI ONT TRANSPIRÉ AVEC NOUS</span>
          <span className="proof__count">{String(CLIENTS.length).padStart(3, "0")}</span>
        </div>
        <div className="proof__grid">
          {CLIENTS.map((name) =>
          <div key={name} className="proof__cell">
              <span className="proof__name">{name}</span>
            </div>
          )}
        </div>
      </div>
    </section>);

}

// ============== SECTION: CONTACT ==============
function Contact({ accent }) {
  const [form, setForm] = useState({ name: "", company: "", email: "", size: "20–50", format: "Bootcamp", message: "" });
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section className="bloc bloc--contact bloc--dark" id="contact" data-screen-label="07 Contact">
      <div className="wrap">
        <div className="contact__grid">
          <div className="contact__left">
            <div className="h-eyebrow h-eyebrow--inv">
              <span className="h-eyebrow__num">07</span>
              <span className="h-eyebrow__dash" />
              <span>Contact</span>
            </div>
            <h2 className="display-xxl">
              On <em style={{ color: accent }}>réserve</em>
              <br />
              une intervention<span style={{ color: accent }}>.</span>
            </h2>
            <p className="contact__lede">
              Décrivez vos équipes et vos contraintes — on vous rappelle sous 24h pour un audit
              gratuit de 30 minutes.
            </p>

            <div className="contact__meta">
              <div>
                <span className="mono-label">EMAIL</span>
                <a href="mailto:hello@hccw.be">hello@hccw.be</a>
              </div>
              <div>
                <span className="mono-label">TÉL.</span>
                <a href="tel:+32488123456">+32 488 12 34 56</a>
              </div>
              <div>
                <span className="mono-label">BASE</span>
                <span>Waterloo</span>
              </div>
              <div>
                <span className="mono-label">DISPO</span>
                <span>Bruxelles & Brabant Wallon</span>
              </div>
            </div>
          </div>

          <form className="contact__form" onSubmit={onSubmit}>
            <div className="field">
              <label>Prénom &amp; nom</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Marie Dupont" />
              
            </div>
            <div className="field">
              <label>Entreprise</label>
              <input
                required
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Acme SA" />
              
            </div>
            <div className="field">
              <label>Email pro</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="marie@acme.be" />
              
            </div>
            <div className="field-row">
              <div className="field">
                <label>Taille équipe</label>
                <select value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}>
                  <option>5–20</option>
                  <option>20–50</option>
                  <option>50–100</option>
                  <option>100+</option>
                </select>
              </div>
              <div className="field">
                <label>Format envisagé</label>
                <select value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })}>
                  <option>Bootcamp</option>
                  <option>Team Building Sport</option>
                  <option>Coaching Collectif</option>
                  <option>Atelier Mobilité</option>
                  <option>Conférence Santé</option>
                  <option>Je ne sais pas encore</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Contexte (optionnel)</label>
              <textarea
                rows="3"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Vos objectifs, vos contraintes, vos créneaux préférés…" />
              
            </div>

            <button type="submit" className="btn btn--solid btn--lg" style={{ background: accent, borderColor: accent, color: "#0E0E10" }}>
              {sent ? "ENVOYÉ — ON VOUS RAPPELLE ✓" : "DEMANDER UN AUDIT GRATUIT →"}
            </button>
          </form>
        </div>

        <footer className="footer">
          <div className="footer__left">
            <img src={window.__resources.footerLogo} alt="HC" className="footer__logo" />
            <div>
              <div className="footer__brand">HC Corporate Wellness</div>
              <div className="footer__sub">COACHING SPORTIF EN ENTREPRISE</div>
            </div>
          </div>
          <div className="footer__right">
            <span>© 2026 HC CW</span>
            <span>·</span>
            <a href="#">Mentions légales</a>
            <span>·</span>
            <a href="#">Politique de confidentialité</a>
          </div>
        </footer>
      </div>
    </section>);

}

// ============== APP ROOT ==============
const ACCENT_OPTIONS = [
"#FDD947", // Signature yellow
"#C8FA50", // Lime
"#FF5A1F", // Orange brut
"#3B82F6" // Electric blue
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#FDD947"
} /*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Reveal on scroll
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const accent = tweaks.accent;

  return (
    <>
      <SiteHeader accent={accent} />
      <Hero accent={accent} />
      <Manifesto />
      <Formats accent={accent} />
      <Coach accent={accent} />
      <Process accent={accent} />
      <Proof />
      <Contact accent={accent} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Couleur d'accent">
          <TweakColor
            label="Accent"
            value={tweaks.accent}
            onChange={(v) => setTweak("accent", v)}
            options={ACCENT_OPTIONS} />
          
          <p style={{ fontSize: 12, color: "rgba(0,0,0,.55)", marginTop: 8, lineHeight: 1.5 }}>
            La couleur d'accent imprègne les titres, badges, CTA et marqueurs sur tout le site —
            sans toucher au noir & blanc dominant.
          </p>
        </TweakSection>
      </TweaksPanel>
    </>);

}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);