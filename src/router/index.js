import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../App.vue'
import Update from '../views/Update.vue'
import MapView from '../views/MapView.vue'

import { Icon } from 'leaflet';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: MapView
  },
  {
    path: '/update',
    name: 'update',
    component: Update
  }
  
]

const router = new VueRouter({
  routes
})

export default router
