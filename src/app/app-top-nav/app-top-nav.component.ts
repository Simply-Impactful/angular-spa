import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-nav',
  templateUrl: './app-top-nav.component.html',
  styleUrls: ['./app-top-nav.component.scss']
})
export class AppTopNavComponent implements OnInit {
  title: string = 'Change Is Simple';
  hideRightMenu: boolean = true;
  canSearch: boolean = false;
  userscore: number = 35; // comes from an API
  searchGroups: string[] = ['Pink', 'Red', 'Purple'];

  constructor() {
  }

  ngOnInit() {
    this.hideRightMenu = false; // TODO: https://stackoverflow.com/questions/43118592/angular-2-how-to-hide-nav-bar-in-some-components
  }

}
