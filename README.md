# GameBoard [![CircleCI](https://circleci.com/gh/dwmkerr/gameboard.svg?style=shield)](https://circleci.com/gh/dwmkerr/gameboard) [![codecov](https://codecov.io/gh/dwmkerr/gameboard/branch/master/graph/badge.svg)](https://codecov.io/gh/dwmkerr/gameboard) [![dependencies Status](https://david-dm.org/dwmkerr/gameboard/status.svg)](https://david-dm.org/dwmkerr/gameboard) [![devDependencies Status](https://david-dm.org/dwmkerr/gameboard/dev-status.svg)](https://david-dm.org/dwmkerr/gameboard?type=dev)

[![Greenkeeper badge](https://badges.greenkeeper.io/dwmkerr/gameboard.svg)](https://greenkeeper.io/) [![GuardRails badge](https://badges.production.guardrails.io/dwmkerr/gameboard.svg)](https://www.guardrails.io)
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

#### Containers

Each of the components in `./src/containers` is essentially a screen. It will often take redux state, and often fire off commands.

Scenes will normally need to be provided with some kind of handler to deal with navigation. For example, the 'Link Friend' container will need an 'onLinkFriend' function, which will normally commit the action and handle subsequent navigation. This allows scenes to be transitioned programatically:

```js
  onFindFriend = () => {
    Actions.LinkFriend({
      onPlayerSelected: async (foundFriend) => {
        const { uid } = firebase.auth().currentUser;
        firebase.firestore()
          .collection(`users/${uid}/friends`)
          .add(foundFriend);
        Actions.pop();
      },
    });
  }
```

In the example above we can see that we can programatically navigate to a scene and then deal with the result in our own way.

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

## Privacy

This is a hobby project and I make no assuranances about privacy and security. However, to try and ensure users can understand what the potential security implications are, be aware of the following notes.

1. User accounts are created based on Google OAuth, this means if you have a google account you can register.
2. The app requests your Display Name, Email Address and Thumbnail only.
3. If you are registered, other users can see your Email, Display Name and Thumbnail if they search for your email address in the 'add friends' screen.

Beyond this no personal data is used and your Google credentials are never stored (they are passed directly to google, using OAuth). In theory there should be very little data the app or server has to potentially be lost or stolen, but again, no assurances are offered.

## TODO

- [ ] Navbar buttons: use nativebase header
- [X] Edit Game
- [X] Edit Time
- [ ] Format Game History Page
- [ ] Move logout to side menu
- [ ] Move user account to firestore
- [ ] Game History auto refresh
