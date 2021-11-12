const state: any = () => ({
    dataList: [],
    debugList: [],
});

const getters = {
    getData(state: { dataList: [] }) {
        return state.dataList;
    },
    getDebug(state: { debugList: [] }) {
        return state.debugList;
    },
};

const actions = {};

const mutations = {
    // dataList
    saveData(state: {dataList: any}, payload: string[]) {
        state.dataList = payload;
    },
    pushData(state: {dataList: any}, payload: string) {
        state.dataList.push(payload);
    },
    // debugList
    saveDebug(state: {debugList: any}, payload: string[]) {
        state.debugList = payload;
    },
    pushDebug(state: {debugList: any}, payload: string) {
        state.debugList.push(new Date().toLocaleTimeString() + ': ' + payload);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}