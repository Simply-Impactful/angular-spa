import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { WindowWrapper, GetWindow } from './shared/window.mock';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material/table';
import {
  MatPaginatorModule,
  MatIconModule,
  MatInputModule,
  MatDialogRef,
  MatSelectModule,
  MatAutocompleteModule,
  MatDialogModule
} from '@angular/material';

import { ActionsComponent } from './actions/actions.component';
import { ActionComponent } from './action/action.component';
import { ActionDialogComponent } from './action-dialog/action-dialog.component';
import { ActionService } from './services/action.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppTopNavComponent } from './app-top-nav/app-top-nav.component';
import { AwsUtil } from './services/aws.service';
import { CreateProfileService } from './services/create-profile.service';
import { GroupsComponent } from './groups/groups.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { CognitoUtil } from './services/cognito.service';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { HomeComponent } from './home/home.component';
import { LogInComponent } from './log-in/log-in.component';
import { LandingComponent } from './landing/landing.component';
import { MaterialModule } from './material.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AdminTopNavComponent } from './admin-top-nav/admin-top-nav.component';
import { AdminAccessLandingComponent } from './admin-access-landing/admin-access-landing.component';
import { AdminAccessActionsComponent } from './admin-access-actions/admin-access-actions.component';
import { AdminAccessUsersComponent } from './admin-access-users/admin-access-users.component';
import { AdminAccessGroupMetadataComponent } from './admin-access-group-metadata/admin-access-group-metadata.component';
import { Parameters } from './services/parameters';
import { LambdaInvocationService } from './services/lambdaInvocation.service';
import { AdminActionDialogComponent } from './admin-action-dialog/admin-action-dialog.component';
import { MyGroupsComponent } from './my-groups/my-groups.component';
import { AdminAccessLevelComponent } from './admin-access-level/admin-access-level.component';
import { LevelComponent } from './level/level.component';
import { LevelsMapping } from './shared/levels-mapping';
import { ExcelService } from './services/excel.service';
import { LoaderComponent } from './loader/loader.component';
import { CommonService } from './services/common.service';
import { ActionDeleteDialogComponent } from './action-delete-dialog/action-delete-dialog.component';
import { ActionConfirmDialogComponent } from './action-confirm-dialog/action-confirm-dialog.component';
import { ScoreDialogComponent } from './score-dialog/score-dialog.component';
import { HomePageModalComponent } from './home-page-modal/home-page-modal.component';
import { UserPermission } from './services/user-permission.service';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    LogInComponent,
    HomeComponent,
    LevelComponent,
    AppTopNavComponent,
    ActionsComponent,
    ActionComponent,
    GroupsComponent,
    ContactUsComponent,
    UserProfileComponent,
    CreateProfileComponent,
    ResetPasswordComponent,
    CreateGroupComponent,
    AdminTopNavComponent,
    AdminAccessLandingComponent,
    AdminAccessActionsComponent,
    AdminAccessUsersComponent,
    AdminAccessGroupMetadataComponent,
    AdminActionDialogComponent,
    MyGroupsComponent,
    AdminAccessLevelComponent,
    ActionDialogComponent,
    LoaderComponent,
    ActionDeleteDialogComponent,
    ActionConfirmDialogComponent,
    ScoreDialogComponent,
    HomePageModalComponent
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
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatAutocompleteModule,
    MatDialogModule
  ],
  entryComponents: [
    ActionDialogComponent,
    AdminActionDialogComponent,
    ActionDeleteDialogComponent,
    ActionConfirmDialogComponent
  ],
  providers: [
    { provide: WindowWrapper, useFactory: GetWindow},
    ActionService,
    CognitoUtil,
    AwsUtil,
    CreateProfileService,
    Parameters,
    LambdaInvocationService,
    HomeComponent,
    LevelsMapping,
    ActionDialogComponent,
    CommonService,
    ExcelService,
    ActionConfirmDialogComponent,
    UserPermission
  ],
  bootstrap: [AppComponent]
})

/**@NgModule({
  exports: [
    MatAutocompleteModule
  ]
}) **/


export class AppModule { }
