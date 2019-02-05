import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from '../services/common.service';
import { Message } from '../model/Message';

@Component({
  selector: 'app-loader-component',
  templateUrl: './loader.html',
  styleUrls: ['./common.scss']
})

export class LoaderComponent implements OnInit {

  loaderStatusSubscription: Subscription;
  messageSubscription: Subscription;
  modalSubscription: Subscription;

  isLoading: boolean;
  modalIsShown: boolean;
  hasNext: boolean;
  message: Message;

  constructor(private commonService: CommonService) {
    this.isLoading = false;
    this.hasNext = false;
    this.modalIsShown = false;
  }

  ngOnInit() {
    this.loaderStatusSubscription = this.commonService.loaderStatus$.subscribe( loading => {this.isLoading = loading; });
    this.messageSubscription = this.commonService.message$.subscribe( message => {
      this.message = message;
    });
    this.modalSubscription = this.commonService.modalStatus$.subscribe( isShown => { this.modalIsShown = isShown; });
  }
}
