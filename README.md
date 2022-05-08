# Rebuild of Mediconcen clinic app

This is a rebuild of the Mediconcen clinic mobile app from ground up using React Native with Expo managed workflow.

## Requirements

- Node version 12 or newer

- expo-cli version 3.24 or newer

```sh
npm install -g expo-cli
```

- npm install

```sh
npm install
```

- expo sdk 38 or newer

```sh
npm i -g expo-cli
```

- ios simulator or android simulator

## Config

- in config.js: Config.URL stores the url for connecting to the backend server. The url is determined by the `Constants.manifest.releaseChannel`

  - dev: not defined yet
  - staging: <https://staging.calldoctor.hk/ClinicAppBackend/> (might change later)
  - testing: <https://testing.prod.mediconcen.com/ClinicAppBackend/> (might change later)
  - prod: <https://web2.prod.mediconcen.com/ClinicAppBackend/>

- app.json: config metadata about the app (see <https://docs.expo.io/versions/latest/config/app/>)

## To run using expo

- `expo install`

- `expo start`

- click Run on Android device or Run on iOS simulator, or scan the QR code with a phone installed with expo

## Build standalone app

- in app.json specific a new app version code. Note android version code must be an integer

- `expo build:{ios|android} --release-channel {dev|testing|staging|prod}` then follow the instruction (<https://docs.expo.io/distribution/building-standalone-apps/>)

## Third-party services used

- [Bugsnag](https://www.bugsnag.com/)
  - Used to track error occurred in production app
  - Currently only using free tier: 1 user, 250 event/day

## Architecture

Please see [docs](docs/README.md)

## Git workflow

- develop branch: Active development branch. Can be directly pushed to.
- feature branch: A separate branch for a specific feature. Branch from develop and merge to develop.
- release branch: Used to prepare for a release (changing meta data) and last minute bug fixes. Branch from develop, merge to master and develop.
- master branch: Active production branch. Always contains the latest stable production release. Only allow merge from release branch. Tag version number to master branch.
- hotfix branch: Short-lived branch for hotfixing urgent bugs in master. Branch from master, merge to master and develop.

### Naming

- feature: feature-featureTracker(if any)-short-decs-for-feature
- release: release-releaseNumber
- hotfix: hotfix-issureTracker(if any)-short-desc-for-hotfix
