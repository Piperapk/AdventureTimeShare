<template>
<Page actionBarHidden="true" loaded="onLoaded" navigatedTo="onNavigatedTo">
    <GridLayout rows="auto, *">
        <!-- Custom Actionbar --> 
        <StackLayout v-show="!isLoading" row="0" height="60">
            <GridLayout rows="auto" columns="auto, *, auto" >
                <StackLayout col="0" margin="15, 0, 0, 25" height="40" width="40" @tap="$goTo('profile')" >
                    <Image horizontalAlignment="left" verticalAlignment="center" src="~/assets/images/icons/back_button.png" width="26.67" height="30" stretch="aspectFit" />
                </StackLayout>
                <StackLayout col="2" margin="11, 25, 0, 0" :isEnabled="!isLoading" verticalAlignment="center" height="40" @tap="saveChanges" >
                    <Label horizontalAlignment="right" text="Save Changes" fontSize="11" color="black" />  
                </StackLayout>                                  
            </GridLayout>               
        </StackLayout>
        <!-- Main Content -->   
        <ScrollView v-show="!isLoading" row="1" >
            <StackLayout>
                <!-- Basic information -->
                <GridLayout rows="auto, auto, auto, auto" columns="*, auto" class="basic-profile-info" marginTop="5">
                    <Label row="0" col="0" colSpan="2" class="user-name" :text="userData.userFirstName + ', ' + userCalculatedAge" textWrap="true" />
                    <Label row="1" col="0" colSpan="2" class="profile-text" :text="'Adventuring since ' + signUpDate" textWrap="true" />
                    <Image row="2" col="0" class="icon-image" :src="userData.userIsVerified ? '~/assets/images/icons/verified_icon.png' : '~/assets/images/icons/not_verified_icon.png'" height="20" horizontalAlignment="left" stretch="aspectFit"/>
                    <Label row="2" col="0" class="profile-text profile-item" :text="(userData.userIsVerified ? 'Verified' : 'Not Verified')" textWrap="true" />
                    <Image row="3" col="0" class="icon-image" src="~/assets/images/icons/map_icon.png" height="20" horizontalAlignment="left" stretch="aspectFit"/>
                    <Label row="3" col="0" class="profile-text profile-item" :text="`${ tripCount } Trips`" textWrap="true" />
                    <GridLayout row="0" col="0" rowSpan="4" v-if="userData.userProfileImages[0]">
                        <Image :isEnabled="isEnabled" class="profile-picture" horizontalAlignment="right" verticalAlignment="center" :src="userData.userProfileImages[0]" width="100" height="100" stretch="aspectFill" @tap="deletePictureSelector(0)" />
                        <Image :isEnabled="isEnabled" class="edit-icon" horizontalAlignment="right" verticalAlignment="top" src="~/assets/images/icons/edit_profile.png" width="35" height="35" stretch="aspectFit" @tap="deletePictureSelector(0)" />                      
                    </GridLayout>
                    <Image :isEnabled="isEnabled" row="0" col="1" rowSpan="4" v-if="!userData.userProfileImages[0]" src="~/assets/images/icons/add.png" style="margin-right: 35;" height="35" horizontalAlignment="center" verticalAlignment="center" stretch="aspectFit" @tap="addPictureSelector" />  
                </GridLayout>    
                <StackLayout height="1" backgroundColor="#E1E1E1"/>   
                <!-- Images edit -->  
                <Label class="input-heading" style="padding-top: 15;" text="Your Images" textWrap="true" />
                <GridLayout rows="auto" columns="*, *, *" style="padding: 15, 25, 20, 0;">
                    <GridLayout row="0" col="0" v-if="userData.userProfileImages[1]">
                        <Image :isEnabled="isEnabled" class="profile-picture" horizontalAlignment="right" verticalAlignment="center" :src="userData.userProfileImages[1]" width="100" height="100" stretch="aspectFill" @tap="deletePictureSelector(1)" />
                        <Image :isEnabled="isEnabled" class="edit-icon" horizontalAlignment="right" verticalAlignment="top" src="~/assets/images/icons/edit_profile.png" width="35" height="35" stretch="aspectFit" @tap="deletePictureSelector(1)" />                      
                    </GridLayout> 
                    <Image :isEnabled="isEnabled" row="0" col="0" v-if="!userData.userProfileImages[1]" src="~/assets/images/icons/add.png" height="35" horizontalAlignment="center" verticalAlignment="center" stretch="aspectFit" @tap="addPictureSelector" />  

                    <GridLayout row="0" col="1" v-if="userData.userProfileImages[2]">
                        <Image :isEnabled="isEnabled" class="profile-picture" horizontalAlignment="right" verticalAlignment="center" :src="userData.userProfileImages[2]" width="100" height="100" stretch="aspectFill" @tap="deletePictureSelector(2)" />
                        <Image :isEnabled="isEnabled" class="edit-icon" horizontalAlignment="right" verticalAlignment="top" src="~/assets/images/icons/edit_profile.png" width="35" height="35" stretch="aspectFit" @tap="deletePictureSelector(2)" />                      
                    </GridLayout> 
                    <Image :isEnabled="isEnabled" row="0" col="1" v-if="!userData.userProfileImages[2]" src="~/assets/images/icons/add.png" height="35" horizontalAlignment="center" verticalAlignment="center" stretch="aspectFit" @tap="addPictureSelector" />  

                    <GridLayout row="0" col="2" v-if="userData.userProfileImages[3]">
                        <Image :isEnabled="isEnabled" class="profile-picture" horizontalAlignment="right" verticalAlignment="center" :src="userData.userProfileImages[3]" width="100" height="100" stretch="aspectFill" @tap="deletePictureSelector(3)" />
                        <Image :isEnabled="isEnabled" class="edit-icon" horizontalAlignment="right" verticalAlignment="top" src="~/assets/images/icons/edit_profile.png" width="35" height="35" stretch="aspectFit" @tap="deletePictureSelector(3)" />                      
                    </GridLayout>     
                    <Image :isEnabled="isEnabled" row="0" col="2" v-if="!userData.userProfileImages[3]" src="~/assets/images/icons/add.png" height="35" horizontalAlignment="center" verticalAlignment="center" stretch="aspectFit" @tap="addPictureSelector" />  
                </GridLayout>
                <StackLayout height="1" backgroundColor="#E1E1E1"/>
                <!-- Basic information edit -->     
                <StackLayout style="padding: 25, 0, 20, 0;">
                    <Label class="input-heading" text="About Me" textWrap="true" />
                    <TextView class="input-field" v-model="userData.userAboutMe" editable="true" />
                    
                    <GridLayout rows="auto" columns="*, *">
                        <StackLayout col="0">
                            <Label class="input-heading" text="My name" textWrap="true" />
                            <TextField class="input-field" v-model="userData.userFirstName" editable="true" />                            
                        </StackLayout>
                        <StackLayout col="1">
                            <Label class="input-heading" text="My Surname" textWrap="true" />
                            <TextField class="input-field" v-model="userData.userLastName" editable="true" />                            
                        </StackLayout>                        
                    </GridLayout>                   

                    <Label class="input-heading" text="Where do I live?" textWrap="true" />
                    <TextField class="input-field" v-model="userData.userLocation" editable="true" @textChange="searchFieldChanged()" @focus="placesAutoHide = false" @blur="placesAutoHide = true" />  
                    <StackLayout v-show="!placesAutoHide" class="search-text" v-for="(place, index) in places" :key="index" >
                        <Label :text="place.description" textWrap="true" @tap="getPlace(place)"/>
                    </StackLayout>

                    <Label class="input-heading" text="When was I born?" textWrap="true" /> 
                    <DatePickerField class="input-field" :maxDate="dateAgeCheck" @dateChange="onDateChange" hint="Click here to set..." :date="this.userData.userAge" dateFormat="'Born': dd MMM yyyy" ></DatePickerField>          
                    <Label class="input-heading" text="What's my education?" textWrap="true" />
                    <TextField ref="dissmissPlacesFocus" class="input-field" v-model="userData.userEducation" editable="true" />
                    <Label class="input-heading" text="Where do I work?" textWrap="true" />               
                    <TextField class="input-field" v-model="userData.userWorkplace" editable="true" />               
                </StackLayout>
                <!-- Tag edit -->  
                <StackLayout backgroundColor="#48566A">
                    <GridLayout rows="auto, auto, auto, auto, auto" columns="*" class="basic-profile-info" >
                        <Image row="0" col="0" class="trip-tag-picture" horizontalAlignment="left" src="~/assets/images/tags/tag_driver.png" height="20" stretch="aspectFit" />
                        <Label row="0" col="0" class="tag-text" text="Do I drive?" textWrap="true" />
                        <Switch row="0" col="0" horizontalAlignment="right" v-model="userData.userTagDriver" color="white" backgroundColor="white" offBackgroundColor="red" margin="10, 0, 0, 0" @checkedChange="changeDrivingTag" />

                        <Image row="1" col="0" class="trip-tag-picture" horizontalAlignment="left" src="~/assets/images/tags/tag_active.png" height="20" stretch="aspectFit" @tap="changeActiveTag" />
                        <Label row="1" col="0" class="tag-text" text="Do I exercise?" textWrap="true" @tap="changeActiveTag" />
                        <Image row="1" col="0" v-show="userData.userTagActive == null" class="trip-tag-picture" horizontalAlignment="right" src="~/assets/images/icons/input_icon_white.png" height="20" stretch="aspectFit" @tap="changeActiveTag" />
                        <Label row="1" col="0" v-show="userData.userTagActive != null" class="tag-text" horizontalAlignment="right" v-model="userData.userTagActive" textWrap="true" @tap="changeActiveTag" />

                        <Image row="2" col="0" class="trip-tag-picture" horizontalAlignment="left" src="~/assets/images/tags/tag_smoke.png" height="20" stretch="aspectFit" @tap="changeSmokeTag" />
                        <Label row="2" col="0" class="tag-text" text="Do I smoke?" textWrap="true" @tap="changeSmokeTag" />
                        <Image row="2" col="0" v-show="userData.userTagSmoke == null" class="trip-tag-picture" horizontalAlignment="right" src="~/assets/images/icons/input_icon_white.png" height="20" stretch="aspectFit" @tap="changeSmokeTag" />
                        <Label row="2" col="0" v-show="userData.userTagSmoke != null" class="tag-text" horizontalAlignment="right" v-model="userData.userTagSmoke" textWrap="true" @tap="changeSmokeTag" />

                        <Image row="3" col="0" class="trip-tag-picture" horizontalAlignment="left" src="~/assets/images/tags/tag_pets.png" height="20" stretch="aspectFit" @tap="changePetsTag" />
                        <Label row="3" col="0" class="tag-text" text="Do I bring any pets on trips?" textWrap="true" @tap="changePetsTag" />
                        <Image row="3" col="0" v-show="userData.userTagPets == null" class="trip-tag-picture" horizontalAlignment="right" src="~/assets/images/icons/input_icon_white.png" height="20" stretch="aspectFit" @tap="changePetsTag" />
                        <Label row="3" col="0" v-show="userData.userTagPets != null" class="tag-text" horizontalAlignment="right" v-model="userData.userTagPets" textWrap="true" @tap="changePetsTag" />

                        <Image row="4" col="0" class="trip-tag-picture" horizontalAlignment="left" src="~/assets/images/tags/tag_drinking.png" height="20" stretch="aspectFit" @tap="changeDrinkingTag" />
                        <Label row="4" col="0" class="tag-text" text="Do I drink?" textWrap="true" @tap="changeDrinkingTag" />
                        <Image row="4" col="0" v-show="userData.userTagDrinking == null" class="trip-tag-picture" horizontalAlignment="right" src="~/assets/images/icons/input_icon_white.png" height="20" stretch="aspectFit" @tap="changeDrinkingTag" />
                        <Label row="4" col="0" v-show="userData.userTagDrinking != null" class="tag-text" horizontalAlignment="right" v-model="userData.userTagDrinking" textWrap="true" @tap="changeDrinkingTag" />
                    </GridLayout>
                </StackLayout>  
                <!-- Languages Edit -->
                <StackLayout margin="20, 20, 5, 0">
                    <Label class="input-heading" text="What languages can I speak?" textWrap="true" />  
                    <GridLayout rows="*" columns="*" v-for="(lang, index) in userData.userLanguages" :key="`B` + index"  >
                        <TextField row="0" col="0" class="text-field" hint="Spoken Languages?" v-model="userData.userLanguages[index]" editable="false" returnKeyType="done" />   
                        <Image row="0" col="0" opacity="0.75" src="~/assets/images/icons/close_icon.png" horizontalAlignment="right" verticalAlignment="center" width="15" height="15" stretch="aspectFit" @tap="removeLanguage(index)" />           
                    </GridLayout>                        
                    <GridLayout rows="auto" columns="*, auto">
                        <TextField row="0" col="0" class="input-field" hint="Add spoken language..." v-model="addUserLanguage" maxLength="35" returnKeyType="done" @returnPress="addLanguage" /> 
                        <Image row="0" col="1" class="trip-icon" margin="0, 0, 0, 15" src="~/assets/images/icons/input_icon.png" opacity="0.75" horizontalAlignment="right" height="20" stretch="aspectFit" @tap="addLanguage"/>
                    </GridLayout>                                               
                </StackLayout>
                <StackLayout height="1" backgroundColor="#E1E1E1"/>   
                <!-- App Settings -->
                <StackLayout class="basic-profile-info" margin="15, 0, 0, 20">
                    <Label class="section-headings" text="App settings" textWrap="true" />                    
                </StackLayout>
                <!-- Currency Edit -->
                <GridLayout margin="20, 0, 0, 0" @tap="openCurrencyList">
                    <Label class="input-heading" :text="'My default new trip currency is '  + userData.userCurrency" textWrap="true" />  
                    <Image margin="0, 25, 0, 15" src="~/assets/images/icons/input_icon.png" opacity="0.75" horizontalAlignment="right" height="20" stretch="aspectFit" />
                </GridLayout>
                <Label class="log-out-button" text="Log Out" textWrap="true" @tap="logOutUser" />
                <TextView v-show="feedback" ref="feedbackLabel" class="text-field" margin="0 ,25" color="#f55a42" horizontalAlignment="center" :text="feedback" textWrap="true" editable="false" /> 
                <Button :backgroundColor="saveValidationDone ? '#48AC66' : '#FFC156'" :color="saveValidationDone ? 'white' : 'black'" class="basic-profile-info" text="Save Changes" @tap="saveChanges" />     
            </StackLayout>
        </ScrollView>
        <ActivityIndicator :busy="isLoading" horizontalAlignment="center" verticalAlignment="center" /> 
    </GridLayout>
</Page>
</template>

<script>
import firebase from 'nativescript-plugin-firebase'
const db = firebase.firestore
const fstore = firebase.storage

import * as enums from 'ui/enums';
import * as fileSystemModule from 'file-system'

import * as camera from 'nativescript-camera'
import * as imageSource from 'image-source'
import * as imagepicker from 'nativescript-imagepicker'

import { GooglePlacesAutocomplete } from 'nativescript-google-places-autocomplete'

import CurrencySelector from './elements/CurrencySelector'

import Profile from './Profile'
import LogIn from './LogIn'

export default {
    name: 'EditProfile',
    props: ['userExtraData'],
    data() {
        return {
            userID: null,

            userData: {
                userTagDriver: false,
                userProfileImages: [null, null, null, null]
            },

            addUserLanguage: null,

            imageFileName: [], // for uploading
            imagePath: [], // for uploading

            places: [], // for Google Places API population
            placesAutoHide: true,
            googlePlacesAutocomplete: null, 

            currencyList: Object.keys(this.$currency.currencyToLocale), //get supported currencies for UI selector

            isLoading: false,
            isEnabled: true,

            feedback: null,

            metadata: {
                contentType: "image/jpg",
                customMetadata: {
                "data": "test"
                }
            }
        }
    },

    computed: {
        signUpDate: function () {
            const date = new Date(this.userData.userSignDate)
            const year = date.getFullYear()
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            const month = monthNames[date.getMonth()]
            return `${month} ${year}`
        },
        
        tripCount: function() {
            return this.userExtraData.userTrips.length
        },

        dateAgeCheck: function() {
            let ageCheckYear = new Date().getFullYear() - 18
            let date = new Date().setFullYear(ageCheckYear)
            let combined = new Date(date).toJSON().slice(0,10).replace(/-/g,'/')
            return combined            
        },            
        
        userCalculatedAge: function() {
            let userDob = Math.floor((new Date() - new Date(this.userData.userAge).getTime()) / 3.15576e+10)
            return userDob
        },

        saveValidationDone: function() {
            if(this.userData.userFirstName && this.userData.userAge){
                return true
            } else {
                return false
            }
        }           
        
    },

    methods: {
        
        getPlace(place) {
            this.googlePlacesAutocomplete.getPlaceById(place.placeId).then((place) => {
                this.userData.userLocation = place.formattedAddress 
                console.log(place.formattedAddress + "\n latitude: " + place.latitude + "\n longitude: " + place.longitude)
                this.$nextTick(() => {
                    this.$refs.dissmissPlacesFocus.nativeView.focus()
                })
                .then(function () {})
            }, error => {
                console.log(error)
            })
        },

        searchFieldChanged() {
            if(!this.placesAutoHide && this.userData.userLocation && this.userData.userLocation.length >= 2){ //Search Google Places when user has inputed at least 2 characters
                this.placesAutoHide = false
                this.googlePlacesAutocomplete.search(this.userData.userLocation)
                .then((places) => {
                    // place predictions list
                    this.places = []
                    this.places = places
                    console.log(JSON.stringify(this.places))
                }, (error => {
                    console.log(error)
                }))
            }
        },

        onDateChange(date) {
            this.userData.userAge = date.value
            console.log("BoD date set to " + date.value)
        },

        removeLanguage(language) {
            let languageIndex = this.userData.userLanguages.indexOf(language)
            this.userData.userLanguages.splice(languageIndex, 1)
        },

        addLanguage() {
            if(this.addUserLanguage){
                this.userData.userLanguages.push(this.addUserLanguage)
                this.addUserLanguage = null                
                console.log("Language added")
            }
        },

        saveChanges() {
            this.isLoading = true
            if(this.saveValidationDone){
                db.collection('users').doc(this.userID).update({
                    userLocation: this.userData.userLocation,
                    userAboutMe: this.userData.userAboutMe,
                    userFirstName: this.userData.userFirstName,
                    userLastName: this.userData.userLastName,
                    userEducation: this.userData.userEducation,
                    userWorkplace: this.userData.userWorkplace,
                    userLanguages: this.userData.userLanguages,
                    userAge: this.userData.userAge,
                    userCurrency: this.userData.userCurrency,

                    userTagDriver: this.userData.userTagDriver,
                    userTagActive: this.userData.userTagActive,
                    userTagSmoke: this.userData.userTagSmoke,
                    userTagPets: this.userData.userTagPets,
                    userTagDrinking: this.userData.userTagDrinking
                })
                .then(() => {
                    this.$navigateTo(Profile)  
                    console.log("User chagnes saved")
                    this.feedback = null
                    this.isLoading = false
                })
            } else {
                this.isLoading = false
                this.feedback = "Please enter your prefered name and age to be displayed to other adventurers"
                this.$nextTick(() => {
                    this.$refs.feedbackLabel.nativeView.focus()
                })              
            }
        },

        openCurrencyList() {
            this.$showModal(CurrencySelector, {
                props: {
                    currencyList: this.currencyList
                }
            }).then(currency => {
                if(currency){
                    this.userData.userCurrency = currency
                }
            })
        },

        deletePictureSelector(index) {
            confirm({title: "Remove this picture?", message: "", okButtonText: "OK", cancelButtonText: "Cancel"})
            .then(result => {
                if(result){
                    this.deletePicture(index)
                } else { console.log("Action cancelled") }
            })
        },

        addPictureSelector(index) {
            action("Select a source for your picture", "Cancel", ["Upload from Gallery", "Take a photo"])
            .then(result => {
                switch(result) {
                    case "Upload from Gallery": return this.selectPicture(); break
                    case "Take a photo": return this.takePicture(); break
                    case "Cancel": return null; break
                }
            })
        },

        takePicture() {
            // Take picture with the camera and call the file save function
            camera.takePicture({ height: 500, keepAspectRatio: true, saveToGallery:true })
                .then((imageAsset) => {
                    this.imageFileName = []
                    this.imagePath = []
                    this.saveToFile(imageAsset)
                    console.log("Image asset saved: " + imageAsset)
                }).catch(function (err) {
                    console.log("Error -> " + err.message);
                })
        },

        selectPicture() {
            // Select pictures from the gallery and save them to the images array
            let context = imagepicker.create({
                mode: "single",
                mediaType: "Image"
            })
            context
            .authorize()
            .then(() => {
                return context.present()
            })
            .then(async (selection) => {
                this.imageFileName = []
                this.imagePath = []
                console.log("Selection done: " + JSON.stringify(selection))
                await selection.forEach((selected) => {
                    // process the selected images, resize and save the resized ones to file
                    selected.options = {height: 500, keepAspectRatio: true }
                    this.saveToFile(selected)   
                })                    
            }).catch((e) => {
                console.log(e)
            })
        },
        
        saveToFile(res) {
            // Save the camera image to a file and assign them to the images array
            imageSource.ImageSource.fromAsset(res)
            .then((image) => {
                console.log("Saving to file")
                let folderPath = fileSystemModule.knownFolders.documents().path
                let fileName = `profileImage-${Date.now()}.jpg` //randomize the image file name. Might want to add extra variables than just date
                this.imageFileName.push(fileName)
                let imgPath = fileSystemModule.path.join(folderPath, fileName)
                this.imagePath.push(imgPath)
                let saved = image.saveToFile(imgPath, "jpg")
                if (saved) {
                console.log("Image saved successfully!")
                console.log("Saved: " + imgPath)        
                this.uploadImg()
                } else { console.log("No file saved")}
            })
        },  

        async uploadImg() {
            // Upload the images array to firebase
            if(this.imagePath) {// if there's an image asset
                console.log("Uploading images to Firebase")                
                for(let i=0; i < this.imagePath.length; i++) {   
                    //upload file                 
                    await fstore.uploadFile({
                    remoteFullPath: `uploads/profile_pics/${this.imageFileName[i]}`,
                    localFullPath: this.imagePath[i],
                    metadata: this.metadata 
                    }) .then(async (uploadedFile) => {
                        await this.insertFirestoreImgRef(this.imageFileName[i])
                        console.log("File uploaded:" + JSON.stringify(uploadedFile))
                        this.isEnabled = true
                        await this.refreshData() // to refresh the layout view
                    }) .catch(e => console.log("File upload error:" + e))
                }
            }
        },

        async insertFirestoreImgRef(fileName){
            // Get the image URL and store it into the user's Firestore DB for access 
            let remotePath = `uploads/profile_pics/${fileName}`
            await fstore.getDownloadUrl({
                remoteFullPath: `uploads/profile_pics/${fileName}`
            }) .then((url) => {
                db.collection('users').doc(this.userID).update({
                userProfileImages: firebase.firestore.FieldValue.arrayUnion(url),
                userProfileImagesPaths: firebase.firestore.FieldValue.arrayUnion(remotePath)
                }) 
                console.log("URL ref created to the user's database document: " + url)               
            })
        },

        async deletePicture(item){
            this.isEnabled = false
            console.log("Starting picture deletion")
            const index = item
            fstore.deleteFile({
                remoteFullPath: this.userData.userProfileImagesPaths[index]
            })
            .then(async () => {
                db.collection('users').doc(this.userID).update({
                userProfileImages: firebase.firestore.FieldValue.arrayRemove(this.userData.userProfileImages[index]),
                userProfileImagesPaths: firebase.firestore.FieldValue.arrayRemove(this.userData.userProfileImagesPaths[index])
                })
                this.isEnabled = true
                console.log("Picture deleted")
                await this.refreshData() // to refresh the layout view
            })
            .catch(err => {console.log("FB picture deletion error: " + err); this.isEnabled = true})                       
        },       
        
        refreshData() {
            const userDocument = db.collection('users').doc(this.userID)
            userDocument.get().then(doc => {
                    if(doc.exists) {
                        this.userData.userProfileImages = doc.data().userProfileImages
                        this.userData.userProfileImagesPaths = doc.data().userProfileImagesPaths                        
                        console.log("User data refreshed")
                    } else {console.log("Document doesn't exist")}
                })
                .catch(error => console.log("Trouble in getting user: " + error))
        },

        changeDrivingTag() { 
            if(this.userData.userTagDriver){
                this.userData.userTagDriver = true
                console.log(this.userData.userTagDriver)
                console.log("Driver on")
            } else {
                this.userData.userTagDriver = false
                console.log(this.userData.userTagDriver)
                console.log("Driver off")
            }
        },

        changeActiveTag() {
            action("Do I exercise?", "Cancel", ["Intense", "Active", "Light", "None"])
            .then(result => {
                if(result != "Cancel"){
                    this.userData.userTagActive = result
                }
            })
        },

        changeSmokeTag() {
            action("Do I smoke?", "Cancel", ["Yes", "Socially", "Never"])
            .then(result => {
                if(result != "Cancel"){
                    this.userData.userTagSmoke = result
                }
            })
        },

        changePetsTag() {
            action("Do I bring any pets on trips?", "Cancel", ["Dog(s)", "Cat(s)", "Other", "None"])
            .then(result => {
                if(result != "Cancel"){
                    this.userData.userTagPets = result
                }
            })
        },

        changeDrinkingTag() {
            action("Do I drink?", "Cancel", ["Yes", "Socially", "Never"])
            .then(result => {
                if(result != "Cancel"){
                    this.userData.userTagDrinking = result
                }
            })
        },

        logOutUser() {
            console.log(`AAA`)
            firebase.getCurrentPushToken().then((token) => { //Get FCM device token and remov it from the user's device token lists, so not to send notifications to the device when the user has logged out.

                if (token){
                    db.collection('users').doc(this.userID).update({
                        userDeviceTokens: firebase.firestore.FieldValue.arrayRemove(token)
                    }).then(() => {
                        firebase.logout() //Log out the user
                        .then(() => {                
                            console.log("User signed out")
                            this.$navigateTo(LogIn)
                        })                        
                    }) 
                    console.log(`Current push token: ${token}`)
                } else {
                    db.collection('users').doc(this.userID).update({ //If the app can't get the user's token, remove of of their tokens as a precaution. Otherwise if the user has logged out and the token is not removed, the device will still receive notifications.
                        userDeviceTokens: []
                    }).then(() => {
                        firebase.logout() //Log out the user
                        .then(() => {                
                            console.log("User signed out")
                            this.$navigateTo(LogIn)
                        })                        
                    })                     
                    console.log(`No FCM token`)                          
                }                
            })            
        }
    },

    created() {
        this.isLoading = true
        this.googlePlacesAutocomplete = new GooglePlacesAutocomplete(this.$store.getters.getGooglePlacesAPI) //Google places API initiation
        //Get current user and querry Firebase for their data
        this.userID = this.$store.getters.getUser
        console.log("User loaded in Profile Edit " + this.userID)
        //Get User's data from Firebase
        const userDocument = db.collection('users').doc(this.userID)
        userDocument.get().then(doc => {
                if(doc.exists) {
                    let userInfo = doc.data()
                    userInfo.id = doc.id
                    this.userData = userInfo
                    console.log("User data loaded")
                    this.isLoading = false
                } else {console.log("Document doesn't exist")}
            })
            .catch(error => console.log("Trouble in getting user: " + error))
    },

    mounted() {
        camera.requestPermissions()
            .then(() => {
                console.log("Camera permission granted")
            })
            .catch(e => {
                console.log('Error requesting camera permission')
            })      
    }
}

</script>

<style scoped>
    .action-bar {
        margin-bottom: 0;
    }
    .profile-picture {
        border-radius: 50%;
        margin: 0, 0, 0, 25;
    }
    .action-bar-text {
        margin-right: 25;
        margin-top: 30;
    }
    /* Basic info */
    .user-name {
        margin: 0, 0, 0;
        font-size: 30;
        color: black;             
    }
    .basic-profile-info {
        margin: 25, 25;
        color: black;
    }
    .profile-text {
        color: #2E2E2E;
        font-size: 15;
    }
    .profile-item {
        margin-top: 15;
        margin-left: 30;
    }
    .section-headings {
        margin: 0;
        font-size: 20;
        color: black;        
    }    
    .text-field {
        margin: 0, 15;
        font-size: 15; 
        background-color: transparent;
        border-color: transparent;
    }       
    .edit-icon {
        background: #E5E5E5;
        border-radius: 50%;
        margin: 0;
        padding: 5;
    }
    .icon-image {
        margin-top: 15;
    } 
    .log-out-button {
        margin: 20;
        font-weight: 500;
    }    
    /* Edit profile items */
    .input-field {
        margin: 0, 15, 10;
        font-size: 15;        
    }
    .input-heading {
        margin: 0, 20;
        font-size: 15;       
    }
    .trip-tag-picture {
        margin: 15, 0, 0, 0;
    }
    .tag-text {
        color: #ffffff;
        margin: 15, 0, 0, 45;
    }
    .age-text-field {
        color: black;
        font-size: 15; 
    }       
    .search-text {
        margin: 0, 30, 10;
        font-size: 15;         
    }
</style>