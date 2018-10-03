import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule, MatDialogRef } from '@angular/material';
import { MatSelectModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material';

import { ActionsComponent } from './actions/actions.component';
import { ActionComponent } from './action/action.component';
import { ActionDialogComponent } from './action-dialog/action-dialog.component';
import { ActionService } from './services/action.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppTopNavComponent } from './app-top-nav/app-top-nav.component';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { AwsUtil } from './services/aws.service';
import { CreateProfileService } from './services/create-profile.service';
import {GroupsComponent } from './groups/groups.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { CreateGroupService } from './services/creategroup.service';
import { CognitoUtil } from './services/cognito.service';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { HomeComponent } from './home/home.component';
import { LogInComponent } from './log-in/log-in.component';
import { LandingComponent } from './landing/landing.component';
import { MaterialModule } from './material.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UploadComponent } from './upload/upload.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AdminTopNavComponent } from './admin-top-nav/admin-top-nav.component';
import { AdminAccessLandingComponent } from './admin-access-landing/admin-access-landing.component';
import { AdminAccessActionsComponent } from './admin-access-actions/admin-access-actions.component';
import { AdminAccessUsersComponent } from './admin-access-users/admin-access-users.component';
import { AdminAccessCurriculumComponent } from './admin-access-curriculum/admin-access-curriculum.component';
import { Parameters } from './services/parameters';
import { LambdaInvocationService } from './services/lambdaInvocation.service';
import { AdminActionDialogComponent } from './admin-action-dialog/admin-action-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LogInComponent,
    LandingComponent,
    ContactUsComponent,
    UserProfileComponent,
    CreateProfileComponent,
    ResetPasswordComponent,
    AppTopNavComponent,
    UploadComponent,
    ActionsComponent,
    ActionComponent,
    GroupsComponent,
    CreateGroupComponent,
    ActionDialogComponent,
    AdminTopNavComponent,
    AdminAccessLandingComponent,
    AdminAccessActionsComponent,
    AdminAccessUsersComponent,
    AdminAccessCurriculumComponent,
    AdminActionDialogComponent
  ],
  imports: [
    [BrowserModule, FormsModule],
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFileUploaderModule,
    MatTableModule,
    MatPaginatorModule
  ],
  entryComponents: [
    ActionDialogComponent,
    AdminActionDialogComponent
  ],
  providers: [
    CreateGroupService,
    CognitoUtil,
    AwsUtil,
    CreateProfileService,
    Parameters,
    LambdaInvocationService,
    ActionService],
    bootstrap: [AppComponent]
})
export class AppModule { }
