import {ChangeDetectionStrategy, Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AdjustHeightPipe} from "../../../pipes/adjust-height.pipe";
import {MatButtonModule} from "@angular/material/button";
import {ThumbnailPipe} from "../../../pipes/thumbnail.pipe";
import {YoutubeService} from "@services/youtube.service";
import {DOMService} from "@services/dom.service";
import {InputComponent} from "@components/input/input.component";
import {ButtonComponent} from "@components/button/button.component";
import {VideoInfo} from "@interface/video-info.interface";
import {Platform} from "@angular/cdk/platform";
import {SafeResourceUrl} from "@angular/platform-browser";
import {YoutubeUtil} from "@utils/youtube.util";

@Component({
  selector: 'app-player',
  standalone: true,
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
  providers: [DOMService],
  imports: [MatExpansionModule, InputComponent, ReactiveFormsModule, CommonModule, MatButtonModule, ButtonComponent, AdjustHeightPipe, ThumbnailPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent implements OnChanges {
  @Input({required: true}) videos: VideoInfo[] | null = null;

  platform = inject(Platform);
  domService = inject(DOMService);
  youtubeUtil = inject(YoutubeUtil);
  panelOpenState = true;
  protected safeURL!: SafeResourceUrl;
  protected currentVideoInfo!: VideoInfo;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.videos) {
      this.setCurrentVideo(this.videos[0]);
    }
  }
  enablePip = async () => await this.domService.enterPiP({containerId: '#pip_container', pipElementId: '#pip_element'});

  setCurrentVideo(videInfo: VideoInfo) {
    this.currentVideoInfo = videInfo;
    this.safeURL = this.youtubeUtil.convertSafeYoutubeUrl(this.currentVideoInfo.videoId)
  }
}
