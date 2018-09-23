import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LogInService } from './log-in.service';
import { CognitoUtil } from '../services/cognito.service';
import { Parameters } from './parameters';

describe('LogInService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CognitoUtil,
        LogInService,
        Parameters,
        HttpClientTestingModule
      ]
    });
  });

  it('should be created', inject([LogInService], (service: LogInService) => {
    expect(service).toBeTruthy();
  }));
});
