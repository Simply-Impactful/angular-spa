import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent implements OnInit {
  password: string = '';
  confirmPassword: string = '';
  message: string = '';

  constructor(private router: Router) { }

  ngOnInit() {}

  save() {
    // update the password details in the DB.. make a call to the backend here.
    // this.password is the parameter to pass
    if (this.password !== this.confirmPassword) {
      this.message = 'Passwords do not match';
    } else if (this.password === '') {
      this.message = 'Password must not be empty';
    } else {
      this.router.navigate(['/home']);
    }
  }
}
