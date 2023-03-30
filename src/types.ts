export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export interface IVideo {
  __metadata_version: number;
  sources: ISource<'tuaa' | 'embed' | 'direct'>[];
  audio: IAudio[];
  captions: ICaption[];
  thumbnails: IThumbnails;
  season: number;
  episode: number;
  title: string;
  description: string;
  date: number;
  duration: number;
}

export type ISource<T extends 'tuaa' | 'embed' | 'direct'> = {
  type: T;
  id: string;
  name: T extends 'embed' | 'direct' ? string : undefined;
  resolutions: T extends 'tuaa' | 'direct' ? IResolution[] : undefined;
  src: T extends 'embed' ? string : undefined;
};

export interface IResolution {
  src: string;
  size: number;
}

export interface IAudio {
  lang: string;
  label: string;
  src: string;
  default: boolean;
}

export interface ICaption {
  label: string;
  srclang: string;
  src: string;
  default: boolean;
}

export interface IThumbnails {
  webp: IThumbnail;
  jpg: IThumbnail;
  avif: IThumbnail;
}

export interface IThumbnail {
  src: string;
  size: number;
}

export type Season = IVideo[];
export type Seasons = Season[];

export interface StatusObject {
  error: boolean;
  finished: boolean;
  status: string;
  downloaded: StatusDownloaded;
  currentItem: {
    status: string;
    downloaded: StatusDownloaded;
  };
}

export interface StatusDownloaded {
  displayType: 'bytes' | 'percent' | 'plain';
  current: number;
  max: number;
}

export type IColorScheme = 'light' | 'dark';
