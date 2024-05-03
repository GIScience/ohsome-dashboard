# ohsome dashboard

[![Build Status](https://jenkins.heigit.org/buildStatus/icon?job=ohsome-dashboard/main)](https://jenkins.heigit.org/job/ohsome-dashboard/job/main/)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=GIScience_ohsome-dashboard&metric=alert_status)](https://sonarcloud.io/dashboard?id=GIScience_ohsome-dashboard)
[![status: active](https://github.com/GIScience/badges/raw/master/status/active.svg)](https://github.com/GIScience/badges#active)
[![LICENSE](https://img.shields.io/github/license/GIScience/ohsome-dashboard)](LICENSE)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fdashboard.ohsome.org)](https://dashboard.ohsome.org)

Try out the online version here: https://dashboard.ohsome.org/

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.0.

## Setup

Use node v18+

The following steps describe possible setups using `npm`.

### Simple Setup

If you only want to change things in the `dashboard` code:
```bash
export DASHBOARD_FOLDER=$(pwd)/ohsome-dashboard # modify to your desired dashboard source folder
git clone ssh://git@github.com:GIScience/ohsome-dashboard.git $DASHBOARD_FOLDER

# eventually switch to a development branch
npm install

npm start
```

### Advanced Setup

If you need to make changes in dashboard code and ohsome-js-utils at the same time:
```bash
export DASHBOARD_FOLDER=$(pwd)/ohsome-dashboard # modify to your desired dashboard source folder
export OHSOME_UTILS_FOLDER=$(pwd)/ohsome-js-utils # modify to your desired ohsome-js-utils source folder
git clone ssh://git@github.com:GIScience/ohsome-dashboard.git $DASHBOARD_FOLDER
git clone ssh://git@github.com:GIScience/ohsome-js-utils.git $OHSOME_UTILS_FOLDER

cd $OHSOME_UTILS_FOLDER/dist
npm link
cd $DASHBOARD_FOLDER

# eventually switch to a development branch
npm install
npm link "@giscience/ohsome-js-utils"

npm start
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod --env=prod` flag for a production build.

## Linting
We are using `eslint`. To configure rules change `.eslintrc.json`.

Run `ng lint` to find out about code style problems.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.
Run `ng e2e` to choose an e2e platform that angular will install for you.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
