# MARIA LUCENA

- Add a step to add the `error.html` to the `dist` folder.
- TODO: https://stackoverflow.com/questions/43118592/angular-2-how-to-hide-nav-bar-in-some-components
- Codepipeline
- AWS doesn't render non static references 
- Add images bucket:
following this article to set up s3.fileUpload:
https://medium.com/@bevin.hernandez/angular-5-file-uploads-to-s3-with-relative-ease-ea19b7fd120e

{
    "Version": "2012-10-17",
    "Id": "Policy1538095811174",
    "Statement": [
        {
            "Sid": "Stmt1538095800490",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:*",
            "Resource": "arn:aws:s3:::simply-impactful-image-data/*"
        }
    ]
    
}

//d704df5911c8d3fffcb053b59e9ffe923d79cd7fd9f7743a68a09b953894e2af

import { AppConf } from '../shared/conf/app.conf';
private appConf = AppConf;

this.appConf.default.userProfile

const file = fileInput.target.files[0];