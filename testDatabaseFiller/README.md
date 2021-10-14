# testDatabaseFiller

This sub project can be used to fill the `sodexo-akp.db`.
It includes a list of towns in germany which is being utilized by the `addAllTowns.js` to communicate with the api service to trigger scrapes.

This data is by nature stale, not updated from any managed database or similar.
It is just being used to have a baseline of citys in the db as a starting point.

## TODO

* Remove stale .json data
* Replace data with some 3rd party API service
* Refactor this mini sub project as a db baseline setup service
* Include .sh file under `shellscripts` which should be executed during setup of the project