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
  factOfTheDayText: string = '';
  imageFile: any;
  conf = AppConf;
  fact: any = {};
  successMessage: string;
  constructor(public appComp: AppComponent, private s3: S3Service) { }

  ngOnInit() {

    // TODO: this is not the right place to set this. Admin is set on congito profile response
    this.appComp.setAdmin();
  }

  save() {
    // update stored value in database when the user clicks save
    this.fact.factOfTheDayText = this.factOfTheDayText.substring(0, 120);
    this.fact.name = this.conf.default.factOfTheDayKey;
    this.fact.type = 'application/json';

    this.s3.uploadFile(this.imageFile, this.conf.imgFolders.facts, (err, location) => {
      if (err) {
        // we will allow for the creation of the item, we have a default image
        console.error(err);
        this.fact.factUrl = this.conf.default.facts;
      } else {
        this.fact.factUrl = location;
      }
      const file = JSON.stringify(this.fact);

      this.s3.uploadFile(this.fact, this.conf.imgFolders.facts, (_err, _location) => {
        if (_err) {
          console.error(err);
          return;
        }
        this.successMessage = 'Fact has been updated!';
      });
    });
  }

  fileEvent(fileInput: any) {
    // save the image file which will be submitted later
    this.imageFile = fileInput.target.files[0];
  }

}
