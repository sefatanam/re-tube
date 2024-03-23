import { Platform } from '@angular/cdk/platform';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  indexedDBLocalPersistence,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  User
} from "firebase/auth";


const provider = new GoogleAuthProvider();

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authUser = signal<User | null>(null);
  router = inject(Router);
  toastService = inject(HotToastService);
  platform = inject(Platform)

  async continue() {
    const auth = getAuth();
    try {
      await setPersistence(auth, indexedDBLocalPersistence);
      if (this.platform.ANDROID || this.platform.IOS) {
        await this.inPhoneSignInWithRedirect(auth);
      } else {
        await this.inWebSignInWithPopUp(auth)
      }
    } catch (e) {
      console.error(e);
      this.toastService.error(`Something went wrong`, { position: 'bottom-center' })
    }
  }

  async signOut() {
    try {
      const auth = getAuth();
      await signOut(auth);
      this.authUser.set(null);
      this.toastService.success(`Successfully Log Out`, { position: 'bottom-center' });
    } catch (e) {
      this.toastService.error(`Something went wrong`, { position: 'bottom-center' })
    } finally {
      /**
       * TODO: Perform user data persistance cleanup
       */
      this.router.navigateByUrl('/public');
      // clear private videos
    }
  }


  private async inWebSignInWithPopUp(auth: Auth) {
    try {
      const result = await signInWithPopup(auth, provider);
      if (result) {
        const user = result.user;
        this.authUser.set(user);
        await this.router.navigateByUrl('/public')
      }
    } catch (error: any) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      console.error(error);
      this.toastService.error(`Something went wrong. Please try later.`, { position: 'bottom-center' })

    }
  }

  private async inPhoneSignInWithRedirect(auth: Auth) {
    try {
      const result = await signInWithRedirect(auth, provider) as any;
      if (result && result['user']) {
        const user = result.user;
        this.authUser.set(user);
        await this.router.navigateByUrl('/player')
      }
    } catch (error: any) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error(error);
      this.toastService.error(`Something went wrong. Please try later.`, { position: 'bottom-center' })
    }
  }
}


