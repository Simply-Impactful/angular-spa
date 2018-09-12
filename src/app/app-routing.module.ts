import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';

import { LogInComponent } from './log-in/log-in.component';
import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home/home.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SecurityQuestionsComponent } from './security-questions/security-questions.component';
import { ActionsComponent } from './actions/actions.component';
import { ConfirmSignUpComponent } from './confirm-sign-up/confirm-sign-up.component';
import { CreateGroupComponent } from './create-group/create-group.component';

const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LogInComponent },
  { path: 'contactus', component: ContactUsComponent },
  { path: 'createuser/:userType', component: CreateProfileComponent },
  { path: 'userprofile', component: UserProfileComponent },
  { path: 'security', component: SecurityQuestionsComponent },
  { path: 'resetpass', component: ResetPasswordComponent },
  { path: 'actions', component: ActionsComponent },
  { path: 'confirmSignUp/:username', component: ConfirmSignUpComponent },
  { path: 'creategroup', component: CreateGroupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
