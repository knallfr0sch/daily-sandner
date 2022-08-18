export type SpiegelWindow = Window &
  typeof globalThis & { SARAs_data: SARA_DATA[] };

export type SARA_DATA = SponLoginInfo | SponPageEvent;

export function isSponLoginInfo(
  sara_data: SARA_DATA
): sara_data is SponLoginInfo {
  return (
    Object.prototype.hasOwnProperty.call(sara_data, 'page') &&
    Object.prototype.hasOwnProperty.call(sara_data, 'user')
  );
}

export type SponPageEvent = {
  event: unknown;
};

export type SponLoginInfo = {
  page: { category: unknown; info: unknown };
  user: {
    info: { tracking_id: string };
    segment: {
      has_active_noAds_subscription: boolean;
      has_active_subscription: boolean;
      loggedIn: boolean;
    };
  };
};
