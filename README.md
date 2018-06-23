# GameBoard [![CircleCI](https://circleci.com/gh/dwmkerr/gameboard.svg?style=shield)](https://circleci.com/gh/dwmkerr/gameboard) [![codecov](https://codecov.io/gh/dwmkerr/gameboard/branch/master/graph/badge.svg)](https://codecov.io/gh/dwmkerr/gameboard) [![dependencies Status](https://david-dm.org/dwmkerr/gameboard/status.svg)](https://david-dm.org/dwmkerr/gameboard) [![devDependencies Status](https://david-dm.org/dwmkerr/gameboard/dev-status.svg)](https://david-dm.org/dwmkerr/gameboard?type=dev)

[![Greenkeeper badge](https://badges.greenkeeper.io/dwmkerr/gameboard.svg)](https://greenkeeper.io/)
      - run: ./scripts/testfairy-upload.sh ./artifacts/android/GameBoard.apk

## Developer Guide

The app is based on [mcnamee/react-native-starter-kit](https://github.com/mcnamee/react-native-starter-kit) v2. v2 is significantly different to the current branch.
### Setup

You'll need to setup some tools on your dev machine:

```bash
# Install a Ruby Bundler, so we can grab Ruby dependencies like Fastlane.
sudo gem install bundler
bundle update
```

### Guide

The main application lifecycle, login state and connected state is managed in the `App` component.

The app interacts with Firebase in the following way:

1. In the XXX component, we register references to a set of key collections.
2. While we are waiting for the data from our collections to arrive, the app shows a loading spinner.
3. Once we have the collection data, we wire it up to Redux. From this point onwards, changes to the collections automatically update the store.

This makes interfacing with the data very easy. Just interact with Firebase, the appropriate collections will be updated and the store will change as a result of that.

#### Navigation

- Handled via [`react-native-router-flux`](https://github.com/aksonov/react-native-router-flux)
- All routes are defined in [`Router.js`](./src/Router.js)

### Credentials

Most sensitive data is stored in: `git@github.com:dwmkerr/dwmkerr.git` in the `fastlane-match` branch. This branch contains the Android Keystore, Provisioning Profiles, Certs etc.

Fastlane certs keyphrase: `gameboard`

### CI/CD

Builds are run on CircleCI 2.

Followed the docs at: https://circleci.com/docs/2.0/ios-codesigning/

To create a release, run:

```
npm run release
```

## Data Schema

### Played Game

```
{
  "createdAt" : 1527400718170,
  "game" : "Star Realms",
  "players" : [ {
    "email" : "dwmkerr@gmail.com",
    "id" : "WisNqBdHXxPGuULiAMDo0zSE5ib2",
    "imageUri" : "https://lh4.googleusercontent.com/-_zlypNvQ2cg/AAAAAAAAAAI/AAAAAAAAB2c/BNJTtlbVWus/s96-c/photo.jpg",
    "name" : "Dave Kerr",
    "order": 1
  }, {
    "email" : "SarahLawton2010@gmail.com",
    "id" : "SarahLawton2010@gmail.com",
    "key" : "-L1r82BWXFYqWSX4_zD7",
    "name" : "Sarah Lawton",
    "rank" : 1
  } ],
  "scorerUid" : "WisNqBdHXxPGuULiAMDo0zSE5ib2"
}
```

## Social Accounts

- Twitter: https://apps.twitter.com/app/14632367
- Google:  

## Google

- Setup following this: https://github.com/devfd/react-native-google-signin
- Then set up signing following this: https://developers.google.com/android/guides/client-auth

## TODO

- [ ] Navbar buttons: use nativebase header
- [X] Edit Game
- [X] Edit Time
- [ ] Format Game History Page
- [ ] Move logout to side menu
- [ ] Move user account to firestore
- [ ] Game History auto refresh
