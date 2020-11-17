<template>
    <Page loaded="onLoaded" navigatedTo="onNavigatedTo" actionBarHidden="true">
        <GridLayout rows="*, auto, auto, *" columns="*" class="page">
            
            <Image v-show="!isLoading" row="0" col="0" class="logo" src="~/assets/images/icons/main_trips_white.png" height="70" stretch="aspectFit" verticalAlignment="top" />

            <GridLayout v-show="!isLoading" row="1" col="0" rows="auto, auto, auto, auto, auto" columns="*" class="form" verticalAlignment="center" >
                <Label :isEnabled="!isLoading" row="0" col="0"  class="sign-up-text" fontSize="15" color="black" margin="0" horizontalAlignment="center" text="Email Login" />
                <StackLayout row="1" col="0" class="input-field">
                    <TextField :isEnabled="isEnabled" class="input" v-model="email" hint="Email" keyboardType="email" autocorrect="false" autocapitalizationType="none" />
                </StackLayout>
                <StackLayout row="2" col="0" class="input-field">
                    <TextField :isEnabled="isEnabled" class="input" v-model="password" hint="Password" secure="true" />
                </StackLayout>

                <Label row="3" col="0" v-show="feedback" class="input" :text="feedback" horizontalAlignment="center" textWrap="true" textAlignment="center" />
                <Button :isEnabled="isEnabled" row="4" col="0" text="Log In" class="btn btn-primary" @tap="logInUser" ></Button>             
            </GridLayout>

            <GridLayout v-show="!isLoading" :isEnabled="isEnabled" row="2" col="0" rows="*" columns="*" height="45" class="google-button" @tap="loginGoogle" >   
                <Image row="0" col="0" src="~/assets/images/icons/google_icon.png" height="30" style="margin-left: 30;" horizontalAlignment="left" verticalAlignment="center" stretch="aspectFit" />          
                <Label row="0" col="0" text="GOOGLE LOGIN" class="button-text" horizontalAlignment="center" verticalAlignment="center" /> 
            </GridLayout>                      

            <Label v-show="!isLoading" :isEnabled="isEnabled" row="3" col="0"  class="sign-up-text" horizontalAlignment="center" verticalAlignment="bottom" text="Don’t have an account? Sign up" @tap="goToSignUp" />

            <ActivityIndicator row="0" col="0" rowSpan="4" :busy="isLoading" horizontalAlignment="center" verticalAlignment="center" />
        </GridLayout>        
    </Page>
</template>

<script>
import firebase from 'nativescript-plugin-firebase'
import { error } from '@nativescript/core/trace/trace'
const db = firebase.firestore

import * as appSettings from 'tns-core-modules/application-settings'

import validator from 'email-validator'

import Feed from './Feed'
import SignUp from './SignUp'
import SignUpSetup from './SignUpSetup'

export default {
    name: 'LogIn',
    data() {
        return {
            email: null,
            password: "",

            feedback: null,
            isLoading: false,
            isEnabled: true
        }
    },

    methods: {
        async logInUser() {
            this.isEnabled = false
            if (!validator.validate(this.email)) {
                this.feedback = "Please enter a valid email address"
                this.isEnabled = true
                return  
            } 
            if(this.email && this.password) {
                this.feedback = null
                await firebase.login({
                    type: firebase.LoginType.PASSWORD,
                    passwordOptions: {
                        email: this.email,
                        password: this.password
                    }
                })
                .then (user => {
                    this.isEnabled = true
                    console.log(`User ${ user.email } signed in`)
                    this.$goTo('feed', {}, { clearHistory: true })
                })
                .catch (error => {
                    if(error = "Logging in the user failed. com.google.firebase.auth.FirebaseAuthInvalidUserException: There is no user record corresponding to this identifier. The user may have been deleted."){
                        this.isEnabled = true
                        this.feedback = "No such user or the user details are incorrect"
                    } else {
                        this.isEnabled = true
                        this.feedback = error 
                    }                                       
                })
            }
            else {
                this.isEnabled = true
                this.feedback = "Please enter your email and password"
            }
        },

        loginGoogle() {
            firebase.login({
                type: firebase.LoginType.GOOGLE,
                // Optional 
                googleOptions: {
                // hostedDomain: "mygsuitedomain.com",
                // // NOTE: no need to add 'profile' nor 'email', because they are always provided
                // // NOTE 2: requesting scopes means you may access those properties, but they are not automatically fetched by the plugin
                // scopes: ['https://www.googleapis.com/auth/user.birthday.read']
                }
            })
            .then(user => {
                this.isLoading = true
                console.log(`User ${ user.email } signed in through Google`)
                this.$store.dispatch('checkOnboardingCompletion') //Check if onboarding has been completed
                .then(() => {
                    const onboarding = this.$store.getters.getOnboarding
                    console.log("Google onboarded? " + onboarding) 
                    if(!onboarding) {
                        console.log("User not onboared redirecting to onboarding")
                        this.$goTo('signupsetup', {}, { clearHistory: true })
                    } else {
                        console.log("Google logged-in")
                        this.$goTo('feed', {}, { clearHistory: true })   
                    }                    
                })
                                   
            })
            .catch(error => {
                this.isLoading = false
                console.log(error)
            })
        },  

        goToSignUp() {
            this.$goTo('signup')
        }
    },

    created() { 
        this.isLoading = true
        //Currently handling log-in state through this. If user not logged in it throws an error rather than null for some reason.
        this.$store.dispatch('checkOnboardingCompletion') //Get's the user and checks if onboarding has been completed
        .then(() => {
            const onboarding = this.$store.getters.getOnboarding
            console.log("Onboarded? " + onboarding) 
            const showOnboarding = appSettings.getBoolean('showOnboarding', true) //Check if user has seen the onboarding slides before
            console.log("Show onboard slides on first run? " + showOnboarding)
            let user = this.$store.getters.getUser //Get user after onboarding
            if(showOnboarding) {
                console.log("Showing onboarding slides on first run")
                this.$goTo('onboard', { userLogged: user }, { clearHistory: true })             
            } else { //If onboards slides were shown before continue with login screen
                if(!onboarding) {
                    console.log("User not onboared redirecting to onboarding")
                    this.$goTo('signupsetup', {}, { clearHistory: true })
                } else {
                    console.log("User uid Login page: " + user)
                    if(user) {
                        console.log("logged-in")
                        this.$goTo('feed', {}, { clearHistory: true })   
                    } else {
                        this.isLoading = false
                        console.log("not logged-in")
                    }                
                }
            }
        }) 
    }
}
</script>

<style scoped>
    Page {
        background-image: url('~/assets/images/login_bg.jpg');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;        
    }
    .logo {
        margin-top: 50;
    }
    .google-button {
        background-color: white;
        border-radius: 7;
        margin: 30, 30;
    }
    .button-text{
        font-size: 15;
        font-weight: bold;
        margin: 0, 0, 0, 15;
    }    
    .form {
        background-color: rgba(255, 255, 255, 0.9);
        margin-top: 0;
        margin-left: 15;
        margin-right: 15;
        padding: 15;
    }
    .input {
        font-size: 15;
        color: black;
    }
    .sign-up-text {
        margin-bottom: 25;
        font-size: 20;
        color: white;
    }
</style>