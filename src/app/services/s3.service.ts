import { Injectable } from '@angular/core';
import { AppConf } from '../shared/conf/app.conf';
import * as AWS from 'aws-sdk';


@Injectable({
  providedIn: 'root'
})
export class S3Service {
  conf = AppConf;
  bucketName: string;

  constructor() {
    this.bucketName = this.conf.imagesBucketName;
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
    const s3 = new AWS.S3({
      region: this.conf.aws.region,
      apiVersion: this.conf.aws.s3Version,
      params: { Bucket: this.bucketName }
    });

    if (!file) {
      // use default image in consuming function
      return cb('No file specified. Skip.');
    }

    const _folder = folder || this.conf.imgFolders.default;
    const body =  (file.type.match('json')) ? JSON.stringify(file) : file;

    const params = {
      Bucket: this.bucketName,
      Key: `${_folder}/${file.name}`,
      Body: body,
      ACL: 'public-read'
    };

    s3.upload(params, function (err, data) {
      if (err) {
        console.error(err);
        return cb(new Error('There was an error uploading your file.'));
      }

      const location = data.Location;

      return cb(null, location);
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

    if (!files) {
      // use default image in consuming function
      return cb('No files specified. Skip.');
    }

    const fileLocations = {};
    const length = Object.keys(files).length;

    // call this function to apply async series and return a clean list of urls.
    Object.keys(files).forEach((key, index, array) => {
      this.uploadFile(files[key], path, (err, location) => {

        if (err) {
          return fileLocations[key] = defaultImg;
        }

        fileLocations[key] = location;

        // watch out for infinite loops
        if (length === array.length ) {
          return fileLocations;
        }
      });
    });

  }
  /**
   * Fetch content from S3. Folder do not exist in S3, so we have to be specific.
   * This will read from public bucket only.
   *
   * @param { string } key - nested folder off root
   * @param { string } fileName - specific file
   * @param { Functions } cb - Function that handles AWS results.
   */
  listObject(key, folder, cb) {
    const s3 = new AWS.S3({
      region: this.conf.aws.region,
      apiVersion: this.conf.aws.s3Version,
      params: { Bucket: this.bucketName }
    });

    if (!key) {
      return cb(new Error('No key was specified'));
    }

    const params = {
      Bucket: this.bucketName,
      Key: `${folder}/${key}`
    };

    s3.getObject(params, function (err, data) {

      if (err) {
        return cb(err);
      }
      const fileData = (data.Body) ? JSON.parse(data.Body.toString()) : {};
      return cb(null, fileData);

    });
  }
}
