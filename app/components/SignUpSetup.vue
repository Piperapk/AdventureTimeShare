<template>
    <Page>
        <ActionBar title="My App" flat="true">
            <Label horizontalAlignment="center" class="action-label" text="Adventure Time" ></Label>
        </ActionBar>
        <ScrollView>
            <StackLayout>    
                <StackLayout class="basic-profile-info" >
                    <GridLayout rows="auto, auto" columns="*" v-show="imagePath[0] == '~/assets/images/icons/profile_icon.png'" @tap="addPictureSelector" >
                        <Image row="0" col="0" class="profile-picture" horizontalAlignment="center" verticalAlignment="center" :src="imagePath[0]" width="100" height="100" stretch="aspectFill" />
                        <Image row="0" col="0" class="edit-icon" marginRight="-80" horizontalAlignment="center" verticalAlignment="top" src="~/assets/images/icons/edit_profile.png" width="35" height="35" stretch="aspectFit" />  
                        <Label row="1" col="0" style="margin-bottom: 25;" horizontalAlignment="center" verticalAlignment="center" text="Add a profile photo" />                      
                    </GridLayout>
                    <GridLayout rows="auto, auto" columns="*" v-show="imagePath[0] != '~/assets/images/icons/profile_icon.png'" @tap="addPictureSelector" >
                        <Image row="0" col="0" class="profile-picture" horizontalAlignment="center" verticalAlignment="center" :src="imagePath[0]" width="100" height="100" stretch="aspectFill" />
                        <Image row="0" col="0" class="edit-icon" marginRight="-80" horizontalAlignment="center" verticalAlignment="top" src="~/assets/images/icons/edit_profile.png" width="35" height="35" stretch="aspectFit" />                   
                    </GridLayout>  
                    <Label class="info-text" fontSize="11" textAlignment="center" marginBottom="10" text="Setting a picture, name and 'about me' informatio will make it easier and safer to connect to other users in the app. Only name and age are required." horizontalAlignment="center" textWrap="true" />                  
                    <Label class="input-heading" text="Basic Information" textWrap="true" />
                    <TextField class="info-text" hint="What's my First name? (required)" v-model="userData.userFirstName" maxLength="40" returnKeyType="done" />
                    <TextField class="info-text" hint="What's my Surname? (private)" v-model="userData.userLastName" maxLength="40" returnKeyType="done" />                    
                    <DatePickerField class="info-text" :maxDate="dateAgeCheck" @dateChange="onDateChange" hint="When was I born? (required)" :date="this.userData.userAge" dateFormat="'Born': dd MMM yyyy" ></DatePickerField>
                    <TextView v-show="this.userData.userAge" class="info-text text-field-noline" :text="userCalculatedAge" returnKeyType="done" editable="false" />
                    <TextView v-show="!this.userData.userAge" class="info-text text-field-noline" text="You need to be over 18 to use our app" returnKeyType="done" editable="false" />

                    <TextField class="info-text" v-model="userData.userLocation" returnKeyType="done" editable="true" hint="Where do I live?" @textChange="searchFieldChanged()" @focus="placesAutoHide = false" @blur="placesAutoHide = true" />  
                    <StackLayout v-show="!placesAutoHide" class="search-text" v-for="(place, index) in places" :key="`A` + index"  >
                        <Label :text="place.description" textWrap="true" @tap="getPlace(place)"/>
                    </StackLayout>
                    <TextField class="info-text" hint="What's my phone number? (private)" v-model="userAuthInfo.phoneNumber" keyboardType="number" maxLength="16" returnKeyType="done" />
                    
                    <Label class="input-heading" marginTop="10" text="About Me" textWrap="true" />
                    <TextView class="info-text" hint="Describe myself to other people. About me." v-model="userData.userAboutMe" maxLength="1000" returnKeyType="done" />                  
                </StackLayout>
                <StackLayout height="1" backgroundColor="#E1E1E1" marginTop="0" marginBottom="0" />      
                <StackLayout class="basic-profile-info" marginTop="10" marginBottom="10" >
                    <Label class="input-heading" marginTop="0" marginBottom="0" text="Profile Information" textWrap="true" />  
                </StackLayout>          
                <!-- Tag edit -->  
                <StackLayout backgroundColor="#48566A">
                    <GridLayout rows="auto, auto, auto, auto, auto" columns="*" class="basic-profile-info">
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
                <!-- Other user info -->                  
                <StackLayout class="basic-profile-info" >
                    <TextField ref="dissmissPlacesFocus" class="info-text" hint="Education?" v-model="userData.userEducation" maxLength="40" returnKeyType="done" />
                    <TextField class="info-text" hint="What do I work?" v-model="userData.userWorkplace" maxLength="40" returnKeyType="done" />
                    <GridLayout rows="auto" columns="*, auto">
                        <TextField row="0" col="0" class="info-text" hint="Spoken Languages?" v-model="addUserLanguage" maxLength="35" returnKeyType="done" @returnPress="addLanguage" /> 
                        <Image row="0" col="1" class="trip-icon" margin="0, 25, 0, 15" src="~/assets/images/icons/input_icon.png" opacity="0.75" horizontalAlignment="right" height="20" stretch="aspectFit" @tap="addLanguage"/>
                    </GridLayout>
                    <GridLayout rows="*" columns="*" v-for="(lang, index) in userData.userLanguages" :key="`B` + index"  >
                        <TextField row="0" col="0" class="info-text text-field-noline" hint="Spoken Languages?" v-model="userData.userLanguages[index]" editable="false" returnKeyType="done" />   
                        <Image row="0" col="0" opacity="0.75" src="~/assets/images/icons/close_icon.png" horizontalAlignment="right" verticalAlignment="center" width="15" height="15" stretch="aspectFit" @tap="removeLanguage(index)" />           
                    </GridLayout>                    
                    <Label v-if="showFeedback" color="#f55a42" margin="0, 0, 10" horizontalAlignment="center" :text="showFeedback" textWrap="true" /> 
                    <Button :backgroundColor="saveValidationDone ? '#48AC66' : '#FFC156'" :color="saveValidationDone ? 'white' : 'black'" text="Save" @tap="saveUser" />                      
                </StackLayout>   
            </StackLayout>            
        </ScrollView>              
    </Page>
</template>

<script>
import firebase from 'nativescript-plugin-firebase'
import { error } from '@nativescript/core/trace/trace'
const db = firebase.firestore
const fstore = firebase.storage

import * as fileSystemModule from 'file-system'

import * as camera from 'nativescript-camera'
import * as imageSource from 'image-source'
import * as imagepicker from 'nativescript-imagepicker'

import { GooglePlacesAutocomplete } from 'nativescript-google-places-autocomplete'

import SignUp from './SignUp'
import Feed from './Feed'
import LogIn from './LogIn'

export default {
    name: 'SignUpSetup',
    data() {
        return {
            userID: null,
            userAuthInfo: {},
            userData: {userTagDriver: false},

            showFeedback: null,

            addUserLanguage: null,
            
            imageFileName: [], // for uploading
            imagePath: ["~/assets/images/DefaultProfile.png"], // for uploading, defualt profile picture set

            places: [], // for Google Places API population
            placesAutoHide: true,
            googlePlacesAutocomplete: null,   
            
            currency: "USD", // default currency for the user

            metadata: {
                contentType: "image/jpg",
                customMetadata: {
                "data": "test"
                }
            }            
        }
    },

    computed: {
        dateAgeCheck: function() {
            let ageCheckYear = new Date().getFullYear() - 18
            let date = new Date().setFullYear(ageCheckYear)
            let combined = new Date(date).toJSON().slice(0,10).replace(/-/g,'/')
            return combined            
        },

        userCalculatedAge: function() {
            let userDob = Math.floor((new Date() - new Date(this.userData.userAge).getTime()) / 3.15576e+10)
            return `My age is ${ userDob }`
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
        saveUser() {
            if(this.saveValidationDone){
                db.collection('users').doc(this.userID).update({
                    userEmail: this.userAuthInfo.email,
                    userPhone: this.userAuthInfo.phoneNumber,
                    userFirstName: this.userData.userFirstName,
                    userLastName: this.userData.userLastName,
                    userIsVerified: this.userIsVerified,
                    userCurrency: this.currency,

                    userAge: this.userData.userAge,
                    userLocation: this.userData.userLocation,
                    userEducation: this.userData.userEducation,
                    userWorkplace: this.userData.userWorkplace,
                    userLanguages: this.userData.userLanguages,

                    userAboutMe: this.userData.userAboutMe,

                    userTagDriver: this.userData.userTagDriver,
                    userTagActive: this.userData.userTagActive,
                    userTagSmoke: this.userData.userTagSmoke,
                    userTagPets: this.userData.userTagPets,
                    userTagDrinking: this.userData.userTagDrinking
                })
                .then(() => {
                    this.uploadImgAndNavigate()  
                })
            } else {
                this.showFeedback = "Please enter your prefered name and age that will be displayed to other adventurers."
            }
        },

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

        addLanguage() {
            if(this.addUserLanguage){
                this.userData.userLanguages.push(this.addUserLanguage)
                this.addUserLanguage = null                
                console.log("Language added")
            }            
        },

        removeLanguage(index) {
            this.userData.userLanguages.splice(index, 1)
            console.log("Language removed")
        },

        addPictureSelector(event) {
            action("Select a source for your picture", "Cancel", ["Upload from Gallery", "Take a photo"])
            .then(result => {
                switch(result) {
                    case "Upload from Gallery": return this.selectPicture(); break
                    case "Take a photo": return this.takePicture(); break
                    case "Cancel": return null; break
                }
            })
        },

        deletePicture() {
            let index = 0
            this.imagePath.splice(index, 1)       
            console.log("Picture deleted")    
        },
        
        takePicture() {
            // Take picture with the camera and call the file save function
        camera.takePicture({ height: 500, keepAspectRatio: true, saveToGallery:true })
            .then(async (imageAsset) => {
                await this.deletePicture()
                this.saveToFile(imageAsset)
                console.log(imageAsset)
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
                await this.deletePicture()
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
                } else { console.log("No file saved")}
            })
        },  

        async uploadImgAndNavigate() {
            // Upload the images array to firebase 
            if(this.imagePath) {// if there's an image asset
                console.log("Uploading images to Firebase")                
                for(let i = 0; i < this.imagePath.length; i++) {  
                    //upload file                 
                    await fstore.uploadFile({
                    remoteFullPath: `uploads/profile_pics/${this.imageFileName[i]}`,
                    localFullPath: this.imagePath[i],
                    metadata: this.metadata 
                    }) .then(async (uploadedFile) => {
                        await this.insertFirestoreImgRef(this.imageFileName[i])
                        console.log("File uploaded:" + JSON.stringify(uploadedFile))
                    }) .catch(e => console.log("File upload error:" + e))
                }
            // Send email verification to the user
            firebase.sendEmailVerification()
            .then(() => {
                console.log("Email verification sent")
            })
            .catch((error) => {
                    console.log("Error sending email verification: " + error)
            })
            confirm({
            title: "Welcome on board!",
            message: "To make the app more secure for everyone we've send you a verification email.",
            okButtonText: "OK",
            }).then(result => {
                // Then finish signup and navigate to feed
                this.$goTo('feed', {}, { clearHistory: true })
                console.log("User chagnes saved and navigating to feed")                
            })

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
        }
    },

    mounted() {
        camera.requestPermissions()
            .then(() => {
                console.log("Camera permission granted")
            })
            .catch(e => {
                console.log('Error requesting camera permission')
            })      
    },    

    created() {
        let deviceLocale = `${this.$device.language.substring(0, 2)}_${this.$device.region}` //get the user's locale to assign to their default currency
        this.currency = this.$currency.localeToCurrency(deviceLocale)
        console.log("User's currency is " + this.currency)

        this.googlePlacesAutocomplete = new GooglePlacesAutocomplete(this.$store.getters.getGooglePlacesAPI) //Google places API initiation
        
        //Get current user and querry Firebase for their data
        this.$store.dispatch('getCurrentUser').then(() => {
            //Get User's data from Firebase
            this.userID = this.$store.getters.getUser
            this.userAuthInfo = this.$store.getters.getUserAuthInfo
            const userDocument = db.collection('users').doc(this.userID)
            userDocument.get()
            .then(doc => {
                if(doc.exists) {
                    let userInfo = doc.data()
                    this.userData = userInfo
                    console.log("User data loaded")
                } else {console.log("Document doesn't exist")}
            })
            .catch(error => console.log("Trouble in getting data: " + error))
        })
    }
}
</script>

<style scoped>
    ActionBar {
        background-color: #ffffff;
    }
    .action-label {
        color: #7A7A7A;
        font-size: 14;
        vertical-align: center;
    }
    .basic-profile-info {
        margin: 25, 25;
        color: black;
    }
    .input-heading {
        margin: 0, 0;
        font-size: 20;       
    }    
    .info-text {
        font-size: 15;
    }
    .text-field-noline { 
        background-color: transparent;
        border-color: transparent;
    }       
    .trip-tag-picture {
        margin: 15, 0, 0, 0;
    }
    .tag-text {
        color: #ffffff;
        margin: 15, 0, 0, 45;
    }
    .search-text {
        margin: 0, 30, 10;
        font-size: 15;         
    }    
    /* Profile photo */
    .edit-icon {
        background: #E5E5E5;
        border-radius: 50%;
        margin: 0;
        padding: 5;
    }
    .circleIcon {
        padding: -8;   
        width: 30;
        height: 30;
        text-align: center;
        color: #7A7A7A;
        font-size: 30;
        border-color: #7A7A7A;
        border-width: 2;
        border-radius: 50;
        margin-left: 25;
    }
    .profile-picture {
        border-radius: 50%;
        margin: 0, 0, 15, 0;
    }            
</style>