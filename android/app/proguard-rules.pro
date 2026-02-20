# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:


-keep class com.facebook.react.** { *; }
-dontwarn com.facebook.react.**


-keep class okhttp3.** { *; }
-keep class com.google.gson.** { *; }
-keepattributes Signature
-keepattributes *Annotation*

-keep class com.google.android.gms.maps.** { *; }
-keep class com.airbnb.android.react.maps.** { *; }
-keep class com.reactnative.imagepicker.** { *; }

