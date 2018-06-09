#!/bin/bash

DIRECTORY=`dirname $0`

patch -p0 < ${DIRECTORY}/patches/apollo.patch || true
