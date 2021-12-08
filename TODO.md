# TODO

This list is sorted from top to bottom, highest to lowest priority

### Backend
* investigate data issue with f.e. town Horb
* solve issue with saver/update-helpers - HERE api related timeouts / retries? 
* introduce backup / fallbacks for data issues
* extend saver/save-processed-data to include geoCode data for sodexo_partners

### Frontend
* add map bounds for german boundingbox
* provide downloaded map for germany -> will have performance boost on application devices
* add caching for loaded map data (possibly will help with performance on web)
* rethink loading of near partners, maybe a combiation of loading near partners, loading all partners later?
* ONLY render, add to cluster partners that are visible on map for user
* introduce vuex store / ionic storage caching for map
* Fix performance issue with here map :(, https://developer.here.com/tutorials/how-to-implement-a-web-map-using-vuejs/
* introduce clustering to map: https://developer.here.com/documentation/examples/maps-js/clustering/marker-clustering
* Fix issue that cities are always being sorted via geo, even if fetched from storage
* introduce request tab as https://ionicframework.com/docs/api/fab (possibly restricted access to reduce exposer?)
* Look into ios build & deployment
* Look into UI design, adjust theme & improve component selection
* Rewrite everthing in ts