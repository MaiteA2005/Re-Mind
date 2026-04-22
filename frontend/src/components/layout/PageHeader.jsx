import "./PageHeader.css";

function PageHeader({
  title,
  subtitle,
  variant = "default",
  action = null,
}) {
  return (
    <header className={`page-header page-header--${variant}`}>
      <div className="page-header__content">
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>

      {action && <div className="page-header__action">{action}</div>}
    </header>
  );
}

export default PageHeader;