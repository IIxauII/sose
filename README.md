# SOSE

This repository aims at delivering an oversight of available sodexo partners in every city in germany.

The idea for this project came up after trying to utilize the existing sodexo search services:

* https://www.sodexo-akp.de/Sites/GeoCoding/affiliateSearch.aspx
* https://play.google.com/store/apps/details?id=com.appsrise.sodexo.voucher&hl=de&gl=US
* https://apps.apple.com/de/app/restaurant-pass/id1541655392

I was not satisfied with the user exerience in the webbrowser and wanted to achieve a unified solution for all end devices.
Also needed an excuse to learn ionic 😅

## Backend

Since sodexo does not offer any public API endpoints for consumption of AKP data I resorted to web scraping for gathering the necessary data.

### scraper
This service utilizes `webdriverIO` to scrape the https://www.sodexo-akp.de/Sites/GeoCoding/affiliateSearch.aspx search service.
It searches for AKP data in a specific city and downloads the HTML elements which containt the necessary data to an .html file in the `/results` folder for further processing.
Example Usages:
* headless example: `npm run scrape Karlsruhe`
* with GUI: `npm run scrape Karlsruhe true`

### processor
This service loads all `.html` files which are stored under `/scraper/results` and utilizes `cheerio` to find AKP restaurant name & address in the HTML code.
The data is then being gathered for each partner and stored in JSON format in the `/results` folder. The city name is saved in the filename.

Example Usage:
* `npm run process`


### saver
This service has two core functionalities:
1. Setting up the database for future consumption (This only needs to be done once)
2. Saving data from the `/processor/results` folder to the database

The database format being used here is `sqlite`, and the saver service uses the `sqlite3` npm package for working with the database.
If the data being processed is a new city, a new row will be created in the database.
IF the data being processed is an existing city, the AKP data for this row will be updated in the database.

Example Usage:
* `npm run setup`
* `npm run save`

### api
This API is built using `koa.js`, a lightweight web framework created from the makers of express.js.
This is our only communication pipeline for the frontend.

It provides AKP data from the database to the frontend & the possibly to trigger a scrape/process/save flow for adding a new city to the database.

This API is still work in progress.

Endpoints (WIP):
* `GET /api/cities`
* `GET /api/cities/{cityName}`
* `POST /api/cities/{cityName}`

### shellscripts
This folder contains shellscripts to simply processes which are needed during project runtime or setup.

Current scripts:
* `addACity.sh` is being used by the koa.js api to trigger a scrape/process/save flow when a request comes in to add a new city.
* `setupProject.sh` is being used to simply initial project setup.
* `showCaseDeploy.sh` helps with fetching new changes, building ionic & deploying as PWA to the webserver folder
* `updateCerts.sh` renews certificates, copies new certs to project, restarts api service to ensure new certs are being used 

## Frontend

### sodexosearcher
The frontend is built with `ionic` and `Vue.js`. I aim to use one codebase for all platforms.
The core focus is currently to provide functionality for a web application & ios, android support afterwards.

This ionic frontend is still work in progress.

Current State (WIP):
* Overview over saved cities in a searchable list
* Clicking on a city displays the available sodexo partners of that city
* Clicking on a sodexo partner opens tab to the location in google maps
* Request page for adding a new city to the database
