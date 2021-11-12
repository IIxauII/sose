
#
# Should help with deploying
#
echo "Alright lets deploy some SOSE!";
echo "";
echo "Fetching latest git changes!";
cd /home/sose/sose/;
git pull;
echo "Removing currently running build!";
cd /var/www/html/;
rm -rf *;
echo "Creating new showcase build!"
cd /home/sose/sose/sodexosearcher/;
npm install;
npm run build:showcase;
echo "Deploying new showcase build!";
cp -R dist/* /var/www/html/;
echo "sose deploy done!";
echo "";
echo "Do not forget to restart / udpate api service aswell! This needs to happen manually for now!";
#
