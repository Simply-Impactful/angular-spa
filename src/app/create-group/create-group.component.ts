import { Component, OnInit } from '@angular/core';
import { CreateGroupService } from '../services/creategroup.service';
import { Group } from '../model/group';


@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {

  groupName: string = '';
  groupType: string = '';
  subcategory: string = '';
  zipcode: string = '';
  other: string = '';
  groupLeader: string = '';
  groupMember: string = '';
  isOther: Boolean = false;
  createdGroup: Group;
  isGroupCreated: boolean;


  constructor(private createGroupService: CreateGroupService) { }

  ngOnInit() {
    this.createdGroup = new Group();
  }

  toggleOption() {
    if (this.createdGroup.groupType === 'Other') {
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
