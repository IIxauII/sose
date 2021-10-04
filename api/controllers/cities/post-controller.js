const { exec } = require('child_process');

module.exports = {
    async addCity(ctx) {
        try {
            console.log(ctx.params.name);
            //ctx.body = 'Will try to add ' + ctx.params.name;
            let promise = new Promise(async (resolve, reject) => {
                exec("cd ../shellscripts && sh addACity.sh " + ctx.params.name, (error, stdout, stderr) => {
                    if (error) {
                        console.log('error', error);
                        reject('upsi dupsi 🙃');
                        return;
                    }
                    if (stderr) {
                        console.log('stderr', stderr);
                        reject('upsi dupsi 🙃');
                        return;
                    }
                    //console.log('stdout', stdout);
                    resolve('🎉 ' + ctx.params.name + ' added 🎉');
                });
            });
            ctx.body = await promise;
        } catch (err) {
            console.log(err);
            ctx.throw(400, 'ADD CITY MAYDAY');
        }
    }
};