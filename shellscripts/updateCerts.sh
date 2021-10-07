#
# updating certs with certbot
#
echo "Updating certs & restarting api server!";
sudo certbot renew;
# copy certs into project folder for usage in api server
CERTSDIR='etc/letsencrypt/live/sose.bounceme.net/';
sudo rsync —-copy-links $CERTSDIR/fullchain.pem $CERTSDIR/privkey.pem /home/sose/sose/certs/;
# adjust permissions
sudo chmod -R ugo+r /home/user/code/project/certs;
# kills forever running api.js
forever stop api.js;
# start forever api.js again with the new files
forever start api.ja;
echo "Done updating certs & restarting api";
