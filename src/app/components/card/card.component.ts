import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GalleryComponent } from '../gallery/gallery.component';
import { SharedService } from 'src/app/services/shared.service';
import * as firebase from 'firebase';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() card: object;
  @Input() index: string;
  constructor(
    private modalService: NgbModal,
    public share: SharedService,
    public auth: AuthService
  ) { }

  // function, that open modal with carousel with more detail description of composition
  // as argument acceptind serial number of composition, that user has clicked
  openGallery(i) {
    // next sharing serial number of composition, that user has clicked
    // in gallery component, this value accepted, and set as started first slide
    this.share.setActive(i);
    const modalRef = this.modalService.open(GalleryComponent, {
      size: 'lg'
    });
  }

    // Main function realization voting
  // Accepting 2 argumaents- composition id and  what vote you want set (good or bad)
  voter(id, b) {
    // this commented function need in develop proccess. This function clear all vote from all composition
    // this.clearRating();
    let isVoting = false; // var, that define, did you vote some composition
    let simpleVoter: any;
    const votingRef = firebase
      .database()
      .ref('objects/' + id)
      .child('properties/rating/' + b);
    firebase
      .database()
      .ref('objects/' + id)
      .child('properties/rating/')
      .on('value', s => {
        if (s.val() !== null) {
          // look through rating keys, they are 2 - good i bad.
          for (const key in s.val()) {
            if (s.val()[key] !== null) {
              // look through user vote keys
              for (const i in s.val()[key]) {
                if (s.val()[key][i] === this.auth.userEmail) {
                  isVoting = true;
                  simpleVoter = i;
                }
              }
            }
          }
        }
      });
    // if you don't vote for some composition, calling function voting. else - vote deleting
    if (!isVoting) {
      this.voterThis(votingRef);
    } else {
      this.disVoterThis(votingRef, simpleVoter);
    }
  }
  // function, that set vote on composition. As an argument - the path to where to send a vote is transmitted
  voterThis(ratRef) {
    ratRef.push(this.auth.userEmail);
  }
  // function, that delete vote from composition. As an argument - the path to where to delete vote, and vote id.
  disVoterThis(ratRef, o) {
    ratRef.child(o).set(null);
  }
  // function, that return voter count from composition. first argument - composition id, second - vote.
  // this need to display vote count on composition
  getVoterLength(id, b) {
    let r;
    firebase
      .database()
      .ref('objects/' + id)
      .child('properties/rating/' + b)
      .on('value', s => {
        r = s.numChildren();
      });
    return r;
  }

  // function, that return color value - green if user voted as good, red if bad, gray if don't voted
  // first argument - composition id, second - vote.
  // this function need to set style on voter buttons
  getStyle(id, b) {
    let isVoted = false;
    let howVoted;
    firebase
      .database()
      .ref('objects/' + id)
      .child('properties/rating/')
      .on('value', s => {
        if (s.val() !== null) {
          const keys = Object.keys(s.val());
          for (const key of keys) {
            if (s.val()[key] !== null) {
              for (const i in s.val()[key]) {
                if (s.val()[key][i] === this.auth.userEmail) {
                  isVoted = true;
                  howVoted = key;
                }
              }
            }
          }
        }
      });
    if (isVoted && howVoted === 'good' && b === 'good') {
      return 'green';
    } else if (isVoted && howVoted === 'bad' && b === 'bad') {
      return 'red';
    } else {
      return 'gray';
    }
  }

  // function clear all vote from all composition
  clearRating() {
    firebase
      .database()
      .ref('objects/')
      .on('value', o => {
        if (o.val() !== null) {
          for (const obj in o.val()) {
            if (obj) {
              firebase
                .database()
                .ref('objects/' + obj)
                .child('properties/rating/')
                .set(null);
            }
          }
        }
      });
  }

  ngOnInit() {
    console.log(this.index);
  }

}
