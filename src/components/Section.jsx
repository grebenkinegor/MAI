import './Section.css'

function Section({ id, title, subtitle, children, variant = 'light' }) {
  return (
    <section id={id} className={`section section-${variant}`}>
      <div className="section-content">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        <div className="section-body">
          {children}
        </div>
      </div>
    </section>
  );
}

export default Section;
