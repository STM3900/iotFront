export const state = () => ({
  status: "idle",
  apiData: null,
  apiMessage: null,
});

export const getters = {
  getStatus: (state) => {
    return state.status;
  },
  getApiData: (state) => {
    return state.apiData;
  },
  getApiMessage: (state) => {
    return state.apiMessage;
  },
};

export const mutations = {
  SET_STATUS(state, status) {
    state.status = status;
  },
  SET_API_DATA(state, apiData) {
    state.apiData = apiData;
  },
  SET_API_MESSAGE(state, apiMessage) {
    state.apiMessage = apiMessage;
  },
};

export const actions = {
  changeStatus(context, status) {
    context.commit("SET_STATUS", status);
  },

  getAllData(context) {
    context.dispatch("changeStatus", "loading");
    this.$axios
      .get(`${this.$axios.defaults.baseURL}/getalldata`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        context.commit("SET_API_DATA", response.data);
        context.dispatch("changeStatus", "ok");
      })
      .catch((error) => {
        context.dispatch("changeStatus", "error");
      });
  },
};
