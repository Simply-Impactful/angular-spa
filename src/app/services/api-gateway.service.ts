import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CognitoUtil, Callback, LoggedInCallback, CognitoCallback } from './cognito.service';
import { User } from '../model/User';
import { Buffer } from 'buffer';
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
      callback.cognitoCallbackWithParam(data);
    });
  }
  getUserActions(callback: Callback, user: User) {
    const use = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + use + '.idToken');
    const username = user.username;
    this.http.get(`https://j514vann5l.execute-api.us-east-1.amazonaws.com/cis/userActions/${username}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      })
    }).subscribe((data) => {
      callback.callbackWithParameters(null, data);
    });
  }
  performAction(callback, user, action) {
    const use = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + use + '.idToken');
    const pointsEarned = action.eligiblePoints;
    const JSON_BODY = {
      username: user.username,
      actionTaken: action.name,
      email: user.email,
      pointsEarned: pointsEarned,
      carbonPoints: action.carbonPoints,
      recordedFrequency: 1,
      zipcode: user.address
    };
    const body = new Buffer(JSON.stringify(JSON_BODY)).toString('utf8');
    this.http.post('https://j514vann5l.execute-api.us-east-1.amazonaws.com/cis/userActions', body, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      }),
    }).subscribe((data) => {
      callback.callbackWithParameters(null, data);
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
      callback.callbackWithParams(null, data);
    });
  }
  adminCreateGroupsData(groupsData: any, callback: CognitoCallback) {
    const user = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + user + '.idToken');
    const JSON_BODY = [];
    for (let i = 0; i < groupsData.length; i++) {
      JSON_BODY.push({
        type: groupsData[i].type,
        subType: groupsData[i].subType
      });
    }
    const body = new Buffer(JSON.stringify(JSON_BODY)).toString('utf8');
    this.http.post('https://f6ss1zd1w0.execute-api.us-east-1.amazonaws.com/cis/adminData', body, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      }),
    }).subscribe((data) => {
      callback.cognitoCallback(null, data);
    });
  }
  createLevelData(levelData, callback) {
    const user = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + user + '.idToken');
    const JSON_BODY = [];
    for (let i = 0; i < levelData.length; i++) {
      JSON_BODY.push({
        min: levelData[i].min,
        max: levelData[i].max,
        statusGraphicUrl: levelData[i].statusGraphicUrl,
        status: levelData[i].status,
        description: levelData[i].description
      });
    }

    const body = new Buffer(JSON.stringify(JSON_BODY)).toString('utf8');
    this.http.post('https://fw154850pg.execute-api.us-east-1.amazonaws.com/cis/LevelData', body, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      })
    }).subscribe((data) => {
      callback.cognitoCallback(null, data);
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
      callback.callbackWithParams(null, data);
    });
  }
  getAllGroups(callback) {
    const user = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + user + '.idToken');
    this.http.get('https://rfma1hd646.execute-api.us-east-1.amazonaws.com/cis/groups/list', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      })
    }).subscribe((data) => {
      callback.cognitoCallbackWithParam(data);
    });
  }
  createGroup(groupData, callback) {
    const user = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.LastAuthUser');
    const idToken = localStorage.getItem('CognitoIdentityServiceProvider.1ei721sssm9hem7j2dineeb6n4.' + user + '.idToken');

    const JSON_BODY = [];
    for (let i = 0; i < groupData.length; i++) {
      JSON_BODY.push({
        name: groupData[i].name,
        username: groupData[i].username, // leader
        description: groupData[i].description,
        zipCode: groupData[i].zipCode,
        groupAvatar: groupData[i].groupAvatar,
        groupType: groupData[i].groupType,
        groupSubType: groupData[i].groupSubType, // different than the array for metaData
        members: groupData[i].membersString,
        pointsEarned: groupData[i].pointsEarned
      });
    }
    const body = new Buffer(JSON.stringify(JSON_BODY)).toString('utf8');
    this.http.post('https://rfma1hd646.execute-api.us-east-1.amazonaws.com/cis/groups', body, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + idToken
      }),
    }).subscribe((data) => {
      callback.cognitoCallback(null, data);
    });
  }
}
