# track-change-simplyimpactful

A web application for Change is Simple Org that gamifies eco-friendly actions.

This project was generated with [Angular CLI][angular-cli] version 6.0.8.

## Home Page in AWS S3

https://s3.amazonaws.com/track-change-simplyimpactful/index.html


## Development server

To start the server locallu run `ng serve -o`. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Building AWS S3 Assets and Deployment 

We are using the `serverless` framework configured with AWS as a provider. The chosen name for the application (S3 Bucket Name and URL): is `track-change-simplyimpactful`. In the package.json you will find 2 scripts, which when concatenated, can be used to create the assets and then push them to AWS:

- `build:prod`
- `sls:deploy:dev`

For convenience, `deploy:dev` calls them in order so you can execute the following when you are ready to sync your bucket:

`npm run deploy:dev`

**Note**: assets (images, vendor files, fonts, etc) are served from the `/src/assets` folder following Angular's conventions locally. However in S3 the reference needs to be "BUCKET_NAME" then local reference to files. Locally we can reference `track-change-simplyimpactful/etc..`. So that this can still work when this in the S3 bucket we have script extracting the contents of that folder and copying them at the root of dist before a bucket sync.


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma][karma].

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor][protacter-test].

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README][angular-readme].

[angular-cli]: https://github.com/angular/angular-cli
[angular-readme]: https://github.com/angular/angular-cli/blob/master/README.md
[karma]: https://karma-runner.github.io
[protacter-test]: http://www.protractortest.org/