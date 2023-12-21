import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.dev';
import { MainContentComponent } from './components/main-content/main-content.component';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, RouterOutlet, MainContentComponent]
})
export class AppComponent {

  firestore: Firestore = inject(Firestore);
  items$!: Observable<any[]>;

  environment = environment;

  title = 're-learn';

  constructor() {
    const aCollection = collection(this.firestore, 'items')
    this.items$ = collectionData(aCollection);
  }
}
