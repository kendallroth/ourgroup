import { RouteRecordRaw } from "vue-router";

// Components
import { AuthLogin, AuthLogout } from "@views/Auth";
// import { UserProfile, UserRouter } from "@views/User";
import Home from "@views/Home.vue";
// import PageNotFound from "@views/PageNotFound.vue";

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
  /*{
    path: "/register",
    name: "authRegister",
    component: Register,
    meta: { requiresNoAuth: true },
  },
  {
    path: "/verify/:code",
    name: "authVerify",
    component: VerifyUser,
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
  /*{
    path: "/user",
    name: "userRouter",
    component: UserRouter,
    meta: { requiresAuth: true },
    redirect: "/user/profile",
    children: [
      {
        path: "profile",
        name: "userProfile",
        component: UserProfile,
      },
    ],
  },*/
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
  /*{
    path: "*",
    name: "pageNotFound",
    component: PageNotFound,
  },*/
];

export default routes;
