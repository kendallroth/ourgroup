<template>
  <v-text-field
    v-bind="$attrs"
    :append-inner-icon="inputIcon"
    :disabled="disabled"
    :error="Boolean(error)"
    :hint="error ?? hint"
    :label="label"
    :model-value="inputValue"
    :type="inputType"
    density="comfortable"
    persistent-hint
    @click:append-inner="toggleHidden"
    @blur="handleBlur"
    @update:model-value="handleChange"
  />
</template>

<script lang="ts">
import { mdiEye, mdiEyeOff } from "@mdi/js";
import { useField } from "vee-validate";
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  name: "TextField",
  props: {
    disabled: {
      default: false,
      type: Boolean,
    },
    hint: {
      default: "",
      type: String,
    },
    label: {
      default: null,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    password: {
      default: false,
      type: Boolean,
    },
    value: {
      default: "",
      type: String,
    },
  },
  setup(props) {
    const hidden = ref(true);

    const {
      value: inputValue,
      errorMessage: rawError,
      handleBlur,
      handleChange,
      meta,
    } = useField(props.name, undefined, {
      initialValue: props.value,
    });

    const error = computed(() => (meta.touched ? rawError.value : ""));
    const inputType = computed(() => (props.password && hidden.value ? "password" : "text"));
    const inputIcon = computed(() =>
      props.password ? (hidden.value ? mdiEyeOff : mdiEye) : undefined,
    );

    /** Toggle whether field is hidden */
    const toggleHidden = () => {
      hidden.value = !hidden.value;
    };

    return {
      error,
      handleChange,
      handleBlur,
      inputHidden: hidden,
      inputIcon,
      inputType,
      inputValue,
      meta,
      toggleHidden,
    };
  },
});
</script>
