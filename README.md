# GameBoard [![CircleCI](https://circleci.com/gh/dwmkerr/gameboard.svg?style=shield)](https://circleci.com/gh/dwmkerr/gameboard) [![codecov](https://codecov.io/gh/dwmkerr/gameboard/branch/master/graph/badge.svg)](https://codecov.io/gh/dwmkerr/gameboard) [![dependencies Status](https://david-dm.org/dwmkerr/gameboard/status.svg)](https://david-dm.org/dwmkerr/gameboard) [![devDependencies Status](https://david-dm.org/dwmkerr/gameboard/dev-status.svg)](https://david-dm.org/dwmkerr/gameboard?type=dev)

[![Greenkeeper badge](https://badges.greenkeeper.io/dwmkerr/gameboard.svg)](https://greenkeeper.io/)
      - run: ./scripts/testfairy-upload.sh ./artifacts/android/GameBoard.apk

## Developer Guide

The app is based on [mcnamee/react-native-starter-kit](https://github.com/mcnamee/react-native-starter-kit) v2. v2 is significantly different to the current branch.
## Setup

You'll need to setup some tools on your dev machine:

```bash
# Install a Ruby Bundler, so we can grab Ruby dependencies like Fastlane.
sudo gem install bundler
bundle update
```

## Guide

The main application lifecycle, login state and connected state is managed in the `App` component.

## Credentials

Most sensitive data is stored in: `git@github.com:dwmkerr/dwmkerr.git` in the `fastlane-match` branch. This branch contains the Android Keystore, Provisioning Profiles, Certs etc.

Fastlane certs keyphrase: `gameboard`

## CircleCI

Followed the docs at:

https://circleci.com/docs/2.0/ios-codesigning/

## Social Accounts

- Twitter: https://apps.twitter.com/app/14632367
- Google:  

## Google

- Setup following this: https://github.com/devfd/react-native-google-signin
- Then set up signing following this: https://developers.google.com/android/guides/client-auth

## 
