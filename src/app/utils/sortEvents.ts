import { SortOption } from '../components/SortFilter';

export interface Event {
  image: string;
  title: string;
  location: string;
  date: string;
  category?: string;
  isLive?: boolean;
  isFree?: boolean;
  hasStreaming?: boolean;
  id?: string | number;
}

export function sortEvents(events: Event[], sortOption: SortOption): Event[] {
  const eventsCopy = [...events];

  switch (sortOption) {
    case 'date-asc':
      // Plus récent en premier (dates plus grandes)
      return eventsCopy.sort((a, b) => {
        const dateA = parseDateString(a.date);
        const dateB = parseDateString(b.date);
        return dateB.getTime() - dateA.getTime();
      });

    case 'date-desc':
      // Plus ancien en premier (dates plus petites)
      return eventsCopy.sort((a, b) => {
        const dateA = parseDateString(a.date);
        const dateB = parseDateString(b.date);
        return dateA.getTime() - dateB.getTime();
      });

    case 'name-asc':
      // A → Z
      return eventsCopy.sort((a, b) => a.title.localeCompare(b.title));

    case 'name-desc':
      // Z → A
      return eventsCopy.sort((a, b) => b.title.localeCompare(a.title));

    case 'category':
      // Grouper par catégorie
      return eventsCopy.sort((a, b) => {
        const catA = a.category || '';
        const catB = b.category || '';
        return catA.localeCompare(catB);
      });

    case 'price-asc':
      // Gratuit en premier
      return eventsCopy.sort((a, b) => {
        if (a.isFree && !b.isFree) return -1;
        if (!a.isFree && b.isFree) return 1;
        return 0;
      });

    case 'price-desc':
      // Payant en premier
      return eventsCopy.sort((a, b) => {
        if (!a.isFree && b.isFree) return -1;
        if (a.isFree && !b.isFree) return 1;
        return 0;
      });

    default:
      return eventsCopy;
  }
}

// Parse différents formats de date
function parseDateString(dateStr: string): Date {
  // Format: "APR 14", "SAM.15 - 09 - 2025", "20h", "05.04.2025", etc.
  
  // Essayer le format DD.MM.YYYY
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('.');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  
  // Essayer le format DD - MM - YYYY
  if (/\d{2}\s*-\s*\d{2}\s*-\s*\d{4}/.test(dateStr)) {
    const match = dateStr.match(/(\d{2})\s*-\s*(\d{2})\s*-\s*(\d{4})/);
    if (match) {
      const [, day, month, year] = match;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
  }
  
  // Format "APR 14" (mois abrégé + jour)
  const monthMap: { [key: string]: number } = {
    'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
    'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11,
    'JANV': 0, 'FÉVR': 1, 'FÉV': 1, 'MARS': 2, 'AVR': 3, 'MAI': 4, 'JUIN': 5,
    'JUIL': 6, 'JUILL': 6, 'AOÛT': 7, 'AOUT': 7, 'SEPT': 8, 'DÉC': 11,
  };
  
  const monthMatch = dateStr.match(/([A-ZÀ-Ü]+)\s*\.?\s*(\d+)/i);
  if (monthMatch) {
    const [, monthStr, day] = monthMatch;
    const month = monthMap[monthStr.toUpperCase()];
    if (month !== undefined) {
      return new Date(2025, month, parseInt(day));
    }
  }
  
  // Format heure "19h", "20h 30m"
  if (/^\d+h/.test(dateStr)) {
    const hour = parseInt(dateStr.match(/^(\d+)h/)?.[1] || '0');
    const today = new Date();
    today.setHours(hour);
    return today;
  }
  
  // Par défaut, essayer de parser la date
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}