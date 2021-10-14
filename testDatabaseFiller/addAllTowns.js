const axios = require('axios');
const chalk = require('chalk');
const phr = require('pretty-hrtime');
const townData = require('./townDataClean.json');

const apiEndpoint = 'https://sose.bounceme.net:1337/api/cities/'

let startTimeGlobal;
let x = 0;
const xMax = townData.length -1;

function addATown() {
    const startTimeCurrent = process.hrtime();
    console.log(`${chalk.bold('Fetching:')} ${chalk.cyan(townData[x].name)}`);
    axios.post(apiEndpoint + townData[x].name)
        .then((res) => {
            console.log('---');
            console.log('res');
            console.log(res.data);
        })
        .catch((err) => {
            console.log('---');
            console.log('error');
            console.log(err.data);
        })
        .finally(() => {
            const timeElabsedCurrent = process.hrtime(startTimeCurrent);
            const timeElabsedGlobal = process.hrtime(startTimeGlobal);
            const townsLeft = (xMax + 1) - (x + 1);
            // just using seconds
            const estimatedTimeLeft = (timeElabsedGlobal[0] / (x + 1)) * townsLeft;
            let estimatedEndTime = process.hrtime();
            estimatedEndTime[0] -= estimatedTimeLeft;
            estimatedEndTime = process.hrtime(estimatedEndTime);
            console.log('---');
            console.log(chalk.bold('Status:'));
            console.log(`⏱  ${timeElabsedCurrent[0] < 5 ? chalk.green(phr(timeElabsedCurrent)) : chalk.yellow(phr(timeElabsedCurrent))}`);
            console.log(`▶  ${chalk.cyan((((x + 1) / (xMax + 1)) * 100).toFixed(2) + '%')} ${chalk.grey(`or ${x + 1}/${xMax + 1} towns`)}`);
            console.log(`⌛  ${chalk.cyan(phr(timeElabsedGlobal))}`);
            console.log(`⏰  ${chalk.cyan(phr(estimatedEndTime))}`);
            console.log('------------');
            ++x;
            if (x <= xMax) {
                addATown();
            } else {
                console.log('🎉 We are done! 🎉');
            }
        });
}

// lets fire this thing up! :)
startTimeGlobal = process.hrtime();
addATown();
