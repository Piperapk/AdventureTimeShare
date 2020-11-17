<template>
    <Page actionBarHidden="true">
        <GridLayout rows="auto, *">
            <!-- Custom Actionbar --> 
            <StackLayout row="0" height="60">
                    <GridLayout rows="auto" columns="auto, *, auto" >
                    <StackLayout col="0" margin="15, 0, 0, 25" height="40" width="40" @tap="$navigateBack" >
                        <Image horizontalAlignment="left" verticalAlignment="center" src="~/assets/images/icons/back_button.png" width="26.67" height="30" stretch="aspectFit" />
                    </StackLayout>
                    <StackLayout col="2" margin="11, 25, 0, 0" verticalAlignment="center" height="40" @tap="saveChanges" >
                        <Label horizontalAlignment="right" text="Save Changes" fontSize="11" color="black" />  
                    </StackLayout>                    
                </GridLayout>               
            </StackLayout>
            <!-- Main Content -->   
            <ScrollView row="1" >
                <StackLayout>
                    <Label class="section-heading" horizontalAlignment="center" verticalAlignment="center" text="Edit your Adventure" />
                        <!-- Basic Information -->
                        <StackLayout>
                        <Label class="section-heading" text="Basic Information" />
                        <StackLayout class="grey-field-box">
                            <Label class="trip-text-heading" marginLeft="15" text="Where to" textWrap="true" /> 
                            <GridLayout columns="auto, *">
                                <Image row="0" col="0" class="trip-icon" src="~/assets/images/icons/location_icon.png" height="20" horizontalAlignment="left" stretch="aspectFit"/>
                                <TextField row="0" col="1" class="input-field" margin="0, 10, 0, 10" v-model="tripData.tripLocation" returnKeyType="done" editable="true" hint="Enter trip location..." @textChange="searchFieldChanged()" @focus="placesAutoHide = false" @blur="placesAutoHide = true" />  
                            </GridLayout> 
                            <StackLayout v-show="!placesAutoHide" class="search-text" v-for="(place, index) in places" :key="index"  >
                                <Label :text="place.description" textWrap="true" @tap="getPlace(place)"/>
                            </StackLayout>                     
                        </StackLayout> 
                        <GridLayout rows="auto, auto" columns="*, *" class="basic-profile-info">
                            <Label row="0" col="0" class="trip-text-heading" text="Date from" textWrap="true" /> 
                            <StackLayout row="1" col="0" orientation="horizontal">
                                <Image class="trip-icon" marginLeft="0" src="~/assets/images/icons/calendar_icon.png" height="15" horizontalAlignment="left" stretch="aspectFit"/>
                                <DatePickerField class="input-field" :minDate="currentDate" @dateChange="onDateChangeFrom" :date="this.tripData.tripDateFrom" hint="dd/mm/yy" dateFormat="dd MMM yyyy" style="margin: 0, 15;" ></DatePickerField>
                            </StackLayout>
                            <Label row="0" col="1" class="trip-text-heading" text="To" textWrap="true" /> 
                            <StackLayout row="1" col="1" orientation="horizontal">
                                <Image class="trip-icon" marginLeft="0" src="~/assets/images/icons/calendar_icon.png" height="15" horizontalAlignment="left" stretch="aspectFit"/>
                                <DatePickerField class="input-field" :minDate="tripData.tripDateFrom" @dateChange="onDateChangeTo" :date="this.tripData.tripDateTo" hint="dd/mm/yy" dateFormat="dd MMM yyyy" style="margin: 0, 15;" ></DatePickerField>
                            </StackLayout>                    
                        </GridLayout>   
                        <StackLayout class="grey-field">
                            <Label class="trip-text" margin="0" :text="tripDuration" v-show="tripData.tripDateFrom && tripData.tripDateTo" horizontalAlignment="center" hint="How many days is the trip..." />
                        </StackLayout>           
                        <StackLayout class="basic-profile-info">
                            <Label class="trip-text-heading" text="Trip title" textWrap="true" /> 
                            <TextView ref="dissmissPlacesFocus" class="input-field" v-model="tripData.tripTitle" hint="Awesome, epic adventure, somewhere?" maxLength="60" returnKeyType="done" />  
                        </StackLayout>
                        <StackLayout class="basic-profile-info">
                            <Label class="trip-text-heading" marginBottom="10" text="Description. What will you and the group do? " textWrap="true" /> 
                            <TextView class="input-field grey-field" padding="15" borderRadius="7" v-model="tripData.tripDescription" hint="Introduce fully the trip to the group..." height="200" maxLength="1000" returnKeyType="done" /> 
                        </StackLayout>                                                
                        <!-- Trip Activity -->
                        <GridLayout rows="auto, auto" columns="*" class="grey-field-box" @tap="changeActivityLevel" >
                            <Label row="0" col="0" class="trip-text-heading" marginLeft="15" text="Activity level" textWrap="true" />
                            <Image row="1" col="0" class="trip-icon" src="~/assets/images/icons/activity_level.png" horizontalAlignment="left" height="30" stretch="aspectFit" />
                            <Label row="1" col="0" v-show="!tripData.tripActivityLevel" class="input-field" margin="0, 35, 0, 65" text="Set..." horizontalAlignment="left" verticalAlignment="center" textWrap="true"/>
                            <Label row="1" col="0" class="input-field" style="margin-left: 65;" v-model="tripData.tripActivityLevel" verticalAlignment="center" textWrap="true" />
                        </GridLayout>
                        <!-- People -->
                        <Label class="section-heading" text="People" />
                        <Label row="0" col="0" colSpan="2" class="trip-text-heading" marginLeft="25" text="Maximum people in the group?" textWrap="true"/>
                        <GridLayout rows="auto, auto" columns="auto, auto, *" class="grey-field-button" marginBottom="0" @tap="membersCountIsEnabled ? membersCountIsEnabled = false : membersCountIsEnabled = true">
                            <Image row="1" col="0" class="trip-icon" src="~/assets/images/icons/people_icon.png" horizontalAlignment="left" height="20" stretch="aspectFit" />
                            <Label v-show="tripData.tripSpaces == 0 || tripData.tripSpaces == null" row="1" col="1" class="input-field" margin="0, 0, 0, 15" text="Select from the dropdown" horizontalAlignment="left" verticalAlignment="center" textWrap="true" />
                            <Label v-show="tripData.tripSpaces > 0" row="1" col="1" class="input-field" margin="0, 0, 0, 15" :text="tripData.tripSpaces + ' people altogether'" horizontalAlignment="left" verticalAlignment="center" textWrap="true" />
                            <Image row="1" col="2" class="trip-icon" marginRight="15" src="~/assets/images/icons/dropdown_icon.png" horizontalAlignment="right" height="11" stretch="aspectFit" />
                        </GridLayout>
                        <StackLayout v-show="membersCountIsEnabled" class="grey-field-button" marginTop="0">
                            <Label class="trip-text" v-for="(count, index) in membersCount" :key="index + 'memberCount'" :text="index == 0 ? count + ' person. Are you going by yourself?' : count + ' people'" horizontalAlignment="left" textWrap="true" @tap="membersCountSelect(count)" />
                        </StackLayout>
                        <TextField v-show="membersCountExtraOn" ref="memberCountExtra" class="input-field" margin="0, 25" v-model="tripData.tripSpaces" hint="More than 10 people? How many..." keyboardType="number" maxLength="2" returnKeyType="done" />
                        <!-- Meeting point -->
                        <GridLayout rows="auto, auto" columns="*" class="basic-profile-info">
                            <Image row="0" col="0" class="icon-image" marginTop="15" src="~/assets/images/icons/location_icon.png" height="20" horizontalAlignment="left" stretch="aspectFit"/>
                            <Label row="0" col="0" class="trip-text" text="Group's preferred meeting point" textWrap="true" />
                            <TextField row="1" col="0" class="input-field" v-model="tripData.tripMeetingLocation" hint="The local cafe or pub? Straight at the airport?" returnKeyType="done" />                        
                        </GridLayout>                      
                        <!-- Costings -->
                        <StackLayout class="grey-field">
                            <Label class="section-heading" text="Costs (total for the group)" />                           
                            <StackLayout backgroundColor="#FFC156" height="50" verticalAlignment="center">
                                <Label class="trip-text" margin="0, 25" text="As costs can be approximate, please provide your best calculated estimate per item." textWrap="true" />
                            </StackLayout>
                            <StackLayout class="basic-profile-info">
                                <GridLayout rows="auto, auto" columns="*">
                                    <TextField row="0" col="0" class="input-field" ref="cost" v-model="costLineItem" hint="Tickets, petrol, food for my cat, etc ..." maxLength="60" returnKeyType="done" />  
                                    <TextField row="1" col="0" class="input-field" v-model="costLinePrice" keyboardType="number" hint="Price?" maxLength="10" returnKeyType="done" @returnPress="addCostLine" /> 
                                </GridLayout>
                                <StackLayout orientation="horizontal" @tap="addCostLine">
                                    <Image class="trip-icon" marginLeft="0" src="~/assets/images/icons/plus_icon.png" opacity="0.75" horizontalAlignment="left" height="20" stretch="aspectFit" />
                                    <Label class="trip-text" margin="0, 0, 0, 15" text="Add line" verticalAlignment="center" />                            
                                </StackLayout>
                                <GridLayout rows="auto" columns="*" marginTop="15" v-for="(cost, index) in tripData.tripCostItems" :key="`B` + index" >
                                    <Label row="0" col="0" class="input-field" horizontalAlignment="left" :text="cost.name + ': ' + $currency.display(cost.price, tripData.tripCurrency)" textWrap="true" />
                                    <Image row="0" col="0" opacity="0.75" src="~/assets/images/icons/close_icon.png" horizontalAlignment="right" width="15" height="15" stretch="aspectFit" @tap="removeCostLine(cost)" />
                                </GridLayout>
                                <Label class="trip-text" color="black" margin="10, 0, 0" :text="'Cost per person: ' + $currency.display(totalMemberCost, tripData.tripCurrency)" textWrap="true" />
                                <Label class="trip-text" color="black" margin="5, 0, 0" :text="'Total cost: ' + $currency.display(tripData.tripCost, tripData.tripCurrency)" textWrap="true" />                             
                            </StackLayout>   
                            <StackLayout height="1" backgroundColor="#E1E1E1"/>
                            <GridLayout class="basic-profile-info" @tap="openCurrencyList">
                                <Label class="trip-text" margin="5, 0, 0" :text="`The trip's currency is `  + tripData.tripCurrency" textWrap="true" />  
                                <Image margin="0" src="~/assets/images/icons/input_icon.png" opacity="0.75" horizontalAlignment="right" height="20" stretch="aspectFit" />
                            </GridLayout>                                          
                        </StackLayout>
                        <StackLayout height="30" backgroundColor="transparent"/>
                        <!-- Other Items -->            
                        <StackLayout class="grey-field" >
                            <StackLayout class="basic-profile-info" >
                                <Label class="trip-text-heading" text="Items required and not included in the cost" />
                                <TextField class="input-field" v-model="otherItem" hint="Headlamp, tent, portable reactor etc ..." maxLength="60" returnKeyType="done" @returnPress="addOtherItem" />  
                                <StackLayout orientation="horizontal" @tap="addOtherItem">
                                    <Image class="trip-icon" marginLeft="0" src="~/assets/images/icons/plus_icon.png" opacity="0.75" horizontalAlignment="left" height="20" stretch="aspectFit" />
                                    <Label class="trip-text" margin="0, 0, 0, 15" text="Add line" verticalAlignment="center" />                            
                                </StackLayout>                        
                                <GridLayout rows="auto" columns="*" marginTop="15" v-for="(item, index) in tripData.tripOtherItems" :key="index + `otherItems`" >
                                    <Label row="0" col="0" class="input-field" horizontalAlignment="left" :text="item" textWrap="true" />
                                    <Image row="0" col="0" opacity="0.75" src="~/assets/images/icons/close_icon.png" horizontalAlignment="right" width="15" height="15" stretch="aspectFit" @tap="removeOtherItem(item)" />                                
                                </GridLayout>                          
                            </StackLayout>                   
                        </StackLayout>
                        <!-- Transport -->
                        <Label class="section-heading" margin="15, 25, 0" text="Transport" />  
                        <StackLayout class="basic-profile-info" >
                            <Label class="trip-text-heading" text="How are you traveling?" />
                            <TextField class="input-field" v-model="tripData.tripTransport" hint="Rent a car, plane, yacht ..." maxLength="60" returnKeyType="done" /> 
                        </StackLayout>
                        <!-- Media -->
                        <Label class="section-heading" text="Trip Media" marginBottom="0"/> 
                        <Label class="trip-text" fontSize="11" margin="0, 0, 0, 25" text="(6 images maximum)" textWrap="true" />    
                        <WrapLayout orientation="horizontal" class="section-heading">
                            <GridLayout rows="147" columns="105" padding="5, 5, 0, 0" v-for="(image, index) in tripData.tripMedia" :key="index + `pictures`" >
                                <Image borderRadius="7" margin="0" horizontalAlignment="center" verticalAlignment="center" :src="image" width="95" height="137" stretch="aspectFill" @tap="deletePictureSelector(index)" />
                                <Image class="edit-icon" horizontalAlignment="right" verticalAlignment="top" src="~/assets/images/icons/edit_profile.png" width="35" height="35" stretch="aspectFit" @tap="deletePictureSelector(index)" />                      
                            </GridLayout> 
                            <GridLayout v-show="tripMediaArrayLength < 6" rows="150" columns="75">
                                <Image marginLeft="35" src="~/assets/images/icons/add.png" height="35" horizontalAlignment="center" verticalAlignment="center" stretch="aspectFit" @tap="addPictureSelector" />                  
                            </GridLayout>
                        </WrapLayout> 
                        <StackLayout class="basic-profile-info" >
                            <Label class="trip-text" margin="0" text="Jazz-up your trip page with pictures and video from the web or your personal library" textWrap="true" />
                            <!-- Image Search -->
                            <Label v-show="tripMediaArrayLength < 6" class="trip-text-heading" marginTop="10" text="Search the web for images" />
                            <StackLayout v-show="tripMediaArrayLength < 6" >
                                <GridLayout rows="auto" columns="*, auto">
                                    <TextField ref="imgSearchField" row="0" col="0" class="input-field" v-model="imgSearchPhrase" hint="Search for an image of your destination ..." returnKeyType="go" @returnPress="searchForImage" /> 
                                    <Image row="0" col="1" class="trip-icon" margin="0, 25, 0, 0" src="~/assets/images/icons/main_explore.png" opacity="1" horizontalAlignment="right" height="30" stretch="aspectFit" @tap="searchForImage"/>
                                </GridLayout>       
                                <Label v-show="imgSearchArray.length > 0" class="trip-text" margin="0" text="Select images:" textWrap="true" />        
                                <WrapLayout orientation="horizontal" margin="0">
                                    <GridLayout rows="140, auto" columns="100" padding="5, 5, 0, 0" v-for="(pic, index) in imgSearchArray" :key="index + `searchPictures`" >
                                        <Image row="0" borderRadius="7" margin="0" horizontalAlignment="left" verticalAlignment="bottom" :src="pic.urls.small" width="95" height="137" stretch="aspectFill" @tap="selectUnsplashImage(pic)" />
                                        <Label row="1" class="trip-text" fontSize="11" margin="5, 0, 5" textWrap="true" @tap="$utils.openUrl(`https://unsplash.com/@${pic.user.username}?utm_source=Adventureme&utm_medium=referral`)"> 
                                            <FormattedString>
                                                <Span text="Photo by " />
                                                <Span :text="pic.user.name" fontWeight="bold" textDecoration="underline"/>
                                            </FormattedString>
                                        </Label>                                                         
                                    </GridLayout> 
                                </WrapLayout>                                  
                            </StackLayout>
                            <Label class="trip-text" margin="5, 0, 5" fontSize="13" fontStyle="italic" textWrap="true" @tap="$utils.openUrl('https://unsplash.com/?utm_source=Adventureme&utm_medium=referral')"> 
                                <FormattedString>
                                    <Span text="Photos by " />
                                    <Span text="Unsplash" fontWeight="bold" textDecoration="underline"/>
                                </FormattedString>
                            </Label>
                            <!-- Image URL -->
                            <StackLayout v-show="tripMediaArrayLength < 6">
                                <Label class="trip-text-heading" marginTop="10" text="Paste an image url from the web (https://)" />
                                <GridLayout rows="auto" columns="*, auto">
                                    <TextField ref="imgUrlField" row="0" col="0" class="input-field" v-model="imageUrl" hint="Paste an image link from the web ..." returnKeyType="go" @returnPress="savePictureUrl" /> 
                                    <Image row="0" col="1" class="trip-icon" margin="0, 25, 0, 15" src="~/assets/images/icons/input_icon.png" opacity="0.75" horizontalAlignment="right" height="20" stretch="aspectFit" @tap="savePictureUrl"/>
                                </GridLayout>                                
                            </StackLayout>
                        </StackLayout>

                        <!-- Itinerary -->
                        <StackLayout class="grey-field">
                            <GridLayout>
                                <Label class="section-heading" text="Create Itinerary" /> 
                                <Switch class="basic-profile-info" horizontalAlignment="right" v-model="tripData.tripItineraryEnabled" color="#2E2E2E" backgroundColor="green" offBackgroundColor="red" @checkedChange="tripInItineraryEnabled" />
                            </GridLayout>
                            <StackLayout class="basic-profile-info" v-show="tripData.tripItineraryEnabled" >
                                <ItineraryInput :tripLength="tripLength" :tripData="tripData" />                                                                    
                            </StackLayout>                        
                        </StackLayout>

                        <Label v-show="feedback" class="basic-profile-info" color="#f55a42" horizontalAlignment="center" :text="feedback" textWrap="true" /> 
                        <Button :backgroundColor="saveValidationDone ? '#48AC66' : '#FFC156'" :color="saveValidationDone ? 'white' : 'black'" class="basic-profile-info" text="Save Trip Changes" @tap="saveChanges" />                          
                        <StackLayout height="30" backgroundColor="transparent"/>                 
                    </StackLayout>
                </StackLayout>
            </ScrollView>
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
import * as imageAsset from 'image-asset'
import * as imagepicker from 'nativescript-imagepicker'
import axios from 'axios/dist/axios'

import { GooglePlacesAutocomplete } from 'nativescript-google-places-autocomplete'

import CurrencySelector from './elements/CurrencySelector'
import ItinerarySelector from './elements/ItinerarySelector'
import ItineraryInput from './elements/ItineraryInput'

export default {
    name: 'TripCurrentEdit',
    props: ['tripID'],
    components: {ItineraryInput},        
    data() {
        return {
            userID: null,

            tripData: {
                tripMedia: [],
                tripMembers: [],
                tripItinerary: [],
                tripCost: 0
            },

            membersCountExtraOn: false,
            membersCountIsEnabled: false,
            membersCount: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "11 or more"],

            costLineItem: null, //for temp storing the cost of each line
            costLinePrice: null, //for temp storing the cost of each line
            otherItem: null, //for temp storing of other items before being pushed to tripOtherItems  
            
            tripImages: [], //for gallery selected pictures
            imageFileName: [], //for camera taken pictures
            imagePath: [], //for camera taken pictures
            imageUrl: null, //images pasted from the web  
            imgSearchPhrase: "", //for Unsplash image search
            imgSearchArray: [], //to store data from API requests             
            
            places: [], // for Google Places API population
            placesAutoHide: true,
            googlePlacesAutocomplete: null,  

            itineraryDay: "", //temp storage of new itinerary entry
            itineraryDestination: null, //temp storage of new itinerary entry
            itineraryDescription: null, //temp storage of new itinerary entry
            
            currencyList: Object.keys(this.$currency.currencyToLocale), //get supported currencies for UI selector

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
        tripDuration: function() { //Calculate the duration of the trip from the trip dates
            if(this.tripData.tripDateFrom && this.tripData.tripDateTo){
                const oneDay = 1000 * 60 * 60 * 24
                let dateDifference = Math.abs(this.tripData.tripDateTo - this.tripData.tripDateFrom)
                let tripLength = Math.round(dateDifference / oneDay) + 1
                if(tripLength == 1){
                    return "It's a day trip!"
                } else {
                    return `It's a ${tripLength}-days trip!`
                }                
            }
        },

        tripLength: function() { //Creates and updates an array of days depending on the length of the trip
            if(this.tripData.tripDateFrom && this.tripData.tripDateTo){
                const oneDay = 1000 * 60 * 60 * 24
                let dateDifference = Math.abs(this.tripData.tripDateTo - this.tripData.tripDateFrom)
                let tripLength = Math.round(dateDifference / oneDay) + 1
                return tripLength            
            }        
        },        

        freeSpaces: function() { //Calculate the number of free spaces for UX display
            if(this.tripData.tripSpaces == null || this.tripData.tripSpaces == 0 || Math.sign(this.tripData.tripSpaces) == -1 || this.tripData.tripSpaces == "-" ) {
                let spaces = 1
                return spaces - this.tripData.tripMembers.length         
            } else {
                return this.tripData.tripSpaces - this.tripData.tripMembers.length
            }
        },

        currentDate: function() { //Calculate current date in yyyy/mm/dd format
            let utc = new Date().toJSON().slice(0,10).replace(/-/g,'/')
            return utc
        },
        
        tripMediaArrayLength: function() {
            return this.tripData.tripMedia.length
        },

        totalMemberCost: function() {
            let cost = this.tripData.tripCost
            if(this.tripData.tripMembers.length == 0){
                return cost
            } else {
                return Number.parseFloat(cost/this.tripData.tripMembers.length)
            } 
        },

        saveValidationDone: function() {
            if(this.tripData.tripTitle && this.tripData.tripLocation && this.tripData.tripDescription && this.tripData.tripDateTo && this.tripData.tripDateFrom && this.tripData.tripSpaces && this.tripData.tripCostItems  && this.tripData.tripMedia.length > 0){
                return true
            } else {
                return false
            }
        }         
    },    

    methods: {

        saveChanges() {
            if(this.saveValidationDone){
                db.collection('trips').doc(this.tripID).update({

                    tripTitle: this.tripData.tripTitle,
                    tripLocation: this.tripData.tripLocation,
                    tripDescription: this.tripData.tripDescription,
                    tripDateFrom: this.tripData.tripDateFrom,
                    tripDateTo: this.tripData.tripDateTo,
                    tripSpaces: this.tripData.tripSpaces,
                    tripCurrency: this.tripData.tripCurrency,

                    tripActivityLevel: this.tripData.tripActivityLevel,
                    tripMeetingLocation: this.tripData.tripMeetingLocation,
                    tripCost: this.tripData.tripCost,
                    tripCostItems: this.tripData.tripCostItems,
                    tripOtherItems: this.tripData.tripOtherItems,
                    tripTransport: this.tripData.tripTransport,

                    tripItineraryEnabled: this.tripData.tripItineraryEnabled,
                    tripItinerary: this.tripData.tripItinerary

                })
                .then(() => {
                    this.$goTo('tripcurrent', {tripID: this.tripID})
                    this.feedback = null
                    console.log("Trip chagnes saved")
                })
            } else {
                this.feedback = "Please input information in requried fields (Trip title, description, dates, location, costs and at least 1 trip picture)"
                console.log("Please input information in all of the fields")
            }
        },    
        
        dayDates(day) { //For date rendering in itinerary
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            let date = null
            if(day){
                if(day == 1) {
                    date = this.tripData.tripDateFrom.getDate()
                } else {
                    date = this.tripData.tripDateFrom.getDate() + day - 1
                }
                const month = monthNames[this.tripData.tripDateFrom.getMonth()] 
                return `${date} ${month}`
            } else {
                return ""
            }      
        },     
        
        membersCountSelect(count) {
            this.membersCountIsEnabled = false
            let index = this.membersCount.indexOf(count)
            if(index == 10){
                this.membersCountExtraOn = true
                this.tripData.tripSpaces = null
                this.$nextTick(() => {
                    this.$refs.memberCountExtra.nativeView.focus()
                })                
            } else {
                this.tripData.tripSpaces = count
            }            
        },        

        tripInItineraryEnabled() {
            if(this.tripData.tripItineraryEnabled){
                this.tripData.tripItineraryEnabled = true
                console.log("Itinerary enabled " + this.tripData.tripItineraryEnabled)
            } else {
                this.tripData.tripItineraryEnabled = false
                console.log("Itinerary disabled " + this.tripData.tripItineraryEnabled)
            }
        },  

        addItineraryItem() {
            if(this.itineraryDay && this.itineraryDestination && this.itineraryDescription){
                let itinerary = {
                    day: this.itineraryDay,
                    destination: this.itineraryDestination,
                    description: this.itineraryDescription
                }
                this.tripData.tripItinerary.push(itinerary)
                this.tripItinerarySort() //sort the itinerary array 
                this.itineraryDay = null
                this.itineraryDestination = null
                this.itineraryDescription = null
                this.$nextTick(() => {
                    this.$refs.itinDay.nativeView.focus()
                })                   
                console.log("Itinerary entry added " + itinerary)
            } else {
                console.log("Fill in all itinerary fields.")
            }
        },

        removeItineraryItem(day) {
            let index = this.tripData.tripItinerary.indexOf(day)
            this.tripData.tripItinerary.splice(index, 1)
        },

        tripItinerarySort() {
            this.tripData.tripItinerary.sort((a, b) => {
                return a.day - b.day
            }) 
            console.log("Trip itinerary sorted")           
        },

        openItinerarySelector() {
            this.$showModal(ItinerarySelector, {
                props: {
                    tripLength: this.tripLength,
                    tripDateFrom: this.tripData.tripDateFrom
                }
            }).then(day => {
                if(day == 'close'){
                    console.log("Itinerary selector closed")
                } else {
                    this.itineraryDay = day
                }                
            })
        },         
        
        openCurrencyList() {
            this.$showModal(CurrencySelector, {
                props: {
                    currencyList: this.currencyList
                }
            }).then(currency => {
                if(currency){
                    this.tripData.tripCurrency = currency
                }
            })
        },        

        addCostLine() {
            if(this.costLineItem && this.costLinePrice){
                let item = {
                    name: this.costLineItem,
                    price: parseFloat(this.costLinePrice)
                }
                this.tripData.tripCostItems.push(item)
                console.log(`Item ${this.costLineItem} added with price of ${this.costLinePrice}`)
                this.tripData.tripCost = parseFloat(this.tripData.tripCost) + parseFloat(this.costLinePrice)
                console.log("Total cost now: " + this.tripData.tripCost)
                this.costLineItem = null
                this.costLinePrice = null
                this.$nextTick(() => {
                    this.$refs.cost.nativeView.focus()
                })             
            }
        },

        removeCostLine(cost) {
            this.tripData.tripCost -= cost.price
            let index = this.tripData.tripCostItems.indexOf(cost)
            this.tripData.tripCostItems.splice(index, 1)            
        },

        addOtherItem() {
            if(this.otherItem){
                this.tripData.tripOtherItems.push(this.otherItem)
                this.otherItem = null
                console.log(`Other item ${this.otherItem} added`)
            }
        },

        removeOtherItem(item) {
            this.tripData.tripOtherItems = this.tripData.tripOtherItems.filter(other => {
                return other != item
            })
        },        

        changeActivityLevel() {
            action("What's the trip activity level?", "Cancel", ["Intense", "Active", "Light", "None"])
            .then(result => {
                if(result != "Cancel"){
                    this.tripData.tripActivityLevel = result
                } else {
                    this.tripData.tripActivityLevel = null
                }
            })
        },

        onDateChangeFrom(date) {
            this.tripData.tripDateFrom = date.value
            console.log("From date set to " + date.value)
        },

        onDateChangeTo(date) {
            this.tripData.tripDateTo = date.value
            console.log("To date set to " + date.value)
        }, 
        
        addPictureSelector(index) {
            action("Select a source for your picture", "Cancel", ["Search the web for images", "Paste a web photo url (https://)", "Upload from Gallery"])
            .then(result => {
                switch(result) {
                    case "Search the web for images": return this.$nextTick(() => {this.$refs.imgSearchField.nativeView.focus()}); break
                    case "Paste a web photo url (https://)": return this.$nextTick(() => {this.$refs.imgUrlField.nativeView.focus()}); break
                    case "Upload from Gallery": return this.selectPicture(); break
                    case "Cancel": return null; break
                }
            })
        },

        getPlace(place) {
            this.googlePlacesAutocomplete.getPlaceById(place.placeId).then((place) => {
                this.tripData.tripLocation = place.formattedAddress 
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
            if(!this.placesAutoHide && this.tripData.tripLocation && this.tripData.tripLocation.length >= 2){ //Search Google Places when user has inputed at least 2 characters
                this.placesAutoHide = false
                this.googlePlacesAutocomplete.search(this.tripData.tripLocation)
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
                this.tripImages.items = []
                this.imageFileName = []
                this.imagePath = []
                console.log("Selection done: " + JSON.stringify(selection))
                await selection.forEach((selected) => {
                // process the selected images, resize and save the resized ones to file
                selected.options = {height: 356, keepAspectRatio: true }
                this.tripImages.items.push(selected)
                this.saveToFile(selected)   
                })                    
            }).catch((e) => {
                console.log(e)
            })
        },        

        async searchForImage() { //Get images from Unsplash
            try {
                const response = await axios.get('https://api.unsplash.com/search/photos/?client_id=' + this.$store.getters.getUnsplashAPI, {
                    params: { query: this.imgSearchPhrase, page: 1, per_page: 6}
                })
                this.imgSearchArray = response.data.results
                console.log(response.data.results) 
            } catch (error) {console.error(error)}            
        },

        async selectUnsplashImage(pic) {
            //Increment the photo's Unsplash viewcount as per their guidelines. This purely increments the photo website viewcount and does nothing else.
            try {
                const response = await axios.get(pic.links.download_location + "?client_id=" + this.$store.getters.getUnsplashAPI, {
                })
                console.log(JSON.stringify(response.data.url)) 
            } catch (error) {console.error(error)}    
            //Set the picture's url as the imageUrl variable. That saves another variable and extra code as we call and reuse savePictureUrl function
            this.imageUrl = pic.urls.regular //using regular sized Unsplash image    
            this.savePictureUrl()
        },         

        savePictureUrl() {
            let isUrlValid = this.imageUrl.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)
            console.log(isUrlValid)
            if(isUrlValid){
                //save picture from url, uncropped
                imageSource.ImageSource.fromUrl(this.imageUrl)
                .then((image) => {
                    this.imageFileName = []
                    this.imagePath = []                     
                    this.tripImages.items = []
                    this.tripImages.items.push(image)
                    console.log("Saving pidture from url")
                    let folderPath = fileSystemModule.knownFolders.documents().path
                    let fileName = `tripImage-${Date.now()}.jpg` //randomize the image file name. Might want to add extra variables than just date
                    this.imageFileName.push(fileName)
                    let imgPath = fileSystemModule.path.join(folderPath, fileName)
                    this.imagePath.push(imgPath)
                    let saved = image.saveToFile(imgPath, "jpg")
                    this.uploadImg()
                    if (saved) {
                        this.imageUrl = null
                        console.log("Image saved successfully!")
                        console.log("Saved: " + imgPath)        
                    } else { console.log("No file saved")}
                })
            } else {
                console.log("URL is invalid")
            }
        },        
        
        saveToFile(res) {
            // Save the camera image to a file and assign them to the images array
            imageSource.ImageSource.fromAsset(res)
            .then((image) => {
                console.log("Saving to file")
                let folderPath = fileSystemModule.knownFolders.documents().path
                let fileName = `tripImage-${Date.now()}.jpg` //randomize the image file name. Might want to add extra variables than just date
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

        deletePictureSelector(index) {
            confirm({title: "Remove this picture?", message: "", okButtonText: "OK", cancelButtonText: "Cancel"})
            .then(result => {
                if(result){
                    this.deletePicture(index)
                } else { console.log("Action cancelled") }
            })
        },    

        deletePicture(item){
            console.log("Starting picture deletion")
            const index = item
            fstore.deleteFile({
                remoteFullPath: this.tripData.tripMediaPaths[index]
            })
            .then(async () => {
                db.collection('trips').doc(this.tripID).update({
                tripMedia: firebase.firestore.FieldValue.arrayRemove(this.tripData.tripMedia[index]),
                tripMediaPaths: firebase.firestore.FieldValue.arrayRemove(this.tripData.tripMediaPaths[index])
                })
                console.log("Picture deleted")
                await this.refreshData() // to refresh the layout view
            })                          
        },         

        refreshData() {
            const tripDocument = db.collection('trips').doc(this.tripID)
            tripDocument.get().then(doc => {
                    if(doc.exists) {
                        this.tripData.tripMedia = doc.data().tripMedia
                        this.tripData.tripMediaPaths = doc.data().tripMediaPaths
                        console.log("Trip data refreshed")
                    } else {console.log("Document doesn't exist")}
                })
                .catch(error => console.log("Trouble in getting user: " + error))
        }, 

        async uploadImg() {
            // Upload the images array to firebase
            if(this.tripImages) {// if there's an image asset
                console.log("Uploading image to Firebase")                
                for(let i=0; i < this.tripImages.items.length; i++) {   
                    //upload file                 
                    await fstore.uploadFile({
                    remoteFullPath: `uploads/trip_pics/${this.imageFileName[i]}`,
                    localFullPath: this.imagePath ? this.imagePath[i] : this.tripImages.items[i]["android"],
                    metadata: this.metadata 
                    }) .then(async (uploadedFile) => {
                        await this.insertFirestoreImgRef(this.imageFileName[i])
                        console.log("File uploaded:" + JSON.stringify(uploadedFile))
                        await this.refreshData() // to refresh the layout view
                    }) .catch(e => console.log("File upload error:" + e))
                } 
                console.log("Trip chagnes saved")
            }
        },

        async insertFirestoreImgRef(fileName){
            // Get the image URL and store it into the trip's Firestore DB for access 
            let remotePath = `uploads/trip_pics/${fileName}`
            await fstore.getDownloadUrl({
                remoteFullPath: `uploads/trip_pics/${fileName}`
            }) .then(async (url) => {
                await db.collection('trips').doc(this.tripID).update({
                tripMedia: firebase.firestore.FieldValue.arrayUnion(url),
                tripMediaPaths: firebase.firestore.FieldValue.arrayUnion(remotePath)
                }).then(() => {
                    console.log("Trip media paths updated in Firebase")
                }) 
                console.log("URL ref created to the trip's database document: " + url)               
            })
        }        
    },       

    created() {
        this.googlePlacesAutocomplete = new GooglePlacesAutocomplete(this.$store.getters.getGooglePlacesAPI) //Google places API initiation        
        console.log("Trip ID loaded in Trup Edit: " + this.tripID)
        db.collection('trips').doc(this.tripID).get().then(doc => {
            this.tripData = doc.data()
            this.tripItinerarySort() //sort the itinerary array 
            console.log("Trip data loaded for trip: " + this.tripData.tripTitle)
        })
        camera.requestPermissions() //get camera permissions
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
        margin-bottom: 25;
    }
    .action-bar-text {
        margin-left: 35;
        margin-right: 25;
        margin-top: 30;
    }
    .basic-profile-info {
        margin: 15, 25;
    }    
    .input-field{
        font-size: 15;
        margin: 0, 0, 0, 0;
    }
    .trip-profile-image {
      margin-top: 5;
      border-radius: 50%;
    }    
    TextField {
        margin: 10, 20;
        font-size: 15;
    }
    .trip-text {
        color: #2E2E2E;
        margin: 15, 0, 0, 20;
    }
    .trip-text-heading {
        color: #2E2E2E;
        font-size: 15;
        font-weight: 500;
    }    
    .section-heading {
        color: #2E2E2E;
        margin: 10, 25;
        font-size: 20; 
        font-weight: 500;      
    }       
    .input-heading {
        margin: 10, 20;
        font-size: 15;       
    }    
    .trip-icon {
        margin: 5, 0, 5, 20;
    }          
    .grey-field-box {
        background-color: #F2F2F2;
        border-radius: 7;
        padding: 10, 0;
        margin: 10, 20;
    }
    .grey-field {
        background-color: #F2F2F2;
        padding: 10, 0;
    }    
    .search-text {
        margin: 0, 50, 10;
        font-size: 15;         
    }    
    .edit-icon {
        background: #E5E5E5;
        border-radius: 50%;
        margin: 0;
        padding: 5;
    }             
</style>