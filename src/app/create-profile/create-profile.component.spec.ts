import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { Router, ActivatedRoute, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../material.module';

import { CreateProfileComponent } from './create-profile.component';
import { UploadComponent } from '../upload/upload.component';

import { AwsUtil } from '../services/aws.service';
import { CognitoUtil } from '../services/cognito.service';
import { CreateProfileService } from '../services/create-profile.service';
import { from } from 'rxjs';

describe('CreateProfileComponent', () => {
  let component: CreateProfileComponent;
  let fixture: ComponentFixture<CreateProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UploadComponent,
        CreateProfileComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        AngularFileUploaderModule,
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule
      ],
      providers: [
        CreateProfileService,
        CognitoUtil,
        { provide: AwsUtil, useValue: {} },
        { provide: Router, useValue: {} },
        {
          provide: ActivatedRoute,
          useValue: { params: from([{ id: 1 }]) },
        }
      ]
    }).compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
