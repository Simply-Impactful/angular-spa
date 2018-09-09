import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError , tap, zip } from 'rxjs/operators';
import { Group } from '../model/Group';

@Injectable()
export class CreateGroupService {
  public apiEndpoint : string;
  groupSource = new BehaviorSubject(new Group());
  group$ = this.groupSource.asObservable();

  constructor(private http: HttpClient) {
    this.apiEndpoint = '';
   }

  creategroup(group:Group): Observable<Group> {
    this.groupSource.next(group);
    console.log("created group " + JSON.stringify(group));
    return this.group$;
  }

    // this doesn't exist yet, but the controller will route to the node.js login API call to validate credentials
/**    return this.http.post<group[]>(this.apiEndpoint + 'groupcreated',requestBody)
    .pipe(
      map(group => {
          this.groupSource.next(group);
          console.log("group " + group);
          return group;
      })
    ) **/
}