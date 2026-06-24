import { RawFestivalResponse, RawFestivalItem, Festival } from './types';

// Helper to sanitize festival title
export function sanitizeTitle(title: string): string {
  if (!title) return '';
  // Remove multi-lingual suffixes like "(한,영, 중간,중번,일)" or "(한,영,중간,중번,일)" or "(한, 영, 중간, 중번, 일)"
  return title.replace(/\s*\([^)]*\)\s*$/, '').trim();
}

// Helper to extract hosting months from dates
export function extractMonths(period: string, usageDay: string): number[] {
  const months = new Set<number>();
  const combined = `${period} ${usageDay}`.trim();

  // 1. Match Korean month patterns like "11월", "1월"
  const krMonthMatches = combined.matchAll(/(\d{1,2})\s*월/g);
  for (const match of krMonthMatches) {
    const m = parseInt(match[1], 10);
    if (m >= 1 && m <= 12) months.add(m);
  }

  // 2. Match YYYY. MM. DD
  const dateFullMatches = combined.matchAll(/(\d{4})[.\-/]\s*(\d{1,2})[.\-/]\s*(\d{1,2})/g);
  for (const match of dateFullMatches) {
    const m = parseInt(match[2], 10);
    if (m >= 1 && m <= 12) months.add(m);
  }

  // 3. Match MM. DD patterns (not preceded by YYYY)
  // e.g. "8. 1. ~ 8. 3." or "7. 5. ~ 7. 13."
  const partialDateMatches = combined.matchAll(/(?:~\s*|\b)(\d{1,2})[.\-/]\s*(\d{1,2})\b/g);
  for (const match of partialDateMatches) {
    const m = parseInt(match[1], 10);
    // Filter out potential day or year values
    if (m >= 1 && m <= 12) {
      months.add(m);
    }
  }

  // Fallback: If no months are found but there is a number between 1 and 12
  if (months.size === 0) {
    const numMatches = combined.matchAll(/\b(\d{1,2})\b/g);
    for (const match of numMatches) {
      const m = parseInt(match[1], 10);
      if (m >= 1 && m <= 12) {
        months.add(m);
      }
    }
  }

  return Array.from(months).sort((a, b) => a - b);
}

// Helper to extract accessibility keywords
export function parseAccessibility(remarks: string): string[] {
  if (!remarks) return [];
  const tags: string[] = [];
  const normalized = remarks.toLowerCase();

  if (normalized.includes('휠체어') || normalized.includes('리프트')) {
    tags.push('휠체어 이용 가능');
  }
  if (normalized.includes('화장실') && normalized.includes('장애인')) {
    tags.push('장애인 화장실');
  }
  if (normalized.includes('주차') && normalized.includes('장애인')) {
    tags.push('장애인 주차구역');
  }
  if (normalized.includes('보조견')) {
    tags.push('보조견 동반 가능');
  }
  if (normalized.includes('수어')) {
    tags.push('수어 통역 제공');
  }
  if (normalized.includes('접근 가능') && tags.length === 0) {
    tags.push('무장애 접근');
  }

  return tags;
}

// Map raw item to sanitized Festival object
export function mapRawFestival(item: RawFestivalItem): Festival {
  const isFree = !item.USAGE_AMOUNT || 
                 item.USAGE_AMOUNT.toLowerCase().includes('무료') || 
                 item.USAGE_AMOUNT.trim() === '';

  // Parse accessibility tags
  const accessibility = parseAccessibility(item.MIDDLE_SIZE_RM1);

  // Split description content into paragraphs
  const description = item.ITEMCNTNTS || '';
  const descriptionParagraphs = description
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  // Default coordinate center (Busan City Hall) if API coordinates are invalid
  const lat = item.LAT && !isNaN(Number(item.LAT)) && Number(item.LAT) !== 0 ? Number(item.LAT) : 35.179554;
  const lng = item.LNG && !isNaN(Number(item.LNG)) && Number(item.LNG) !== 0 ? Number(item.LNG) : 129.075641;

  return {
    id: item.UC_SEQ,
    title: sanitizeTitle(item.MAIN_TITLE),
    gugun: item.GUGUN_NM || '기타',
    lat,
    lng,
    place: item.PLACE || '',
    tagline: item.TITLE || '',
    subtitle: item.SUBTITLE || '',
    mainPlace: item.MAIN_PLACE || item.PLACE || '',
    address: item.ADDR1 || item.ADDR2 || '부산광역시',
    tel: item.CNTCT_TEL || '',
    homepage: item.HOMEPAGE_URL || '',
    traffic: item.TRFC_INFO || '',
    months: extractMonths(item.USAGE_DAY_WEEK_AND_TIME, item.USAGE_DAY),
    period: item.USAGE_DAY_WEEK_AND_TIME || item.USAGE_DAY || '일정 확인 필요',
    fee: item.USAGE_AMOUNT || '무료',
    isFree,
    imageNormal: item.MAIN_IMG_NORMAL || '/images/default-festival.jpg',
    imageThumb: item.MAIN_IMG_THUMB || '/images/default-festival-thumb.jpg',
    description,
    descriptionParagraphs,
    accessibility,
  };
}

export async function fetchFestivals(): Promise<Festival[]> {
  const serviceKey = '126fc93eb5c942b022866f746537cfa6b5c2f2cd141dad1d41e0fc14d0465e88';
  const url = `https://apis.data.go.kr/6260000/FestivalService/getFestivalKr?serviceKey=${serviceKey}&pageNo=1&numOfRows=100&resultType=json`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache response for 1 hour
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch festivals: ${res.statusText}`);
    }

    const data: RawFestivalResponse = await res.json();
    
    if (!data.getFestivalKr || !data.getFestivalKr.item) {
      throw new Error('Invalid API response format');
    }

    return data.getFestivalKr.item.map(mapRawFestival);
  } catch (error) {
    console.error('Error fetching festivals:', error);
    return [];
  }
}
