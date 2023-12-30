import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root'
})
export class DOMService {

  document = inject(DOCUMENT);
  toastService = inject(HotToastService);

  togglePictureInPicture(iframeId: string): void {
    const iframeElement = document.getElementById(iframeId) as HTMLIFrameElement;

    if (!iframeElement) {
      this.toastService.error("Iframe element not found.", { position: 'bottom-center' });
      return;
    }

    const iframeDocument = iframeElement.contentDocument || iframeElement.contentWindow?.document;

    if (iframeDocument) {
      const videoElement = iframeDocument.querySelector('video') as HTMLVideoElement;

      if (videoElement) {
        if ('pictureInPictureEnabled' in document) {
          videoElement.addEventListener('loadedmetadata', () => {
            videoElement.addEventListener('click', this.handleToggle.bind(this, videoElement));
          });
        } else {
          this.toastService.error("Picture-in-Picture is not supported in this browser or device.", { position: 'bottom-center' });
        }
      } else {
        this.toastService.error("Video element not found within the iframe.", { position: 'bottom-center' });
      }
    } else {
      this.toastService.error("Iframe document not accessible.", { position: 'bottom-center' });
    }
  }

  private async handleToggle(video: HTMLVideoElement): Promise<void> {
    try {
      if (document.pictureInPictureElement === video) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (error) {
      this.toastService.error("Error toggling Picture-in-Picture mode.", { position: 'bottom-center' });
      console.error('Error toggling Picture-in-Picture mode:', error);
    }
  }
}
