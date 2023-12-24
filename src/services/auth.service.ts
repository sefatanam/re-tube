import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { getAuth, signInWithPopup, GoogleAuthProvider, User, setPersistence, indexedDBLocalPersistence, signOut } from "firebase/auth";

const provider = new GoogleAuthProvider();

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authUser = signal<User | null>(null);
  router = inject(Router)
  toastService = inject(HotToastService)

  continue() {
    const auth = getAuth();
    setPersistence(auth, indexedDBLocalPersistence).then(() => {
      signInWithPopup(auth, provider)
        .then((result: any) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          // const credential = GoogleAuthProvider.credentialFromResult(result);
          // const token = credential!.accessToken;
          const user = result.user;
          this.authUser.set(user);
        }).catch((error) => {
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
        });
    }).catch((err) => {
      console.error(err);
      this.toastService.error(`Something went wrong`, { position: 'bottom-center' })

    })
  }

  signOut() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        this.authUser.set(null);
        this.toastService.success(`Successfully Log Out`, { position: 'bottom-center' })
      })
      .catch((error) => {
        this.toastService.error(`Something went wrong`, { position: 'bottom-center' })
      })
  }

}


