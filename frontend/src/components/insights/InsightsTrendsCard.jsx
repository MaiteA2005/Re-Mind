import stats from "../../assets/icons_groen/stats_groen.svg";
import energie from "../../assets/icons_groen/bliksem_groen.svg";
import compleet from "../../assets/icons_groen/name_one_win_groen.svg";
import idee from "../../assets/icons_groen/idee_groen.svg";
import trend from "../../assets/icons_groen/trend_groen.svg";

import "./css/InsightsTrendsCard.css";

function getAverage(items, key) {
    if (!items.length) return null;

    const total = items.reduce((sum, item) => sum + Number(item[key] || 0), 0);
    return Number((total / items.length).toFixed(1));
}

function getPeriodLabel(period) {
    return period === "month" ? "deze maand" : "deze week";
}

function getHighestStressMoment(checkIns, period) {
    const periodLabel = getPeriodLabel(period);

    if (!checkIns.length) {
        return {
        icon: stats,
        title: `Nog geen piekmoment ${periodLabel}`,
        text: `Vul meer check-ins in om te zien wanneer je stress ${periodLabel} het hoogst is.`,
        };
    }

    const highest = [...checkIns].sort(
        (a, b) => Number(b.stressLevel || 0) - Number(a.stressLevel || 0)
    )[0];

    const date = new Date(highest.createdAt);
    const day = date.toLocaleDateString("nl-BE", { weekday: "long" });
    const time = date.toLocaleTimeString("nl-BE", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return {
        icon: stats,
        title: period === "month" ? "Piekstress deze maand" : `Piekstress op ${day}`,
        text:
        period === "month"
            ? `Je hoogste stressmoment ${periodLabel} viel op ${day} rond ${time}.`
            : `Je stress was ${periodLabel} het hoogst op ${day} rond ${time}.`,
    };
}

function getEnergyPattern(checkIns, period) {
    const periodLabel = getPeriodLabel(period);

    if (!checkIns.length) {
        return {
        icon: energie,
        title: `Nog geen energiepatroon ${periodLabel}`,
        text: `Vul meer check-ins in om je energiepatroon voor ${periodLabel} te ontdekken.`,
        };
    }

    const lowest = [...checkIns].sort(
        (a, b) => Number(a.energyLevel || 0) - Number(b.energyLevel || 0)
    )[0];

    const date = new Date(lowest.createdAt);
    const day = date.toLocaleDateString("nl-BE", { weekday: "long" });
    const time = date.toLocaleTimeString("nl-BE", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return {
        icon: energie,
        title: period === "month" ? "Energiepatroon deze maand" : "Energiepatroon deze week",
        text:
        period === "month"
            ? `Je energie was deze maand het laagst op ${day} rond ${time}.`
            : `Je energie was deze week het laagst rond ${time}. Overweeg rond dat moment een korte pauze.`,
    };
}

function getRecoveryInsight(checkIns, period) {
    const periodLabel = getPeriodLabel(period);
    const averageStress = getAverage(checkIns, "stressLevel");
    const averageEnergy = getAverage(checkIns, "energyLevel");

    if (averageStress === null || averageEnergy === null) {
        return {
        icon: compleet,
        title: `Herstelmomenten ${periodLabel}`,
        text: `Neem regelmatig korte pauzes om herstelmomenten voor ${periodLabel} zichtbaar te maken.`,
        };
    }

    if (averageStress <= 4 && averageEnergy >= 6) {
        return {
        icon: compleet,
        title: `Goed herstel ${periodLabel}`,
        text: `Je stress blijft ${periodLabel} laag en je energie is stabiel. Je zit goed in balans.`,
        };
    }

    return {
        icon: compleet,
        title: `Herstel kan beter ${periodLabel}`,
        text: `Je stress en energie tonen dat extra rustmomenten ${periodLabel} nog nuttig kunnen zijn.`,
    };
}

function getPreventivePauseInsight(checkIns, pauseReminders, period) {
  const periodLabel = getPeriodLabel(period);
  const averageStress = getAverage(checkIns, "stressLevel");
  const takenPauses = pauseReminders.filter(
    (reminder) => reminder.action === "taken"
  ).length;

  if (averageStress >= 6 && takenPauses === 0) {
    return {
      icon: idee,
      title: "Plan pauzes preventief",
      text: `Je stress loopt ${periodLabel} op, maar er zijn weinig genomen pauzes. Neem een pauze vóór je stress piekt.`,
    };
  }

  return {
    icon: idee,
    title: "Blijf pauzes bewust plannen",
    text: `Korte pauzes helpen om stresspieken ${periodLabel} beter te voorkomen.`,
  };
}

function getMovementInsight(checkIns, period) {
    const periodLabel = getPeriodLabel(period);
    const averageEnergy = getAverage(checkIns, "energyLevel");

    if (averageEnergy !== null && averageEnergy <= 4) {
        return {
            icon: trend,
            title: "Meer beweging integreren",
            text: `Je energie ligt ${periodLabel} wat lager. Een korte wandeling of actieve pauze kan helpen.`,
        };
    }
    
    return {
        icon: trend,
        title: "Energie stabiel houden",
        text: `Blijf korte herstelmomenten nemen om je energieniveau ${periodLabel} stabiel te houden.`,
    };
}

function TrendItem({ icon, title, text }) {
    return (
        <div className="insightsTrendItem">
        <span className="insightsTrendIcon">
            <img src={icon} alt="" />
        </span>

        <div>
            <h4>{title}</h4>
            <p>{text}</p>
        </div>
        </div>
    );
}

function InsightsTrendsCard({
    period = "week",
    checkIns = [],
    pauseReminders = [],
    }) {
    const insights = [
        getHighestStressMoment(checkIns, period),
        getEnergyPattern(checkIns, period),
        getRecoveryInsight(checkIns, period),
    ];

    const trends = [
        getPreventivePauseInsight(checkIns, pauseReminders, period),
        getMovementInsight(checkIns, period),
    ];

    return (
        <section className="insightsTrendsCard">
        <div className="insightsTrendsColumn">
            <h3>{period === "month" ? "Inzichten deze maand" : "Inzichten deze week"}</h3>

            {insights.map((item) => (
            <TrendItem key={item.title} {...item} />
            ))}
        </div>

        <div className="insightsTrendsColumn">
            <h3>
            {period === "month"
                ? "Stress & Energie Trends deze maand"
                : "Stress & Energie Trends deze week"}
            </h3>

            {trends.map((item) => (
            <TrendItem key={item.title} {...item} />
            ))}
        </div>
        </section>
    );
}

export default InsightsTrendsCard;