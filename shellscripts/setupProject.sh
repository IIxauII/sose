#
# Simplifies project setup
#
echo "🛠 Setting up SOSE project 🛠";
echo "";
#
echo "Setting up scraper";
cd ../scraper;
npm install;
echo "✅";
#
echo "Setting up processor";
cd ../processor;
npm install;
echo "✅";
#
echo "Setting up saver";
cd ../saver;
npm install;
echo "✅";
#
echo "Setting up database";
npm run setup;
echo "✅";
#
echo "Setting up api server";
cd ../api;
npm install;
echo "✅";
#
echo "Setting up ionic";
cd ../sodexosearcher;
npm install;
echo "✅";
#
echo "";
echo "🎉 SOSE project ready! 🎉";
