package app.iola.iola;

import android.os.Bundle;
import com.facebook.react.ReactFragmentActivity;
import com.facebook.react.ReactActivityDelegate;

import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle;
import android.support.annotation.Nullable;

public class MainActivity extends ReactFragmentActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "iola";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {

            /**
             * Sets application component properties
             *
             * @return Bundle
             */
            @Nullable
            @Override
            protected Bundle getLaunchOptions() {
                Bundle bundle = new Bundle();
                bundle.putBoolean("isStorybook", BuildConfig.FLAVOR.equals("storybook"));

                return bundle;
            }
        };
    }
}
