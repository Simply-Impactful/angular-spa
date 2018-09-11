import { TestBed, inject } from '@angular/core/testing';

import { CreateGroupService } from './creategroup.service';

describe('CreateGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateGroupService]
    });
  });

  it('should be created', inject([CreateGroupService], (service: CreateGroupService) => {
    expect(service).toBeTruthy();
  }));
});
