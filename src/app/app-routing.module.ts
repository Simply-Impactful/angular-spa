import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LogInComponent } from './log-in/log-in.component';
import { LandingComponent } from './landing/landing.component';
import { HomeComponent } from './home/home.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ActionsComponent } from './actions/actions.component';
import { GroupsComponent } from './groups/groups.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { AdminAccessLandingComponent } from './admin-access-landing/admin-access-landing.component';
import { AdminAccessActionsComponent } from './admin-access-actions/admin-access-actions.component';
import { AdminAccessUsersComponent } from './admin-access-users/admin-access-users.component';
import { AdminAccessGroupMetadataComponent } from './admin-access-group-metadata/admin-access-group-metadata.component';
import { AdminAccessLevelComponent } from './admin-access-level/admin-access-level.component';
import { LevelComponent } from './level/level.component';

const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LogInComponent },
  { path: 'contactus', component: ContactUsComponent },
  { path: 'createuser/:userType', component: CreateProfileComponent },
  { path: 'userprofile', component: UserProfileComponent },
  { path: 'resetpass', component: ResetPasswordComponent },
  { path: 'groups', component: GroupsComponent },
  { path: 'creategroup', component: CreateGroupComponent },
  { path: 'level', component: LevelComponent },
  { path: 'adminaccesslanding', component: AdminAccessLandingComponent },
  { path: 'adminaccessusers', component: AdminAccessUsersComponent },
  { path: 'adminaccessactions', component: AdminAccessActionsComponent },
  { path: 'adminaccessgroupinfo', component: AdminAccessGroupMetadataComponent },
  { path: 'adminaccesslevel', component: AdminAccessLevelComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
