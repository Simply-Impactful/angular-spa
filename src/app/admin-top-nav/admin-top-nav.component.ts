import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'admin-top-nav',
  templateUrl: './admin-top-nav.component.html',
  styleUrls: ['./admin-top-nav.component.scss']
})

export class AdminTopNavComponent implements OnInit {
  title: string = 'Change Is Simple';
  hideRightMenu: boolean = true;
  canSearch: boolean = false;
  userscore: number = 35; // comes from an API
  activatedRoute: ActivatedRoute;
  constructor() {
  }

  ngOnInit() {
    console.log(this.activatedRoute.url);
    this.hideRightMenu = false;

    // TODO: https://stackoverflow.com/questions/43118592/angular-2-how-to-hide-nav-bar-in-some-components

  }

}
