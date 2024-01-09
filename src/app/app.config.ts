import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { environment } from '../environments/environment.dev';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideServiceWorker } from '@angular/service-worker';
import { AuthService } from 'services/auth.service';
import { provideHotToastConfig } from '@ngneat/hot-toast';
import { PlatformModule } from '@angular/cdk/platform';
import { initializeApp } from "firebase/app";
import { initializer } from './tokens/initializer.token';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";

initializeApp(environment.firebaseConfig)

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AuthService],
      useFactory: initializer
    },
    provideRouter(routes, withViewTransitions()),
    provideClientHydration(),
    importProvidersFrom(provideFirebaseApp(() => initializeApp(environment.firebaseConfig))),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    provideAnimationsAsync(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    importProvidersFrom(AuthService),
    provideHotToastConfig(),
    importProvidersFrom(PlatformModule),
  ],
};
