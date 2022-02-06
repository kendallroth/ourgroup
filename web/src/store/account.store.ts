import { acceptHMRUpdate, defineStore } from "pinia";

// Types
import { IAuthAccount } from "@typings/account.types";

interface IState {
  account: IAuthAccount | null;
}

export const useAccountStore = defineStore("account", {
  state: (): IState => ({
    account: null,
  }),
  getters: {
    authenticated: (state) => Boolean(state.account),
  },
  actions: {
    setAccount(payload: IAuthAccount | null) {
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
