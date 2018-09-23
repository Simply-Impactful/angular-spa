import { Component, OnInit } from '@angular/core';
import { Group } from '../model/group';
import { CreateGroupService } from '../services/creategroup.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/User';
import { LogInService, Parameters } from '../services/log-in.service';
import { CognitoUtil, Callback, LoggedInCallback } from '../services/cognito.service';
import { AwsUtil } from '../services/aws.service';
import { CreateProfileService } from '../services/create-profile.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, LoggedInCallback {
  user: User;
  userCopy: User;
  userscore = '';

  groupSource = new BehaviorSubject(new Group());
  group$ = this.groupSource.asObservable();
  group: Group;

  constructor(private createGroupService: CreateGroupService, private loginService: LogInService,
    private cognito: CognitoUtil, private createProfileService: CreateProfileService,
    private params: Parameters) { }

  ngOnInit() {

    // userscore = whatever is pulled from the db
    this.params.user$.subscribe(user => {
      this.user = user;
      this.userscore = this.user.userPoints;
    });

    this.createGroupService.group$.subscribe(createdGroup => {
      this.group = createdGroup;
    });

    this.loginService.isAuthenticated(this, this.user);
  }

  /** Interface needed for LoggedInCallback */
  isLoggedIn(message: string, isLoggedIn: boolean) {
  }
  // leave this for the builder to pass
  save() {

  }
}
