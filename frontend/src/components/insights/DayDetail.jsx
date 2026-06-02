import "./css/DayDetail.css";

function formatTime(date) {
    return new Date(date).toLocaleTimeString("nl-BE", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function DayDetail({ checkIns = [], pauseSessions = [], dayClosings = [] }) {
    const timelineItems = [
        ...checkIns.map((checkIn) => ({
        id: `checkin-${checkIn._id}`,
        type: "checkin",
        time: checkIn.createdAt,
        title: `Stress: ${checkIn.stressLevel}/10 • Energie: ${checkIn.energyLevel}/10`,
        text: checkIn.note || "Check-in ingevuld",
        })),

        ...pauseSessions.map((pause) => ({
        id: `pause-${pause._id}`,
        type: "pause",
        time: pause.completedAt,
        title: "Pauze genomen",
        text: pause.pauseTitle || pause.title || "Korte pauze afgerond",
        })),

        ...dayClosings.map((closing) => ({
        id: `closing-${closing._id}`,
        type: "closing",
        time: closing.createdAt,
        title: "Dagafsluiting",
        text:
            closing.tomorrowFocus ||
            closing.highlight ||
            "Je hebt je dag afgesloten",
        })),
    ].sort((a, b) => new Date(a.time) - new Date(b.time));

    return (
        <section className="dayDetail">
        <h2>Bekijk je dag in detail</h2>

        <div className="dayDetailCard">
            {timelineItems.length === 0 ? (
            <p className="dayDetailEmpty">
                Nog geen detaildata voor vandaag. Vul check-ins in of neem pauzes om
                hier je dagverloop te zien.
            </p>
            ) : (
            <div className="dayTimeline">
                {timelineItems.map((item) => (
                <article className="dayTimelineItem" key={item.id}>
                    <div className={`dayTimelineIcon ${item.type}`}>
                    {item.type === "checkin" && "↯"}
                    {item.type === "pause" && "☕"}
                    {item.type === "closing" && "✓"}
                    </div>

                    <time>{formatTime(item.time)}</time>

                    <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    </div>
                </article>
                ))}
            </div>
            )}
        </div>
        </section>
    );
}

export default DayDetail;