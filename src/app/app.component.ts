import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'Change Is Simple';
  username = 'Jack';
  userscore = 35;
  searchGroups: string[] = ['Pink', 'Red', 'Purple'];

  constructor(){}
  
  ngOnInit() {}
}



