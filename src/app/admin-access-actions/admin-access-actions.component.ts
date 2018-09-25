import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Route, Router } from '@angular/router';
import {MatTableDataSource, MatButton} from '@angular/material';


export interface ActionData {
  ACTION: string;
  POINTS: number;
  LIMIT: number;
  FREQUENCY: string;
  FACT: String;
  IMAGE: String;
  ICON: String;
    // Remove: CheckboxRequiredValidator;
}

const ACTION_DATA: ActionData[] = [

  {ACTION: 'Skipped the show', POINTS: 1, LIMIT: 2, FREQUENCY: 'Per Day', FACT: 'Americans use 500 straw per day',
  IMAGE: 'show', ICON: 'straw'},
  {ACTION: 'Skipped the show', POINTS: 1, LIMIT: 2, FREQUENCY: 'Per Day', FACT: 'Americans use 500 straw per day',
  IMAGE: 'show', ICON: 'straw'},
  {ACTION: 'Skipped the show', POINTS: 1, LIMIT: 2, FREQUENCY: 'Per Day', FACT: 'Americans use 500 straw per day',
  IMAGE: 'show', ICON: 'straw'},
  {ACTION: 'Skipped the show', POINTS: 1, LIMIT: 2, FREQUENCY: 'Per Day', FACT: 'Americans use 500 straw per day',
  IMAGE: 'show', ICON: 'straw'},
  {ACTION: 'Skipped the show', POINTS: 1, LIMIT: 2, FREQUENCY: 'Per Day', FACT: 'Americans use 500 straw per day',
  IMAGE: 'show', ICON: 'straw'},
  {ACTION: 'Skipped the show', POINTS: 1, LIMIT: 2, FREQUENCY: 'Per Day', FACT: 'Americans use 500 straw per day',
  IMAGE: 'show', ICON: 'straw'},
];

@Component({
  selector: 'app-admin-access-actions',
  templateUrl: './admin-access-actions.component.html',
  styleUrls: ['./admin-access-actions.component.scss']
})

export class AdminAccessActionsComponent implements OnInit {
  displayedColumns: string[] = ['ACTION', 'POINTS', 'LIMIT', 'FREQUENCY', 'FACT', 'IMAGE', 'ICON'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  data: ActionData[] = ACTION_DATA;

   constructor(public appComp: AppComponent) { }

  ngOnInit() {
    this.appComp.setAdmin();
  }

}


