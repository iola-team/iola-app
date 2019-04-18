package app.iola.iola;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.wheelpicker.WheelPickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
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
            new NetInfoPackage(),
            new AsyncStoragePackage(),
            new ReactNativeRestartPackage(),
            new RNScreensPackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage(),
            new RNDeviceInfo(),
            new WheelPickerPackage(),
            new RNFetchBlobPackage(),
            new PickerPackage(),
            new LinearGradientPackage(),
            new SplashScreenReactPackage()
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
}