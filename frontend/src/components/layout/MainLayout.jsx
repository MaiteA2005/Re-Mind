import Sidebar from "./Sidebar";
import PageHeader from "./PageHeader";
import "./MainLayout.css";

function MainLayout({ title, subtitle, action, children }) {
  return (
    <div className="layout">
      <Sidebar />

      <main className="layout__content">
        <PageHeader
          title={title}
          subtitle={subtitle}
          action={action}
        />

        <section className="layout__body">
          {children}
        </section>
      </main>
    </div>
  );
}

export default MainLayout;