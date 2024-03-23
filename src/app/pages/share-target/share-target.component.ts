import { JsonPipe, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, PLATFORM_ID, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoInfo } from '@interface/video-info.interface';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from '@services/auth.service';
import { YoutubeService } from '@services/youtube.service';
import { YoutubeUtil } from '@utils/youtube.util';
import { ThumbnailPipe } from 'pipes/thumbnail.pipe';

@Component({
  selector: 'app-share-target',
  standalone: true,
  imports: [JsonPipe, ThumbnailPipe, MatButtonModule],
  templateUrl: './share-target.component.html',
  styleUrl: './share-target.component.scss',
})
export class ShareTargetComponent implements AfterViewInit {

  videoInfo !: VideoInfo;

  toaster = inject(HotToastService);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  youtubeUtil = inject(YoutubeUtil);
  youtubeService = inject(YoutubeService);

  constructor(@Inject(PLATFORM_ID) private platform: Object) { }

  ngAfterViewInit(): void {

    try {

      if (isPlatformBrowser(this.platform)) {
        const authUser = this.authService.authUser();
        if (!authUser) {
          this.toaster.info('You are not authorize to perform this action. Please login.')
          return;
        }
        const { title, text: url } = this.route.snapshot.queryParams;
        if (!title || !url) {
          this.toaster.info('Shared data is not supported.');
          return;
        }
        const videoId = this.youtubeUtil.extractYouTubeVideoIdFromSharedLink(url);
        if (!videoId) {
          this.toaster.info('Shared link is not supported');
          return;
        }
        this.videoInfo = {
          videoId: videoId,
          title: title,
          userId: authUser.uid,
          userName: authUser.displayName ?? authUser.uid
        }
      }
    } catch (err: any) {
      this.toaster.error(err.message);

    }


  }

  async onSave() {
    const authUser = this.authService.authUser();
    if (!authUser?.email || !authUser?.uid) {
      this.toaster.info('You are not authorize to perform this action. Please login.')
      return;
    }
    await this.youtubeService.saveVideo(this.videoInfo, authUser.email);
    await this.youtubeService.clearCache('private');
    this.toaster.success('Video added to Personal Playlist');
    await this.router.navigate(['personal'], { queryParams: { uid: authUser.uid } })
  }
}
