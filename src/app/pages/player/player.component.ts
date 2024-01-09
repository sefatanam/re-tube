import {Component, inject, OnInit} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {SafeResourceUrl} from '@angular/platform-browser';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HotToastService} from '@ngneat/hot-toast';
import {Observable, tap} from 'rxjs';
import {Platform} from '@angular/cdk/platform';
import {AdjustHeightPipe} from "./adjust-height.pipe";
import {VideoInfo} from "@interface/video-info.interface";
import {youtubeUrlValidator} from "@validators/youtube.validators";
import {convertSafeYoutubeUrl, extractYouTubeVideoId} from "@utils/youtube.util";
import {User} from "firebase/auth";
import {ButtonComponent, InputComponent} from '@components/index';
import {MatButtonModule} from "@angular/material/button";
import {AuthService, DOMService, YoutubeService} from '@services/index';

@Component({
  selector: 'app-player',
  standalone: true,
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
  providers: [DOMService, YoutubeService],
  imports: [MatExpansionModule, InputComponent, ReactiveFormsModule, CommonModule, MatButtonModule, ButtonComponent, AdjustHeightPipe]
})
export class PlayerComponent implements OnInit {
  youtubeService = inject(YoutubeService);
  authService = inject(AuthService);
  toastService = inject(HotToastService);
  platform = inject(Platform);
  domService = inject(DOMService);
  videoInfos$ !: Observable<VideoInfo[]>;
  panelOpenState = true;
  protected safeURL!: SafeResourceUrl;
  protected currentVideoInfo!: VideoInfo;
  private formBuilder = inject(FormBuilder);

  magicForm = this.formBuilder.group({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    videoId: new FormControl('', [Validators.required, youtubeUrlValidator()]),
  })

  ngOnInit(): void {
    try {
      this.videoInfos$ = this.youtubeService.getVideos().pipe((tap(videos => {
        this.currentVideoInfo = videos[0];
        this.safeURL = convertSafeYoutubeUrl(this.currentVideoInfo.videoId);
      })));
    } catch (err) {
      this.toastService.error('Failed to fetch videos.', {position: 'bottom-center'})
    }
  }

  async submit() {
    try {
      if (this.isFormInvalid()) {
        return this.handleError('Form is not valid');
      }
      const extractedVideoId = this.extractVideoIdFromForm();
      if (!extractedVideoId) {
        return this.handleError('Link is not valid, Cannot extract the video id.');
      }
      const authUser = this.authService.authUser();
      if (!authUser) {
        return this.handleError('You must have to login before submit');
      }
      if (!this.isValidTitleAndDisplayName()) {
        return this.handleError('Something went wrong!');
      }
      const videoInfo = this.createVideoInfo(extractedVideoId, authUser);
      if (!videoInfo) {
        return this.handleError('Something went wrong!.')
      }
      await this.youtubeService.saveVideo(videoInfo);
      this.resetForm();
      this.toastService.success('Added to public playlist', {position: 'bottom-center'});
    } catch (error) {
      this.handleError('Something went wrong!');
    }
  }

  setCurrentVideo(videInfo: VideoInfo) {
    this.currentVideoInfo = videInfo;
    this.safeURL = convertSafeYoutubeUrl(this.currentVideoInfo.videoId)
  }

  enablePip = async () => await this.domService.enterPiP({containerId: '#pip_container', pipElementId: '#pip_element'});

  private isFormInvalid(): boolean {
    return this.magicForm.invalid;
  }

  private extractVideoIdFromForm(): string | false {
    const {videoId} = this.magicForm.value;
    if (!videoId) return false;
    return extractYouTubeVideoId(videoId);
  }

  private isValidTitleAndDisplayName(): boolean {
    const {title} = this.magicForm.value;
    const {displayName} = this.authService.authUser() || {};
    return !!title && !!displayName;
  }

  private createVideoInfo(extractedVideoId: string, authUser: User): VideoInfo | false {
    const {uid, displayName} = authUser;
    const {title} = this.magicForm.value;
    if (!uid || !displayName || !title) return false;

    return {
      videoId: extractedVideoId,
      title,
      userId: uid,
      userName: displayName,
    };
  }

  private resetForm(): void {
    this.magicForm.reset();
  }

  private handleError(message: string): void {
    this.toastService.error(message, {position: 'bottom-center'});
  }
}
