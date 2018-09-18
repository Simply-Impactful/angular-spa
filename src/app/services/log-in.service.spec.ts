import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LogInService } from './log-in.service';
import { CognitoUtil } from '../services/cognito.service';

describe('LogInService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CognitoUtil,
        LogInService,
        HttpClientTestingModule
      ]
    });
  });

  it('should be created', inject([LogInService], (service: LogInService) => {
    expect(service).toBeTruthy();
  }));
});
