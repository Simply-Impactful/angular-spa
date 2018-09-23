import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-admin-access-users',
  templateUrl: './admin-access-users.component.html',
  styleUrls: ['./admin-access-users.component.scss']
})
export class AdminAccessUsersComponent implements OnInit {

  constructor(public appComp: AppComponent) { }
  ngOnInit() {
    this.appComp.setAdmin();
  }

}
