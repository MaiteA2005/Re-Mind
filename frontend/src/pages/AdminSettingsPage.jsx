import { useAuth } from "../context/AuthContext";

import AdminLayout from "../components/admin/AdminLayout";
import Button from "../components/base/Button";
import "./css/AdminPage.css";

function AdminSettingsPage() {
    const { user } = useAuth();

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    const businessName = user?.businessName || storedUser?.businessName || "Bedrijf";
    const adminEmail = user?.email || storedUser?.email || "Email";

    return (
        <AdminLayout
        title="Instellingen"
        subtitle="Krijg inzicht in het welzijn van je team"
        >
        <div className="adminSettingsStack">
            <section className="adminSettingsCard">
            <h2>Team instellingen</h2>

            <label>
                Bedrijfsnaam
                <input 
                    type="text" 
                    value={businessName} 
                    readOnly
                />
            </label>

            <label>
                Admin email
                <input 
                    type="email" 
                    value={adminEmail} 
                    readOnly
                />
            </label>
            </section>

            <section className="adminSettingsCard">
            <h2>Werkuren instellen</h2>
            <p>
                Stel de standaard werkuren in voor je team. Deze worden gebruikt
                voor pauze suggesties en inzichten.
            </p>

            <div className="adminTwoColumns">
                <label>
                Start werkdag
                <input type="time" />
                </label>

                <label>
                Einde werkdag
                <input type="time" />
                </label>
            </div>
            </section>

            <section className="adminSettingsCard">
            <h2>Pauze suggesties aanpassen</h2>
            <p>
                Stel in hoe vaak Re:Mind pauze suggesties moet doen. Dit is een
                zachte herinnering, geen verplichting.
            </p>

            <label>
                Pauze frequentie
                <input type="text" placeholder= "[hoeveelheid/uur]" />
            </label>
            </section>

            <section className="adminSettingsCard">
            <h2>Medewerkers beheren</h2>
            <p>
                Voeg nieuwe teamleden toe of verwijder toegang voor vertrokken
                medewerkers.
            </p>

            <div className="adminButtonRow">
                <Button variant="primary">Medewerker uitnodigen</Button>
                <Button variant="danger">Medewerker verwijderen</Button>
            </div>

            <div className="adminInfoBox">
                Je hebt momenteel <strong>12 actieve teamleden</strong> in je licentie.
            </div>
            </section>

            <section className="adminSettingsCard">
            <h2>Notificaties</h2>
            <p>Ontvang zachte notificaties over team trends en inzichten.</p>

            <label className="adminCheckbox">
                <input type="checkbox" defaultChecked />
                Wekelijkse team samenvatting
            </label>

            <label className="adminCheckbox">
                <input type="checkbox" />
                Maandelijks inzichten rapport
            </label>

            <label className="adminCheckbox">
                <input type="checkbox" />
                Belangrijke trend meldingen
            </label>
            </section>

            <Button variant="primary">Instellingen opslaan</Button>

            <section className="adminPrivacyBox">
            <strong>Privacy:</strong>
            <p>
                Re:Mind respecteert de privacy van je teamleden. Individuele
                check-in data en persoonlijke inzichten blijven altijd privé.
                Alleen geaggregeerde team-trends zijn zichtbaar in het admin dashboard.
            </p>
            </section>
        </div>
        </AdminLayout>
    );
}

export default AdminSettingsPage;