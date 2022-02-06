<template>
  <app-page size="small">
    <v-card class="profile-card">
      <h2>Profile</h2>
      <template v-if="account">
        <div class="profile__label">Name</div>
        <div class="profile__value">{{ account.name ?? "N/A" }}</div>
        <div class="profile__label">Email</div>
        <div class="profile__value">{{ account.email }}</div>
        <div class="profile__label">Verified At</div>
        <div class="profile__value">
          {{
            account.verifiedAt ? $filters.formatDate(account.verifiedAt, "MMMM DD, YYYY") : "N/A"
          }}
        </div>
      </template>
    </v-card>
  </app-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// Utilities
import { useAccountStore } from "@store";

export default defineComponent({
  name: "AccountProfile",
  setup() {
    const accountStore = useAccountStore();

    return {
      account: accountStore.account,
    };
  },
});
</script>

<style lang="scss" scoped>
.profile-card {
  padding: 24px;
  margin: 32px 0;
}

.profile__unverified-prompt {
  margin-top: 24px;
}

// TODO: Remove temporary classes
.profile__label {
  margin-top: 8px;
  font-weight: 600;
}
</style>
