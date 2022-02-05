<template>
  <v-text-field
    v-bind="$attrs"
    :disabled="disabled"
    :error="Boolean(error)"
    :hint="error ?? hint"
    :label="label"
    :value="inputValue"
    density="comfortable"
    persistent-hint
    @blur="handleBlur"
    @update:model-value="handleChange"
  />
</template>

<script lang="ts">
import { useField } from "vee-validate";
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "TextField",
  props: {
    disabled: {
      default: false,
      type: Boolean,
    },
    hint: {
      default: "",
      type:String,
    },
    label: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    value: {
      default: "",
      type: String,
    },
  },
  setup(props) {
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

    return {
      error,
      handleChange,
      handleBlur,
      inputValue,
      meta,
    };
  },
});
</script>
