import { User } from './../model/User';
import { Action } from './../model/Action';
import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { LoggedInCallback, CognitoUtil } from '../services/cognito.service';
import { AWSError } from 'aws-sdk';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { Group } from '../model/Group';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DoubleRowPaginatorComponent } from '../double-row-paginator/double-row-paginator.component';

/**
 * @title Table with expandable rows
 */
@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GroupsComponent implements OnInit, LoggedInCallback {
  constructor(
    public lambdaService: LambdaInvocationService) { }

  dataSource;
  columnsToDisplay = ['name', 'leader', 'createdDate', 'totalPoints', 'zipCode', 'joinGroup'];
  groups: Group[];
  isExpanded: boolean = false;
  isCollapsed: boolean = true;
  expandedElement: any;
  tempElementData: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(DoubleRowPaginatorComponent) customPaginator: DoubleRowPaginatorComponent;

  isExpansionDetailRow = (i: number, row: Object) => {
    // console.log(row);
    return row.hasOwnProperty('detailRow');
  }

  ngOnInit() {
     this.lambdaService.getAllGroups(this);
  }
  isLoggedIn(message: string, loggedIn: boolean): void {}

  joinGroup() {
    console.log('join group');
  }

  expand() {
    this.isExpanded = true;
    this.isCollapsed = false;
  }
  collapse() {
    this.isCollapsed = true;
    this.isExpanded = false;
  }

  // response of lamdba list Actions API call
  callbackWithParams(error: AWSError, result: any): void {
    const response = JSON.parse(result);
    this.groups = response.body;
    for (let i = 0; i < this.groups.length; i++) {
      this.groups[i].groupAvatar = 'https://s3.amazonaws.com/simply-impactful-image-data/StrawFactImage.jpg';
    }
    this.dataSource = this.groups;

  //  this.dataSource = new MatTableDataSource<any>();

  //  this.dataSource.sort = this.sort;

 //   this.dataSource.paginator = this.customPaginator;
/**    this.dataSource.sortingDataAccessor = (item, property) => {

      let newItem;
      if (item.element !== undefined) {
        newItem = item.element;
       } else {
        newItem = item;
       }
      console.log(this.tempElementData);
      let foundElement;
      if (item.element !== undefined) {
        foundElement = this.tempElementData.find(i => i.element !== undefined && item.element.name === i.element.name);
       } else {
        foundElement = this.tempElementData.find(i => item.name === i.name);
      }
      const index = this.tempElementData.indexOf(foundElement);
      console.log('foundElement: ' + JSON.stringify(item) + ' '  + +index);
      return +index;
   }; **/
 }
  // response of isAuthenticated method in login service
  callbackWithParam(result: any): void {}

}
