#!/bin/bash
concurrently -n canvas-renderer,app -c cyan,green \
  "yarn workspace @web-mon-jrc/canvas-renderer build:watch" \
  "yarn workspace web-mon-jrc dev $@"
