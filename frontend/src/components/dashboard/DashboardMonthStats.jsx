import inzichtenIcon from "../../assets/icons_groen/inzichten_groen.svg";
import "./css/DashboardMonthStats.css";

function getThisMonthItems(items, dateKey = "createdAt") {
    const now = new Date();

    return items.filter((item) => {
        const date = new Date(item[dateKey]);

        return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
        );
    });
    }

    function getAverage(items, key) {
    if (items.length === 0) return null;

    const total = items.reduce((sum, item) => sum + Number(item[key] || 0), 0);
    return (total / items.length).toFixed(1);
    }

    function DashboardMonthStats({ checkIns = [], pauseSessions = [] }) {
    const monthCheckIns = getThisMonthItems(checkIns, "createdAt");
    const monthPauses = getThisMonthItems(pauseSessions, "completedAt");

    const averageStress = getAverage(monthCheckIns, "stressLevel");
    const averageEnergy = getAverage(monthCheckIns, "energyLevel");

    return (
        <section className="monthSection">
        <article className="card cardMonth">
            <div className="cardHeader">
            <div className="cardHeaderLeft">
                <img src={inzichtenIcon} alt="" className="cardIcon" />
                <h3>Maand</h3>
            </div>
            </div>

            <div className="monthStats">
            <div>
                <span>Gemiddelde stress</span>
                <strong>{averageStress ? `${averageStress}/10` : "-"}</strong>
            </div>

            <div>
                <span>Gemiddelde energie</span>
                <strong>{averageEnergy ? `${averageEnergy}/10` : "-"}</strong>
            </div>

            <div>
                <span>Check-ins</span>
                <strong>{monthCheckIns.length}</strong>
            </div>

            <div>
                <span>Pauzes</span>
                <strong>{monthPauses.length}</strong>
            </div>
            </div>
        </article>
        </section>
    );
}

export default DashboardMonthStats;