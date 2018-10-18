import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-admin-access-level',
  templateUrl: './admin-access-level.component.html',
  styleUrls: ['./admin-access-level.component.scss']
})
export class AdminAccessLevelComponent implements OnInit {

  inputText;
  editField: string;
  levelList: Array<any> = [
    { id: 1, points: '0 - 100',  levelInfo: 'Elephant',
        image: 'https://s3.amazonaws.com/simply-impactful-image-data/Levels/elephant2.svg' },
    { id: 2, points: '100 - 200',  levelInfo: 'Lemur',
      image: 'https://s3.amazonaws.com/simply-impactful-image-data/Levels/lemur.svg' },
  ];

  awaitingLevelList: Array<any> = [];

  constructor(private appComp: AppComponent) { }

  ngOnInit() {
    this.appComp.setAdmin();
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
