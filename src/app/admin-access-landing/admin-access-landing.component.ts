import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Route, Router } from '@angular/router';
import { S3Service } from '../services/s3.service';

@Component({
  selector: 'app-admin-access-landing',
  templateUrl: './admin-access-landing.component.html',
  styleUrls: ['./admin-access-landing.component.scss']
})
export class AdminAccessLandingComponent implements OnInit {
  inputText: string = '';
  // grab stored value from DB
  dynamicText: string = 'Americans user 500 million plastic straws each day.';
  description: string = '';
  image: any;

  constructor(public appComp: AppComponent, private s3: S3Service) { }

  ngOnInit() {
    this.appComp.setAdmin();
  }

  save() {
    // update stored value in database when the user clicks save
    this.dynamicText = this.inputText;
    console.log(this.dynamicText);

    this.s3.uploadFile(this.image);
  }

  fileEvent(fileInput: any, imageName) {
    // save the image file which will be submitted later
    this.image = fileInput.target.files[0];
  }

}
