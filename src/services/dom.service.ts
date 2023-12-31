import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root'
})
export class DOMService {

  document = inject(DOCUMENT);
  toastService = inject(HotToastService);

  async enterPiP(args: { containerId: string, pipElementId: string }) {
    try {
      // Close Picture-in-Picture window if any.
      // @ts-ignore
      if (documentPictureInPicture.window) {
        // @ts-ignore
        documentPictureInPicture.window.close();
        return;
      }
      // @ts-ignore
      // Open a Picture-in-Picture window.
      const pipWindow = await documentPictureInPicture.requestWindow({
        width: 350,
        height: 200,
      });
      // Move video to the Picture-in-Picture window and make it full page.
      const video = this.document.querySelector(args.pipElementId);
      pipWindow.document.body.append(video);
      // Listen for the PiP closing event to move the video back.
      pipWindow.addEventListener("pagehide", (event: any) => {
        const videoContainer = document.querySelector(args.containerId);
        const pipVideo = event.target.querySelector(args.pipElementId);
        // @ts-ignore
        videoContainer.append(pipVideo);
      });
    } catch (err: any) {
      this.toastService.error(`Something went wrong! ${err['message']}`)
    }
  }
}
