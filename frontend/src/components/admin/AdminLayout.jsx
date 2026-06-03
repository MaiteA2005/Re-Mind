import AdminSidebar from "./AdminSidebar";
import "../../pages/css/AdminPage.css";

function AdminLayout({ title, subtitle, children }) {
    return (
        <div className="adminShell">
        <AdminSidebar />

        <main className="adminMain">
            <header className="adminHeader">
            <h1>{title}</h1>
            <p>{subtitle}</p>
            </header>

            <div className="adminContent">{children}</div>
        </main>
        </div>
    );
}

export default AdminLayout;