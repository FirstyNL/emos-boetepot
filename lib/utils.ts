export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "net nu";
  if (minutes < 60) return `${minutes}m geleden`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}u geleden`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d geleden`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w geleden`;
}

export function firstName(fullName: string): string {
  return fullName.trim().split(" ")[0] || fullName;
}

const GREETINGS = [
  (name: string) => `Mogge, ${name}!`,
  (name: string) => `Tijd om te dokken, ${name}!`,
  (name: string) => `Zorg dat je je tas bij je hebt, ${name}!`,
  (name: string) => `Dag ${name}, de pot mist je bijdrage.`,
  (name: string) => `Yo ${name}, weer een kans om beroemd te worden.`,
  (name: string) => `${name}! Was jij niet te laat vorige week?`,
  (name: string) => `Welkom terug, ${name}. De boetepot groeit gestaag.`,
  (name: string) => `${name}, vandaag geen smoesjes.`,
];

export function pickGreeting(fullName: string): string {
  const name = firstName(fullName);
  const index = Math.floor(Math.random() * GREETINGS.length);
  return GREETINGS[index](name);
}

export function startOfWeek(date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
