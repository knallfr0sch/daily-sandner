export type EconomistWindow = Window & typeof globalThis & { tedl: TEDL};

export type EconomistLoginStatus = "logged-in" | "logged-out";
export type EconomistAccountType = "paid" | "registered";

export type EconomistUser = {
  ContactId: string,
  IsSubscriber: boolean,
  /**
   * ISO 8601 Date string
   */
  RegisteredAt: string,
  account_type: EconomistAccountType,
  customerSegment: string,
  isEspressoSubscriber: boolean;
  isLapsed: boolean;
  fb: Object;
  status: EconomistLoginStatus
}

export type TEDL = {
  ads: unknown,
  events: unknown,
  platform: unknown,
  screen: unknown,
  user: EconomistUser
}