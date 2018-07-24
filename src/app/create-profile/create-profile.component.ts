import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  save(){
    console.log("saving");
    // A service call to the backend will be made here to store the user's data in DB
  }

}
