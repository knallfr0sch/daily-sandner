export type NytimesWindow = Window &
  typeof globalThis & { dataLayer: NYTimesData[]};


export type NYTimesSubscriptionDetail = {
  billingSource: string,
  bundleType: NYTimesBundleType,
  campaignId: string,
  entitlements: string[],
  hasActiveEntitlements: boolean,
  ownershipStatus: 'OWNED',
  promotionTierType: string,
  startDate: string,
  status: NYTimesSubscriptionStatus,
  subscriptionId: number,
  subscriptionName: 'Basic Digital Access',
  subscriptionProducts: string[]
}

export function isPageData(data: NYTimesData): boolean {
  return Object.prototype.hasOwnProperty.call(data, 'event') 
      && (data as {event: string}).event === "pageDataReady";
}

export type PageData = {
  event: "pageDataReady";
  session: NYTimesSession;
  user: NYTimesUser;
}

export type NYTimesSession = { isLoggedIn: boolean };

export type NYTimesData = PageData | unknown;
export type NYTimesUserType = 'anon' | 'regi' |'sub';
export type NYTimesBundleType = 'XPASS' | string;
export type NYTimesSubscriptionStatus = 'ACTIVE' | string;

export type NYTimesUser = {
  type: NYTimesUserType,
  regiId: number,
  watSegs: string,
  nytdOtherData: unknown,
  subInfo: {
    subscriptions: NYTimesSubscriptionDetail[]
  },
  subscriptions: {
    activeBundles: [
      'Bundle XPASS'
    ],
    subscriberType: 'Regular',
    activeSubscriberSince: number,
    isNewsSubscriber: 1
  },
  tracking: unknown,
  subscriberInfo: unknown,
  actioniq: unknown,
  adv_scores: unknown,
  adv_segments: unknown
}

export interface NYTimesArticle {
  section: string;
  subsection: string;
  title: string;
  abstract: string;
  url: string;
  uri: string;
  byline: string;
  item_type: string;
  updated_date: string;
  created_date: string;
  published_date: string;
  material_type_facet: string;
  kicker: string;
  des_facet:  string[];
  org_facet: string[];
  per_facet: string[];
  geo_facet: string[];
  multimedia: [{
    url: string      
    format: string;      
    height: number;          
    width: number;          
    type: string;      
    subtype: string;      
    caption: string;      
    copyright: string;    
  }]  
  short_url: string
}

  
