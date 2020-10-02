import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CognitoUtil, Callback, LoggedInCallback, CognitoCallback } from './cognito.service';
@Injectable({
  providedIn: 'root'
})
export class ApiGatewayService implements OnInit {

  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    // throw new Error("Method not implemented.");
  }

  listActions(callback: LoggedInCallback) {
    const user = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + user + '.idToken');
    this.http.get('https://o9qsu1id7j.execute-api.us-east-1.amazonaws.com/cis/actions', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      })
    }).subscribe((data) => {
      // console.log("ListUsers");
      // console.log(data);
      callback.callbackWithParams(null, data);
    });

  }
  listUserActions(callback: LoggedInCallback) {
    // debugger;
    const user = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + user + '.idToken');
    this.http.get('https://j514vann5l.execute-api.us-east-1.amazonaws.com/cis/userActions', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      })
    }).subscribe((data) => {
      // console.log("ListUsers");
      // console.log(data);
      callback.callbackWithParams(null, data);
    });
  }
}
