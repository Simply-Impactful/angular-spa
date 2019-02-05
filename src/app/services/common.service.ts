import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import * as _ from 'lodash';
import { Message } from '../model/Message';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';


@Injectable()
export class CommonService {

  loaderStatusSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loaderStatus$ = this.loaderStatusSource.asObservable();
  modalStatusSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  modalStatus$ = this.modalStatusSource.asObservable();
  messageSource = new BehaviorSubject<Message>(new Message('', false));
  message$ = this.messageSource.asObservable();

  constructor() {}

  setLoader(showLoader: boolean) {
    this.loaderStatusSource.next(showLoader);
  }
  setModal(showModal: boolean) {
    this.modalStatusSource.next(showModal);
  }
  setMessage(message: Message) {
    this.messageSource.next(message);
  }

}
