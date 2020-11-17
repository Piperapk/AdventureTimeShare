import Vue from 'nativescript-vue'
import Vuex from 'vuex'
import * as utils from 'tns-core-modules/utils/utils'
import { isAndroid, isIOS, device, screen } from "tns-core-modules/platform"
import * as application from 'tns-core-modules/application/application'

import { store } from './store'
import routes from './router'
import * as currency from './currency/currency'
import * as backendService from './services/BackendService'

import firebase from 'nativescript-plugin-firebase'
import RadListView from 'nativescript-ui-listview/vue'
import RadAutoComplete from 'nativescript-ui-autocomplete/vue'
import DateTimePicker from "nativescript-datetimepicker/vue"
import { AndroidApplication } from 'tns-core-modules/application/application'

Vue.prototype.$goTo = function(to, props, params) {//Prototyping app-wide navigation 
  if (!routes[to]) return;
  this.$navigateTo(routes[to], {
      props,
      ...params // clearHistory, backstackVisible
  })
}
Object.defineProperty(Vue.prototype, '$currency', { value: currency })
Object.defineProperty(Vue.prototype, '$device', { value: device })
Object.defineProperty(Vue.prototype, '$utils', { value: utils })
Object.defineProperty(Vue.prototype, '$backendService', { value: backendService })
Object.defineProperty(Vue.prototype, '$application', { value: application })

let isLoggedIn = false //not working to set up user as onAuth is async
store.commit('setGooglePlacesAPI', 'none')
store.commit('setUnsplashAPI', 'none')

firebase.init({
  // Optionally pass in properties for database, authentication and cloud messaging,

  storageBucket: 'gs://adventuretime-test1.appspot.com',
  
  showNotifications: false,
  showNotificationsWhenInForeground: true,

  onAuthStateChanged: data => { // optional but useful to immediately re-logon the user when they re-visit your app
    console.log(data.loggedIn ? "Logged in to firebase" : "Logged out from firebase");
    if (data.loggedIn) {
      console.log("user's email address: " + (data.user.email ? data.user.email : "N/As"));
      store.commit('setUser', data.user.uid)
      store.commit('setUserAuthInfo', data.user)

      if(data.user.emailVerified) {// If it's verified make sure the FB user document reflects that. TODO host a custom email verification page and run a function that updates the FB field once: https://firebase.google.com/docs/auth/custom-email-handler
        firebase.firestore.collection('users').doc(data.user.uid).update({
          userIsVerified: data.user.emailVerified
        })
        console.log("User is verified")
      } else {
        console.log("User is not verified")
      }

      firebase.getCurrentPushToken().then((token) => { //Get FCM device token and push it to user's Firestore document. To be used by Firestore Cloud Functions for notifications
        if (token){
          firebase.firestore.collection('users').doc(data.user.uid).update({
            userDeviceTokens: firebase.firestore.FieldValue.arrayUnion(token)
          })          
          console.log(`Current push token: ${token}`)
        } else {
          console.log(`No FCM token`)
        }
      })

      isLoggedIn = true
      // Vue.prototype.$navigateTo(routes.feed)
    }
    else {
      isLoggedIn = false
    }
  },

  onPushTokenReceivedCallback: function(token) {
    console.log("Firebase push token: " + token);
  },

  onMessageReceivedCallback: function(message) {
    console.log("Title: " + message.title);
    console.log("Body: " + message.body);
    console.log("Chat ID': " + message.data.chatID);
    store.commit('setChatNotification', true)
  }

}).then(
    function () {
      console.log("firebase.init done");
    },  
    function (error) {
      console.log("firebase.init error: " + error);
    }
);

Vue.registerElement('Carousel', () => require('nativescript-carousel').Carousel);
Vue.registerElement('CarouselItem', () => require('nativescript-carousel').CarouselItem);
Vue.use(Vuex);
Vue.use(RadListView);
Vue.use(RadAutoComplete);
Vue.use(DateTimePicker);
  
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

new Vue({
  store, 
  render: h => h('frame', [h(isLoggedIn ? routes.feed : routes.login)])
}).$start()