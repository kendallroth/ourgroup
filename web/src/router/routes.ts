import { RouteRecordRaw } from "vue-router";

// Components
import { AccountProfile, AccountRouter, AccountSettings } from "@views/Account";
import {
  AuthLogin,
  AuthLogout,
  AuthPasswordForget,
  AuthPasswordReset,
  AuthRegister,
  AuthRouter,
  AuthVerify,
} from "@views/Auth";
import Home from "@views/Home.vue";
import PageNotFound from "@views/PageNotFound.vue";
import { GroupDashboard } from "@views/Group";

// Utilities
import { AuthService } from "@services";

/*
 * There are several types of route protection:
 *   - requiresAuth         - Route is unaccessible when not authenticated
 *   - requiresNoAuth       - Route is unaccessible when authenticated
 *
 * There are also a few other related properties (not route protection)
 *   - isEmailCode          - Route handles an email code/link
 */

const unauthenticatedRoutes: RouteRecordRaw[] = [
  {
    path: "/auth",
    name: "authRouter",
    component: AuthRouter,
    redirect: "/account/login",
    children: [
      {
        path: "logout",
        name: "authLogout",
        component: AuthLogout,
        // NOTE: Should always be accessible for authentication cleanup purposes
      },
      {
        path: "login",
        name: "authLogin",
        component: AuthLogin,
        meta: { requiresNoAuth: true },
      },
      {
        path: "register",
        name: "authRegister",
        component: AuthRegister,
        meta: { requiresNoAuth: true },
      },
      {
        path: "verify/:code",
        name: "authVerify",
        component: AuthVerify,
      },
      {
        path: "password/forget",
        name: "authPasswordForget",
        component: AuthPasswordForget,
        meta: { requiresNoAuth: true },
      },
      {
        path: "password/reset/:code",
        name: "authPasswordReset",
        component: AuthPasswordReset,
        meta: { requiresNoAuth: true },
      },
    ],
  },
];

const authenticatedRoutes: RouteRecordRaw[] = [
  {
    path: "/account",
    name: "accountRouter",
    component: AccountRouter,
    meta: { requiresAuth: true },
    redirect: "/account/profile",
    children: [
      {
        path: "profile",
        name: "accountProfile",
        component: AccountProfile,
      },
      {
        path: "settings",
        name: "accountSettings",
        component: AccountSettings,
      },
    ],
  },
  {
    path: "/groups",
    name: "GroupDashboard",
    component: GroupDashboard,
    meta: { requiresAuth: true },
  },
];

const routes: RouteRecordRaw[] = [
  ...unauthenticatedRoutes,
  ...authenticatedRoutes,
  {
    path: "/",
    name: "home",
    component: Home,
    beforeEnter: () => {
      // Redirect root route to groups list for authenticated users
      const authenticated = AuthService.hasAuthTokens();
      if (authenticated) return "/groups";
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "pageNotFound",
    component: PageNotFound,
  },
];

export default routes;
