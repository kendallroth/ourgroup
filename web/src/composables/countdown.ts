import { computed, ComputedRef, onBeforeUnmount, ref, Ref } from "vue";

interface IUseCountdown {
  countdown: Ref<number>;
  /** Whether countdown is active */
  countdownActive: ComputedRef<boolean>;
  /** Whether countdown is stalled/unactive */
  countdownUnactive: ComputedRef<boolean>;
  /**
   * Begin a second-based countdown
   *
   * @param seconds  - Countdown length
   * @param callback - Optional callback when finished
   */
  startCountdown: (seconds: number, callback?: () => void) => void;
}

/**
 * Countdown interval utilities (seconds)
 */
const useCountdown = (): IUseCountdown => {
  const countdown = ref(0);
  const countdownInterval = ref<number | undefined>();

  const countdownActive = computed(() => countdown.value > 0);
  const countdownUnactive = computed(() => countdown.value <= 0);

  onBeforeUnmount(() => {
    clearInterval(countdownInterval.value);
  });

  const startCountdown = (seconds: number, callback?: () => void) => {
    clearInterval(countdownInterval.value);
    countdown.value = seconds;

    countdownInterval.value = window.setInterval(() => {
      countdown.value--;

      if (countdown.value <= 0) {
        callback?.();
        countdown.value = 0;
        clearInterval(countdownInterval.value);
      }
    }, 1000);
  };

  return {
    countdown,
    countdownActive,
    countdownUnactive,
    startCountdown,
  };
};

export { useCountdown };
