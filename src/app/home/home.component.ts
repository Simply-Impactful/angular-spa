import { Component, OnInit } from '@angular/core';
import { Group } from '../model/Group';
import { CreateGroupService } from '../services/creategroup.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/User';
import { LogInService } from '../services/log-in.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: User;

  userscore = '';

  groupSource = new BehaviorSubject(new Group());
  group$ = this.groupSource.asObservable();
  group: Group;

  constructor(private createGroupService: CreateGroupService, private loginService: LogInService) { }

  ngOnInit() {
    // userscore = whatever is pulled from the db
    this.loginService.user$.subscribe(user => {
      this.user = user;
    });
    // TODO: need to subscribe to the user in the create profile service to get points

    this.createGroupService.group$.subscribe(createdGroup => {
      this.group = createdGroup;
    });
  }
}
