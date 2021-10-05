#
# This script should help with showcase branch creation
#
git checkout main;
git pull;
cd ../sodexosearcher;
ionic build;
cd dist;
mv assets ../../assets;
mv css ../../css;
mv js ../../js;
mv index.html ../../index.html;
cd ../..;
ls;
git checkout showcase;
git add assets;
git add css;
git add js;
git add index.html;
git commit -m "update showcase";
git push;
echo "done";
#