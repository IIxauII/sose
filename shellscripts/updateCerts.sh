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
echo "Restarting all forever scripts";
forever restartall;
forever list;
echo "done";
