import { t } from '../i18n';

interface SupportSectionProps {
  variant: 'home' | 'panel';
}

export function SupportSection({ variant }: SupportSectionProps) {
  const box = (
    <>
      <div>
        <p className="e-eyebrow">{t.supportEyebrow}</p>
        <h2 id="apoie-titulo">
          {t.supportTitle}
          <span className="e-accent">{t.supportTitleEm}</span>
        </h2>
        <p className="e-lead">{t.supportLead}</p>
      </div>
      <ul className="e-profile-areas">
        {t.supportAreas.map((area) => (
          <li className="e-profile-area" key={area.title}>
            <span className="e-profile-area-mark" aria-hidden="true" />
            <div>
              <strong>{area.title}</strong>
              <span>{area.text}</span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );

  if (variant === 'panel') {
    return (
      <section className="e-panel e-support-panel" id="apoie" aria-labelledby="apoie-titulo">
        <div className="e-support-box">{box}</div>
      </section>
    );
  }

  return (
    <section className="e-sec" id="apoie" aria-labelledby="apoie-titulo">
      <div className="e-wrap e-support-box">{box}</div>
    </section>
  );
}
