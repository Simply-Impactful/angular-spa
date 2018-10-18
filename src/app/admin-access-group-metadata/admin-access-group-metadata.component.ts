import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-admin-access-group-metadata',
  templateUrl: './admin-access-group-metadata.component.html',
  styleUrls: ['./admin-access-group-metadata.component.scss']
})
export class AdminAccessGroupMetadataComponent implements OnInit {
  inputText;
  editField: string;
  typeList: Array<any> = [
    { id: 1, type: 'School',  subType: 'Club' },
  ];

  awaitingTypeList: Array<any> = [];

  constructor(public appComp: AppComponent) { }

  ngOnInit() {
    this.appComp.setAdmin();
  }

  saveNew() {}

    updateList(id: number, property: string, event: any) {
      const editField = event.target.textContent;
      this.typeList[id][property] = editField;
    }

    remove(id: any) {
      this.awaitingTypeList.push(this.typeList[id]);
      this.typeList.splice(id, 1);
    }

    add() {
        const groupType = this.awaitingTypeList[0];
        this.typeList.push(groupType);
        this.awaitingTypeList.splice(0, 1);
    }

    changeValue(id: number, property: string, event: any) {
      this.editField = event.target.textContent;
    }
}
