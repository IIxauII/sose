# TODO

This list is sorted from top to bottom, highest to lowest priority

* investigate data issue with f.e. town Horb
* solve issue with saver/update-helpers - HERE api related timeouts / retries? 
* introduce backup / fallbacks for data issues
* extend saver/save-processed-data to include geoCode data for sodexo_partners
* adjust database structure, move away from POC JSON string saving of sodexo_partner data
* clean up, declutter and improve usability from a UX standpoint
* remove request tab, introduce request tab as https://ionicframework.com/docs/api/fab (possibly restricted access to reduce exposer?)
* some component logic has introduced WET code, make it DRY (services)
* introduce vuex store for less API requests, data transfer, load on end device & caching
* Look into ios build & deployment
* Look into UI design, adjust theme & improve component selection
* Think about: Should I provide my gathered data to the public & share the db?