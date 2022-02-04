import VueRouter from "vue-router";

// Utilities
import { AuthService } from "@services";

const guardRouter = (router: VueRouter.Router): void => {
  // Configure routing guards (primarily for authentication)
  router.beforeEach((to, from, next) => {
    // Determine whether app is loading initially or routing internally
    //   NOTE: Requires all routes to have "name" set in the routing config
    const isRoutedByApp = Boolean(from.name);

    // TODO: Properly update to use Vuex state (based on user object)!
    // Authentication is indicated by a Vuex user object and flag
    // const isAuthenticated = Store.getters["auth/isAuthenticated"];
    const isAuthenticated = AuthService.hasAuthTokens();

    // Some routes require authentication (all matching routes must be checked)
    const requiresAuth = to.matched.some((r) => r.meta && r.meta.requiresAuth);

    // Protect routes that require authentication
    if (requiresAuth) {
      if (requiresAuth && !isAuthenticated) {
        // TODO: Possibly prompt the users to login via a dialog

        // Directly accessing protected routes BEFORE authentication is determine (ie. page load)
        //   should let the authentication query handler reroute if necessary.
        // Otherwise, redirect the login page and provide a redirect back.
        return isRoutedByApp
          ? next({ path: "/signin", query: { redirectUrl: to.fullPath } })
          : next();
      }

      return next();
    } else if (to.matched.some((r) => r.meta && r.meta.requiresNoAuth)) {
      // Some routes cannot be accessed when authenticated (all matching routes must be checked)
      if (isAuthenticated) {
        // Cancel navigation if it occurred within the app (not a refresh or manual route load).
        //   Otherwise, redirect to home (necessary to avoid invalid route state).
        return isRoutedByApp ? next(false) : next("/");
      }

      return next();
    }

    next();
  });
};

export default guardRouter;
