import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Route, Router } from '@angular/router';
import { S3Service } from '../services/s3.service';
import { AppConf } from '../shared/conf/app.conf';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-access-landing',
  templateUrl: './admin-access-landing.component.html',
  styleUrls: ['./admin-access-landing.component.scss']
})
export class AdminAccessLandingComponent implements OnInit {
  inputText: string = '';
  imageFile: any;
  conf = AppConf;
  fact: any = {};
  factOfTheDayText: string = '';
  factUrl: string = '';
  factOfTheDayUri: string = this.conf.default.factOfTheDayUri;
  successMessage: string;

  constructor(public appComp: AppComponent, private s3: S3Service, private http: HttpClient) { }

  ngOnInit() {
    // TODO: this is not the right place to set this. Admin is set on congito profile response
    this.appComp.setAdmin();
    this.getData().subscribe();
  }

  getData(): Observable<any> {
    return this.http.get<any>(this.factOfTheDayUri, { responseType: 'json' }).pipe(
      map(res => {
        this.factOfTheDayText = (res) ? res.factOfTheDayText : this.factOfTheDayText;
        this.factUrl = (res) ? res.factUrl : this.factUrl;
      }),
      catchError(err => {
        const errMsg = (err || err.message) ? err.message : (err || {}).toString();
        return throwError(errMsg);
      })
    );
  }

  save() {
    // update stored value in database when the user clicks save
    this.fact.factOfTheDayText = this.factOfTheDayText.substring(0, 120);
    this.fact.name = this.conf.default.factOfTheDayKey;
    this.fact.type = 'application/json';

    // if they aren't uploading an image, pass forward their existing one
    if (this.imageFile) {
      this.s3.uploadFile(this.imageFile, this.conf.imgFolders.facts, (err, location) => {
        if (err) {
          // we will allow for the creation of the item, we have a default image
          console.error(err);
          this.fact.factUrl = this.factUrl;
        } else {
          this.fact.factUrl = location;
          this.s3.uploadFile(this.fact, this.conf.imgFolders.facts, (_err, _location) => {
            if (_err) {
              console.error(_err);
              return;
            }
            this.successMessage = 'Fact has been updated!';
          });
        }
        const file = JSON.stringify(this.fact);
      });

    } else if (this.factOfTheDayText) { // they uploaded a fact
      this.s3.uploadFile(this.fact, this.conf.imgFolders.facts, (_err, _location) => {
        if (_err) {
          console.error(_err);
          return;
        }
        this.successMessage = 'Fact has been updated!';
      });
    } else { // no input
      window.alert('Oops. You didn\'t upload an image or a fact!');
    }
  }

  fileEvent(fileInput: any) {
    // save the image file which will be submitted later
    this.imageFile = fileInput.target.files[0];
  }

}
