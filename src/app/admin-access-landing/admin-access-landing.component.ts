import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Route, Router } from '@angular/router';
import { S3Service } from '../services/s3.service';
import { AppConf } from '../shared/conf/app.conf';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { LogInService } from '../services/log-in.service';
import { AWSError } from 'aws-sdk';
import { CognitoUtil } from '../services/cognito.service';

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
  errorMessage: string;

  constructor(public appComp: AppComponent,
      private s3: S3Service,
      private http: HttpClient, private router: Router,
      private loginService: LogInService, private cognitoUtil: CognitoUtil) { }

  ngOnInit() {
    this.loginService.isAuthenticated(this);
    // TODO: this is not the right place to set this. Admin is set on congito profile response
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.appComp.setAdmin();
      this.getData().subscribe();
    } else {
      console.log('not logged in');
      this.cognitoUtil.getCurrentUser().signOut();
      this.router.navigate(['/landing']);
    }
  }
  // result of lambda listActions and Delete Actions API
  callbackWithParams(error: AWSError, result: any): void {
    console.log('result in isAuthenticated Admin landing ' + result);
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
    if (this.inputText) {
      this.fact.factOfTheDayText = this.inputText;
    } else {
      this.fact.factOfTheDayText = this.factOfTheDayText.substring(0, 120);
    }
    // update stored value in database when the user clicks save
    this.fact.name = this.conf.default.factOfTheDayKey;
    this.fact.type = 'application/json';

    // if they aren't uploading an image, pass forward their existing one
    if (this.imageFile) {
      this.successMessage = 'Loading...';
      this.s3.uploadFile(this.imageFile, this.conf.imgFolders.facts, (err, location) => {
        if (err) {
          // we will allow for the creation of the item, we have a default image
          console.error(err);
          this.fact.factUrl = this.factUrl;
          this.errorMessage = 'The image failed to upload.';
        } else {
          this.fact.factUrl = location;
          this.s3.uploadFile(this.fact, this.conf.imgFolders.facts, (_err, _location) => {
            if (_err) {
              console.error(_err);
              this.successMessage = '';
              this.errorMessage = 'The fact failed to update.';
              return;
            } else {
              this.errorMessage = '';
              this.successMessage = 'The Landing page has been updated!';
              // refresh the data for the session
              this.getData().subscribe();
            }
          });
        }
        const file = JSON.stringify(this.fact);
      });

    } else if (this.factOfTheDayText) { // they uploaded a fact
      this.successMessage = 'Loading...';
      this.fact.factUrl = this.factUrl;
      this.s3.uploadFile(this.fact, this.conf.imgFolders.facts, (_err, _location) => {
        if (_err) {
          console.error(_err);
          this.successMessage = '';
          this.errorMessage = 'The fact failed to upload.';
          return;
        } else {
          this.errorMessage = '';
          this.successMessage = 'The Landing page has been updated!';
          this.getData().subscribe();
        }
      });
    } else { // no input
      this.successMessage = '';
      this.errorMessage = 'Oops. You didn\'t upload an image or a fact!';
    }
  }

  fileEvent(fileInput: any) {
    this.successMessage = '';
    // save the image file which will be submitted later
    this.imageFile = fileInput.target.files[0];
  }

  callbackWithParam(result: any): void { }
}
