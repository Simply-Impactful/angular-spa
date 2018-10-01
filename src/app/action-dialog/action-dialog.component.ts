import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Action } from '../model/Action';
import { ActionService } from '../services/action.service';
import { User } from '../model/User';
import { Parameters } from '../services/parameters';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { AWSError } from 'aws-sdk';

@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.scss']
})
export class ActionDialogComponent implements OnInit {

  action: Action;
  user: User;

  constructor(
    @Inject(MAT_DIALOG_DATA)public data: Action,
    public thisDialogRef: MatDialogRef<ActionDialogComponent>,
    private params: Parameters,
    private lambdaService: LambdaInvocationService) { }

  ngOnInit() {
    this.action = this.data;
    this.params.user$.subscribe(user => {
      this.user = user;
    });
  }

  onCloseConfirm() {
    // console.log('ONCLOSECONFIRM user ' + JSON.stringify(this.user));
    // console.log('ONCLOSECONFIRM action ' + JSON.stringify(this.action));
    // sends points to DB for action taken
    this.user.username = 'dkrajewski';
    this.user.email = 'david.krajewski30@gmail.com';
    this.lambdaService.performAction(this, this.user, this.action);
    /*this.actionService.takeAction(this.user, this.action).subscribe(response => {
      this.action = response;
    });*/
    this.thisDialogRef.close('Confirm');
  }

  onCloseCancel() {
    this.thisDialogRef.close('Cancel');
  }

  // Skeletal methods we need to put here in order to use the lambdaService
  isLoggedIn(message: string, loggedIn: boolean): void {
    // throw new Error('Method not implemented.');
   }

   callbackWithParams(error: AWSError, result: any): void {

   }

}
