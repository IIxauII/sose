import { Storage } from '@ionic/storage';

const storage = new Storage();
let currentStorage: Storage;

export class AppStartupStorageService {
    async createStorage(): Promise<Storage> {
        console.log('Creating new ionic/storage');
        return await storage.create().then((s) => {
            console.log('Created new ionic/storage!');
            currentStorage = s;
            return currentStorage;
        });
    }
    getCurrentStorage(): Storage {
        return currentStorage;
    }
}