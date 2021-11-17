import { LogToDebugArguments, LogToDebugPayload } from '@/model/debug.d';
import { LogLevel } from '@/model/enums/debug';
import store from '../store/index';

export class DebugService {
    /* logToDebug(payload: string) {
        if (store && store.commit) {
            store.commit('debug/pushDebug', payload, { root: true });
        } else {
            console.log('DebugService.logToDebug: store is not ready!');
        }
    } */
    logToDebug(logLevel: LogLevel, initiator: string, caller: string, message: string): void {
        const payload: LogToDebugPayload = {
            time: new Date().toLocaleTimeString(),
            logLevel,
            initiator,
            caller,
            message,
        }
        if (store && store.commit) {
            store.commit('debug/pushDebug', payload, { root: true })
        } else {
            console.log('DebugService.logToDebug: store is not ready!');
        }
    }
}