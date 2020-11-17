import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import firebase from 'nativescript-plugin-firebase'

const db = firebase.firestore

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        user: null,
        userAuthInfo: null, //Google authentication info: is verified, phone
        userData: {}, //Firebase user document
        userExtraData: {}, //Friends, trips, chats, favs

        anyUserExtraData: {}, //Friends, trips, chats, favs
        anyUserData: {},  //Firebase user document

        checkOnboarding: null,

        googlePlacesAPI: null,
        unsplashAPI: null,

        chatListenderActive: false,

        chatNotification: false,
    },

    getters: {
        getUser: state => {
            return state.user
        },
        getUserAuthInfo: state => {
            return state.userAuthInfo
        },        
        getUserData: state => {
            return state.userData
        },
        getUserExtraData: state => {
            return state.userExtraData
        },         
        getAnyUserExtraData: state => {
            return state.anyUserExtraData
        },        
        getAnyUserData: state => {
            return state.anyUserData
        },        
        getOnboarding: state => {
            return state.checkOnboarding
        },
        getGooglePlacesAPI: state => {
            return state.googlePlacesAPI
        },
        getUnsplashAPI: state => {
            return state.unsplashAPI
        },
        getChatListenerActive: state => {
            return state.chatListenderActive
        },
        getChatNotification: state => {
            return state.chatNotification
        }
    },

    mutations: {
        setUser: (state, payload) => {
            state.user = payload
        },
        setUserAuthInfo: (state, payload) => {
            state.userAuthInfo = payload
        },        
        setUserData: (state, payload) => {
            state.userData = payload
        },
        setUserExtraData: (state, payload) => {
            state.userExtraData = payload
        },        
        setAnyUserExtraData: (state, payload) => {
            state.anyUserExtraData = payload
        },        
        setAnyUserData: (state, payload) => {
            state.anyUserData = payload
        },        
        checkOnboardingCompletion: (state, payload) => {
            state.checkOnboarding = payload
        },
        setGooglePlacesAPI: (state, payload) => {
            state.googlePlacesAPI = payload
        },
        setUnsplashAPI: (state, payload) => {
            state.unsplashAPI = payload
        },
        setChatListenerActive: (state, payload) => {
            state.chatListenderActive = payload
        },
        setChatNotification: (state, payload) => {
            state.chatNotification = payload
        }
    },

    actions: {
        
        async checkOnboardingCompletion ({ commit, dispatch, getters }) {
            await dispatch('getCurrentUser')
            const userID = getters.getUser
            if(userID) {
                await db.collection('users').doc(userID).get()
                .then(async (doc) => {
                    if(doc.exists) {
                        console.log("User exists")
                        let firstName = doc.data().userFirstName
                        let age = doc.data().userAge
                        if(!firstName || !age) {
                            commit('checkOnboardingCompletion', false)
                            console.log("User hasn't completed onboarding")
                        } else {
                            commit('checkOnboardingCompletion', true)
                            console.log("Onboarding is completed")
                        }
                    } else {
                        await commit('checkOnboardingCompletion', false)
                        console.log("User Firebase document doesn't exist. Creating user document in Firebase for onboarding")
                        // Create the user and set out their user and user data
                        let signUpDate = Date()                
                        await db.collection('users').doc(userID).set({
                            userID: userID,
                            userEmail: null,
                            userPhone: null,
                            userFirstName: null,
                            userLastName: null,
                            userAge: null,
                            userSignDate: signUpDate,
                            userIsVerified: false,
                            
                            userAboutMe: null,
                            userLocation: null,
                            userLanguages: [],
                            userEducation: null,
                            userWorkplace: null,

                            userProfileImages: [],
                            userProfileImagesPaths: [],

                            userTagDriver: false,
                            userTagActive: null,
                            userTagSmoke: null,
                            userTagPets: null,
                            userTagDrinking: null
                        })
                        .then(() => {
                            db.collection('user_data').doc(userID).set({
                                userChats: [],
                                userTrips: [],
                                userFavs: [],
                                userFriends: []
                            }) 
                            .then(() => {
                                console.log(`User document ${ userID } created for onboarding`)
                            })
                        })
                    }
                })
                .catch(error => {
                    console.log("checkOnboardingCompletion error: " + error)
                }) 
            } else {
                commit('checkOnboardingCompletion', true)
                console.log("Onboarding is completed as there is no logged in user")
            }
        },

        async getCurrentUser ({ commit }) {
            await firebase.getCurrentUser()
            .then((user) => {
                console.log("User " + user.uid + " set to vuex store")
                commit('setUser', user.uid)
                commit('setUserAuthInfo', user)
            })
            .catch(error => {
                commit('setUser', null)
                commit('setUserAuthInfo', null)
                console.log("getCurrentUser error: " + error)
            })
        },

        async getCurrentUserData ({ commit }, payload) {
            await db.collection('users').doc(payload).get()
            .then((doc) => {
                let userData = doc.data()
                commit('setUserData', userData)
                console.log("getCurrentUserData ran in vuex store for user " + payload + userData)
            })
        },

        async getUserExtraData ({ commit }, payload) {
            await db.collection('user_data').doc(payload).get()
            .then((doc) => {
                let userExtraData = doc.data()
                commit('setUserExtraData', userExtraData)
                console.log("getUserExtraData ran in vuex store for user " + payload + userExtraData)
            })
        },         

        async getAnyUserExtraData ({ commit }, payload) {
            await db.collection('user_data').doc(payload).get()
            .then((doc) => {
                let userAnyExtraData = doc.data()
                commit('setAnyUserExtraData', userAnyExtraData)
                console.log("getAnyUserExtraData ran in vuex store for user " + payload + userAnyExtraData)
            })
        },        

        async getAnyUserData ({ commit }, payload) {
            await db.collection('users').doc(payload).get()
            .then((doc) => {
                let userData = doc.data()
                commit('setAnyUserData', userData)
                console.log("getAnyUserData ran in vuex store for user " + payload + userData)
            })
        }
    }
})