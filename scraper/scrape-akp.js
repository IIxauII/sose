//#####################################
// Scrapes sodexo akp search for data
//#####################################

/**
 * Expected arguments:
 * 1: city name or plz of place which should be scraped
 * 
 * Optional arguments:
 * 2: visible browser: 'true'
 * 
 * Example usage:
 * node ./scrape-akp.js "Karlsruhe"
 * 
 * Example usage with visible browser:
 * node ./scrape-akp.js Karlsruhe true
 */

const { remote } = require('webdriverio');
const { default: $ } = require('webdriverio/build/commands/browser/$');
const fs = require('fs');
const scrapeConfig = require('./config/scrape-config.json');
const { exec } = require('child_process');

let browser;

let toMuchArguments = false;
let toFewArguments = false;

let townNameOrPlz = '';
let visibleBrowser = false;

let scrapingIsDone = false;
let maxRunTime = 45;
let startTime = new Date();

function logTimePassed() {
    const timePassed = (new Date() - startTime)/1000;
    console.log(timePassed, 's');
}

function longRunningAborter() {
    setTimeout(() => {
        if (scrapingIsDone) {
            return;
        } else {
            console.error('Process is running longer than %s seconds - aborting', maxRunTime);
            browser.deleteSession();
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }, maxRunTime * 1000);
}

// just a test, did not work out, using a service is better :sweat:
function startChromedriver() {
    exec("chromedriver --port=4444", (error, stdout, stderr) => {
        if (error) {
            console.log('error', error);
            return;
        }
        if (stderr) {
            console.log('stderr', stderr);
            return;
        }
        console.log('stdout', stdout);
    })
}

if (process.argv.length === 2) {
    toFewArguments = true;
    console.log('No arguments provided! Aborting!');
    process.exit(1);
} else {
    // print process.argv
    process.argv.forEach(function (val, index, array) {
        console.log(index + ': ' + val);
        if (index === 2) {
            townNameOrPlz = val;
        } else if (index === 3 && val.toLowerCase() === 'true') {
            visibleBrowser = true;
        } else if (index > 4) {
            toMuchArguments = true;
        }
    });

    if (toMuchArguments) {
        console.log('To much arguments provided! Arguments:');
        console.log(process.argv);
        console.log('Aborting!');
        process.exit(1);
    }
}

// tracks time process has run, terminates process if time exceeds max
longRunningAborter();

(async () => {

    if (visibleBrowser) {
        browser = await remote({
            capabilities: {
                browserName: 'chrome',
            },
            logLevel: 'warn',
        });
    } else {
        browser = await remote({
            capabilities: {
                browserName: 'chrome',
                'goog:chromeOptions': {
                    // to run chrome headless the following flags are required
                    // (see https://developers.google.com/web/updates/2017/04/headless-chrome)
                    args: ['--headless', '--disable-gpu', '--no-sandbox'],
                }
            },
            logLevel: 'warn',
            port: 4444,
        }).catch((err) => {
            console.log('chrome headless start error!');
            console.error(err);
        })
    }

    // open sodexo search url
    console.log('1');
    logTimePassed();
    await browser.url(scrapeConfig.url.search);

    // find & select location input
    console.log('2');
    logTimePassed();
    const locationInput = await browser.$(scrapeConfig.selector.locationInput);
    await locationInput.click();

    // enter location argument
    console.log('3');
    logTimePassed();
    await locationInput.setValue(townNameOrPlz);

    // pause here to wait for sodexo akp to be ready, could be improved by just waiting until dropdown element with suggestions appear instead of hardcoding a value...
    console.log('4');
    logTimePassed();
    console.log('start pause');
    await browser.pause(500);
    console.log('end pause');

    // accept first dropdown suggestion
    console.log('5');
    logTimePassed();
    await browser.keys(['Enter']);

    // submit search
    console.log('6');
    logTimePassed();
    const searchButton = await browser.$(scrapeConfig.selector.searchButton);
    await searchButton.click();

    // find and click search results amount dropdown
    console.log('7');
    logTimePassed();
    const searchResultAmountDropdown = await browser.$(scrapeConfig.selector.searchResultsAmountDropdown);
    await searchResultAmountDropdown.click();

    // click show 'all' results per page
    console.log('8');
    logTimePassed();
    const searchResultsAmountAll = await browser.$(scrapeConfig.selector.searchResultsAmountAll);
    await searchResultsAmountAll.isClickable();
    // need to wait here since this ui is so garbage and slow, possibly faster to execute custom js here via webdriver
    // which changes the value of the input field & then executes the ASPx js method with updates the page.
    console.log('start pause');
    await browser.pause(1000);
    console.log('end pause');
    await searchResultsAmountAll.click();

    // fetching result HTML
    console.log('9');
    logTimePassed();
    console.log('start pause');
    await browser.pause(1000);
    console.log('end pause');

    const searchResultsContainer = await browser.$(scrapeConfig.selector.searchResultsContainer);
    const searchResultsContainerHTML = await searchResultsContainer.getHTML();

    console.log('10');
    logTimePassed();
    // saving result HTML as file
    const data = new Uint8Array(Buffer.from(searchResultsContainerHTML));
    const fileName = scrapeConfig.results.path + Date.now() + scrapeConfig.results.seperator + townNameOrPlz.toLowerCase() + scrapeConfig.results.fileEnding;
    fs.writeFile(fileName, data, async (err) => {
        if (err) {
            throw err;
        } else {
            console.log(`Scraped AKP data has been saved under: ${fileName}`);
        }

        // closing browser session
        await browser.deleteSession();
        scrapingIsDone = true;
        console.log('done');
        logTimePassed();
        process.exit(0);
    });
})()
