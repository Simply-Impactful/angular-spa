import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userscore: number = 0;
  username: string = 'Jack';
  actionPoints: number = 0;
  isUnplug: boolean = true;
  name: string="";

  constructor() { }

  ngOnInit() {
  }

  // Add the number of points assigned to each action
  add(name: string){
    if(name=="faucet"){
      this.actionPoints=5;
    }
    if(name=="lights"){
      this.actionPoints=5;
    }
    if(name=="unplug"){
      this.actionPoints=7;
    }
    // = this.actionPoint+1;
    this.userscore = this.userscore+this.actionPoints;
  }
}
