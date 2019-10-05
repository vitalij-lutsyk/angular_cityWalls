import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddNewCompositionComponent } from 'src/app/components/add-new-composition/add-new-composition.component';
import { SignInComponent } from 'src/app/pages/sign-in/sign-in.component';
import { SignUpComponent } from 'src/app/pages/sign-up/sign-up.component';
import { MapComponent } from 'src/app/components/map/map.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    public auth: AuthService,
    private modalService: NgbModal,
  ) { }

  // function, that log off users
  LogOut() {
    this.auth.logOut();
  }

  // function, that open modal with AddNewComposition component
  openAddNew() {
    const modalRef = this.modalService.open(AddNewCompositionComponent, {
      size: 'lg'
    });
  }

  // function, that open modal with SignIn component
  openSignIn() {
    const modalRef = this.modalService.open(SignInComponent, {
      centered: true,
      size: 'sm'
    });
  }

  // function, that open modal with SignUp component
  openSignUp() {
    const modalRef = this.modalService.open(SignUpComponent);
  }

  // function, that open modal with Map component
  openFullMap() {
    const modalRef = this.modalService.open(MapComponent, {
      centered: true,
      size: 'lg'
    });
  }
  ngOnInit() {
  }

}
