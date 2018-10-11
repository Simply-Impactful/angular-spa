import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Route, Router } from '@angular/router';
import { S3Service } from '../services/s3.service';
import { AppConf } from '../shared/conf/app.conf';

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
  imageFile: any;
  conf = AppConf;
  item: any = {};

  constructor(public appComp: AppComponent, private s3: S3Service) { }

  ngOnInit() {
    // TODO: this is not the right place to set this. Admin is set on congito profile response
    this.appComp.setAdmin();
  }

  save() {
    // update stored value in database when the user clicks save
    console.log(this.description);
    this.item.description = this.description;
    console.log(this.description);

    this.s3.uploadFile(this.imageFile, this.conf.imgFolders.facts, (err, location) => {
      if (err) {
        // we will allow for the creation of the item, we have a default image
        console.log(err);
        this.item.factUrl = this.conf.default.facts;
      } else {
        this.item.factUrl = location;
      }
      console.log('here we save the item:', this.item);
      // lambda invoke with entire object
    });
  }

  fileEvent(fileInput: any, imageName) {
    // save the image file which will be submitted later
    this.imageFile = fileInput.target.files[0];
  }

}
