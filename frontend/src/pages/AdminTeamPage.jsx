import AdminLayout from "../components/admin/AdminLayout";
import "./css/AdminPage.css";

const teamMembers = [
    { initials: "EV", name: "Emma Vermand", status: "Actief", time: "2 min geleden" },
    { initials: "LJ", name: "Lars Jansen", status: "Rustig ritme", time: "1 uur geleden" },
    { initials: "SdV", name: "Sophie De Vries", status: "Actief", time: "5 min geleden" },
    { initials: "TB", name: "Tom Bakker", status: "Stabiel", time: "30 min geleden" },
    { initials: "LS", name: "Lisa Smit", status: "Actief", time: "10 min geleden" },
    { initials: "MdJ", name: "Max de Jong", status: "Rustig ritme", time: "2 uur geleden" },
    { initials: "NV", name: "Nina Visser", status: "Stabiel", time: "45 min geleden" },
    { initials: "DM", name: "Daan Mulder", status: "Actief", time: "1 min geleden" },
];

function AdminTeamPage() {
    return (
        <AdminLayout
        title="Team overzicht"
        subtitle="Krijg inzicht in het welzijn van je team"
        >
        <section className="adminStatsGrid">
            <article className="adminStatCard">
            <span>Actief</span>
            <strong>4</strong>
            </article>

            <article className="adminStatCard">
            <span>Rustig ritme</span>
            <strong>3</strong>
            </article>

            <article className="adminStatCard">
            <span>Stabiel</span>
            <strong>3</strong>
            </article>
        </section>

        <section className="adminPanel">
            <h2>Alle teamleden</h2>

            <div className="adminMemberList">
            {teamMembers.map((member) => (
                <article className="adminMemberRow" key={member.name}>
                <div className="adminAvatar">{member.initials}</div>

                <div>
                    <h3>{member.name}</h3>
                    <p>{member.status}</p>
                </div>

                <span>{member.time}</span>
                </article>
            ))}
            </div>
        </section>

        <section className="adminPrivacyBox">
            <strong>Privacy:</strong>
            <p>
            Deze overzichten zijn bedoeld om team-trends te begrijpen, niet om
            individuele prestaties te beoordelen. Alle gedetailleerde check-in data
            blijft privé voor het individu.
            </p>
        </section>
        </AdminLayout>
    );
}

export default AdminTeamPage;