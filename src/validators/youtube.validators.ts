import { AbstractControl, ValidatorFn } from "@angular/forms";

export const YOUTUBE_URL_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([a-zA-Z0-9_-]{11})(?:\?(?:\S*))?$/;

export const SHARED_URL_REGEX = /[?&]v=([^&]+)/;

export function youtubeUrlValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control?.value) return null;
    const valid = YOUTUBE_URL_REGEX.test(control.value);
    return valid ? null : { pattern: true };
  };
}
