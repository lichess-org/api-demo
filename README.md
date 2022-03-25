# Lichess OAuth app demo

This is an example for a fully client side OAuth app that uses various APIs.

## Try it out

[The demo app is hosted on Github Pages](https://lichess-org.github.io/api-demo/)

## Run it on your machine

1. `npm install`
1. `npm run build`
1. `npm run serve` or any other method to serve the app on http://localhost:8000

## Points of interest

- [ND-JSON stream reader](https://github.com/lichess-org/api-demo/blob/master/src/ndJsonStream.ts)
- [OAuth "Login with Lichess"](https://github.com/lichess-org/api-demo/blob/master/src/auth.ts)
- [Game play](https://github.com/lichess-org/api-demo/blob/master/src/game.ts)
- [Create a seek and await a game](https://github.com/lichess-org/api-demo/blob/master/src/seek.ts)
- [Read the main event stream](https://github.com/lichess-org/api-demo/blob/master/src/ctrl.ts)

Feel free to reuse and learn from this code when building your own Lichess API app.
