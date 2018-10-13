import { Component, OnInit } from '@angular/core';
import { AppConf } from '../shared/conf/app.conf';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  conf = AppConf;
  factOfTheDayText: string = 'Americans use about 500 million plastic straws each day.';
  factOfTheDayUri: string = this.conf.default.factOfTheDayUri;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getFactOfDay().subscribe();
  }

  getFactOfDay(): Observable<any> {
    return this.http.get<any>(this.factOfTheDayUri, { responseType: 'json' }).pipe(
      map(res => {
        this.factOfTheDayText = res.factOfTheDayText;
      }),
      catchError(err => {
        const errMsg = (err || err.message) ? err.message : (err || {}).toString();
        return throwError(errMsg);
    })
    );
  }
}
