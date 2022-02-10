// Utilities
import router from "@router";

/**
 * Get a redirect target from URL
 *
 * @returns URL redirect string
 */
const getUrlRedirect = (): string | null => {
  const { redirect } = router.currentRoute.query;
  return redirect && typeof redirect == "string" ? redirect : null;
};

/**
 * Handle a URL redirect (manual replacement)
 *
 * @returns Whether URL was redirected
 */
const handleUrlRedirect = (): boolean => {
  const redirect = getUrlRedirect();
  if (redirect) {
    router.replace(redirect);
    return true;
  }
  return false;
};

/**
 * Protect routes based on authentication status (manual)
 *
 * @param authenticated - Whether user is authenticated
 */
const protectRoute = (authenticated = false): void => {
  const { currentRoute } = router;

  if (authenticated) {
    if (currentRoute.meta?.requiresNoAuth) {
      router.replace("/timeline");
    }
  } else {
    if (currentRoute.meta?.requiresAuth) {
      router.replace({
        path: "/",
        query: { redirect: currentRoute.fullPath },
      });
    }
  }
};

export { getUrlRedirect, handleUrlRedirect, protectRoute };
