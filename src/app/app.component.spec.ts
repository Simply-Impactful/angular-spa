import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  AdminViewLanding,
  AdminViewActions,
  AdminViewCurriculum,
  AdminViewUsers
} from './admin-view/admin-view.component';
import { AdminTopNavComponent } from './admin-top-nav/admin-top-nav.component';
import { ActionsComponent } from './actions/actions.component';
import { ActionComponent } from './action/action.component';
import { ActionDialogComponent } from './action-dialog/action-dialog.component';
import { AppComponent } from './app.component';
import { AppTopNavComponent } from './app-top-nav/app-top-nav.component';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { CreateGroupComponent } from './create-group/create-group.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { HomeComponent } from './home/home.component';
import { LogInComponent } from './log-in/log-in.component';
import { LandingComponent } from './landing/landing.component';
import { MaterialModule } from './material.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UploadComponent } from './upload/upload.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SecurityQuestionsComponent } from './security-questions/security-questions.component';


import { AwsUtil } from './services/aws.service';
import { CognitoUtil } from './services/cognito.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ActionDialogComponent,
        ActionsComponent,
        ActionComponent,
        AdminTopNavComponent,
        AdminViewLanding,
        AdminViewActions,
        AdminViewCurriculum,
        AdminViewUsers,
        AppTopNavComponent,
        CreateProfileComponent,
        CreateGroupComponent,
        ContactUsComponent,
        HomeComponent,
        LogInComponent,
        LandingComponent,
        UploadComponent,
        UserProfileComponent,
        ResetPasswordComponent,
        SecurityQuestionsComponent
      ],
      imports: [
        [BrowserModule, FormsModule],
        AngularFileUploaderModule,
        MaterialModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        CognitoUtil,
        AwsUtil
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
