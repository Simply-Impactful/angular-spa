import { Component, OnInit } from '@angular/core';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {

  userscore: number;
  username = 'Jack';

  constructor() { }

  ngOnInit() {
    // this.userscore = valueFromTheDB;
  }

  add(name: string) {}
}
