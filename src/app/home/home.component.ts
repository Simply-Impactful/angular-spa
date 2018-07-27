import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userscore: number = 45;
  username: string = 'Jack';

  constructor() { }

  ngOnInit() {
  }

}
