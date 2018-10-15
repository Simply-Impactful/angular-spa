import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-access-level',
  templateUrl: './admin-access-level.component.html',
  styleUrls: ['./admin-access-level.component.scss']
})
export class AdminAccessLevelComponent implements OnInit {

  inputText;
  editField: string;
  levelList: Array<any> = [
    { id: 1, points: 1000,  levelInfo: 'Elephant', image: 'Elephant' },
  ];

  awaitingLevelList: Array<any> = [
    { id: 2, points: '', levelInfo: '', image: '' },
  ];

  constructor() { }

  ngOnInit() {
  }

  save() {}

  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent;
    this.levelList[id][property] = editField;
  }

  remove(id: any) {
    this.awaitingLevelList.push(this.levelList[id]);
    this.levelList.splice(id, 1);
  }

  add() {
      const level = this.awaitingLevelList[0];
      this.levelList.push(level);
      this.awaitingLevelList.splice(0, 1);
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }
}
