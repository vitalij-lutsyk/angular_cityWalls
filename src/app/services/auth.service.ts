import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string;
  userId: string;
  userEmail = '';
  constructor(private router: Router) {}
  signUp(email: string, pass: string): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, pass)
      .then(data => data)
      .catch(e => e);
  }

  signIn(email: string, pass: string): Promise<any> {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then(data => {
        this.userEmail = data.user.email;
        this.userId = data.user.uid;
        firebase
          .auth()
          .currentUser.getIdToken()
          .then((token: string) => {
            this.token = token;
          });
      });
  }

  logOut() {
    firebase.auth().signOut();
    this.token = null;
  }
}
