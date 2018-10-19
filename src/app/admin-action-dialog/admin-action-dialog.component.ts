import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Action } from '../model/Action';
import { Parameters } from '../services/parameters';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { AWSError } from 'aws-sdk';
import { LogInService } from '../services/log-in.service';
import { CognitoUtil, LoggedInCallback, Callback } from '../services/cognito.service';
import { S3Service } from '../services/s3.service';
import { AppConf } from '../shared/conf/app.conf';

@Component({
  selector: 'app-admin-action-dialog',
  templateUrl: './admin-action-dialog.component.html',
  styleUrls: ['./admin-action-dialog.component.scss']
})
export class AdminActionDialogComponent implements OnInit, LoggedInCallback, Callback {
  conf = AppConf;
  action: Action;
  existingActions: Action[];
  errorMessage = '';
  isCreating: boolean = false;
  isEditing: boolean = false;
  displayText = 'Edit';
  imageFiles: any = {};
  funFactImage: any;
  tileIcon: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Action,
    public thisDialogRef: MatDialogRef<AdminActionDialogComponent>,
    private params: Parameters, private cognitoUtil: CognitoUtil,
    private lambdaService: LambdaInvocationService, private loginService: LogInService,
    private s3: S3Service) { }

  ngOnInit() {
    this.lambdaService.listActions(this);
    this.action = this.data;
    // if no data was passed forward, create was called
    if (!this.action) {
      this.action = new Action();
      this.isCreating = true;
      this.displayText = 'Create';
    } else {
      this.isEditing = true;
    }
  }

  // adminCreateAction is used for both 'create' and 'edit' calls
  onCloseConfirm() {
    let isError = false;
    const name = this.action.name;
    if (this.isCreating && this.existingActions) {
      for (let i = 0; i < this.existingActions.length; i++) {
        if (this.existingActions[i].name === name) {
          this.errorMessage = 'Error: Unable to create an action with a name that already exists.' +
            'Please Hit UNDO and edit the action instead.';
          isError = true;
          break;
        }
      }
    }
    if (!isError) {
      this.uploadAndSend();
   }
  }

  uploadAndSend() {
    if (this.funFactImage) {
      this.s3.uploadFile(this.funFactImage, this.conf.imgFolders.actions, (err, location) => {
        if (err) {
          // we will allow for the creation of the item, we have a default image
          console.log(err);
          this.action.funFactImageUrl = this.conf.default.groupAvatar;
          this.lambdaService.adminCreateAction(this.action, this);
        } else {
            this.action.funFactImageUrl = location;
            this.lambdaService.adminCreateAction(this.action, this);
        }
      });
    }
    if (this.tileIcon) {
      console.log('this.tileIcon ' + this.tileIcon);
      this.s3.uploadFile(this.tileIcon, this.conf.imgFolders.tileIcons, (err, location) => {
        if (err) {
          // we will allow for the creation of the item, we have a default image
          console.log(err);
          this.action.tileIconUrl = this.conf.default.groupAvatar;
          this.lambdaService.adminCreateAction(this.action, this);
        } else {
            this.action.tileIconUrl = location;
            this.lambdaService.adminCreateAction(this.action, this);
        }
      });
    } if (!this.tileIcon && !this.funFactImage) { // still create anyway
      this.lambdaService.adminCreateAction(this.action, this);
    }
  }

  onCloseCancel() {
    this.thisDialogRef.close('Cancel');
  }

  // API response of list Actions
  callbackWithParams(error: AWSError, result: any): void {
    if (result) {
      const response = JSON.parse(result);
      this.existingActions = response.body;
    }
  }

  // API response of Create Actions
  callbackWithParameters(error: AWSError, result: any) {
    if (result) {
      this.thisDialogRef.close('Confirm');
      if (this.isCreating) {
        window.location.reload();
      }
    } else {
      console.log('ERROR ' + error);
    }
  }

  // storing as single variables instead of an array for now...
  fileEvent(fileInput: any, imageName: string) {
    this[imageName] = fileInput.target.files[0];
  }

  /**
   * TODO: Which lambda is this invoking?
   * createActions
   *
   * @param item
   * @returns void
   */
  save(action) {
    console.log(JSON.stringify(action, null, 2));
    // TODO: uploadFiles. Might need async series. This will not work.
    this.s3.uploadFiles(this.imageFiles, this.conf.default.action, this.conf.imgFolders.actions,
        (err, locations) => {
      if (err) {
        return new Error('Was not able to create admin page: ' + err);
      } else {
        console.log('locations?', location);
      }
      // lambda invoke save actions
    });
  }
    /**
     // when we upload the image, this doesn't go out to s3 right way. Or does it?
    fileEvent(fileInput: any, imageName) {
      // captures an image file and adds it to the object of images. Pass correct name from html
      this.imageFiles[imageName] = fileInput.target.files[0];
    } */

    // LoggedInCallback interface
    isLoggedIn(message: string, loggedIn: boolean): void { }
    callbackWithParam(result: any): void {}

     // Callback Interface
    callback() {}
    cognitoCallbackWithParam(result: any) {}
  }
