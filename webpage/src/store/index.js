import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const state={
  baseUrl:'http://www.baidu.com',
  isHeight:'',
  routerList:[]
};
const getters = {
  getHeight(state) {
    return state.isHeight
  },
  getRouterList(state){
    return state.routerList
  }
};
const mutations = {
  setHeight(state,item) {
    state.isHeight = item;
  },
  setRouterList(state,item){
    state.routerList=item
  }
};
const actions = {
  hideFooter(context,item) {
    context.commit('hide',item);
  }
};

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});

export default store;
