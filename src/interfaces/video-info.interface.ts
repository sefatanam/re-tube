export interface VideoInfo {
  userId: string;
  videoId: string;
  title: string;
  userName: string;
}

export type VideoInfoResponse = Omit<VideoInfo, 'userName' | 'userId'>