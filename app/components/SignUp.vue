<template>
    <Page loaded="onLoaded" navigatedTo="onNavigatedTo" actionBarHidden="true">
        <GridLayout rows="*, auto, *" columns="*" class="page">

            <Image row="0" col="0" class="logo" src="~/assets/images/icons/main_trips_white.png" height="70" stretch="aspectFit" verticalAlignment="top" />

            <GridLayout row="1" col="0" rows="auto, auto, auto, auto, auto" columns="*" class="form" verticalAlignment="center" >
                    <Label :isEnabled="!isLoading" row="0" col="0"  class="sign-up-text" fontSize="15" color="black" margin="0" horizontalAlignment="center" text="Sign up witn an email" />
                    <StackLayout row="1" col="0" class="input-field">
                        <TextField :isEnabled="!isLoading" class="input" v-model="email" hint="Email" keyboardType="email" autocorrect="false" autocapitalizationType="none" />
                    </StackLayout>
                    <StackLayout row="2" col="0" class="input-field">
                        <TextField :isEnabled="!isLoading" class="input" v-model="password" hint="Password" secure="true" />
                    </StackLayout>

                    <Label row="3" col="0" v-show="feedback" class="input" :text="feedback" horizontalAlignment="center" textWrap="true" textAlignment="center" />
                    <Button :isEnabled="!isLoading" row="4" col="0" text="Sign up" class="btn btn-primary" @tap="signUpUser" ></Button>             
            </GridLayout>                

            <Label :isEnabled="!isLoading" row="2" col="0"  class="sign-up-text" horizontalAlignment="center" verticalAlignment="bottom" text="Go to Login" @tap="goToLogIn" />

            <ActivityIndicator row="0" col="0" rowSpan="4" :busy="isLoading" horizontalAlignment="center" verticalAlignment="center" />
        </GridLayout>     
    </Page>
</template>

<script>
import firebase from 'nativescript-plugin-firebase'
import { error } from '@nativescript/core/trace/trace'
const db = firebase.firestore

import validator from 'email-validator'

import SignUpSetup from './SignUpSetup'
import LogIn from './LogIn'

export default {
    name: 'SignUp',
    data() {
        return {
            email: null,
            password: "",

            feedback: null,
            isLoading: false
        }
    },
    methods: {
        signUpUser() {
            if (!validator.validate(this.email)) {
                this.feedback = "Please enter a valid email address"
                return  
            }             
            if(this.password.length < 6){
                this.feedback = "Your password must be at least 6 characters long"
                return
            }            
            if(this.email && this.password) {
                this.feedback = null
                firebase.createUser({
                    email: this.email,
                    password: this.password
                })
                .then (user => {
                    // Create the user and set out their user and user data, then navigate to the Feed page
                    let signUpDate = Date()                
                    db.collection('users').doc(user.uid).set({
                        userID: user.uid,
                        userEmail: user.email,
                        userPhone: user.phoneNumber,

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
                    }) .then(() => {
                        db.collection('user_data').doc(user.uid).set({
                            userChats: [],
                            userTrips: [],
                            userFavs: [],
                            userFriends: []
                        }) .then(() => {
                            console.log(`User ${ user.email } created`)
                            this.$goTo('signupsetup', {}, { clearHistory: true })
                        })
                    })
                })
                .catch (error => this.feedback = error)
            }
            else {
                this.feedback = "Please enter your email and password"
            }
        },

        goToLogIn() {
            this.$navigateTo(LogIn)
        }
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