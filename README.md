# GameBoard [![CircleCI](https://circleci.com/gh/dwmkerr/gameboard.svg?style=shield)](https://circleci.com/gh/dwmkerr/gameboard) [![codecov](https://codecov.io/gh/dwmkerr/gameboard/branch/master/graph/badge.svg)](https://codecov.io/gh/dwmkerr/gameboard) [![dependencies Status](https://david-dm.org/dwmkerr/gameboard/status.svg)](https://david-dm.org/dwmkerr/gameboard) [![devDependencies Status](https://david-dm.org/dwmkerr/gameboard/dev-status.svg)](https://david-dm.org/dwmkerr/gameboard?type=dev)

[![Greenkeeper badge](https://badges.greenkeeper.io/dwmkerr/gameboard.svg)](https://greenkeeper.io/)
      - run: ./scripts/testfairy-upload.sh ./artifacts/android/GameBoard.apk

## Setup

You'll need to setup some tools on your dev machine:

```bash
# Install a Ruby Bundler, so we can grab Ruby dependencies like Fastlane.
sudo gem install bundler
bundle update
```

## Developer Guide

### Branching

The main branch is `develop`. Merges into `master` trigger a release (see [Releasing](#releasing)).

### Structure

The main application lifecycle, login state and connected state is managed in the `App` component.

### Environment Variables

The following environment variables are used.

| Environment Variable | Usage |
|----------------------|-------|
| `GH_TOKEN` | A personal access token to GitHub. Only required when running the `make release` command, used when release notes are generated. |
| `NPM_TOKEN` | An NPM Access Token. Only required when running the `make release` command, used when publishing the npm module for version number tracking. |

## Credentials

Most sensitive data is stored in: `git@github.com:dwmkerr/dwmkerr.git` in the `fastlane-match` branch. This branch contains the Android Keystore, Provisioning Profiles, Certs etc.

Fastlane certs keyphrase: `gameboard`

## CircleCI

Followed the docs at:

https://circleci.com/docs/2.0/ios-codesigning/

## Releasing

Any commit to `master` will trigger a release of the project. [`semantic-release`](https://github.com/semantic-release/semantic-release) is used to automatically create release notes and increment version numbers.

## Social Accounts

- Twitter: https://apps.twitter.com/app/14632367
- Google:  

## Google

- Setup following this: https://github.com/devfd/react-native-google-signin
- Then set up signing following this: https://developers.google.com/android/guides/client-auth
