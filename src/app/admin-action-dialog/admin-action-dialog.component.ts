import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Action } from '../model/Action';
import { ActionService } from '../services/action.service';
import { User } from '../model/User';
import { Parameters } from '../services/parameters';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { AWSError } from 'aws-sdk';
import { LogInService } from '../services/log-in.service';
import { CognitoUtil, LoggedInCallback } from '../services/cognito.service';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { S3Service } from '../services/s3.service';


@Component({
  selector: 'app-admin-action-dialog',
  templateUrl: './admin-action-dialog.component.html',
  styleUrls: ['./admin-action-dialog.component.scss']
})
export class AdminActionDialogComponent implements OnInit, LoggedInCallback {

  action: Action;
  http: HttpClient;
  existingActions: Action[];
  errorMessage = '';
  isCreating: boolean = false;
  isEditing: boolean = false;
  displayText = 'Edit';
  funFactImageFile: File;
  // funFactImageFile: File;
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

  // when we upload the image, this doesn't go out to s3 right way. Or does it?
  fileEvent(fileInput: any, imageName) {
    this.funFactImageFile = fileInput.target.files[0];
    console.log('file ' + JSON.stringify(this.funFactImageFile));
    // this.s3.uploadFile(this.funFactImageFile);
  }

  /**
   *
   * @param file -
   * @param name
   */
  uploadTileIcon(file: File, name) {
    this.action[name] = file;

    // this.s3.uploadFile(file);
  }


  // adminCreateAction is used for both 'create' and 'edit' calls
  // NEED TO confirm if they are trying to create a name that already exists
  onCloseConfirm() {
    let isError = false;
    const name = this.action.name;
    if (this.isCreating) {
      for (let i = 0; i < this.existingActions.length; i++) {
        if (this.existingActions[i].name === name) {
          this.errorMessage = 'Error: Unable to create an action with a name that already exists.' +
            'Please Hit UNDO and edit the action instead.';
          isError = true;
          break;
        }
      }
    } else { // they're editing
      this.lambdaService.adminCreateAction(this.action, this);
      this.thisDialogRef.close('Confirm');
      //   window.location.reload();
    }
    if (!isError) {
      this.lambdaService.adminCreateAction(this.action, this);
      this.thisDialogRef.close('Confirm');
      window.location.reload();
    }
  }

  onCloseCancel() {
    this.thisDialogRef.close('Cancel');
  }

  // Skeletal methods we need to put here in order to use the lambdaService
  isLoggedIn(message: string, loggedIn: boolean): void { }

  // response of lambda calls
  callbackWithParams(error: AWSError, result: any): void {
    //   console.log('create result ' + result);
    const response = JSON.parse(result);
    this.existingActions = response.body;
  }
  // response of is auth
  callbackWithParam(result: any): void { }

}
