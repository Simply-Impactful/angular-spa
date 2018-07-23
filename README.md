# track-change-simplyimpactful

A web application for Change is Simple Org that gamifies eco-friendly actions.

This project was generated with [Angular CLI][angular-cli] version 6.0.8.

## Angular Material

Please read the Angular Material documentation for adding Material components to your Angular components:

https://material.angular.io/components/categories

Here is the theming documentation:

https://material.angular.io/guide/theming


## Home Page in AWS S3

https://s3.amazonaws.com/track-change-simplyimpactful/index.html

## Development server

To start the server locallu run `ng serve -o`. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Building AWS S3 Assets and Deployment 

We are using the `serverless` framework configured with AWS as a provider. The chosen name for the application (S3 Bucket Name and URL): is `track-change-simplyimpactful`. In the package.json you will find 2 scripts, which when concatenated, can be used to create the assets and then push them to AWS:

- `build:prod`
- `deploy:assets-move`
- `sls:deploy:dev`

For convenience, `deploy:dev` calls them in order so you can execute the following when you are ready to sync your changes to the S3 bucket:

`npm run deploy:dev`

**Note**: assets (images, vendor files, fonts, etc) are saved on the `/src/assets` folder following Angular's conventions locally. Becuase we are using S3 and we need to match our local references to what S3 is looking for, we have some configuration to force Angular to build the application and copy the assets to the `/track-change-simplyimpactful/` folder. We can make the reference to files like: `/track-change-simplyimpactful/images/logo.png`. The script `./scripts/extract-assets.sh` handles copying the contents of `/dist/track-change-simplyimpactful` to the root of `dist` to maintain the same structure on deployment.

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