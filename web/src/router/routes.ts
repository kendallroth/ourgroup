import { RouteRecordRaw } from "vue-router";

// Components
import { AccountProfile, AccountRouter } from "@views/Account";
import { AuthLogin, AuthLogout, AuthVerify } from "@views/Auth";
import Home from "@views/Home.vue";
import PageNotFound from "@views/PageNotFound.vue";

/*
 * There are several types of route protection:
 *   - requiresAuth         - Route is unaccessible when not authenticated
 *   - requiresNoAuth       - Route is unaccessible when authenticated
 *
 * There are also a few other related properties (not route protection)
 *   - isEmailCode          - Route handles an email code/link
 *
 * There are also additional meta properties:
 *   - noScrollOnParamChange - Prevent scrolling when the route parameters changes
 */

const unauthenticatedRoutes: RouteRecordRaw[] = [
  {
    path: "/logout",
    name: "authLogout",
    component: AuthLogout,
    // NOTE: Should always be accessible for authentication cleanup purposes
  },
  {
    path: "/login",
    name: "authLogin",
    component: AuthLogin,
    meta: { requiresNoAuth: true },
  },
  {
    path: "/verify/:code",
    name: "authVerify",
    component: AuthVerify,
  },
  /*{
    path: "/register",
    name: "authRegister",
    component: Register,
    meta: { requiresNoAuth: true },
  },
  {
    path: "/password/forget",
    name: "passwordForget",
    component: PasswordForget,
    meta: { requiresNoAuth: true },
  },
  {
    path: "/password/reset/:code",
    name: "passwordReset",
    component: PasswordReset,
    meta: { requiresNoAuth: true },
  },*/
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
    ],
  },
];

const routes: RouteRecordRaw[] = [
  ...unauthenticatedRoutes,
  ...authenticatedRoutes,
  // TODO: Home route should technically change depending on authentication...
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "pageNotFound",
    component: PageNotFound,
  },
];

export default routes;
