interface State {
  isActiveMenuInGame: boolean;
  tabType: string;
}
export const useMenuInGameStore = defineStore("MenuInGameStore", {
  state: (): State => {
    return {
      isActiveMenuInGame: false,
      tabType: "",
    };
  },
  getters: {},
  actions: {
    setIsActiveMenuInGame(data: boolean) {
      this.isActiveMenuInGame = data;
    },
    setTabType(data: string) {
      this.tabType = data;
    },
  },
});
