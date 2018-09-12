import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ConfirmSignUpComponent } from './confirm-sign-up.component';
import { CognitoUtil } from '../services/cognito.service';
import { AwsUtil } from '../services/aws.service';

import { MaterialModule } from '../material.module';
import { CreateProfileService } from '../services/create-profile.service';

describe('ConfirmSignUpComponent', () => {
  let component: ConfirmSignUpComponent;
  let fixture: ComponentFixture<ConfirmSignUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmSignUpComponent],
      imports: [
        MaterialModule,
        FormsModule,
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
    fixture = TestBed.createComponent(ConfirmSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
