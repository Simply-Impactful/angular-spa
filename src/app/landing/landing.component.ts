import { Component, OnInit } from '@angular/core';
import { AdminViewComponent } from './../admin-view/admin-view.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {


  constructor() { }
  

  dynamicText: string  = '';

  ngOnInit() {
    this.dynamicText = 'Americans use about 500 million plastic straws each day.'
   // console.log("admin tex " + this.admin.dynamicText);
  }


}
