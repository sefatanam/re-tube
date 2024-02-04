import { YOUTUBE_URL_REGEX, youtubeUrlValidator } from "@validators/youtube.validators";
import { inject, Injectable } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { VideoInfo } from "@interface/video-info.interface";
import { User } from "firebase/auth";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

export type FromStatus<T extends boolean> = {
  data: T extends true ? VideoInfo : null,
  isValid: T,
  error: T extends false ? string : null
}

@Injectable({ providedIn: "root" })
export class YoutubeUtil {
  private sanitizer = inject(DomSanitizer);

  public extractYouTubeVideoId(url: string): string {
    const match = url.match(YOUTUBE_URL_REGEX);
    if (match && match[1]) {
      return match[1];
    }
    throw new Error('Video URL not able to parse.')
  }

  public convertSafeYoutubeUrl(videoId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`)
  }


  public async getValidVideoInfoFromForm(form: FormGroup, user: User): Promise<FromStatus<boolean>> {
    try {
      if (form.invalid) {
        return { error: 'Form is not valid', data: null, isValid: false } as FromStatus<false>
      }
      const videoInfo = this.createVideoInfo(form, user);
      if (!videoInfo) {
        return { error: 'Something went wrong!.', data: null, isValid: false } as FromStatus<false>
      }
      return { data: videoInfo, isValid: true, error: null } as FromStatus<true>

    } catch (error: any) {
      return { error: String(error).toString(), isValid: false, data: null } as FromStatus<false>;
    }
  }


  private createVideoInfo(form: FormGroup, authUser: User): VideoInfo | false {
    const { uid, displayName } = authUser;
    const { title, videoId } = form.value;
    if (!uid || !displayName || !title || !videoId) return false;

    return {
      videoId: this.extractYouTubeVideoId(videoId),
      title,
      userId: uid,
      userName: displayName,
    };
  }
}
