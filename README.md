# Dino Game

This repository contains the code for a dino game, where you use your phone as the controller and a monitor to play.

The screen url is `<WEBSITE_ROOT>/screen`.
The controller url is `<WEBSITE_ROOT>`.

## Hosting

1. Fill in Pongnub credentials in `src/connection.js`.
2. Make sure the `WEBSITE_ROOT` constant is set to the correct value in `src/connection.js`.
3. Statically host the `src` folder.

## Local development

1. Make sure NodeJS is installed
2. Make sure the `WEBSITE_ROOT` constant is set to `http://localhost:3000` in `src/connection.js`.
3. Open a terminal and navigate to the folder containing this repository.
4. Execute `npx serve src` (it will locally host the `src` folder)
