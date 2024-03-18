import { AfterViewInit, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { environment } from 'environments/environment.dev';
import gsap from 'gsap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  env = environment;
  /* heading
paragraph */

  ngAfterViewInit(): void {
    gsap
      .timeline({ repeat: 0 })
      .from('.heading', {
        scale: 14,
        opacity: 0,
        ease: 'circ',
        duration: 1.5,
        stagger: 0.8,
      })
      .to('.heading', {
        opacity: 1,
        easing: 'power3',
        duration: 1.5,
        stagger: 1,
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
        delay: 1.4,
        stagger: 0.1,
        ease: 'sine.out',
      }
    );

    gsap.to('#explore-btn', {
      ease: 'sine.in',
      opacity: 1,
      y: 0,
      delay: 1.4,
    });
    gsap.to('.outtro', {
      ease: 'power4.in',
      opacity: 1,
      y: 0,
      delay: 2,
    });
  }
}
