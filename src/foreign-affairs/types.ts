export type ForeignAffairsWindow = Window &
  typeof globalThis & { dataLayer: ForeignAffairsData[] };

export type ForeignAffairsData = ForeignAffairsUser | unknown;

export function isDataForeignAffairsUser(
  foreignAffairsData: ForeignAffairsData,
): foreignAffairsData is ForeignAffairsUser {
  return Object.prototype.hasOwnProperty.call(foreignAffairsData, "user type");
}

export type ForeignAffairsUserType = "anonymous" | "plus_subscriber_user"

export type ForeignAffairsUser = {
  articletypedl: "landing_page",
  content_type_dl: "Landing Page",
  magissuedatedl: "digital",
  nodedatalayer: "4",
  paywallstdl: "Paywall Free",
  "user type": ForeignAffairsUserType
}