import { Component, OnInit } from '@angular/core';
import { CreateGroupService } from '../services/creategroup.service';
import { BehaviorSubject } from 'rxjs';
import { group } from '../model/group';


@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {

   groupname: string = "";
   grouptype: string = "";
   subcategory: string = "";
   zipcode: string = "";
   shortdescription:string ="";
   createdGroup: group;
//   groupSource = new BehaviorSubject(new group());
 //  group$ = this.groupSource.asObservable();
   
  constructor(private createGroupService: CreateGroupService) { }
  
  ngOnInit() {
    this.createdGroup = new group();
  }

  creategroup() {
    console.log("created Group " + this.createdGroup);
    // A service call will be made here to validate the credentials against what we have stored in the DB
    this.createGroupService.creategroup(this.createdGroup).subscribe();
  }

}
