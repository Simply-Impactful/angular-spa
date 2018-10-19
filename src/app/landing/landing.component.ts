import { Component, OnInit } from '@angular/core';
import { AppConf } from '../shared/conf/app.conf';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LogInService } from '../services/log-in.service';
import { Router } from '@angular/router';
import { LoggedInCallback } from '../services/cognito.service';
import { AWSError } from 'aws-sdk';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, LoggedInCallback {
  conf = AppConf;
  factOfTheDayText: string = 'Americans use about 500 million plastic straws each day.';
  factOfTheDayUri: string = this.conf.default.factOfTheDayUri;

  constructor(private http: HttpClient, public logInService: LogInService, public router: Router) {}

  ngOnInit() {
    this.getFactOfDay().subscribe();
    this.logInService.isAuthenticated(this);
  }

  isLoggedIn(message: string, isLoggedIn: boolean): void {
    if (isLoggedIn) {
      // will route to home page when authenticated is true
       this.router.navigate(['/home']);
    } else {
       this.router.navigate(['/landing']);
    }
  }

  getFactOfDay(): Observable<any> {
    return this.http.get<any>(this.factOfTheDayUri, { responseType: 'json' }).pipe(
      map(res => {
        this.factOfTheDayText = (res) ? res.factOfTheDayText : this.factOfTheDayText;
      }),
      catchError(err => {
        const errMsg = (err || err.message) ? err.message : (err || {}).toString();
        return throwError(errMsg);
      })
    );
  }

  callbackWithParams(error: AWSError, result: any) {}
  callbackWithParam(result: any) {}
}
