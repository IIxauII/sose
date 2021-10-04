#!/bin/bash
#
# Process for adding a city to database
# 
# 
echo Adding city ${1};
#
cd ../scraper && npm run scrape ${1}; #npm run scrape ${1} true;
#
cd ../processor && npm run process;
#
cd ../saver && npm run save;
#
echo It could be that city ${1} is now added;
#