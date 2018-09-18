import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { Router, ActivatedRoute } from '@angular/router';

import { SecurityQuestionsComponent } from '../security-questions/security-questions.component';
import { CreateProfileComponent } from './create-profile.component';
import { UploadComponent } from '../upload/upload.component';

import { MaterialModule } from '../material.module';
import { CognitoUtil } from '../services/cognito.service';
import { CreateProfileService } from '../services/create-profile.service';
import { AwsUtil } from '../services/aws.service';

describe('CreateProfileComponent', () => {
  let component: CreateProfileComponent;
  let fixture: ComponentFixture<CreateProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UploadComponent,
        CreateProfileComponent,
        SecurityQuestionsComponent
      ],
      imports: [
        AngularFileUploaderModule,
        MaterialModule,
        FormsModule
      ],
      providers: [
        CreateProfileService,
        CognitoUtil,
        AwsUtil,
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },

      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
