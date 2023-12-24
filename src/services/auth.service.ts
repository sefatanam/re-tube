import { Injectable, signal } from '@angular/core';
// import { User } from '@typings/user.type';
// import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getAuth, signInWithPopup, GoogleAuthProvider, User, setPersistence, indexedDBLocalPersistence } from "firebase/auth";

const provider = new GoogleAuthProvider();

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authUser = signal<User | null>(null)

  continue() {
    const auth = getAuth();
    setPersistence(auth, indexedDBLocalPersistence).then(() => {
      signInWithPopup(auth, provider)
        .then((result: any) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential!.accessToken;
          const user = result.user;
          this.authUser.set(user);
          console.log('Set logged in user')
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
          console.error(error)
        });
    }).catch((err) => {
      console.error(err)
    })

  }

}


