#!/usr/bin/env bash -e

# Get the version from the package.json.
version=$(cat package.json | grep version | cut -d'"' -f4)

# Get the current version and current build.
currentVersion=$(/usr/libexec/PlistBuddy -c "Print CFBundleShortVersionString" ./ios/GameBoard/Info.plist)
currentBuild=$(/usr/libexec/PlistBuddy -c "Print CFBundleVersion" ./ios/GameBoard/Info.plist)

# Set the bundle version.
echo "Updating version '${currentVersion}' to '${version}'..."
/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString ${version}" ./ios/GameBoard/Info.plist

# Set the build num.
if [[ -z "$BUILD_NUM" ]]; then
    echo "No \$BUILD_NUM specified, build num will remain as '$currentBuild'."
else
    echo "Updating build num '${currentBuild}' to '${BUILD_NUM}'..."
    /usr/libexec/PlistBuddy -c "Set :CFBundleVersion ${BUILD_NUM}" ./ios/GameBoard/Info.plist
fi

# Set the version.
cat ./android/app/build.gradle | sed -E "s/versionName .*$/versionName \"${version}\"/" > ./android/app/build.gradle.tmp

# Set the build number.
cat ./android/app/build.gradle.tmp | sed -E "s/versionCode [0-9]+$/versionCode ${BUILD_NUM}/" > ./android/app/build.gradle
rm ./android/app/build.gradle.tmp
