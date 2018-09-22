import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-admin-access-actions',
  templateUrl: './admin-access-actions.component.html',
  styleUrls: ['./admin-access-actions.component.scss']
})
export class AdminAccessActionsComponent implements OnInit {

  constructor(public appComp: AppComponent) { }

  ngOnInit() {
    this.appComp.setAdmin();
  }

}
