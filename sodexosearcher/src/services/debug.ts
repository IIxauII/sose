import store from '../store/index'

export class DebugService {
    logToDebug(payload: string) {
        store.commit('debug/pushDebug', payload, { root: true});
    }
}