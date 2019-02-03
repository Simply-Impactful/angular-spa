import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Email } from '../model/Email';
import { LambdaInvocationService } from '../services/lambdaInvocation.service';
import { Router } from '@angular/router';
import { CognitoCallback } from '../services/cognito.service';



@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit, CognitoCallback {
  email;

  options: FormGroup;

  constructor(fb: FormBuilder, public lambdaService: LambdaInvocationService, public router: Router) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto'
    });
  }

  ngOnInit() {
    this.email = new Email();

  }
  send() {
         this.lambdaService.sendEmail(this.email, this);
         // TODO: can we do this without a window reload?
         this.router.navigate(['/home']);
         window.location.reload();
     }
  cognitoCallback(message: string, result: any) {
      if (result) {
        this.router.navigate(['/home']);
      }
  }
}
