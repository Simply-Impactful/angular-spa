import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CognitoUtil } from './cognito.service';

import * as AWS from 'aws-sdk';
//  import * as S3 from 'aws-sdk/clients/s3';

@Injectable({
  providedIn: 'root'
})
export class S3Service {
  // TODO: put these in a single
  rootFolder = 'images';
  region = environment.region;
  apiVersion = '2006-03-01';
  bucketName: string;

  public cognitoUtil: CognitoUtil;
  constructor() {
    this.bucketName = 'simply-impactful-image-data';
  }

  /**
   *
   * @param file - File - to update to the s3 bucket. Check type.
   * @param [folder] - string - s3 bucket folder location.
   */
  uploadFile(file: File, folder?: string) {
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({ IdentityPoolId: environment.identityPoolId});

    const s3 = new AWS.S3({
      region: environment.region,
      apiVersion: '2006-03-01',
      params: { Bucket: this.bucketName}
    });

    if (!file) {
      throw new Error('Please specify a file name');
    }

    const _folder = folder || this.rootFolder;
    const params = {
      Bucket:   this.bucketName,
      Key:  `${_folder}/${file.name}`,
      Body: file,
      ACL: 'public-read'
    };

    s3.upload(params, function (err, data) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }

      console.log('Successfully uploaded file.', data);
      return true;
    });
  }
}
