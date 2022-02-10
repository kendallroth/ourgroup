<template>
  <v-app-bar app class="app-header" color="primary">
    <div class="app-header__content">
      <router-link to="/">
        <v-img
          :src="logoImg"
          alt="App Logo"
          class="app-header__logo"
          contain
          height="48"
          width="48"
        />
      </router-link>
      <v-app-bar-title class="app-header__text">OurGroup</v-app-bar-title>
      <div class="app-header__version">v{{ appVersion }}</div>
      <v-spacer />
      <template v-if="!loading && !isLogoutRoute">
        <template v-if="accountStore.authenticated">
          <v-chip v-if="!accountStore.verified" class="mr-2">
            <v-icon :icon="icons.alert" left small />
            Unverified account
          </v-chip>
          <v-menu ref="menuRef" anchor="bottom end">
            <template #activator="{ props }">
              <v-btn v-bind="props" id="theAppHeader__menuBtn" color="transparent" flat icon small>
                <v-icon :icon="icons.profile" color="white" />
              </v-btn>
            </template>
            <v-list class="elevation-2 app-header__menu__list">
              <v-list-subheader class="app-header__menu__title">
                {{ account?.name ?? account?.email }}
              </v-list-subheader>
              <v-list-item
                v-for="menuItem in menuItems"
                :key="menuItem.to"
                :to="menuItem.to"
                active-class="app-header__menu__item--active"
                @click="closeMenu"
              >
                {{ menuItem.text }}
              </v-list-item>
              <v-divider />
              <v-list-item to="/auth/logout">
                <v-icon :icon="icons.logout" class="mr-2" />
                Logout
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-else>
          <v-btn class="mr-4" to="/auth/register" variant="outlined">Sign Up</v-btn>
          <v-btn to="/auth/login">Log In</v-btn>
        </template>
      </template>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";
import { mdiAlert, mdiFaceMan, mdiLogoutVariant } from "@mdi/js";

// Utilities
import config from "@config";
import { useAccountStore } from "@store";

interface IMenuItem {
  text: string;
  to: string;
}

export default defineComponent({
  name: "TheAppHeader",
  props: {
    loading: {
      default: false,
      type: Boolean,
    },
  },
  setup() {
    const route = useRoute();
    const accountStore = useAccountStore();

    const isLogoutRoute = computed(() => route.name === "authLogout");

    const icons = {
      alert: mdiAlert,
      logout: mdiLogoutVariant,
      profile: mdiFaceMan,
    };
    const logoImg = new URL("/src/assets/logo.png", import.meta.url).href;
    const menuItems: IMenuItem[] = [
      { text: "Profile", to: "/account/profile" },
      { text: "Settings", to: "/account/settings" },
    ];

    /**
     * Force menu to close when child item is clicked; required as 'closeOnContentClick' is not supported.
     */
    const closeMenu = (): void => {
      const menuBtnEl: HTMLElement | null = document.querySelector("#theAppHeader__menuBtn");
      menuBtnEl?.click();
    };

    return {
      account: computed(() => accountStore.account),
      accountStore,
      appVersion: config.app.version,
      closeMenu,
      icons,
      isLogoutRoute,
      logoImg,
      menuItems,
    };
  },
});
</script>

<style lang="scss" scoped>
.app-header {
  display: flex;
}

.app-header__content {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: #{$breakpoint-lg}px;
  margin: 0 auto;
  padding: 0 16px;
}

.app-header__logo {
  flex-shrink: 0;
  flex-grow: 0;
  background-color: white;
  border-radius: 50%;

  :deep(img) {
    padding: 6px;
  }
}

.app-header__version {
  margin-left: 16px;
  font-size: 0.85rem;
  font-family: monospace;
  opacity: 0.8;
}

.app-header__menu__title {
  font-weight: 600;
}

.app-header__menu__list {
  margin-top: 0px;
  padding-bottom: 0px;
  border-radius: 4px;
  min-width: 200px; // NOTE: Workaround since 'VMenu.minWidth' is not working!
}

.app-header__menu__item--active :deep(.v-list-item__overlay) {
  opacity: 0;
}
</style>
