import Sidebar from "./Sidebar";
import PageHeader from "./PageHeader";
import "./MainLayout.css";

function MainLayout({ title, subtitle, variant = "default", action, children }) {
  return (
    <div className="layout">
      <Sidebar />

      <main className="layoutContent">
        <div className="mainHeader">
          <PageHeader
            title={title}
            subtitle={subtitle}
            variant={variant}
            action={action}
          />
        </div>


        <div className="mainBody">
          {children}
        </div>
      </main>
    </div>
  );
}

export default MainLayout;