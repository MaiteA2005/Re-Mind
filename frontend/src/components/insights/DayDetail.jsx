import "./css/DayDetail.css";

import energie from "../../assets/icons_zwart/bliksem_zwart.svg";
import koffie from "../../assets/icons_zwart/koffie_zwart.svg";
import batterij from "../../assets/icons_zwart/batterij_zwart.svg";
import waarschuwing from "../../assets/icons_zwart/waarschuwing_zwart.svg";
import check from "../../assets/icons_zwart/check_zwart.svg";
import kruis from "../../assets/icons_zwart/kruis_zwart.svg";

function isValidDate(date) {
    return date instanceof Date && !Number.isNaN(date.getTime());
}

function toDate(value) {
    const date = new Date(value);
    return isValidDate(date) ? date : null;
}

function formatTime(date) {
    const parsedDate = toDate(date);
    if (!parsedDate) return "";

    return parsedDate.toLocaleTimeString("nl-BE", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getWeekOfMonth(date) {
    const parsedDate = toDate(date);
    if (!parsedDate) return 1;

    return Math.ceil(parsedDate.getDate() / 7);
}

function getAverage(items, key) {
    if (!items.length) return null;

    const total = items.reduce((sum, item) => sum + Number(item[key] || 0), 0);
        return Number((total / items.length).toFixed(1));
    }

    function getWeekdayIndex(date) {
    const parsedDate = toDate(date);
    if (!parsedDate) return null;

    const day = parsedDate.getDay();
    return day === 0 ? 6 : day - 1;
}

function getTimelineIcon(type, stressLevel, energyLevel, hasData = true) {
    if (!hasData) return kruis;

    if (type === "pause") return koffie;
    if (type === "closing") return check;
    if (stressLevel >= 7 && energyLevel <= 4) return waarschuwing;
    if (energyLevel <= 3) return batterij;

    return energie;
}

function getTimelineIconClass(type, stressLevel, energyLevel, hasData = true) {
    if (!hasData) return "noData";

    if (type === "pause") return "pause";
    if (type === "closing") return "closing";
    if (stressLevel >= 7 && energyLevel <= 4) return "warning";
    if (energyLevel <= 3) return "energy";

    return "checkin";
}

function getDayInsightText({ label, checkIns, pauses }) {
    if (!checkIns.length && !pauses.length) {
        return `Nog geen gegevens voor ${label.toLowerCase()}.`;
    }

    const averageStress = getAverage(checkIns, "stressLevel");
    const averageEnergy = getAverage(checkIns, "energyLevel");
    const pauseCount = pauses.length;

    if (averageStress >= 7 && averageEnergy <= 4) {
        return `Op ${label.toLowerCase()} zie je hoge stress en lagere energie. Een extra rustmoment kan hier helpen.`;
    }

    if (averageStress >= 7 && pauseCount >= 1) {
        return `Je stress ligt hoog op ${label.toLowerCase()}, maar je neemt wel pauzes om het tempo beter vol te houden.`;
    }

    if (averageEnergy <= 4 && pauseCount === 0) {
        return `Je energie zakt op ${label.toLowerCase()} en er zijn weinig pauzemomenten. Plan preventief een korte pauze.`;
    }

    if (averageStress <= 4 && averageEnergy >= 6) {
        return `${label} ziet er stabiel uit: je stress blijft laag en je energie is goed.`;
    }

    if (pauseCount >= 2) {
        return `Je neemt op ${label.toLowerCase()} meerdere pauzes. Dat helpt om je werkdag beter te spreiden.`;
    }

    return `Op ${label.toLowerCase()} blijven je stress en energie redelijk in balans.`;
}

function getWeekInsightRows(checkIns, pauseSessions) {
    const days = [
        { label: "Maandag", index: 0 },
        { label: "Dinsdag", index: 1 },
        { label: "Woensdag", index: 2 },
        { label: "Donderdag", index: 3 },
        { label: "Vrijdag", index: 4 },
        { label: "Zaterdag", index: 5 },
        { label: "Zondag", index: 6 },
    ];

    return days.map((day) => {
        const dayCheckIns = checkIns.filter(
        (checkIn) => getWeekdayIndex(checkIn.createdAt) === day.index
        );

        const dayPauses = pauseSessions.filter(
        (pause) =>
            getWeekdayIndex(pause.completedAt || pause.createdAt) === day.index
        );

        const averageStress = getAverage(dayCheckIns, "stressLevel");
        const averageEnergy = getAverage(dayCheckIns, "energyLevel");
        const hasData = dayCheckIns.length > 0 || dayPauses.length > 0;

        return {
        label: day.label,
        hasData,
        type: "checkin",
        stressLevel: averageStress,
        energyLevel: averageEnergy,
        text: getDayInsightText({
            label: day.label,
            checkIns: dayCheckIns,
            pauses: dayPauses,
        }),
        };
    });
}

function getMonthInsightRows(checkIns, pauseSessions) {
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

    return weeks.map((weekLabel, index) => {
        const weekNumber = index + 1;

        const weekCheckIns = checkIns.filter(
        (checkIn) => getWeekOfMonth(checkIn.createdAt) === weekNumber
        );

        const weekPauses = pauseSessions.filter(
        (pause) =>
            getWeekOfMonth(pause.completedAt || pause.createdAt) === weekNumber
        );

        const averageStress = getAverage(weekCheckIns, "stressLevel");
        const averageEnergy = getAverage(weekCheckIns, "energyLevel");
        const hasData = weekCheckIns.length > 0 || weekPauses.length > 0;

        return {
        label: weekLabel,
        hasData,
        type: "checkin",
        stressLevel: averageStress,
        energyLevel: averageEnergy,
        text: getDayInsightText({
            label: weekLabel,
            checkIns: weekCheckIns,
            pauses: weekPauses,
        }),
        };
    });
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
        title: `Stress: ${checkIn.stressLevel}/5 • Energie: ${checkIn.energyLevel}/5`,
        text: checkIn.note || "Check-in ingevuld",
        stressLevel: Number(checkIn.stressLevel),
        energyLevel: Number(checkIn.energyLevel),
        hasData: true,
        })),

        ...pauseSessions.map((pause) => ({
        id: `pause-${pause._id}`,
        type: "pause",
        time: pause.completedAt || pause.createdAt,
        title: "Pauze",
        text: pause.pauseTitle || pause.title || pause.type || "Pauze genomen",
        hasData: true,
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
        hasData: true,
        })),
    ]
        .filter((item) => toDate(item.time))
        .sort((a, b) => new Date(a.time) - new Date(b.time));

    const title =
        period === "week"
        ? "Bekijk je week in detail"
        : period === "month"
        ? "Bekijk je maand in detail"
        : "Bekijk je dag in detail";

    const emptyText =
        period === "week"
        ? "Nog geen gegevens voor deze week."
        : period === "month"
        ? "Nog geen gegevens voor deze maand."
        : "Nog geen gegevens voor vandaag.";

    const insightRows =
        period === "month"
        ? getMonthInsightRows(checkIns, pauseSessions)
        : getWeekInsightRows(checkIns, pauseSessions);

    return (
        <section className="dayDetail">
        <h2>{title}</h2>

        <div className="dayDetailCard">
            {period === "today" ? (
            timelineItems.length === 0 ? (
                <p className="dayDetailEmpty">
                {emptyText} Vul check-ins in of neem pauzes om hier je verloop te
                zien.
                </p>
            ) : (
                <div className="detailTimeline todayTimeline">
                {timelineItems.map((item) => (
                    <article className="detailTimelineItem" key={item.id}>
                    <div
                        className={`detailTimelineIcon ${getTimelineIconClass(
                        item.type,
                        item.stressLevel,
                        item.energyLevel,
                        item.hasData
                        )}`}
                    >
                        <img
                        src={getTimelineIcon(
                            item.type,
                            item.stressLevel,
                            item.energyLevel,
                            item.hasData
                        )}
                        alt=""
                        />
                    </div>

                    <time>{formatTime(item.time)}</time>

                    <h3>{item.title}</h3>

                    <p>{item.text}</p>
                    </article>
                ))}
                </div>
            )
            ) : (
            <div className="detailTimeline insightTimeline">
                {insightRows.map((row) => (
                <article
                    className="detailTimelineItem insightTimelineItem"
                    key={row.label}
                >
                    <div
                    className={`detailTimelineIcon ${getTimelineIconClass(
                        row.type,
                        row.stressLevel,
                        row.energyLevel,
                        row.hasData
                    )}`}
                    >
                    <img
                        src={getTimelineIcon(
                        row.type,
                        row.stressLevel,
                        row.energyLevel,
                        row.hasData
                        )}
                        alt=""
                    />
                    </div>

                    <strong>{row.label}</strong>

                    <p>{row.text}</p>
                </article>
                ))}
            </div>
            )}
        </div>
        </section>
    );
}

export default DayDetail;