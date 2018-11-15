import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignUpComponent } from '../sign-up/sign-up.component';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  @ViewChild('email')
  email: ElementRef;

  constructor(
    private auth: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal
  ) {}

  ngOnInit() {}
  onSignIn(form: NgForm) {
    const { email, pass } = form.value;
    this.auth
      .signIn(email, pass)
      .then(data => {
        this.router.navigate(['main']);
        this.activeModal.close();
      })
      .catch(e => console.log(e));
  }
  openSignUp() {
    this.activeModal.close();
    const modalRef = this.modalService.open(SignUpComponent);
  }
  onForgotPass() {
    firebase.auth().sendPasswordResetEmail(this.email.nativeElement.value);
  }
}
