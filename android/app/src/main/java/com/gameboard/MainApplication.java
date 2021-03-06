package com.gameboard;

import android.app.Application;
import android.content.Context;
import android.support.multidex.MultiDex;

import com.facebook.react.ReactApplication;
import com.testfairy.react.TestFairyPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.testfairy.react.TestFairyPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.oblador.vectoricons.VectorIconsPackage;

import co.apptailor.googlesignin.RNGoogleSigninPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import com.testfairy.react.TestFairyPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new TestFairyPackage(),
            new VectorIconsPackage(),
            new TestFairyPackage(),
            new RNFirebasePackage(),
              new VectorIconsPackage(),
              new RNGoogleSigninPackage(),
              new RNFirebasePackage(),
              new RNFirebaseAnalyticsPackage(),
              new RNFirebaseAuthPackage(),
              new RNFirebaseDatabasePackage(),
              new RNFirebaseFirestorePackage(),
              new TestFairyPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }

@Override
  protected void attachBaseContext(Context base) {
     super.attachBaseContext(base);
     MultiDex.install(this);
  }
}
