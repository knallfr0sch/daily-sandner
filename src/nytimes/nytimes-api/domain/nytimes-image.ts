import { NytimesMediaMetadata } from "./nytimes-media-metadata";

export interface NytimesImage {
  type: string;
  subtype: string;
  caption: string;
  copyright: string;
  approved_for_syndication: 0 | 1;
  "media-metadata": NytimesMediaMetadata[];
}
