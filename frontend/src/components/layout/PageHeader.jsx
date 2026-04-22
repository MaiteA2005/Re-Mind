import "./PageHeader.css";

function PageHeader({
  title,
  subtitle,
  variant = "default",
  action = null,
}) {
  return (
    <header className={`pageHeader ${variant === "dashboard" ? "pageHeaderDashboard" : "pageHeaderDefault"}`}>
      <div className="pageHeaderContent">
        <h1 className="pageHeaderTitle">{title}</h1>
        {subtitle && <p className="pageHeaderSubtitle">{subtitle}</p>}
      </div>

      {action && <div className="pageHeaderAction">{action}</div>}
    </header>
  );
}

export default PageHeader;