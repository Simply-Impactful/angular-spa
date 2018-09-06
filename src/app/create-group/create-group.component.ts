import { Component, OnInit } from '@angular/core';
import { CreateGroupService } from '../services/creategroup.service';


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

  constructor(public createGroupService: CreateGroupService) { }
  
  ngOnInit() {
  }

  creategroup() {
    // A service call will be made here to validate the credentials against what we have stored in the DB
    this.createGroupService.creategroup(this.groupname, 
                                        this.grouptype,
                                        this.subcategory, 
                                        this.shortdescription,
                                        this.zipcode).subscribe(
      group => {
        if (group.isgroupCreated) {
          console.log("group created");
        }
      });
  }
  
}
