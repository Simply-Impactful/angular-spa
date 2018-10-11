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
  item: any;

  constructor(public appComp: AppComponent, private s3: S3Service) { }

  ngOnInit() {
    this.appComp.setAdmin();
  }

  save() {
    // update stored value in database when the user clicks save
    this.dynamicText = this.inputText;
    this.item.dynamicText = this.inputText;
    console.log(this.dynamicText);

    this.s3.uploadFile(this.imageFile, this.conf.images.adminFolderName, (err, data) => {
      if (err) {
        return new Error('Was not able to create admin page: ' + err);
      }
      this.item.imageUrl = location;
      console.log('here we save the item:', this.item);
      // lambda invoke with entire object
    });
  }

  fileEvent(fileInput: any, imageName) {
    // save the image file which will be submitted later
    this.imageFile = fileInput.target.files[0];
  }

}
