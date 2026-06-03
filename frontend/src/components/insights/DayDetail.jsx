import "./css/DayDetail.css";

function isValidDate(date) {
    return date instanceof Date && !Number.isNaN(date.getTime());
}

function formatTime(date) {
    const parsedDate = new Date(date);
    if (!isValidDate(parsedDate)) return "";

    return parsedDate.toLocaleTimeString("nl-BE", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatFullDay(date) {
    const parsedDate = new Date(date);
    if (!isValidDate(parsedDate)) return "";

    return parsedDate.toLocaleDateString("nl-BE", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });
    }

    function getDayKey(date) {
    const parsedDate = new Date(date);
    if (!isValidDate(parsedDate)) return "unknown";

    return parsedDate.toISOString().split("T")[0];
    }

    function getWeekOfMonth(date) {
    const parsedDate = new Date(date);
    if (!isValidDate(parsedDate)) return 1;

    return Math.ceil(parsedDate.getDate() / 7);
    }

    function formatWeekLabel(date) {
    return `Week ${getWeekOfMonth(date)}`;
    }

    function getGroupKey(date, period) {
    if (period === "month") {
        return formatWeekLabel(date);
    }

    return getDayKey(date);
    }

    function getGroupTitle(groupKey, firstItem, period) {
    if (period === "month") {
        return groupKey;
    }

    return formatFullDay(firstItem.time);
    }

    function getItemText(item) {
    if (item.type === "checkin") {
        return item.text || "Check-in ingevuld";
    }

    if (item.type === "pause") {
        return item.text || "Korte pauze afgerond";
    }

    return item.text || "Je hebt je dag afgesloten";
    }

    function DayDetail({
    period = "today",
    checkIns = [],
    pauseSessions = [],
    dayClosings = [],
    }) {
    const timelineItems = [
        ...checkIns.map((checkIn) => ({
        id: `checkin-${checkIn._id}`,
        type: "checkin",
        time: checkIn.createdAt,
        title: `Stress: ${checkIn.stressLevel}/10 • Energie: ${checkIn.energyLevel}/10`,
        text: checkIn.note,
        })),

        ...pauseSessions.map((pause) => ({
        id: `pause-${pause._id}`,
        type: "pause",
        time: pause.completedAt,
        title: "Pauze genomen",
        text: pause.pauseTitle || pause.title || pause.type,
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
    ]
        .filter((item) => isValidDate(new Date(item.time)))
        .sort((a, b) => new Date(a.time) - new Date(b.time));

    const groupedItems = timelineItems.reduce((acc, item) => {
        const key = getGroupKey(item.time, period);

        if (!acc[key]) {
        acc[key] = [];
        }

        acc[key].push(item);
        return acc;
    }, {});

    const groupedKeys = Object.keys(groupedItems).sort((a, b) => {
        if (period === "month") {
        return Number(a.replace("Week ", "")) - Number(b.replace("Week ", ""));
        }

        return new Date(a) - new Date(b);
    });

    const title =
        period === "week"
        ? "Bekijk je week in detail"
        : period === "month"
        ? "Bekijk je maand in detail"
        : "Bekijk je dag in detail";

    const emptyText =
        period === "week"
        ? "Nog geen detaildata voor deze week."
        : period === "month"
        ? "Nog geen detaildata voor deze maand."
        : "Nog geen detaildata voor vandaag.";

    return (
        <section className="dayDetail">
        <h2>{title}</h2>

        <div className="dayDetailCard">
            {timelineItems.length === 0 ? (
            <p className="dayDetailEmpty">
                {emptyText} Vul check-ins in of neem pauzes om hier je verloop te
                zien.
            </p>
            ) : period === "week" || period === "month" ? (
            <div className="weekTimeline">
                {groupedKeys.map((groupKey) => {
                const groupItems = groupedItems[groupKey];

                return (
                    <div className="weekTimelineGroup" key={groupKey}>
                    <h3>{getGroupTitle(groupKey, groupItems[0], period)}</h3>

                    <div className="dayTimeline">
                        {groupItems.map((item) => (
                        <article className="dayTimelineItem" key={item.id}>
                            <div className={`dayTimelineIcon ${item.type}`}>
                            {item.type === "checkin" && "↯"}
                            {item.type === "pause" && "☕"}
                            {item.type === "closing" && "✓"}
                            </div>

                            <time>{formatTime(item.time)}</time>

                            <div>
                            <h4>{item.title}</h4>
                            <p>{getItemText(item)}</p>
                            </div>
                        </article>
                        ))}
                    </div>
                    </div>
                );
                })}
            </div>
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
                    <p>{getItemText(item)}</p>
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