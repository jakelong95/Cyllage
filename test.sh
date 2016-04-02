#!/bin/bash
curl -X GET localhost:3000/start
curl -X POST -H "Content-Type: application/json" -d '{"sessionID":"jake","operations":{"layer":0,"pos":{"x":0,"y":0},"rotate":2,"size":{"w":100,"h":100},"crop":{"x1":-1,"x2":300,"y1":10,"y2":300}}}' localhost:3000/images