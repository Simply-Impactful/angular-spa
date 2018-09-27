import { Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { Route, Router } from '@angular/router';
import {MatTableDataSource, MatPaginator, MatButton, MatCheckbox} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';


export interface ActionData {
  action: string;
  points: number;
  limit: number;
  frequency: string;
  fact: String;
  image: String;
  icon: String;
}

const ACTION_DATA: ActionData[] = [
  {action: 'Skipped the show', points: 1, limit: 2, frequency: 'Per Day',
  fact: 'Americans use 500 straw per day', image: 'show', icon: 'straw'},
  {action: 'Skipped the show', points: 2, limit: 2, frequency: 'Per Day',
  fact: 'Americans use 500 straw per day', image: 'show', icon: 'straw'},
  {action: 'Skipped the show', points: 3, limit: 2, frequency: 'Per Day',
  fact: 'Americans use 500 straw per day', image: 'show', icon: 'straw'},
  {action: 'Skipped the show', points: 4, limit: 2, frequency: 'Per Day',
  fact: 'Americans use 500 straw per day', image: 'show', icon: 'straw'},
  {action: 'Skipped the show', points: 5, limit: 2, frequency: 'Per Day',
  fact: 'Americans use 500 straw per day', image: 'show', icon: 'straw'},
  {action: 'Skipped the show', points: 6, limit: 2, frequency: 'Per Day',
  fact: 'Americans use 500 straw per day', image: 'show', icon: 'straw'},
  {action: 'Skipped the show', points: 7, limit: 2, frequency: 'Per Day',
  fact: 'Americans use 500 straw per day', image: 'show', icon: 'straw'},
  {action: 'Skipped the show', points: 8, limit: 2, frequency: 'Per Day',
  fact: 'Americans use 500 straw per day', image: 'show', icon: 'straw'},
  {action: 'Skipped the show', points: 9, limit: 2, frequency: 'Per Day',
  fact: 'Americans use 500 straw per day', image: 'show', icon: 'straw'},
  {action: 'Skipped the show', points: 10, limit: 2, frequency: 'Per Day',
  fact: 'Americans use 500 straw per day', image: 'show', icon: 'straw'},
  {action: 'Skipped the show', points: 11, limit: 2, frequency: 'Per Day',
  fact: 'Americans use 500 straw per day', image: 'show', icon: 'straw'},
  {action: 'Skipped the show', points: 12, limit: 2, frequency: 'Per Day',
  fact: 'Americans use 500 straw per day', image: 'show', icon: 'straw'},
  {action: 'Skipped the show', points: 13, limit: 2, frequency: 'Per Day',
  fact: 'Americans use 500 straw per day', image: 'show', icon: 'straw'},
  {action: 'Skipped the show', points: 14, limit: 2, frequency: 'Per Day',
  fact: 'Americans use 500 straw per day', image: 'show', icon: 'straw'},
  {action: 'Skipped the show', points: 15, limit: 2, frequency: 'Per Day',
  fact: 'Americans use 500 straw per day', image: 'show', icon: 'straw'},
  {action: 'Skipped the show', points: 16, limit: 2, frequency: 'Per Day',
  fact: 'Americans use 500 straw per day', image: 'show', icon: 'straw'},
  {action: 'Skipped the show', points: 17, limit: 2, frequency: 'Per Day',
  fact: 'Americans use 500 straw per day', image: 'show', icon: 'straw'},
  {action: 'Skipped the show', points: 18, limit: 2, frequency: 'Per Day',
  fact: 'Americans use 500 straw per day', image: 'show', icon: 'straw'},

];

@Component({
  selector: 'app-admin-access-actions',
  templateUrl: './admin-access-actions.component.html',
  styleUrls: ['./admin-access-actions.component.scss']
})

export class AdminAccessActionsComponent implements OnInit {
 displayedColumns = ['action', 'points', 'limit', 'frequency', 'fact', 'image', 'icon', 'delete'];
 datasource = new MatTableDataSource(ACTION_DATA);
 selection = new SelectionModel<ActionData>(true, []);
 data: ActionData[] = ACTION_DATA;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public appComp: AppComponent) { }

  ngOnInit() {
    this.appComp.setAdmin();
    this.datasource.paginator = this.paginator;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.data.forEach(row => this.selection.select(row));
  }
}


