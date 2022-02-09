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
    verified: (state) => Boolean(state.account?.verifiedAt),
  },
  actions: {
    setAccount(payload: IAuthAccount | null) {
      this.account = payload;
    },
    updateAccount(payload: Partial<IAuthAccount>) {
      this.account = {
        ...this.account,
        ...payload,
      } as IAuthAccount;
    },
    clearAccount() {
      this.$reset();
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAccountStore, import.meta.hot));
}
