import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CognitoUtil } from './cognito.service';
import * as AWS from 'aws-sdk';

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
   * Upload a file to S3 images bucket and return it's location
   *
   * @param { File } file  - to update to the s3 bucket. Check type.
   * @param { string } folder - s3 bucket folder location.
   * @param { Function } cb - callback function to handle nested call.
   * @returns { string } location - s3 public location of image.
   */
  public uploadFile(file: File, folder: string, cb) {
    AWS.config.credentials =
      new AWS.CognitoIdentityCredentials({ IdentityPoolId: environment.identityPoolId });

    const s3 = new AWS.S3({
      region: environment.region,
      apiVersion: '2006-03-01',
      params: { Bucket: this.bucketName }
    });

    if (!file) {
      // use default image in consuming function
      return cb('No file specified. Skip.');
    }

    const _folder = folder || this.rootFolder;

    const params = {
      Bucket: this.bucketName,
      Key: `${_folder}/${file.name}`,
      Body: file,
      ACL: 'public-read'
    };

    s3.upload(params, function (err, data) {
      if (err) {
        console.error(err);
        return  cb(new Error('There was an error uploading your file.'));
      }

      const location = data.Location;
      cb(null, location);
    });
  }

  /**
   *
   * @param { Files[]} files
   * @param  {Function } cb - callback for hanlding
   * @returns  { Error, Object } error from lambda or fileLocations as a {: val1, key2: val} pair.
   */
  // this.imageFiles, this.conf.imgFolders.actions
  uploadFiles(files, defaultImg, path, cb) {
    const fileLocations = {};

    // call this function to apply async series and return a clean list of urls.
    Object.keys(files).forEach(key => {
      this.uploadFile(files[key], path, (err, location) => {
        if (err) {
          return fileLocations[key] = defaultImg;
        }
        fileLocations[key] = location;
      });
    });
    console.log(fileLocations);
    return fileLocations;
  }
  /**
   * Fetch content from S3. Folder do not exist in S3, so we have to be specific.
   * This will read from public bucket only.
   *
   * @param { string } folder - nested folder off root
   * @param { string } fileName - specific file
   * @param { Functions } cb - Function that handles AWS results.
   */
  listObject(folder, fileName, cb) {
    AWS.config.credentials =
      new AWS.CognitoIdentityCredentials({ IdentityPoolId: environment.identityPoolId });

    const s3 = new AWS.S3({
      region: environment.region,
      apiVersion: '2006-03-01',
      params: { Bucket: this.bucketName }
    });

    if (!folder) {
      cb(new Error('Please specify a folder'));
    }

    /* Test to ensure I can specify a resource with parameters. */

    const params = {
      Bucket: this.bucketName,
      Delimiter: '/',
      Prefix: `${folder}/${fileName}`
    };

    s3.listObjects(params, function (err, data) {
      if (err) {
        cb(err);
      } else {
        cb(null, data);
      }
    });
  }
}
