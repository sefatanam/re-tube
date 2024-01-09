import {YOUTUBE_URL_REGEX} from "@validators/youtube.validators";
import {inject, Injectable} from "@angular/core";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {VideoInfo} from "@interface/video-info.interface";


@Injectable({providedIn: "root"})
export class YoutubeUtil {
  sanitizer = inject(DomSanitizer);

  public extractYouTubeVideoId(url: any): string | false {
    const match = url.match(YOUTUBE_URL_REGEX);
    if (match && match[1]) {
      return match[1];
    }
    return false;
  }

  public convertSafeYoutubeUrl(videoId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`)
  }

  public generateVideoInfoId(videoInfo: VideoInfo): string {
    const {videoId} = videoInfo;
    const uniqueString = `${videoId}_${Date.now()}`;
    return `uid_${uniqueString}`;
  }
}
