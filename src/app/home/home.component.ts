import { Component, OnInit } from '@angular/core';
import { Group } from '../model/Group';
import { CreateGroupService } from '../services/creategroup.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/User';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userSource = new BehaviorSubject(new User());
  user$ = this.userSource.asObservable();
  user: User;

  userscore = '';

  groupSource = new BehaviorSubject(new Group());
  group$ = this.groupSource.asObservable();
  group: Group;

  constructor(private createGroupService: CreateGroupService) { }

  ngOnInit() {
    // userscore = whatever is pulled from the db
    this.createGroupService.group$.subscribe(createdGroup => {
      this.group = createdGroup;
    });
 //   console.log("HOME comp this.user " + JSON.stringify(this.user));
  }
}
