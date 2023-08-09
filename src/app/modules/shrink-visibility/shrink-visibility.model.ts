export interface Card {
  text: string;
  results: number | string;
  currency?: string;
  trend?: number;
}

export interface ShrinkVisibility {
  "shrink-item-ratio": number;
  "shrink-value": {
    amount: number;
    currency: string;
  };
  "shrink-event-bulk-ratio": number;
  "exit-items": {
    count: number;
    trend: number;
  };
  refresh: {
    "last-pos-event-time": number;
    "last-exit-event-time": number;
  };
}

export interface ShrinkEventsData {
  "day-of-week"?: number | string;
  "hour-of-day"?: number;
  "shrink-event-count": number;
  "bulk-event-count": number;
  "sweetheart-count": number;
  day?: string;
}

export interface ShrinkBySites {
  "site-code": string,
  "shrink-event-count": number,
  "shrink-item-ratio": number,
  "bulk-event-ratio": number,
  "shrink-event-trend": number,
  "site-name"?: string,
  "coordinates"?: Coordinates[] | []
}

export interface Coordinates {
  "latitude": number,
  "longitude": number
}

export interface FilterFields {
  "start-date": string | null;
  "end-date": string | null;
  "start-time"?: number;
  "end-time"?: number;
  "site-code"?: string [];
  "site-name"?: string [];
  "site-label"?: string [];
  "event-label"?: string;
  "bulk-tags"?: string;
  "itemLabel"?: string;
  "include-not-in-catalog"?: boolean;
  "site-directory"?: string[];
  "epc"?: string;
}

export interface ShrinkEventsByProductAttributes {
  "Value": string;
  "Quantity": number;
  "Amount": number;
  "Currency": string;
  "Ratio": number;
}

export interface ShrinkDataRefresh {
  "lastShrinkDataRefreshed": string | null ,
  "lastPosUploaded": string | null
}

export interface FilterChange {
  "applied": boolean ,
  "clearAction": boolean,
  "pageUrl":string
}