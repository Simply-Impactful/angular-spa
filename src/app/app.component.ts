import { Component, OnInit } from '@angular/core';
import { AwsUtil } from './services/aws.service';
import { CognitoUtil } from './services/cognito.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
 
  constructor(public awsUtil: AwsUtil, public cognito: CognitoUtil) {
    console.log("AppComponent: constructor");
}
  
  ngOnInit() {}
}



