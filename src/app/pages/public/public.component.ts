import { AfterViewInit, ChangeDetectionStrategy, Component, HostListener, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PlayerComponent } from "@components/player/player.component";
import { YoutubeService } from "@services/youtube.service";
import { YoutubeUtil } from "@utils/youtube.util";
import { AuthService } from "@services/auth.service";
import { HotToastService } from "@ngneat/hot-toast";
import { Observable } from "rxjs";
import { VideoInfoResponse } from "@interface/video-info.interface";
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AsyncPipe, NgTemplateOutlet } from "@angular/common";
import { InputComponent } from "@components/input/input.component";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule, MatExpansionPanel } from "@angular/material/expansion";
import { youtubeUrlValidator } from '@validators/youtube.validators';

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
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicComponent implements OnInit, AfterViewInit {
  @ViewChild('panel') panel!: MatExpansionPanel;

  youtubeService = inject(YoutubeService);
  youtubeUtil = inject(YoutubeUtil);
  authUser = inject(AuthService).authUser;
  toastService = inject(HotToastService);

  videoInfos$ !: Observable<VideoInfoResponse[]>;
  private formBuilder = inject(FormBuilder);



  publicForm = this.formBuilder.group({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    videoId: new FormControl('', [Validators.required, youtubeUrlValidator()]),
  })
  shouldExpand: unknown;

  ngOnInit(): void {
    try {
      this.videoInfos$ = this.youtubeService.getVideos('videos', 'public')
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
    const validateVideoInfo = await this.youtubeUtil.getValidVideoInfoFromForm(this.publicForm, authUser);
    if (!validateVideoInfo.isValid && validateVideoInfo.error) {
      this.toastService.error(validateVideoInfo.error.toString());
      return;
    }

    if (validateVideoInfo.isValid && validateVideoInfo.data) {
      await this.youtubeService.saveVideo(validateVideoInfo.data, 'videos');
      this.publicForm.reset();
      this.toastService.success('Added to public playlist');
    }
  }

  async ngAfterViewInit() {
    await this.youtubeService.videosRealtimeUpdateInit()
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // @ts-ignore
    if (!this.panel._body.nativeElement.contains(event.target)) {
      // Close the expansion panel if it's open
      if (this.panel.expanded) {
        this.panel.close();
      }
    }
  }
}
