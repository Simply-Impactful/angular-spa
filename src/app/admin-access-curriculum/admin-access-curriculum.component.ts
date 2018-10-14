import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-admin-access-curriculum',
  templateUrl: './admin-access-curriculum.component.html',
  styleUrls: ['./admin-access-curriculum.component.scss']
})
export class AdminAccessCurriculumComponent implements OnInit {
  inputText;
  editField: string;
  typeList: Array<any> = [
    { id: 1, type: 'School',  subType: 'Club' },
  //  { id: 2, type: 'Company',  subType: 'Department' },
  //  { id: 3, type: 'Organization',  subType: 'Religious' },
  //  { id: 4, type: 'Sports',  subType: '' },
  //  { id: 5, type: 'Other',  subType: ''},
  ];

  awaitingTypeList: Array<any> = [
    { id: 6, type: '', subType: '' },
  ];

  constructor(public appComp: AppComponent) { }

  ngOnInit() {
    this.appComp.setAdmin();
  }

  save() {}

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
