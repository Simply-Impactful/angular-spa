import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Action } from '../model/Action';
import { ActionService } from '../services/action.service';
import { User } from '../model/User';
import { Parameters } from '../services/parameters';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { AWSError } from 'aws-sdk';
import { LogInService } from '../services/log-in.service';
import { CognitoUtil } from '../services/cognito.service';
import { HttpClient } from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-admin-action-dialog',
  templateUrl: './admin-action-dialog.component.html',
  styleUrls: ['./admin-action-dialog.component.scss']
})
export class AdminActionDialogComponent implements OnInit {

  action: Action;
  http:  HttpClient;

  constructor(
    @Inject(MAT_DIALOG_DATA)public data: Action,
    public thisDialogRef: MatDialogRef<AdminActionDialogComponent>,
    private params: Parameters, private cognitoUtil: CognitoUtil,
    private lambdaService: LambdaInvocationService, private loginService: LogInService) { }

  ngOnInit() {
    this.action = this.data;
  }

  uploadFunFactImage(file: File) {
    console.log('file ' + JSON.stringify(file));
  //  this.action.funFactImageUrl = file;

    this.basicUploadSingle(file);
  }

  uploadTileIcon(file: File) {
 //   this.action.tileIconUrl = file;

    this.basicUploadSingle(file);
  }

   // this will fail since file.io dosen't accept this type of upload
  // but it is still possible to upload a file with this style
  basicUploadSingle(file: File) {
    // need to replace with S3 URL
    this.http.post('https://file.io', file)
      .subscribe(event => {
        console.log('done');
      });
  }

  // adminCreateAction is used for both 'create' and 'edit' calls
  // NEED TO confirm if they are trying to create a name that already exists
  onCloseConfirm() {
    this.lambdaService.adminCreateAction(this.action, this);
   // window.location.reload();
    this.thisDialogRef.close('Confirm');
  }

  onCloseCancel() {
    this.thisDialogRef.close('Cancel');
  }

  // Skeletal methods we need to put here in order to use the lambdaService
  isLoggedIn(message: string, loggedIn: boolean): void {}

   // response of lambda call
   callbackWithParams(error: AWSError, result: any): void {
     console.log('create result ' + result);
   }
   // response of is auth
   callbackWithParam(result: any): void {}

}
