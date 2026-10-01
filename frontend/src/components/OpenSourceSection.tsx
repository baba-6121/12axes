import { t } from '../i18n';

const CARD_ICONS = [
  <>
    <path d="M12 3 4 7v5c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V7l-8-4Z" />
    <path d="m9 12 2 2 4-4" />
  </>,
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </>,
  <>
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h10" />
  </>,
  <>
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="8" r="2.5" />
    <path d="M6 8.5v7" />
    <path d="M18 10.5c0 4-6 3-11 6" />
  </>
];

/** Result interpretation guide shown below the profile explainer. */
export function OpenSourceSection() {
  return (
    <section className="e-oss" id="codigo-aberto" aria-labelledby="oss-titulo">
      <div className="e-wrap">
        <div className="e-oss-head">
          <div>
            <p className="e-oss-eyebrow">{t.ossEyebrow}</p>
            <h2 id="oss-titulo">{t.ossTitle}</h2>
          </div>
          <p className="e-oss-lead">{t.ossLead}</p>
        </div>
        <ul className="e-oss-cards">
          {t.ossCards.map((card, index) => (
            <li className="e-oss-card" key={card.title}>
              <span className="e-oss-num">/{String(index + 1).padStart(2, '0')}</span>
              <svg className="e-oss-ico" viewBox="0 0 24 24" aria-hidden="true">
                {CARD_ICONS[index]}
              </svg>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </li>
          ))}
        </ul>
        <div className="e-oss-bar">
          <svg className="e-oss-gh" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 7v10M8.5 10.5h7M8.5 13.5h7" />
          </svg>
          <div className="e-oss-bar-txt">
            <b>{t.ossBarText}</b>
          </div>
          <div className="e-oss-actions">
            <a className="e-oss-btn e-oss-primary" href="#versoes">
              {t.ossPrimaryCta}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 17 17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </a>
            <a className="e-oss-btn e-oss-ghost" href="#como-funciona">
              {t.ossSecondaryCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
