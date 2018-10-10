import { AngularFileUploaderComponent } from 'angular-file-uploader';
import { Component, OnInit, ViewChild } from '@angular/core';
import { S3Service } from '../services/s3.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  resetUpload: boolean;
  // // token: string = 'lkdjlfjld';
  // afuConfig = {
  //   uploadAPI: {
  //     url: 'https://slack.com/api/files.upload'
  //   }
  // };

  @ViewChild('afu') private afuref1: AngularFileUploaderComponent;
  constructor(private s3: S3Service) { }

  ngOnInit() {
    /* Notification.requestPermission(function(params) {
      var n = new Notification('HTML5 Notifications API', {
        body: 'It's working woohoooooooooooooo...!',
        icon:'https://www.wikihow.com/images/4/4b/Right-Click-on-a-Mouse-That-Does-Not-Have-Right-Click-Step-5.jpg'
      });
    }) */
  }
  DocUpload(env) {
    console.log('upload');
    console.log(env);
  }

  resetfu(id) {
    this[`afuref${id}`].resetFileUpload();
  }

  uploadFile(fileInput: any) {
    console.dir(fileInput);
    const file = fileInput.target.files[0];
    this.s3.uploadFile(file);
  }

}
