import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError, tap, zip } from 'rxjs/operators';
import { Action } from '../model/Action';
import { User } from '../model/User';
import { MatDialog } from '@angular/material';
import { ActionDialogComponent } from './../action-dialog/action-dialog.component';

@Injectable()
export class ActionService implements OnInit {
  public apiEndpoint: string;

  actionSource = new BehaviorSubject(new Action());
  action$ = this.actionSource.asObservable();
  action = new Action;

  userSource = new BehaviorSubject(new User());
  user$ = this.userSource.asObservable();
  // is this the best way to do this?
  user = new User;

  dialogResult = '';

  constructor(private http: HttpClient, private dialog: MatDialog) {
    this.apiEndpoint = '';
  }

  ngOnInit() {
  }

  openDialog(name: string) {
    this.action = this.getData(name);
    const dialogRef = this.dialog.open(ActionDialogComponent, {
      width: '600px',
      //  data: {action:this.action}
    });
    this.actionSource.next(this.action);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      this.dialogResult = result;
    });
  }

  getData(name: string) {
    // Need to input this data into the DB from what the Admins upload
    // send GET request to DB to collect data for given action
    // placeholders...
    if (name === 'unplug') {
      this.action.name = 'unplug';
      this.action.points = 8;
      this.action.fact = 'Did you know? Americans use about 18 millions barrels of oil everyday';
      this.action.status = 'Elephant';
      this.action.imageUrl = '/track-change-simplyimpactful/images/FossilFuelsFacts.jpg';
    }
    if (name === 'faucet') {
      this.action.name = 'faucet';
      this.action.points = 5;
      this.action.fact = 'You saved 10 liters of water today';
      this.action.status = 'Giraffe';
      this.action.imageUrl = '';
    }
    if (name === 'light') {
      this.action.name = 'light';
      this.action.points = 7;
      this.action.fact = 'You saved 10 watts today';
      this.action.status = 'Giraffe';
      this.action.imageUrl = '';
    }
    // mock response
    return this.action;
  }

  takeAction(action: Action): Observable<Action> {
    console.log('action in take action ' + JSON.stringify(action));
    this.actionSource.next(action);
    // log points
    const points = action.points;
    this.user.points = this.user.points + points;
    console.log('user points ======>' + this.user.points);

    this.userSource.next(this.user); // user$ object
    return this.action$;
  }

  // this doesn't exist yet, but the controller will route to the node.js login API call to validate credentials
  /**    return this.http.post<action[]>(this.apiEndpoint + 'action',requestBody)
      .pipe(
        map(action => {
            this.actionSource.next(action);
            console.log("action " + action);
            return action;
        })
      ) **/
}
