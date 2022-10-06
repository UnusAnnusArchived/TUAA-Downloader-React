export interface IVideo {
  sources?: ISource[];
  tracks?: ITrack[];
  posters?: IPoster[];
  season: number;
  episode: number;
  title: string;
  description: string;
  date?: number;
  releasedate: number;
  duration?: number;
  thumbnail?: string;
  video?: string;
}

export interface ISource {
  src: string;
  type: string;
  size: number;
}

export interface ITrack {
  kind: string;
  label: string;
  srclang: string;
  src: string;
}

export interface IPoster {
  src: string;
  type: string;
}

export interface StatusObject {
  downloaded: number;
  filesize: number;
  currentItem: {
    filePath: string;
    text: string;
    downloaded: number;
    filesize: number;
  };
}
