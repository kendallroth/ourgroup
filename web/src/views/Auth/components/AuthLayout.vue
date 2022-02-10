<template>
  <v-main class="auth-layout__main">
    <div class="auth-layout__content">
      <div v-if="$vuetify.display.smAndUp" class="auth-layout__side auth-layout__side--left">
        <slot name="image">
          <v-img :src="groupImg" alt="Group" class="auth-layout__image" contain width="500" />
        </slot>
      </div>
      <div class="auth-layout__side auth-layout__side--right">
        <div class="auth-layout__side__content--right elevation-2">
          <slot name="default" />
        </div>
      </div>
    </div>
  </v-main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// Components
export default defineComponent({
  name: "AuthLayout",
  setup() {
    const groupImg = new URL("/src/assets/good_team.png", import.meta.url).href;

    return {
      groupImg,
    };
  },
});
</script>

<style lang="scss" scoped>
$max-page-width: $breakpoint-lg - 160;
.auth-layout__content {
  display: flex;
  width: 100%;
  max-width: #{$max-page-width}px;
  margin: 0 auto;
}

// Divide auth pages into two sections (right and left)
.auth-layout__side {
  display: flex;
  flex-grow: 1; // Fill section height
  flex-direction: column;
  justify-content: center;
  padding: 64px 32px;

  @include xsOnly {
    width: 100%;
  }

  &.auth-layout__side--left {
    align-items: flex-end;

    @include smUp() {
      width: calc(100% * 3 / 5);
    }

    @include mdUp() {
      width: calc(100% * 3 / 5);
    }
  }
  &.auth-layout__side--right {
    align-items: stretch;

    @include smUp() {
      width: calc(100% * 2 / 5);
    }

    @include mdUp {
      width: calc(100% * 2 / 5);
    }
  }
}

.auth-layout__side__content--right {
  padding: 24px;
  padding-top: 16px;
  background-color: rgb(var(--v-theme-surface));
  border-radius: 8px;
}
</style>

<style lang="scss">
.auth-layout__main {
  > .v-main__wrap {
    display: flex;
    flex-grow: 1;
    width: 100%;

    @include xsOnly {
      flex-direction: column;
    }

    @include smUp {
      flex-direction: row;
    }
  }
}
</style>
