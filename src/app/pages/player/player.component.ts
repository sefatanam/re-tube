import { AfterContentInit, Component, OnInit, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { InputComponent } from "../../components/input/input.component";
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Firestore, collectionData, collection, setDoc, doc } from '@angular/fire/firestore';
import { AuthService } from 'services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Observable, tap } from 'rxjs';
import { ButtonComponent } from "../../components/button/button.component";
import { DOMService } from 'services/dom.service';
// import { AngularFirestore } from '@angular/fire/compat/firestore';

export function youtubeUrlValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const regexPattern = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([a-zA-Z0-9_-]{11})(?:\?(?:\S*))?$/;
    const valid = regexPattern.test(control.value);
    return valid ? null : { pattern: true };
  };
}

function extractYouTubeVideoId(url: any): string | null {
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([a-zA-Z0-9_-]{11})(?:\?(?:\S*))?$/;
  const match = url.match(youtubeRegex);

  if (match && match[1]) {
    return match[1];
  }

  return null;
}


type VideoInfo = {
  userId: string;
  videoId: string;
  title: string;
  userName: string;
}

function generateRandomUId(videoInfo: VideoInfo): string {
  const { videoId } = videoInfo;
  const uniqueString = `${videoId}_${Date.now()}`;
  return `uid_${uniqueString}`;
}


@Component({
  selector: 'app-player',
  standalone: true,
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
  imports: [MatExpansionModule, InputComponent, ReactiveFormsModule, CommonModule, MatButtonModule, ButtonComponent],
  providers: [DOMService]
})
export class PlayerComponent implements OnInit {
  currentVideoInfo: VideoInfo = { videoId: '', title: '', userId: '', userName: '' }

  videoInfo: VideoInfo = {
    videoId: '',
    userId: '',
    title: '',
    userName: ''
  }
  firestore: Firestore = inject(Firestore);
  authService = inject(AuthService)
  toastService = inject(HotToastService)
  videoInfos$ !: Observable<VideoInfo[]>;
  domService = inject(DOMService)

  ngOnInit(): void {
    try {
      const aCollection = collection(this.firestore, 'videos');
      this.videoInfos$ = (collectionData(aCollection) as Observable<VideoInfo[]>).pipe((tap(videos => {
        this.currentVideoInfo = videos[0];
        this.safeURL = this.makeVideoSafeUrl(this.currentVideoInfo.videoId);
      })));
    } catch (err) {
      this.toastService.error('Failed to fetch videos.', { position: 'bottom-center' })

    }
  }
  private formBuilder = inject(FormBuilder);

  magicForm = this.formBuilder.group({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    videoId: new FormControl('', [Validators.required, youtubeUrlValidator()]),
  })

  panelOpenState = true;
  sanitizer = inject(DomSanitizer)
  // videoId = '';
  safeURL!: SafeResourceUrl


  async submit() {
    try {
      if (this.magicForm.invalid) {
        this.toastService.error(`Form is not valid`, {
          position: 'bottom-center'
        })
        return;
      }

      const { title, videoId } = this.magicForm.value;
      const extractedVideoId = extractYouTubeVideoId(videoId ?? "");

      if (!extractYouTubeVideoId) {
        this.toastService.error(`Link is not valid, Cannot extract the video id.`, {
          position: 'bottom-center'
        })
      }

      if (!this.authService.authUser()) {
        this.toastService.error(`You must have to login before submit`, {
          position: 'bottom-center'
        })
      }

      const { uid, displayName } = this.authService.authUser() ?? {};

      if (title && extractedVideoId && uid && displayName) {
        this.videoInfo = {
          videoId: extractedVideoId,
          title: title,
          userId: uid,
          userName: displayName
        }
      }

      const docId = generateRandomUId(this.videoInfo);
      await setDoc(doc(this.firestore, "videos", docId), this.videoInfo);

      this.magicForm.reset()
      this.toastService.success('Added to playlist', { position: 'bottom-center' })
    } catch (error) {
      this.toastService.error('Something went wrong!', { position: 'bottom-center' })
    }
  }

  makeVideoSafeUrl(videoId: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1`)
  }


  setCurrentVideo(videInfo: VideoInfo) {
    this.currentVideoInfo = videInfo;
    this.safeURL = this.makeVideoSafeUrl(this.currentVideoInfo.videoId)
  }

  enablePip = (iframeId: string) => this.domService.togglePictureInPicture(iframeId)
}
