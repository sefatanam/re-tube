import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { InputComponent } from '@components/input/input.component';
import { PlayerComponent } from '@components/player/player.component';
import { VideoInfo } from '@interface/video-info.interface';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from '@services/auth.service';
import { YoutubeService } from '@services/youtube.service';
import { YoutubeUtil } from '@utils/youtube.util';
import { youtubeUrlValidator } from '@validators/youtube.validators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [PlayerComponent, InputComponent, ReactiveFormsModule, MatExpansionModule],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.scss'
})
export class PersonalComponent {


  youtubeService = inject(YoutubeService);
  youtubeUtil = inject(YoutubeUtil);
  authUser = inject(AuthService).authUser;
  toastService = inject(HotToastService);
  videoInfos$ !: Observable<VideoInfo[]>;
  private formBuilder = inject(FormBuilder);

  privateForm = this.formBuilder.group({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    videoId: new FormControl('', [Validators.required, youtubeUrlValidator()]),
  })

  submit() {

  }
}
