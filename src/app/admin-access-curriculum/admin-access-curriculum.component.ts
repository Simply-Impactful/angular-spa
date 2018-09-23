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

  constructor(public appComp: AppComponent) { }

  ngOnInit() {
    this.appComp.setAdmin();
  }

  save() {}
}
