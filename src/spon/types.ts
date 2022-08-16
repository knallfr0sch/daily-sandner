export type SpiegelWindow = Window & typeof globalThis & { SARAs_data: SARA_DATA[]};

export type SARA_DATA = SponLoginInfo | SponPageEvent;

export function isSponLoginInfo(sara_data: SARA_DATA): sara_data is SponLoginInfo {
  return sara_data.hasOwnProperty('page') && sara_data.hasOwnProperty('user');
}

export type SponPageEvent = {
  event: unknown;
}

export type SponLoginInfo = {
  page: { category: any, info: any },
  user: {
    info: { tracking_id: string },
    segment: {
      has_active_noAds_subscription: boolean,
      has_active_subscription: boolean,
      loggedIn: boolean
    },
  }
}