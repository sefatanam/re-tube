import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-share-target',
  standalone: true,
  imports: [],
  templateUrl: './share-target.component.html',
  styleUrl: './share-target.component.scss'
})
export class ShareTargetComponent implements AfterViewInit {
  toaster = inject(HotToastService)
  route = inject(ActivatedRoute)
  constructor(@Inject(PLATFORM_ID) private platform: Object) { }
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platform)) {
      this.toaster.info(JSON.stringify(this.route.snapshot.queryParams))
    }
  }
}
