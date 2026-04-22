import Sidebar from "./Sidebar";
import PageHeader from "./PageHeader";
import "./MainLayout.css";

function MainLayout({ title, subtitle, variant = "default", action, children }) {
  return (
    <div className="layout">
      <Sidebar />

      <main className="layoutContent">
        <PageHeader
          title={title}
          subtitle={subtitle}
          variant={variant}
          action={action}
        />

        <section className="layoutBody">
          {children}
        </section>
      </main>
    </div>
  );
}

export default MainLayout;