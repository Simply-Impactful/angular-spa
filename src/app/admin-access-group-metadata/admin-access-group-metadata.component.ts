import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Route, Router } from '@angular/router';
import { AWSError } from 'aws-sdk';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { LoggedInCallback } from '../services/cognito.service';

@Component({
  selector: 'app-admin-access-group-metadata',
  templateUrl: './admin-access-group-metadata.component.html',
  styleUrls: ['./admin-access-group-metadata.component.scss']
})
export class AdminAccessGroupMetadataComponent implements OnInit, LoggedInCallback {
  inputText;
  editField: string;
  typeList = [];
 /** typeList: Array<any> = [
    { id: 1, type: 'Non-Profit',  subType: 'Department, Entire Company' },
    { id: 2, type: 'For-Profit',  subType: 'Department, Entire Company' },
    { id: 3, type: 'School',  subType: '' },
    { id: 4, type: 'Other',  subType: '' },
  ]; **/

  addTypeList = [];
  awaitingTypeList: Array<any> = [];

  constructor(public appComp: AppComponent, public lambdaService: LambdaInvocationService) { }

  ngOnInit() {
    this.appComp.setAdmin();
    this.lambdaService.listGroupsMetaData(this);
  }

   // result of listGroupsMetaData - loggedInCallback interface
   callbackWithParams(error: AWSError, result: any): void {
    if (result) {
      const response = JSON.parse(result);
      this.typeList = response.body;
    }
  }
  saveNew() {}

    updateList(id: number, property: string, event: any) {
      const editField = event.target.textContent;
      this.typeList[id][property] = editField;
    }

    remove(id: any) {
      this.awaitingTypeList.push(this.typeList[id]);
      this.typeList.splice(id, 1);
    }

    add() {
// const groupType = this.awaitingTypeList[0];
        this.addTypeList.push(null);
        this.awaitingTypeList.splice(0, 1);
    }

    changeValue(id: number, property: string, event: any) {
      this.editField = event.target.textContent;
    }

    isLoggedIn(message: string, loggedIn: boolean) {}
    callbackWithParam(result: any) {}
}
