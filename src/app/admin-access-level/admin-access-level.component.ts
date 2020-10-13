import { Component, OnInit, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Levels } from '../model/Levels';
import { LogInService } from '../services/log-in.service';
import { Parameters} from '../services/parameters';
import { CognitoUtil, LoggedInCallback, Callback } from '../services/cognito.service';
import { AWSError } from 'aws-sdk';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import { S3Service } from '../services/s3.service';
import { AppConf } from '../shared/conf/app.conf';
import { ApiGatewayService } from '../services/api-gateway.service';

@Component({
  selector: 'app-admin-access-level',
  templateUrl: './admin-access-level.component.html',
  styleUrls: ['./admin-access-level.component.scss']
})
export class AdminAccessLevelComponent implements OnInit, Callback {

  conf = AppConf;
  levels: Levels[];
  displayedColumns = ['min', 'max', 'status', 'statusGraphicUrl', 'description'];
  dataSource;
  inputText;
  editField: string;
  editFieldNumber: number;
  statusGraphicUrl: any;
  awaitingLevelList: Array<any> = [];
  imageFiles: any = {};
  isViewing: boolean = true;
  isAdding: boolean = false;
  addingLevels = [];
  levelsObj = new Levels;

  constructor(public appComp: AppComponent, public lambdaService: LambdaInvocationService,
    private s3: S3Service,
    public apiService: ApiGatewayService) {}

  ngOnInit() {
    this.appComp.setAdmin();
    this.apiService.listLevelData(this);
  }

isLoggedIn(message: string, loggedIn: boolean): void {}
cognitoCallbackWithParam(result: any): void {
    if (result) {
      if (result.toString().includes('error')) {
        console.log('error pulling the levels data' + result);
        // retry
        this.apiService.listLevelData(this);
      } else {
        // const response = JSON.parse(result);
        this.levels = result;
        console.log('response.body', result);
        const ascending = this.levels.sort((a, b) => Number(a.min) - Number(b.min));
        this.dataSource = new MatTableDataSource(ascending);
      }
     }
  }

  callbackWithParam(result: any): void {}

  saveNew() {
    if (this.statusGraphicUrl) {
      this.s3.uploadFile(this.statusGraphicUrl, this.conf.imgFolders.actions, (err, location) => {
        if (err) {
          // we will allow for the creation of the item, we have a default image
          console.log(err);
          this.levelsObj.statusGraphicUrl = this.conf.default.groupAvatar;
          this.levels.push(this.levelsObj);
          // this.lambdaService.createLevelData(this.levels, this);
        } else {
            this.levelsObj.statusGraphicUrl = location;
            this.levels.push(this.levelsObj);
            // response goes to cognitoCallback
            this.apiService.createLevelData(this.levels, this);
        }
      });
    }
  }

  cognitoCallback(message: string, result: any) {
    if (result) {
      console.log('result of create level ' + result);
      this.addingLevels.pop();
    } else {
      console.log('error ' + message);
      if (message.toString().includes('credentials')) {
        this.apiService.createLevelData(this.levels, this);
      }
    }
  }

  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent;
    this.levels[id][property] = editField;
  }

  remove(id: any) {
    this.awaitingLevelList.push(this.levels[id]);
    this.levels.splice(id, 1);
  }

  add() {
  //    const level = this.awaitingLevelList[0];
      this.addingLevels.push(null);
      this.awaitingLevelList.splice(0, 1);
  }

  changeValueString(property: string, event: any) {
    this.editField = event.target.textContent;
    if (property === 'status') {
      this.levelsObj.status = this.editField;
    }
    if (property === 'description') {
      this.levelsObj.description = this.editField;
    }
  }

  changeValueNumber(property: string, event: any) {
    this.editFieldNumber = event.target.textContent;
    if (property === 'min') {
      this.levelsObj.min = this.editFieldNumber;
    }
    if (property === 'max') {
      this.levelsObj.max = this.editFieldNumber;
    }
  }

  // storing as single variables instead of an array for now...
  fileEvent(fileInput: any, imageName: string) {
    this[imageName] = fileInput.target.files[0];
  }

  callback(): void {}

  callbackWithParameters(error: AWSError, result: any) {}
}
