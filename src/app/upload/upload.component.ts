import { AngularFileUploaderComponent } from 'angular-file-uploader';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  resetUpload: boolean;
  token: string = "lkdjlfjld";
  afuConfig = {
    uploadAPI: {
      url: "https://slack.com/api/files.upload"
    }
  };

  @ViewChild("afu") private afuref1: AngularFileUploaderComponent;
  constructor() { }

  ngOnInit() {
    /* Notification.requestPermission(function(params) {
      var n = new Notification('HTML5 Notifications API', {
        body: "It's working woohoooooooooooooo...!",
        icon:'https://www.wikihow.com/images/4/4b/Right-Click-on-a-Mouse-That-Does-Not-Have-Right-Click-Step-5.jpg'
      });
    }) */
  }
  DocUpload(env) {
    console.log(env);
  }

  resetfu(id) {
    //this.rfu.resetFileUpload(id);
    //id == 1 ? this.afuref1.resetFileUpload() : this.afuref2.resetFileUpload();
    this[`afuref${id}`].resetFileUpload();
    //this.resetUpload1 = true;
  }

}
