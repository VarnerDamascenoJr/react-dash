import type { PageIntroProps } from './common.types';

export default function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <section className="pageIntro">
      <div>
        <span className="pageIntro__eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <p>{description}</p>
    </section>
  );
}
