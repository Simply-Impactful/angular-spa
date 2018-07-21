import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LogInComponent }      from './log-in/log-in.component';
import { LandingComponent } from './landing/landing.component'

const routes: Routes = [
  { path: 'cloud-project-ml-1', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'login', component: LogInComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
