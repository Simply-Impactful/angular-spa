import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { group } from '../model/group';
import { Observable } from 'rxjs';
import { map, catchError , tap, zip } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CreateGroupService {
  public apiEndpoint : string;

  constructor(private http: HttpClient) {
    this.apiEndpoint = '';
   }

  creategroup(groupname: string, 
              grouptype: string, 
              subcategory: string, 
              shortdescription: string,
              zipcode: string): Observable<group>{
    let requestBody = { "groupname" : groupname,
                        "grouptype": grouptype,
                        "subcategory" : subcategory,
                        "shortdescription": shortdescription,
                        "zipcode" : zipcode};

    // this doesn't exist yet, but the controller will route to the node.js login API call to validate credentials
    return this.http.post<group>(this.apiEndpoint + 'groupcreated',requestBody)
    .pipe(
      map(group => {
          if(group.isgroupCreated) {
            // once group created, we'll route to the home page
           console.log("group created successfully");
          }
           else{
            console.log("group was not created successfully");
           }
          return group;
      })
    )
  }
}
