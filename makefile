ios:
	npm install
	bundle install
	bundle exec fastlane ios build

android:
	npm install
	bundle exec fastlane android build

upload-alpha:
	./scripts/testfairy-upload.sh ./artifacts/android/GameBoard.apk
	./scripts/testfairy-upload.sh ./artifacts/ios/GameBoard.ipa
	./scripts/upload-dsym.sh -f ${TESTFAIRY_API_KEY} -p ./artifacts/ios

# Runs semantic release.
release:
	npx semantic-release


.PHONY: ios android
