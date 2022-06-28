export const state = () => ({
  status: "idle",
  apiData: null,
});

export const getters = {
  getStatus: (state) => {
    return state.status;
  },
  getApiData: (state) => {
    return state.apiData;
  },
};

export const mutations = {
  SET_STATUS(state, status) {
    state.status = status;
  },
  SET_API_DATA(state, apiData) {
    state.apiData = apiData;
  },
};

export const actions = {
  changeStatus(context, status) {
    context.commit("SET_STATUS", status);
  },

  getAllData(context) {
    context.dispatch("changeStatus", "loading");
    this.$axios
      .get(`${this.$axios.defaults.baseURL}/getdevices`, {
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
