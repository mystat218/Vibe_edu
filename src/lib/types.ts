export interface RawFestivalItem {
  UC_SEQ: number;
  MAIN_TITLE: string;
  GUGUN_NM: string;
  LAT: number;
  LNG: number;
  PLACE: string;
  TITLE: string;
  SUBTITLE: string;
  MAIN_PLACE: string;
  ADDR1: string;
  ADDR2: string;
  CNTCT_TEL: string;
  HOMEPAGE_URL: string;
  TRFC_INFO: string;
  USAGE_DAY: string;
  USAGE_DAY_WEEK_AND_TIME: string;
  USAGE_AMOUNT: string;
  MAIN_IMG_NORMAL: string;
  MAIN_IMG_THUMB: string;
  ITEMCNTNTS: string;
  MIDDLE_SIZE_RM1: string;
}

export interface RawFestivalResponse {
  getFestivalKr: {
    header: {
      code: string;
      message: string;
    };
    item: RawFestivalItem[];
  };
}

export interface Festival {
  id: number;
  title: string;
  gugun: string;
  lat: number;
  lng: number;
  place: string;
  tagline: string;
  subtitle: string;
  mainPlace: string;
  address: string;
  tel: string;
  homepage: string;
  traffic: string;
  months: number[]; // e.g. [8] for August
  period: string;
  fee: string;
  isFree: boolean;
  imageNormal: string;
  imageThumb: string;
  description: string;
  descriptionParagraphs: string[];
  accessibility: string[];
}
