import { Component, OnInit } from '@angular/core';
import { AdminViewComponent } from './../admin-view/admin-view.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {


  constructor(public admin: AdminViewComponent) { }
  

  dynamicText: string  = "";

  ngOnInit() {
    this.dynamicText = this.admin.dynamicText;
   // console.log("admin tex " + this.admin.dynamicText);
  }


}
