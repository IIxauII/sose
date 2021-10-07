#
# updating certs with certbot
#
echo "Updating certs!";
sudo certbot renew;
# copy certs into project folder for usage in api server
echo "Copying certs into project dir";
CERTSDIR='/etc/letsencrypt/live/sose.bounceme.net';
sudo cp -v $CERTSDIR/fullchain.pem /home/sose/sose/certs/;
sudo cp -v $CERTSDIR/privkey.pem /home/sose/sose/certs/;
# adjust permissions
echo "Adjusting file permissions";
sudo chmod -R ugo+r /home/sose/sose/certs;
# kills forever running api.js
echo "Stopping api server";
forever stop api.js;
# start forever api.js again with the new files
echo "Starting api server!";
cd /home/sose/sose/api/;
forever start api.js;
echo "done";
