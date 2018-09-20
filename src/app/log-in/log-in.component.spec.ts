import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { LogInComponent } from './log-in.component';
import { MaterialModule } from '../material.module';

import { CognitoUtil } from '../services/cognito.service';
import { AwsUtil } from '../services/aws.service';
import { LogInService } from '../services/log-in.service';

class LoginSrvcMock {
  isAuthenticated(obj: any) { return true; }
  authenticate(username: string, password: string, obj: any) {
    return {};
  }
}

describe('LogInComponent', () => {
  let component: LogInComponent;
  let fixture: ComponentFixture<LogInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LogInComponent],
      imports: [
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: CognitoUtil, useValue: {} },
        { provide: AwsUtil, useValue: {} },
        { provide: LogInService, useValue: LoginSrvcMock },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}; )
