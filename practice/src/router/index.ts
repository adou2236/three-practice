import { createRouter, createWebHistory } from 'vue-router'
const modules = import.meta.glob('../views/**.vue');
const routes: any[] = [];

for (const path in modules) {
  let route = {
    path: '/' + path.match(/\/([^\/]+)\.vue$/)[1],
    name: path.match(/\/([^\/]+)\.vue$/)[1],
    component: modules[path]
  }
  routes.push(route);
}
console.log(routes)

let root = {
  path: '/',
  redirect: routes[0].path
}
routes.push(root)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
