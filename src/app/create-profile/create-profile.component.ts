import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFileUploaderModule, AngularFileUploaderComponent } from "angular-file-uploader";


@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit {
  userType: any;
  private sub: any;

  /**= {
    ApiResponse: "",
    resetUpload: '',
    config: '',
    multiple: false,
    formatsAllowed: ".jpg,.png",
    maxSize: "1",
    uploadAPI:  {
      url:"https://example-file-upload-api",
      headers: {
     "Content-Type" : "text/plain;charset=UTF-8",
    // "Authorization" : `Bearer ${token}`
      }
    },
    theme: "dragNDrop",
    hideProgressBar: true,
    hideResetBtn: true,
    hideSelectBtn: true
}; **/


  constructor(private route: ActivatedRoute, private fileUpload: AngularFileUploaderModule, private afuConfig: AngularFileUploaderComponent) {
  }

  ngOnInit() {
    this.afuConfig.theme="";
    this.afuConfig.uploadAPI="https://example-file-upload-api";

    this.sub = this.route.params.subscribe(params => {
       this.userType = params['userType']; // (+) converts string 'id' to a number

       // In a real app: dispatch action to load the details here.
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  save(){
    console.log('save was called');
    // A service call to the backend will be made here to store the user's data in DB
  }

  upload(){
    
    var a= "test";
   // a = this.fileUploadComp.uploadMsgText;
  }
   
  

}
