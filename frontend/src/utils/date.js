export function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(date = new Date()) {
  const formattedDate = new Intl.DateTimeFormat("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat("nl-BE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return `${formattedDate} - ${formattedTime}`;
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours();

  if (hour < 12) {
    return "Goedemorgen";
  } else if (hour < 18) {
    return "Goedemiddag";
  } else {
    return "Goedenavond";
  }
}