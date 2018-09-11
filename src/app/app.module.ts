import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LogInComponent } from './log-in/log-in.component';
import { LandingComponent } from './landing/landing.component'
import { MaterialModule } from './material.module';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { HttpClientModule, HttpClient, HttpHeaders, HttpRequest,HttpParams} from '@angular/common/http';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SecurityQuestionsComponent } from './security-questions/security-questions.component';
import { AppTopNavComponent } from './app-top-nav/app-top-nav.component';
import { HomeComponent } from './home/home.component';
import { AngularFileUploaderModule, AngularFileUploaderComponent } from "angular-file-uploader";
import { UploadComponent } from './upload/upload.component';
import { ActionsComponent } from './actions/actions.component';
import { AwsUtil } from './services/aws.service';
import { CreateProfileService } from './services/create-profile.service';
import { ConfirmSignUpComponent } from './confirm-sign-up/confirm-sign-up.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { CreateGroupService } from './services/creategroup.service';
import { ActionComponent } from './action/action.component';
import { ActionDialogComponent } from './action-dialog/action-dialog.component';
import { ActionService } from './services/action.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CognitoUtil } from './services/cognito.service';


@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    LandingComponent,
    ContactUsComponent,
    UserProfileComponent,
    CreateProfileComponent,
    ResetPasswordComponent,
    SecurityQuestionsComponent,
    AppTopNavComponent,
    HomeComponent,
    UploadComponent,
    ActionsComponent,
    ConfirmSignUpComponent,
    CreateGroupComponent,
    ActionComponent,
    ActionDialogComponent
  ],
  imports: [
    [ BrowserModule, FormsModule],
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFileUploaderModule,
    BrowserAnimationsModule
  ],
  entryComponents: [
    ActionDialogComponent
  ],
  providers: [ CreateGroupService, ActionService, CognitoUtil, AwsUtil, CreateProfileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
