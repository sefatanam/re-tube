import { Component, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [MatExpansionModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {
  panelOpenState = true;
  sanitizer = inject(DomSanitizer)
  // videoId = '';
  videoId = 'zXiQZkrJFnA'
  safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.videoId}`)

}
