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
  listGroupsMetaData(callback: LoggedInCallback) {
    const user = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + user + '.idToken');
    this.http.get('https://f6ss1zd1w0.execute-api.us-east-1.amazonaws.com/cis/adminData', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      })
    }).subscribe((data) => {
      // console.log("ListUsers");
      // console.log(data);
      callback.callbackWithParams(null, data);
    });
  }
  listLevelData(callback: Callback): any {
    const user = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + user + '.idToken');
    this.http.get('https://fw154850pg.execute-api.us-east-1.amazonaws.com/cis/LevelData', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      })
    }).subscribe((data) => {
      // console.log("ListUsers");
      // console.log(data);
      callback.cognitoCallbackWithParam(data);
    });
  }
  getUserActions(callback, user) {
    const use = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + use + '.idToken');
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
  performAction(callback, user, action) {
    const use = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + use + '.idToken');
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
  deleteGroup(callback, group) {
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
  adminDeleteAction(actionData, callback) {
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
  adminCreateAction(actionData, callback) {
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
  adminCreateGroupsData(groupsData: any, callback: CognitoCallback) {
    const user = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + user + '.idToken');
    this.http.get('https://j514vann5l.execute-api.us-east-1.amazonaws.com/cis/userActions', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      })
    }).subscribe((data) => {
      // console.log("ListUsers");
      // console.log(data);
      callback.cognitoCallback(null, data);
    });
  }
  createLevelData(levelData, callback) {
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
  getGroupMembers(callback, group) {
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
  getAllGroups(callback) {
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
  createGroup(groupData, callback) {
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
  sendEmail(email, callback) {
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
