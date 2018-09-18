import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CreateGroupService } from './creategroup.service';

describe('CreateGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        CreateGroupService,
        HttpClientTestingModule
      ]
    });
  });

  it('should be created', inject([CreateGroupService], (service: CreateGroupService) => {
    expect(service).toBeTruthy();
  }));
});
