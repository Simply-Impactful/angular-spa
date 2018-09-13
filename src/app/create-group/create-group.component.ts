import { Component, OnInit } from '@angular/core';
import { CreateGroupService } from '../services/creategroup.service';
import { Group } from '../model/Group';


@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {

  groupname: string = '';
  grouptype: string = '';
  subcategory: string = '';
  zipcode: string = '';
  other: string = '';
  isOther: Boolean = false;
  createdGroup: Group;

  constructor(private createGroupService: CreateGroupService) { }

  ngOnInit() {
    this.createdGroup = new Group();
  }

  toggleOption() {
    if (this.createdGroup.grouptype === 'Other') {
      this.isOther = true;
    } else {
      this.isOther = false;
    }
  }

  creategroup() {
    // A service call will be made here to validate the credentials against what we have stored in the DB
    this.createGroupService.createGroup(this.createdGroup).subscribe();
  }

}
