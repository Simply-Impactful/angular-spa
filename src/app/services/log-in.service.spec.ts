import { TestBed, inject } from '@angular/core/testing';

import { LogInService } from './log-in.service';

describe('LogInService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogInService]
    });
  });

  it('should be created', inject([LogInService], (service: LogInService) => {
    expect(service).toBeTruthy();
  }));
});
