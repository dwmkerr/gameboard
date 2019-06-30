build: ios android

# Setup a working environment.
init:
	sudo gem install bundler


ios:
	npm install
	bundle install
	bundle exec fastlane ios build

android:
	npm install
	bundle exec fastlane android build

upload-alpha:
	# Android currently disabled...
	# ./scripts/testfairy-upload.sh ./artifacts/android/GameBoard.apk
	./scripts/testfairy-upload.sh ./artifacts/ios/GameBoard.ipa
	./scripts/upload-dsym.sh -f ${TESTFAIRY_API_KEY} -p ./artifacts/ios

# Run the CircleCI build locally.
circleci_android:
	circleci config validate -c .circleci/config.yml
	circleci build --job android

# Clean the React Native cache and just about anything else we can.
clean:
	rm -rf ./node_modules
	rm -rf ./ios/Pods
	rm -fr $$TMPDIR/react-*
	npm cache clean --force
	rm -rf /tmp/metro-bundler-cache-*
	rm -rf /tmp/haste-map-react-native-packager-*

.PHONY: ios android
