// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  region: 'us-east-1',

  identityPoolId: 'us-east-1:30ec0bb4-d8a2-4d87-a1f5-799fc2fb3952',
  userPoolId: 'us-east-1_Iz6DhxAP7',
  
  clientId: '1ei721sssm9hem7j2dineeb6n4', //unauthorized
 
  //clientId: '5cq9n133nnu3kc8fofhfsd72s8', //authorized
  //clientIdSecret: 1bmsa8v91fqv9atc416881pkbcs0hool8dcgq4g00c2ssu0gbcpa

 // rekognitionBucket: 'rekognition-pics',
 // albumName: "usercontent",
  bucketRegion: 'us-east-1',

  ddbTableName: '',

  cognito_idp_endpoint: 'https://cognito-idp.us-east-1.amazonaws.com/',
  cognito_identity_endpoint: '',
  sts_endpoint: '',
  dynamodb_endpoint: '',
  s3_endpoint: ''
};


/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
