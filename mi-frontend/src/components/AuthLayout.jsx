export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth">
      <aside className="auth-art" aria-hidden="true">
        <p className="auth-brand">Taller Masc</p>
        <svg className="pulse" viewBox="0 0 600 120" preserveAspectRatio="none">
          <path pathLength="1" d="M0 60 H170 L195 60 L215 18 L245 104 L270 36 L290 60 H600" />
        </svg>
        <p className="auth-claim">Cada mascota, su historia clínica al día.</p>
      </aside>
      <section className="auth-form">
        <div className="auth-box">
          <h1>{title}</h1>
          {subtitle && <p className="muted">{subtitle}</p>}
          {children}
        </div>
      </section>
    </div>
  );
}
