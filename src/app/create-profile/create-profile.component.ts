import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CognitoUtil } from '../services/cognito.service';


@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit {
  userType: any;
  private sub: any;
  

  constructor(private route: ActivatedRoute, public cognitoUtil: CognitoUtil) {
  }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
       this.userType = params['userType']; // (+) converts string 'id' to a number

       // In a real app: dispatch action to load the details here.
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  createAccount(){
    let userPool = this.cognitoUtil.getUserPool();
    console.log("userPool " + JSON.stringify(userPool));
  }
   
  

}
