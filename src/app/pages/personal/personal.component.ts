import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { InputComponent } from '@components/input/input.component';
import { PlayerComponent } from '@components/player/player.component';
import { VideoInfo, VideoInfoResponse } from '@interface/video-info.interface';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from '@services/auth.service';
import { YoutubeService } from '@services/youtube.service';
import { YoutubeUtil } from '@utils/youtube.util';
import { youtubeUrlValidator } from '@validators/youtube.validators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [PlayerComponent, InputComponent, ReactiveFormsModule, MatExpansionModule, NgTemplateOutlet, AsyncPipe],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.scss'
})
export class PersonalComponent implements OnInit {


  youtubeService = inject(YoutubeService);
  youtubeUtil = inject(YoutubeUtil);
  authUser = inject(AuthService).authUser;
  toastService = inject(HotToastService);
  videoInfos$ !: Observable<VideoInfoResponse[]>;
  private formBuilder = inject(FormBuilder);

  privateForm = this.formBuilder.group({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    videoId: new FormControl('', [Validators.required, youtubeUrlValidator()]),
  })

  ngOnInit(): void {
    try {
      const authUserEmail = this.authUser()?.email;
      if (authUserEmail) {
        this.videoInfos$ = this.youtubeService.getVideos(authUserEmail, 'privateVideos')
      }
    } catch (err) {
      this.toastService.error('Failed to fetch videos.')
    }
  }

  async submit() {
    const authUser = this.authUser();
    if (!authUser) {
      this.toastService.error('You must have to login before submit');
      return;
    }
    const validateVideoInfo = await this.youtubeUtil.getValidVideoInfoFromForm(this.privateForm, authUser);
    if (!validateVideoInfo.isValid && validateVideoInfo.error) {
      this.toastService.error(validateVideoInfo.error.toString());
      return;
    }

    if (validateVideoInfo.isValid && validateVideoInfo.data && authUser.email) {
      await this.youtubeService.saveVideo(validateVideoInfo.data, authUser.email);
      this.privateForm.reset();
      this.toastService.success('Added to private playlist');
    }
  }
}
