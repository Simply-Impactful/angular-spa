import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss']
})
export class AdminViewComponent implements OnInit {

  inputText: string = '';
  // grab stored value from DB
  dynamicText: string = 'Americans user 500 million plastic straws each day.';

  constructor() { }

  ngOnInit() {
  }

  save(){
    // update stored value in database when the user clicks save
    this.dynamicText = this.inputText;
    console.log(this.dynamicText);

  }
}
