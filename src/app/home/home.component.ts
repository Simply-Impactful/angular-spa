import { Component, OnInit } from '@angular/core';
import { Group } from '../model/Group';
import { CreateGroupService } from '../services/creategroup.service';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userscore: number;
  username: string = 'Jack';
  actionPoints: number = 0;
  faucetPoints: number = 5;
  unplugPoints: number = 7;
  lightsPoints: number = 5;
  name: string = '';
  groupSource = new BehaviorSubject(new Group());
  group$ = this.groupSource.asObservable();
  group: Group;

  constructor(private createGroupService: CreateGroupService) { }

  ngOnInit() {
    // userscore = whatever is pulled from the db
    this.userscore = 0;
    this.createGroupService.group$.subscribe(createdGroup => {
      this.group = createdGroup;
    });
  }

  // Add the number of points assigned to each action
  // should make the point allocation be a method call and pass the action type to return the points
  add(name: string) {
    if (name === 'faucet') {
      this.actionPoints = this.faucetPoints;
    }
    if (name === 'lights') {
      this.actionPoints = this.lightsPoints;
    }
    if (name === 'unplug') {
      this.actionPoints = this.unplugPoints;
    }
    // = this.actionPoint+1;
    this.userscore = this.userscore + this.actionPoints;
  }
}
