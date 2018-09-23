import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-admin-access-landing',
  templateUrl: './admin-access-landing.component.html',
  styleUrls: ['./admin-access-landing.component.scss']
})
export class AdminAccessLandingComponent implements OnInit {
  inputText: string = '';
  // grab stored value from DB
  dynamicText: string = 'Americans user 500 million plastic straws each day.';
  description: string = '';

  constructor(public appComp: AppComponent) { }

  ngOnInit() {
    this.appComp.setAdmin();
  }

  save() {
    // update stored value in database when the user clicks save
    this.dynamicText = this.inputText;
    console.log(this.dynamicText);
  }

}
