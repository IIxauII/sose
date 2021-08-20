const fs = require('fs');
const cheerio = require('cheerio');
const processorConfig = require('./config/processor-config.json');
const path = require('path');

// loads file & processes data of it
function processOneFile(inputFilePath, fileName, fileData) {
    console.log('Starting with processing of %s', fileName);
    let $ = cheerio.load(fileData, {}, false);

    let entries = $(processorConfig.input.selectors.entries);

    let akpPartners = [];

    entries.each((i, entry) => {
        let akpPartner = {
            name: $(entry).children(processorConfig.input.selectors.name).text(),
            address: $(entry).children(processorConfig.input.selectors.address).text(),
        };
        akpPartners.push(akpPartner);
    });

    // creating output filePath, extracting .html fileEnding from fileName
    const outputFilePath = processorConfig.output.path + fileName.slice(0, -5) + processorConfig.output.fileEnding;
    fs.writeFile(outputFilePath, JSON.stringify(akpPartners), (err) => {
        if (err) {
            throw err;
        } else {
            console.log('Saved akpPartners data from %s to %s', inputFilePath, outputFilePath);

            // deleting now processed .html file
            fs.unlink(inputFilePath, (err) => {
                if (err) {
                    throw err;
                } else {
                    console.log('Done processing, deleting %s', inputFilePath);
                    console.log('done');
                }
            })
        }
    });
}   

// loads input dir
// processes files in dir
function processInputDir() {
    fs.readdir(processorConfig.input.path, {}, (err, fileNames) => {
        if (err) {
            throw err;
        } else {
            console.log('read dir %s', processorConfig.input.path);
            console.log(fileNames);
            fileNames = fileNames.filter(el => path.extname(el) === '.html');
            console.log(fileNames);
            fileNames.forEach((fileName) => {
                const inputFilePath = processorConfig.input.path + fileName;
                fs.readFile(inputFilePath, 'utf8', (err, data) => {
                    if (err) {
                        throw err;
                    } else {
                        console.log('Loaded file: %s', inputFilePath);
                        console.log(data.length);
                        processOneFile(inputFilePath, fileName, data);
                    }
                })
            });
        }
    });
}

// executing stuff here:
processInputDir();