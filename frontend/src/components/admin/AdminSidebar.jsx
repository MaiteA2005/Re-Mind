import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import logo from "../../assets/logo_groen.svg";

// zwarte icons
import teamBlack from "../../assets/icons_zwart/team_zwart.svg";
import instellingenBlack from "../../assets/icons_zwart/instellingen_zwart.svg";
import pijlLinksBlack from "../../assets/icons_zwart/pijl_links_zwart.svg";

// witte icons
import teamWhite from "../../assets/icons_wit/team_wit.svg";
import instellingenWhite from "../../assets/icons_wit/instellingen_wit.svg";
import pijlLinksWhite from "../../assets/icons_wit/pijl_links_wit.svg";

function AdminSidebar() {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const businessName =
    user?.businessName ||
    JSON.parse(localStorage.getItem("user") || "{}")?.businessName ||
    "Bedrijf";

    return (
        <aside className="adminSidebar">
        <div className="adminSidebarTop">
            <img src={logo} alt="Re:Mind" className="adminSidebarLogo" />
            <p>{businessName}</p>

            <nav className="adminSidebarNav">
            <NavLink to="/admin/team">
                {({ isActive }) => (
                <>
                    <img src={isActive ? teamWhite : teamBlack} alt="" />
                    Team
                </>
                )}
            </NavLink>

            <NavLink to="/admin/settings">
                {({ isActive }) => (
                <>
                    <img
                    src={isActive ? instellingenWhite : instellingenBlack}
                    alt=""
                    />
                    Instellingen
                </>
                )}
            </NavLink>
            </nav>
        </div>

        <button
            type="button"
            className="adminBackToApp"
            onClick={() => navigate("/dashboard")}
        >
            <img src={pijlLinksBlack} alt="" />
            Naar gebruikersapp
        </button>
        </aside>
    );
}

export default AdminSidebar;