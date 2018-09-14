import { Component, OnInit } from '@angular/core';
import { Action } from '../model/Action';
import { ActionService } from '../services/action.service';
import { User } from '../model/User';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  name: string = '';
  user: User;

  constructor(public actionService: ActionService) { }

  ngOnInit() {
  }

  openDialog(name: string) {
    this.actionService.openDialog(name);
  }
}
