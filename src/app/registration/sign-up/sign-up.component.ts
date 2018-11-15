import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { NgForm } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private activeModal: NgbActiveModal
  ) {}

  ngOnInit() {}
  onSignUp(form: NgForm) {
    const { email, pass, fName, sName, age, gender } = form.value;
    this.auth
      .signUp(email, pass)
      .then(data => {
        const uid = data.user.uid;
        firebase
          .database()
          .ref(`users/${uid}`)
          .set({
            fName,
            sName,
            email,
            age,
            gender
          });
      })
      .then(data => {
        this.activeModal.close();
        alert('Реєстрація успішна!');
        this.auth.signIn(email, pass);
      });
  }
}
