import { Component, OnInit } from '@angular/core';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent {

  username: string = '';
  email: string = '';
  zipcode: string = '';
  organization: string = '';
  isEditProfile: Boolean = false;
  isUserProfile: Boolean = true;


  constructor() { }

  editProfile() {
    this.isUserProfile = false;
      this.isEditProfile = true;
  }
  userProfile() {
    this.isEditProfile = false;
    this.isUserProfile = true;
  }
}

