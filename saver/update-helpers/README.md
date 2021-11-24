### Update Helpers

These update helpers are designed to upgrade / extend an existing SOSE db to work with new features introduced / being consumed in the frontend.

Each folder contains executable js scripts which will alter your database, extend the database to be able to save new data & also seamlessly add this new required data to the database by utilizing API services like the HERE api.

They are numerated with a rising number. The higher the number the newer the update. All updates which are required for your installation should be executed step by step from oldest to newest (e.g. execute updates in 01, ... 02, ... 03, and so on)

In case the update extends the database, the `extend-database.js` of the folder needs to be executed before the `add-x-x.js` files to ensure that the db will work with the new data and not run into any errors during the update.

It is advised to create a backup of your database before running any update!