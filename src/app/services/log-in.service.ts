import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { User } from '../model/User';
import { Observable } from 'rxjs';
import { map, catchError , tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LogInService {
  public apiEndpoint : string;

  constructor(private http: HttpClient) {
    this.apiEndpoint = '';
   }

  login(username: string, password: string): Observable<User>{
    let requestBody = { "username" : username, "password": password};
    // this doesn't exist yet, but the controller will route to the node.js login API call to validate credentials
    return this.http.post<User>(this.apiEndpoint + 'login',requestBody)
    .pipe(
      map(user => {
          if(user.isLoggedIn) {
            // once they're logged in, we'll route to the landing page
           console.log("logged In successfully");
          }
           else{
            console.log("User was not logged in successfully");
           }
          return user;
      })
    )
  }
}
