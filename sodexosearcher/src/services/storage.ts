import { StorageItemLifeSpan, StorageStrings } from './../model/enums/storage';
import { Storage } from '@ionic/storage';
import { AppStartupStorageService } from './appStartupStorage'; 
import { DebugService } from '@/services/debug';
import { LogLevel } from '@/model/enums/debug';

const debugService = new DebugService();
const d1 = 'services';
const d2 = 'storage';
const appStartupStorageService = new AppStartupStorageService();

export class StorageService {
    private fetchCurrentStorage(): Storage {
        return appStartupStorageService.getCurrentStorage();
    }
    async setItem(key: string, value: any): Promise<any> {
        //debugService.logToDebug(`Setting new ionic/storage item: ${key}`);
        debugService.logToDebug(LogLevel.INFO, d1, d2, `Setting new ionic/storage item: ${key}`);
        value = JSON.stringify(value);
        await this.fetchCurrentStorage().set(key + StorageStrings.TIMESTAMPSUFFIX, new Date().getTime()).catch((err) => {
            //debugService.logToDebug('Error while setting timestamp for item!');
            debugService.logToDebug(LogLevel.ERROR, d1, d2, `Error while setting timestamp for item: ${key}`);
            throw Error('Error while setting timestamp for item!');
        })
        return await this.fetchCurrentStorage().set(key, value).catch((err) => {
            //debugService.logToDebug(`Error while storing data for item: ${key}, error: ${err}`);
            debugService.logToDebug(LogLevel.ERROR, d1, d2, `Error while storing data for item: ${key}, error: ${err}`);
        });
    }
    async getItem(key: string): Promise<any> {
        //debugService.logToDebug(`Fetching ionic/storage item with key: ${key}`);
        debugService.logToDebug(LogLevel.INFO, d1, d2, `Fetching ionic/storage item with key: ${key}`);
        return await this.fetchCurrentStorage().get(key + StorageStrings.TIMESTAMPSUFFIX).then(async (data) => {
            //debugService.logToDebug(`Timestamp of ionic/storage item with key: ${key}, ${data}`);
            debugService.logToDebug(LogLevel.INFO, d1, d2, `Timestamp of ionic/storage item with key: ${key}, ${data}`);
            debugService.logToDebug(LogLevel.INFO, d1, d2, `Current StorageLifeStamp of item with key; ${key}, ${new Date().getTime() - data}`);
            //debugService.logToDebug(`Current StorageLifeStamp of item with key; ${key}, ${new Date().getTime() - data}`);
            if (new Date().getTime() - data >= StorageItemLifeSpan.TEST) {
                //debugService.logToDebug(`ionic/storage item with key: ${key} has expired!`);
                debugService.logToDebug(LogLevel.WARNING, d1, d2, `ionic/storage item with key: ${key} has expired!`);
                throw Error('ionic/storage item has expired!');
            }
            return await this.fetchCurrentStorage().get(key).then((data) => {
                //debugService.logToDebug(`Fetched ionic/storage item with key: ${key}`);
                debugService.logToDebug(LogLevel.SUCCESS, d1, d2, `Fetched ionic/storage item with key: ${key}`);
                return JSON.parse(data);
            });
        }).catch((err) => {
            throw err;
        })
    }
    async removeItem(key: string): Promise<any> {
        return await this.fetchCurrentStorage().remove(key);
    }
    async clearStorage(): Promise<void> {
        return await this.fetchCurrentStorage().clear();
    }
    async getKeys(): Promise<string[]> {
        return await this.fetchCurrentStorage().keys();
    }
    async getQuantity(): Promise<number> {
        return await this.fetchCurrentStorage().length();
    }
}