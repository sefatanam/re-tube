import { AfterViewInit, Component } from '@angular/core';
import { environment } from 'environments/environment.dev';
import gsap from 'gsap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  env = environment;
  /* heading
paragraph */

  ngAfterViewInit(): void {
    gsap.to('.heading', {
      ease: 'power1.in',
      opacity: 1,
      y: 0,
    });

    gsap.fromTo(
      '.paragraph',
      {
        opacity: 0,
        y: 10,
      },
      {
        opacity: 1,
        y: 0,
        delay: 1,
        stagger: 0.1,
      }
    );
  }
}
