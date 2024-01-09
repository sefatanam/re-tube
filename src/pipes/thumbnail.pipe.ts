import {inject, Pipe, PipeTransform} from '@angular/core';

import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Pipe({
  name: 'thumbnail',
  standalone: true
})
export class ThumbnailPipe implements PipeTransform {

  sanitizer = inject(DomSanitizer);

  transform(videoId: string | undefined): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://img.youtube.com/vi/' + videoId + '/default.jpg');
  }

}
