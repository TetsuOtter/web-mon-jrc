#!/bin/bash
concurrently -n canvas-renderer,canvas-demo -c cyan,green \
  "yarn workspace @web-mon-jrc/canvas-renderer build:watch" \
  "yarn workspace @web-mon-jrc/canvas-demo dev $@"
