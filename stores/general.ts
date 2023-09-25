interface State {
  userToken: string | null;
}
export const useGeneralStore = defineStore("GeneralStore", {
  state: (): State => {
    return {
      userToken: "",
    };
  },
  getters: {},
  actions: {
    setUserToken(data: string | null) {
      this.userToken = data;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGeneralStore, import.meta.hot));
}
