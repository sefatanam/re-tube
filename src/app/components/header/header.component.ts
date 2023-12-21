import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() onMenuClick = new EventEmitter<void>();
}
