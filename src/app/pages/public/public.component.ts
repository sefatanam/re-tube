import {AfterViewInit, Component, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {PlayerComponent} from "@components/player/player.component";
import {YoutubeService} from "@services/youtube.service";
import {YoutubeUtil} from "@utils/youtube.util";
import {AuthService} from "@services/auth.service";
import {HotToastService} from "@ngneat/hot-toast";
import {Observable} from "rxjs";
import {VideoInfo} from "@interface/video-info.interface";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {youtubeUrlValidator} from "@validators/youtube.validators";
import {User} from "firebase/auth";
import {AsyncPipe, NgTemplateOutlet} from "@angular/common";
import {InputComponent} from "@components/input/input.component";
import {MatButtonModule} from "@angular/material/button";
import {MatExpansionModule} from "@angular/material/expansion";

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [
    PlayerComponent,
    AsyncPipe,
    FormsModule,
    InputComponent,
    MatButtonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    NgTemplateOutlet
  ],
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PublicComponent implements OnInit , AfterViewInit, OnDestroy{

  youtubeService = inject(YoutubeService);
  youtubeUtil = inject(YoutubeUtil);
  authUser = inject(AuthService).authUser;
  toastService = inject(HotToastService);

  videoInfos$ !: Observable<VideoInfo[]>

  private formBuilder = inject(FormBuilder);


  magicForm = this.formBuilder.group({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    videoId: new FormControl('', [Validators.required, youtubeUrlValidator()]),
  })

  ngOnInit(): void {
    try {
      this.videoInfos$ = this.youtubeService.getVideos()
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
      const authUser = this.authUser();
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

  private isFormInvalid(): boolean {
    return this.magicForm.invalid;
  }

  private extractVideoIdFromForm(): string | false {
    const {videoId} = this.magicForm.value;
    if (!videoId) return false;
    return this.youtubeUtil.extractYouTubeVideoId(videoId);
  }

  private isValidTitleAndDisplayName(): boolean {
    const {title} = this.magicForm.value;
    const displayName = this.authUser()?.displayName
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


  async ngAfterViewInit() {
    await this.youtubeService.videosRealtimeUpdateInit()
  }

  ngOnDestroy(): void {
  }
}
