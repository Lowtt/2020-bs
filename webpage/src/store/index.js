import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const state = {
  isHeight: '',
};
const getters = {
  getHeight(state) {
    return state.isHeight
  },

};
const mutations = {
  setHeight(state, item) {
    state.isHeight = item;
  },

};
const actions = {};

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});

export default store;
