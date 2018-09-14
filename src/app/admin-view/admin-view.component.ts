import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-admin-view',
  templateUrl: './sub/admin-view-landing.html',
  //styleUrls: ['./admin-view.component.scss']
})
export class AdminViewLanding implements OnInit {
  inputText: string = '';
  // grab stored value from DB
  dynamicText: string = 'Americans user 500 million plastic straws each day.';
  description: string = '';

  constructor(public appComp: AppComponent) { }

  ngOnInit() {
    this.appComp.setAdmin();
  }

  save(){
    // update stored value in database when the user clicks save
    this.dynamicText = this.inputText;
    console.log(this.dynamicText);
  }
}

@Component({
  selector: 'app-admin-view',
  templateUrl: './sub/admin-view-actions.html',
  //styleUrls: ['./admin-view.component.scss']
})
export class AdminViewActions implements OnInit {

  constructor(public appComp: AppComponent) { }

  ngOnInit() {
    this.appComp.setAdmin();
  }
}

@Component({
  selector: 'app-admin-view',
  templateUrl: './sub/admin-view-users.html',
  //styleUrls: ['./admin-view.component.scss']
})
export class AdminViewUsers implements OnInit {

  constructor(public appComp: AppComponent) { }

  ngOnInit() {
    this.appComp.setAdmin();
  }
}

@Component({
  selector: 'app-admin-view',
  templateUrl: './sub/admin-view-curriculum.html',
  //styleUrls: ['./admin-view.component.scss']
})
export class AdminViewCurriculum implements OnInit {

  constructor(public appComp: AppComponent) { }

  ngOnInit() {
    this.appComp.setAdmin();
  }
}