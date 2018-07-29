import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_PACKAGE_URL_PROVIDER } from '@angular/platform-browser-dynamic/src/compiler_factory';
import * as _ from 'lodash';

@Component({
  selector: 'app-security-questions',
  templateUrl: './security-questions.component.html',
  styleUrls: ['./security-questions.component.scss']
})
export class SecurityQuestionsComponent implements OnInit {

  isSecurity: boolean = false;
  isCreateProfile: boolean = false;
  url: string;

  constructor(public router: Router) { 
  }

  ngOnInit() {
    this.url = this.router.url;

    // Defines the logic for the HTML file to allow for routing to login after password reset
    if(this.url.substring(1) == 'security'){
      this.isSecurity=true;
     }
     else{
       // allows us to route to home page after creating profile
       this.isCreateProfile=true;
     }

  }

  save(){
    console.log("saving");
    // backend validation on security Qs and As
  }
}
