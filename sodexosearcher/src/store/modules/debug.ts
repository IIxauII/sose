import { LogToDebugPayload } from "@/model/debug";

const state: any = () => ({
    debugList: [],
});

const getters = {
    getDebug(state: { debugList: LogToDebugPayload[] }) {
        return state.debugList;
    },
};

const actions = {};

const mutations = {
    // debugList
    saveDebug(state: {debugList: any}, payload: string[]) {
        state.debugList = payload;
    },
    pushDebug(state: {debugList: LogToDebugPayload[]}, payload: LogToDebugPayload) {
        state.debugList.push(payload);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}