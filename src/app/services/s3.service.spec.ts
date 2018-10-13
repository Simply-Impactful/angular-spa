import { TestBed, inject } from '@angular/core/testing';

import { S3Service } from './s3.service';

describe('S3Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        S3Service
      ]
    });
  });

  it('should be created', inject([S3Service], (service: S3Service) => {
    expect(service).toBeTruthy();
  }));

  describe('uploadFiles', () => {
    it('should be function', inject([S3Service], (service: S3Service) => {
      expect(service.uploadFiles).toBeTruthy();
    }));

    it('should match the lengthç of the object', inject([S3Service], (service: S3Service) => {
      const files = { icon: {}, action: {}, another: {}};
      service.uploadFiles(files, 'default', 'path', (err, data) => {
        const length = Object.keys(data);
        expect(length).toBeTruthy(3);
      });

    }));
  });

});
