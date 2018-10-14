# It All Adds Up

A web application for Change is Simple Org that gamifies eco-friendly actions.

This project was generated with [Angular CLI][angular-cli] version 6.0.8.


## Home Page

https://s3.amazonaws.com/italladdsup/index.html

## Angular Material

Please read the Angular Material documentation for adding Material components to your Angular components:

https://material.angular.io/components/categories

Here is the theming documentation:

https://material.angular.io/guide/theming


# Convert images to SVG:

https://www.youtube.com/watch?v=wA7BX-cI-RE

## Development server

To start the server locallu run `ng serve -o`. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Building AWS S3 Assets and Deployment 

We are using the `serverless` framework configured with AWS as a provider. The chosen name for the application (S3 Bucket Name and URL): is `italladdsup.world`. In the package.json you will find 2 scripts, which when concatenated, can be used to create the assets and then push them to AWS:

- `build:prod`
- `sls:deploy:prod`


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma][karma].

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor][protacter-test].

## Known Issues

- For the global undefined error with Cognito see => https://github.com/aws-amplify/amplify-js/issues/678


## Domain Configuration to S3 bucket.

To configure the traffic routing to the S3 bucket, we followed the AWS instructions [here][aws-s3-route53]. In our scenario, we have the domain (`italladdsup.world`) registered with GoDaddy, so after following those steps we had to update the nameservers in GoDaddy (under manage DNS) with the AWS Hosted Zones NS values. [Here][aws-route53-goddady] is a helpful video used to accomplish this last part.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README][angular-readme].

[angular-cli]: https://github.com/angular/angular-cli
[angular-readme]: https://github.com/angular/angular-cli/blob/master/README.md
[karma]: https://karma-runner.github.io
[protacter-test]: http://www.protractortest.org/
[aws-s3-route53]: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/getting-started.html#getting-started-find-domain-name
[aws-route53-goddady]: https://www.youtube.com/watch?v=8Pcc13m60os