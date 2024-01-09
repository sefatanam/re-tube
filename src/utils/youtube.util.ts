import {YOUTUBE_URL_REGEX} from "@validators/youtube.validators";
import {inject} from "@angular/core";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {VideoInfo} from "@interface/video-info.interface";

export function extractYouTubeVideoId(url: any): string | false {
  const match = url.match(YOUTUBE_URL_REGEX);
  if (match && match[1]) {
    return match[1];
  }
  return false;
}

export function convertSafeYoutubeUrl(videoId: string): SafeResourceUrl{
  const sanitizer = inject(DomSanitizer);
  return sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`)
}

export function generateVideoInfoId(videoInfo: VideoInfo): string {
  const { videoId } = videoInfo;
  const uniqueString = `${videoId}_${Date.now()}`;
  return `uid_${uniqueString}`;
}
