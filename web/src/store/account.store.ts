import { acceptHMRUpdate, defineStore } from "pinia";

interface IState {
  account: string | null;
}

export const useAccountStore = defineStore("account", {
  state: (): IState => ({
    account: null,
  }),
  getters: {
    authenticated: (state) => Boolean(state.account),
  },
  actions: {
    setAccount(payload: string | null) {
      this.account = payload;
    },
    clearAccount() {
      this.$reset();
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAccountStore, import.meta.hot));
}
