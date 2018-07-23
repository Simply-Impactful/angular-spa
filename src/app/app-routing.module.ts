import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LogInComponent }      from './log-in/log-in.component';
import { LandingComponent } from './landing/landing.component'
import { ContactUsComponent } from './contact-us/contact-us.component'
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';

const routes: Routes = [
  { path: 'track-change-simplyimpactful', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'login', component: LogInComponent },
  { path: 'contactus', component: ContactUsComponent },
  { path: 'createuser', component: CreateProfileComponent },
  { path: 'userprofile', component: UserProfileComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
