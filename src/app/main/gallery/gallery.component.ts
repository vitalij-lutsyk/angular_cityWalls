import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DbService } from '../../services/db.service';
import { UserObj } from '../../services/userObj';
import {
  NgbCarouselConfig,
  NgbCarousel,
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../services/shared.service';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  providers: [DbService, NgbCarouselConfig]
})
export class GalleryComponent implements OnInit {
  active: string;
  @ViewChild('myCarousel')
  myCarousel: NgbCarousel;
  constructor(
    public db: DbService,
    public config: NgbCarouselConfig,
    private activeModal: NgbActiveModal,
    public share: SharedService
  ) {
    this.config.interval = 1000000;
  }

  objects: UserObj[];
  ngOnInit() {
    this.myCarousel.activeId = this.share.active.toString();
    this.db.fetchData();
    this.objects = this.db.objects;
  }
  closeModal() {
    this.activeModal.close();
  }
}
