import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit {
  userType: any;
  private sub: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.userType = params['userType']; // (+) converts string 'id' to a number

       // In a real app: dispatch action to load the details here.
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  save(){
    console.log('save was called');
    // A service call to the backend will be made here to store the user's data in DB
  }
  

}
