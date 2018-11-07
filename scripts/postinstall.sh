#!/bin/bash

DIRECTORY=`dirname $0`

# @TODO: patch `build.gradle` of `react-native-wheel-picker-android` to support new RN-0.56.0
# Remove this when this MR is accepted: https://github.com/ElekenAgency/ReactNativeWheelPicker/pull/70
patch -fp0 < ${DIRECTORY}/patches/react-native-wheel-picker-android.patch || true
