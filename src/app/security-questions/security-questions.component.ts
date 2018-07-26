import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-security-questions',
  templateUrl: './security-questions.component.html',
  styleUrls: ['./security-questions.component.scss']
})
export class SecurityQuestionsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  save(){
    console.log("saving");
    // backend validation on security Qs and As
  }
}
