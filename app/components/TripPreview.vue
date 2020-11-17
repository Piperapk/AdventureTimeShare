<template>
    <Page actionBarHidden="true" loaded="onLoaded" navigatedTo="onNavigatedTo"> 
        <!-- Grid layout to facilitate the bottom action bar -->
        <GridLayout> 
            <ScrollView v-show="!isLoading">
                <StackLayout>
                    <!-- Custom Actionbar and Image Carrousel and extra profile info -->
                    <GridLayout rows="*" columns="*" >                
                        <GridLayout row="0" col="0" v-if="hasItems != 0" rows="500">
                            <Carousel ref="myCarousel" debug="true" height="100%" width="100%" color="white" indicatorColor="#fff" indicatorOffset="0, 0" showIndicator="true">                        
                                <CarouselItem v-for="(item, i) in tripData.tripMedia" :key="i" verticalAlignment="middle" >
                                    <Image class="profile-images" :src="item" stretch="aspectFill" />
                                </CarouselItem>
                            </Carousel>
                        </GridLayout>    
                        <GridLayout row="0" col="0" rows="*" columns="auto, *, auto" class="action-bar" >
                            <StackLayout col="0" :isEnabled="!isLoading" margin="30, 0, 0, 25" verticalAlignment="top" height="40" width="40" @tap="$navigateBack" >
                                <Image src="~/assets/images/icons/back_button.png" horizontalAlignment="left" width="26.67" height="30" stretch="aspectFit" />
                            </StackLayout>  
                            <StackLayout col="2" v-show="!isTripFavourite" :isEnabled="!isLoading" margin="35, 25, 0, 0" verticalAlignment="top" height="40" width="40" @tap="addToFavourite()" >
                                <Image src="~/assets/images/icons/fav_icon.png" horizontalAlignment="right" height="25" stretch="aspectFit" />
                            </StackLayout>    
                            <StackLayout col="2" v-show="isTripFavourite" :isEnabled="!isLoading" margin="35, 25, 0, 0" verticalAlignment="top" height="40" width="40" @tap="removeFromFavourite()" >
                                <Image src="~/assets/images/icons/fav_active_icon.png" horizontalAlignment="right" height="25" stretch="aspectFit" />
                            </StackLayout>                                                                                 
                        </GridLayout>                                                       
                    </GridLayout>            
                    <!-- Basic trip information -->
                    <StackLayout style="background-color: #F2F2F2;" >
                        <GridLayout rows="auto, auto, auto, auto" columns="*" class="basic-profile-info" >
                            <Label row="0" col="0" :text="tripDuration" textWrap="true" />
                            <Image row="1" col="0" class="icon-image" src="~/assets/images/icons/location_icon.png" height="20" horizontalAlignment="left" stretch="aspectFit" @tap="openDirections(tripData.tripLocation)" />
                            <Label row="1" col="0" class="trip-text trip-item" :text="this.tripData.tripLocation.toUpperCase()" textWrap="true" @tap="openDirections(tripData.tripLocation)" />
                            <Image row="2" col="0" class="icon-image" src="~/assets/images/icons/calendar_icon.png" height="15" horizontalAlignment="left" stretch="aspectFit"/>
                            <Label row="2" col="0" class="trip-text trip-item" :text="tripDates" textWrap="true" />
                            <Label row="3" col="0" class="trip-title" :text="tripData.tripTitle" textWrap="true" />
                        </GridLayout>                       
                    </StackLayout>
                    <StackLayout height="1" backgroundColor="#E1E1E1"/>
                    <!-- TODO Trip Tags -->
                    <!-- Trip Details -->
                    <StackLayout style="background-color: #F2F2F2;" >
                        <Label text="Trip overview" class="section-heading-text basic-profile-info" marginBottom="0" textWrap="true" />
                        <GridLayout rows="auto, auto, auto" columns="*, *" class="basic-profile-info" marginTop="10" >
                            <StackLayout row="0" col="0" marginBottom="10" marginRight="10">
                                <StackLayout orientation="horizontal">
                                    <Image class="icon-image" src="~/assets/images/icons/people_icon.png" height="15" horizontalAlignment="left" style="margin-top: 10;" stretch="aspectFit"/>
                                    <Label class="trip-item-details" fontWeight="500" text="PEOPLE" textWrap="true" />                            
                                </StackLayout>
                                <Label class="trip-text" :text="freeSpaces + ' Free Spaces'" textWrap="true" />
                                <Label class="trip-text" :text="tripData.tripSpaces + ' Going in Total'" textWrap="true" />                                
                            </StackLayout>

                            <StackLayout row="0" col="1" marginBottom="10" >
                                <StackLayout orientation="horizontal" @tap="navigateToCreatorProfile(userData.userID)">
                                    <Image class="profile-picture" :src="profileImage" height="30" width="30" horizontalAlignment="left" verticalAlignment="bottom" stretch="aspectFill"/>
                                    <Label class="trip-item-details" fontWeight="500" text="ORGANISER" textWrap="true" />                                
                                </StackLayout>
                                <Label class="trip-text" :text="userData.userFirstName" textWrap="true" />
                                <Label v-show="userData.userLocation" class="trip-text" :text="userData.userLocation" textWrap="true" />                                
                            </StackLayout>

                            <StackLayout row="1" col="0" marginBottom="10" marginRight="10">
                                <StackLayout orientation="horizontal">
                                    <Image class="icon-image" src="~/assets/images/icons/transport_icon.png" height="15" horizontalAlignment="left" verticalAlignment="center" style="margin-bottom: 5;" stretch="aspectFit"/>
                                    <Label class="trip-item-details" fontWeight="500" text="TRANSPORT" textWrap="true" />
                                </StackLayout>
                                <Label v-show="tripData.tripTransport" class="trip-text" :text="tripData.tripTransport" textWrap="true" />
                                <Label class="trip-text" :text="numberOfDrivers + ' Driver(s) in the group'" textWrap="true" />                                
                            </StackLayout>

                            <StackLayout row="1" col="1" marginBottom="10" >
                                <StackLayout orientation="horizontal">
                                    <Image class="icon-image" src="~/assets/images/icons/activity_level.png" height="20" horizontalAlignment="left" verticalAlignment="top" stretch="aspectFit"/>
                                    <Label class="trip-item-details" fontWeight="500" text="ACTIVITY LEVEL" textWrap="true" />
                                </StackLayout>
                                <Label class="trip-text" :text="tripData.tripActivityLevel" textWrap="true" />                                
                            </StackLayout>

                            <StackLayout row="2" col="0" marginBottom="10" marginRight="10">
                                <StackLayout orientation="horizontal">
                                    <Image class="icon-image" src="~/assets/images/icons/list_green_icon.png" height="20" horizontalAlignment="left" verticalAlignment="top" stretch="aspectFit"/>
                                    <Label class="trip-item-details" fontWeight="500" text="INCLUDED (in price)" textWrap="true" />
                                </StackLayout>
                                <Label class="trip-text" :text="includedItems" textWrap="true" />                                
                            </StackLayout>

                            <StackLayout row="2" col="1" marginBottom="10" >
                                <StackLayout orientation="horizontal">
                                    <Image class="icon-image" src="~/assets/images/icons/list_red_icon.png" height="20" horizontalAlignment="left" verticalAlignment="top" stretch="aspectFit"/>
                                    <Label class="trip-item-details" fontWeight="500" text="NOT INCLUDED" textWrap="true" />
                                </StackLayout>
                                <Label class="trip-text" :text="tripData.tripOtherItems.join(', ')" textWrap="true" />                                
                            </StackLayout>
                        </GridLayout>   
                    </StackLayout>

                    <!-- Trip Description -->
                    <StackLayout class="basic-profile-info" >
                        <Label text="Details" class="section-heading-text" textWrap="true" />
                        <TextView :text="this.tripData.tripDescription" class="text-field" editable="false" />                    
                    </StackLayout>
                    <StackLayout height="1" backgroundColor="#E1E1E1"/>
                    <!-- The Group -->
                    <StackLayout class="basic-profile-info" >
                        <Label text="The Group" class="section-heading-text" textWrap="true" />   
                        <WrapLayout orientation="horizontal" >                   
                            <GridLayout rows="65" columns="65" v-for="(member, index) in membersProfileData" :key="`A` + index" >
                                <Image row="0" col="0" class="trip-profile-image" horizontalAlignment="left" :src="member.profileImage" width="50" height="50" stretch="aspectFill" @tap="navigateToCreatorProfile(member.id)" />
                            </GridLayout> 
                            <GridLayout rows="65" columns="65" v-for="free in freeSpaces ? freeSpaces : 0" :key="free" @tap="joinTripAction()" >
                                <Image :isEnabled="!isEnabled" row="0" col="0" v-show="freeSpaces > 0" horizontalAlignment="left" src="~/assets/images/icons/add.png" width="50" height="50" stretch="aspectFit" />                     
                            </GridLayout>
                        </WrapLayout>    
                        <Label class="trip-text" :text="memberNames" textWrap="true" />
                        <GridLayout v-show="tripData.tripMeetingLocation" rows="auto, auto" columns="*" @tap="openDirections(tripData.tripMeetingLocation)">
                            <Image row="0" col="0" class="icon-image" src="~/assets/images/icons/location_icon.png" height="20" horizontalAlignment="left" stretch="aspectFit"/>
                            <Label row="0" col="0" class="trip-text trip-item" text="Group's preferred meeting point" textWrap="true" />
                            <Label row="1" col="0" class="trip-text" style="margin-top: 10;" :text="'- ' + tripData.tripMeetingLocation" textWrap="true" />                        
                        </GridLayout>
                    </StackLayout>
                    <StackLayout height="1" backgroundColor="#E1E1E1"/>
                    <!-- Costings -->
                    <StackLayout>
                        <StackLayout class="grey-field">
                            <Label class="grey-field-box section-heading-text" text="Costs (per person)" textWrap="true" /> 
                            <Label class="trip-text" style="background-color: #FFC156; color: black; padding: 5, 25;" text="Costs are approximate and can vary depending on when the final bookings and purchases are made between the group." textWrap="true" />  
                            <Label class="trip-text" color="black"  margin="15, 25, 0" horizontalAlignment="left" text="Items:" textWrap="true" />
                        </StackLayout>
                        <GridLayout rows="auto" columns="*" class="grey-field-box" v-for="(cost, index) in tripData.tripCostItems" :key="`C` + index" >
                            <Label row="0" col="0" class="trip-text" horizontalAlignment="left" :text="cost.name + ': ' + $currency.display(cost.price/membersCount, tripData.tripCurrency)" textWrap="true" />
                        </GridLayout>   
                        <Label class="grey-field-box trip-text" color="black" :text="'Total cost: ' + $currency.display(totalCost, tripData.tripCurrency)" textWrap="true" />                                            
                    </StackLayout>
                    <StackLayout height="1" backgroundColor="#E1E1E1" />
                    <!-- Organiser Info -->
                    <StackLayout class="basic-profile-info" >
                        <Label text="Meet the organiser" class="section-heading-text" textWrap="true" /> 
                        <!-- Basic information -->
                        <GridLayout rows="auto, auto, auto, auto" columns="*" >
                            <Label row="0" col="0" colSpan="2" class="user-name" :text="userData.userFirstName + ', ' + userCalculatedAge" textWrap="true" />
                            <Label row="1" col="0" colSpan="2" class="profile-text" :text="'Adventuring since ' + userSignupDate" textWrap="true" />
                            <Image row="2" col="0" class="icon-image" :src="userData.userIsVerified ? '~/assets/images/icons/verified_icon.png' : '~/assets/images/icons/not_verified_icon.png'" height="20" horizontalAlignment="left" stretch="aspectFit"/>
                            <Label row="2" col="0" class="profile-text profile-item" :text="(userData.userIsVerified ? 'Verified' : 'Not Verified')" textWrap="true" />
                            <Image row="3" col="0" class="icon-image" src="~/assets/images/icons/map_icon.png" height="20" horizontalAlignment="left" stretch="aspectFit"/>
                            <Label row="3" col="0" class="profile-text profile-item" :text="`${ tripCount } Trips`" textWrap="true" />
                            <Image row="0" col="0" rowSpan="4" colSpan="3" class="profile-picture" horizontalAlignment="right" verticalAlignment="center" :src="profileImage" width="100" height="100" stretch="aspectFill" @tap="navigateToCreatorProfile(userData.userID)" />
                        </GridLayout>
                        <StackLayout height="1" backgroundColor="#E1E1E1" style="margin: 15, 0;"/>
                        <!-- About Me -->
                        <GridLayout rows="auto, auto, auto, auto, auto" columns="*" >
                            <Label row="0" col="0" class="section-heading-text" text="About Me" textWrap="true" />
                            <TextView row="1" col="0" class="profile-text text-field" :text="userData.userAboutMe" editable="false" />
                            <StackLayout row="2" col="0" height="1" margin="10em, 50em" backgroundColor="#E1E1E1"/>
                            <Image row="3" col="0" class="icon-image" src="~/assets/images/icons/home.png" height="15" horizontalAlignment="left" stretch="aspectFit"/>
                            <Label row="3" col="0" v-show="userData.userLocation" class="profile-text profile-item" :text="'Lives in ' + userData.userLocation" textWrap="true" @tap="openDirections(userData.userLocation)" />
                            <Image row="4" col="0" class="icon-image" src="~/assets/images/icons/language_icon.png" height="20" horizontalAlignment="left" stretch="aspectFit"/>
                            <Label row="4" col="0" v-show="userData.userLanguages" class="profile-text profile-item" :text="'Speaks ' + userData.userLanguages.join(', ')" textWrap="true" />                     
                        </GridLayout>  
                        <Button class="profile-button" width="120" height="36" horizontalAlignment="left" @tap="navigateToCreatorProfile(userData.userID)">
                            <FormattedString>
                                <Span text="View Profile"/>
                            </FormattedString>
                        </Button>        
                    </StackLayout>
                    <!-- Itinerary -->   
                    <StackLayout height="1" backgroundColor="#E1E1E1"/> 
                    <Label class="section-heading" text="Itinerary" v-show="tripData.tripItineraryEnabled" /> 
                    <StackLayout class="grey-field" v-show="tripData.tripItineraryEnabled" >
                        <StackLayout class="basic-profile-info" marginTop="0">
                            <!-- Itinerary show -->
                            <StackLayout v-for="(day, index) in tripData.tripItinerary" :key="index + `itinerary`">
                                <Label class="trip-text-heading" margin="10, 0" :text="`Day ${day.day} (${dayDates(day.day)})`" />   
                                <GridLayout columns="auto, *" margin="0, 0, 10" @tap="openDirections(day.destination)" >
                                    <Image row="0" col="0" class="trip-icon" margin="0" src="~/assets/images/icons/location_icon.png" height="20" horizontalAlignment="left" stretch="aspectFit"/>
                                    <Label row="0" col="1" class="trip-text" margin="0, 10, 0, 10" :text="day.destination" textWrap="true"/>  
                                </GridLayout>      
                                <GridLayout columns="auto, *" margin="0, 0, 10">
                                    <Image row="0" col="0" class="trip-icon" margin="0" src="~/assets/images/icons/list_icon.png" height="20" horizontalAlignment="left" stretch="aspectFit"/>
                                    <Label row="0" col="1" class="trip-text" margin="0, 10, 0, 10" :text="day.description" textWrap="true"/>  
                                </GridLayout> 
                                <StackLayout height="1" backgroundColor="#E1E1E1"/>                                                              
                            </StackLayout>                                                                                                
                        </StackLayout>                        
                    </StackLayout>     
                    <Label class="basic-profile-info trip-text" horizontalAlignment="left" verticalAlignment="center" text="Report trip" @tap="reportTrip()"/>                        
                    <StackLayout height="50" backgroundColor="transparent"/>                                                    
                </StackLayout>
            </ScrollView>
            <!-- Bottom action bar -->
            <StackLayout v-show="!isLoading" verticalAlignment="bottom" >
                <StackLayout height="1" backgroundColor="#E1E1E1" />       
                <GridLayout v-show="userTripStatus == 'not member'" rows="auto, auto" columns="*, auto" class="bottom-navigation" height="55" verticalAlignment="bottom" >
                    <Label row="0" col="0" :text="freeSpaces + ' Free Spaces'" style="color: white;" textWrap="true" />
                    <Label row="1" col="0" :text="$currency.display(totalCost, tripData.tripCurrency) + ' per person (approx.)'" style="color: white;" textWrap="true" />
                    <Button row="0" col="1" rowSpan="2" class="bottom-action-button" horizontalAlignment="right" width="120" height="36" @tap="joinTripAction()" >
                        <FormattedString>
                            <Span text="I want to go!"/>
                        </FormattedString>
                    </Button>
                </GridLayout>
                <GridLayout v-show="userTripStatus == 'member'" rows="auto" columns="*, auto" class="bottom-navigation" backgroundColor="#48AC66" height="55" verticalAlignment="bottom" >
                    <Label row="0" col="0" text="You're already on this trip!" marginTop="5" fontSize="15" style="color: white;" verticalAlignment="center" textWrap="true" />
                    <Button row="0" col="1" rowSpan="2" class="bottom-action-button" marginTop="5" horizontalAlignment="right" width="120" height="36" @tap="joinTripAction()" >
                        <FormattedString>
                            <Span text="Go to trip"/>
                        </FormattedString>
                    </Button>
                </GridLayout>          
                <GridLayout v-show="userTripStatus == 'pending'" rows="auto" columns="*, auto" class="bottom-navigation" backgroundColor="#FFC156" height="55" verticalAlignment="bottom" >
                    <Label row="0" col="0" text="You have a pending invite!" marginTop="5" fontSize="15" color="black" verticalAlignment="center" textWrap="true" />
                    <Button row="0" col="1" rowSpan="2" class="bottom-action-button" marginTop="5" horizontalAlignment="right" width="120" height="36" @tap="joinTripAction()" >
                        <FormattedString>
                            <Span text="Go to chats"/>
                        </FormattedString>
                    </Button>
                </GridLayout>                         
            </StackLayout>
            <ActivityIndicator :busy="isLoading" horizontalAlignment="center" verticalAlignment="center" />  
        </GridLayout> 
    </Page>
</template>

<script>
import firebase from 'nativescript-plugin-firebase'
const db = firebase.firestore

import carousel from 'nativescript-carousel'
import * as email from "nativescript-email"

import Feed from "./Feed"
import Trips from "./Trips"
import ProfilePreview from "./ProfilePreview"

export default {
    name: 'TripPreview',
    props: ['tripID'],
    data() {
        return {
            userID: null,
            userData: { //curent user's data for display
                userProfileImages: [],
                userLanguages: []
            },
            userExtraData: {
                userFavs: [],
                userTrips: [],
            },
            privateChat: { //extra object to store the private chat between the user and the organiser (if it exists)
                chatMessages: []
            }, 
            membersProfileData: [], //for storing the image paths to the profile pictures of the trip members, their names and other data

            tripData: {
                tripOtherItems: [],
                tripCostItems: [],
                tripMembers: [],
                tripMedia: [],
                tripLocation: "",     
                tripDateFrom: new Date(),    
            },
            isLoading: false,
            isEnabled: true                   
        }
    },

    computed: {
        hasItems () {
            //image carousel
            return this.tripData.tripMedia.length > 0        
        },

        freeSpaces: function() {
            return this.tripData.tripSpaces - this.tripData.tripMembers.length
        },

        membersCount: function() {
            return this.tripData.tripMembers.length + 1 //adding + 1 one member as that would be a new prospective member that's about to join
        },

        totalCost: function() {
            let cost = this.tripData.tripCost
            return Number.parseFloat(cost/this.membersCount)
        },

        includedItems: function() {
            let items = []
            const costItemCount = this.tripData.tripCostItems.length
            for(let i = 0; i < costItemCount; i++){
                items.push(this.tripData.tripCostItems[i].name)
            }
            return items.join(', ')
        },

        memberNames: function() {
            let name = []
            for(let i = 0; i < this.membersProfileData.length; i++){
                if(i == 0) {                    
                    name.push(this.membersProfileData[i].name + " (organiser)")
                } else {
                    name.push(this.membersProfileData[i].name)
                }
                
            }
            return name.join(', ').replace(/,(?!.*,)/gmi, ' and')
        },

        tripDates: function() {
            //Change dates rendering
            const dateFrom = new Date(this.tripData.tripDateFrom)
            const dateTo = new Date(this.tripData.tripDateTo)
            const year = dateTo.getFullYear()
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            const monthFrom = dateFrom.getDate() + " " + monthNames[dateFrom.getMonth()]
            const monthTo = dateTo.getDate() + " " + monthNames[dateTo.getMonth()]
            return `${monthFrom} - ${monthTo} ${year}`            
        },

        tripDuration: function() { //Calculate the duration of the trip from the trip dates
            if(this.tripData.tripDateFrom && this.tripData.tripDateTo){
                const oneDay = 1000 * 60 * 60 * 24
                let dateDifference = Math.abs(this.tripData.tripDateTo - this.tripData.tripDateFrom)
                return Math.round(dateDifference / oneDay) + "-Days"
            }
        },

        numberOfDrivers: function() { //Calculate the number of driverts for UX display
            let drivers = 0
            for(let i = 0; i < this.membersProfileData.length; i++){
                if(this.membersProfileData[i].isDriver){
                    drivers++
                }
            }
            return drivers
        },

        userSignupDate: function() {
            const date = new Date(this.userData.userSignDate)
            const year = date.getFullYear()
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            const month = monthNames[date.getMonth()]
            return `${month} ${year}`
        },
        
        profileImage: function() {
            let image = this.userData.userProfileImages[0]
            return image
        },

        userCalculatedAge: function() {
            let userDob = Math.floor((new Date() - new Date(this.userData.userAge).getTime()) / 3.15576e+10)
            return userDob
        },

        isTripFavourite: function() {
            let doesContain = this.userExtraData.userFavs.includes(this.tripData.tripID)
            return doesContain
        },    
        
        tripCount: function() {
            return this.userExtraData.userTrips.length
        },
        
        userTripStatus: function() { //Check if the current user hasn't joined the trip, they already have or if they have a pending invite for the trip.
            //The user will be a placeholder/temp member if they are only in the trip members array but the trip is not in their user data trips
            let tripInviteMessages = this.privateChat.chatMessages.filter(msg => msg.inviteForUserID == this.userID && msg.tripRequestID == this.tripData.tripID && msg.tripRequestStatus == "pending")
            let isPending = tripInviteMessages.length
            let isTempMember = this.tripData.tripMembers.includes(this.userID) 
            let isMember = this.userExtraData.userTrips.includes(this.tripData.tripID)
            if(isTempMember && isMember)
            {
                return 'member'
            }            
            else if(isPending > 0)
            {
                return 'pending'
            } 
            else if(!isTempMember && !isMember)
            {
                return 'not member'
            }
        }
        
    },

    watch: {
        async userImages(to) {
            //image carousel
            await this.$nextTick()
            this.$refs.myCarousel.nativeView.refresh();
        }
    },        

    methods: {
        navigateToCreatorProfile(member) {
            if(member != "Anonymous"){
                this.$navigateTo(ProfilePreview, {
                    props: {
                        sourceUserId: member
                    }
                })                
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

        joinTripAction(){
            if(this.userTripStatus == 'member'){
                this.$goTo('tripcurrent', {tripID: this.tripData.tripID})
            } else if(this.userTripStatus == 'pending') {
                this.$goTo('chat')
            } else {
                this.$goTo('trippreviewgo', {tripData: this.tripData, organiserData: this.userData, membersProfileData: this.membersProfileData})
            }
        },
        
        addToFavourite() {
            this.userExtraData.userFavs.push(this.tripData.tripID)
            db.collection('user_data').doc(this.userID).update({
                userFavs: this.userExtraData.userFavs
            })
            confirm({
                message: "Trip added to favourites!",
                okButtonText: "OK"
            })            
            console.log("Favourite added")
        },

        removeFromFavourite() {
            let index = this.userExtraData.userFavs.indexOf(this.tripData.tripID)
            this.userExtraData.userFavs.splice(index, 1)
            db.collection('user_data').doc(this.userID).update({
                userFavs: this.userExtraData.userFavs
            })
            confirm({
                message: "Trip removed from favourites.",
                okButtonText: "OK"
            })                
            console.log("Favourite removed")
        },
        
        openDirections(place) {//Use Google Places API to search for the location
            let searchPhrase = encodeURIComponent(place)
            console.log(searchPhrase)
            this.$utils.openUrl('https://www.google.com/maps/search/?api=1&query=' + searchPhrase)
        },    
        
        reportTrip() {
            email.available().then(avail => {
                console.log("Email available? " + avail);
                if(avail){
                    email.compose({
                        subject: `Report trip: ${this.tripData.tripTitle}`,
                        body: `I'm reporting trip ${this.tripData.tripTitle}. User id = ${this.tripData.tripID}`,
                        to: ['piperapk@gmail.com']
                    }).then(
                    function() {
                    console.log("Email composer closed");
                    }, function(err) {
                    console.log("Error: " + err);
                    });                     
                }      
            })                                             
        }        

    },

    created() {
        this.isLoading = true
        // Get user and document
        this.userID = this.$store.getters.getUser
        console.log("User retreived from Trip Preview " + this.userID)
        console.log("Trip ID passed from Feed is " + this.tripID)
        db.collection('trips').doc(this.tripID).get()
        .then(async (doc) => {
            if(doc.exists){
                this.tripData = doc.data()
                console.log("Trip data loaded for tripID " + this.tripData.tripID)
                for(let i = 0; i < this.tripData.tripMembers.length; i++) { //get trip members and their data (profile pic, name, etc.)
                    if(this.tripData.tripMembers[i] == 'Anonymous') {
                        let member = {}
                        member.id = "Anonymous"           
                        member.name = "Anonymous Buddy"
                        member.profileImage = "~/assets/images/icons/profile_icon.png"
                        this.membersProfileData.push(member)                                                 
                    } else {
                        await db.collection('users').doc(this.tripData.tripMembers[i]).get()
                        .then(person => {
                            this.$store.dispatch('getAnyUserExtraData', this.tripData.tripMembers[i]).then(() => { //get user's extra data: favs, trips, friends                            
                                let userExtraData = this.$store.getters.getAnyUserExtraData 
                                let member = {}
                                member.id = person.id           
                                member.name = person.data().userFirstName
                                member.profileImage = this.$backendService.defaultProfiePicture(person.data().userProfileImages[0])
                                member.isDriver = person.data().userTagDriver
                                member.friends = userExtraData.userFriends
                                member.chats = userExtraData.userChats
                                this.membersProfileData.push(member)  
                                this.isLoading = false                               
                            })                   
                        })
                    }
                }
                this.$store.dispatch('getAnyUserData', this.tripData.userID).then(() => { //Get organiser's data for profile display 
                    this.userData = this.$store.getters.getAnyUserData
                    //To get the trip invite status relating to the currently logged in user: 
                    //Get the organisers chats. See if the user has their ID in their chat. If it has it means they have a direct chat. Get that chat's ID
                    let orrganiserIndex = this.membersProfileData.findIndex(member => member.id == this.userData.userID)
                    let chatIndex = this.membersProfileData[orrganiserIndex].chats.findIndex(chat => chat.chatID.includes(this.userID)) 
                    if(chatIndex >= 0){ //if the chat exists
                        db.collection('chats').doc(this.membersProfileData[orrganiserIndex].chats[chatIndex].chatID).get().then(doc => {
                            console.log("Priva chat loaded " + this.membersProfileData[orrganiserIndex].chats[chatIndex].chatID)
                            this.privateChat = doc.data()                    
                        })
                    } else {
                        console.log("No common chat exists")
                    }        
                })    


            } else {
                confirm({
                message: "This trip no longer exists.",
                okButtonText: "Go back"
                }).then(() => {
                    this.$navigateBack()
                })
                console.log("No such Firebase document")
            }                     
        })
        this.$store.dispatch('getUserExtraData', this.userID).then(() => { //Get the current user's extra data
            this.userExtraData = this.$store.getters.getUserExtraData 
        })    
    }
}
</script>

<style scoped>
    .action-bar {
        margin-bottom: 25;
    }   
    .basic-profile-info {
        margin: 25, 25;
        color: black;
    }
    .trip-title {
        color: #2E2E2E;
        font-size: 30;
        margin-top: 15;
        margin-left: 0;                
    }
    .section-heading-text {
        font-size: 20; 
        font-weight: 500; 
        color: black;     
    }     
    .trip-text {
        font-size: 15;
    }
    .trip-item {
        margin-top: 15;
        margin-left: 30;
    }    
    .trip-item-details {
        font-size: 15;
        margin-top: 15;
        margin-left: 10;
    }      
    .trip-profile-image {
      margin-top: 5;
      border-radius: 50%;
    }    
    .icon-image {
        margin-top: 15;
    } 
    .bottom-navigation {
        background-color: black;
        padding: 5, 25;
    }      
    .bottom-action-button {
        background-color: white;
        color: black;
        font-size: 15;
        border-radius: 7;
        padding: -5, 0;
    }      
    .grey-field-box {
        background-color: #F2F2F2;
        padding: 10, 25;
    }   
    .text-field {
        background-color: transparent;
        border-color: transparent;
    }    
    /* Organiser's profile  */
    .profile-text {
        color: #2E2E2E;
        font-size: 15;
    }
    .profile-item {
        margin-top: 15;
        margin-left: 30;
    }
    .profile-picture {
        border-radius: 50%;
    }
    .user-name {
        margin: 0, 0, 0;
        font-size: 30;
        color: black;             
    }
    .profile-button {
        background-color: #2E2E2E;
        color: white;
        font-size: 15;
        border-radius: 7;
        padding: -5, 0;
        margin-top: 20;
    }       
    /* From TripCurrendEdit itinerary. TODO align styles from TripCurrendEdit */
    .trip-text-heading {
        color: #2E2E2E;
        font-size: 15;
        font-weight: 500;
    }      
    .trip-icon {
        margin: 5, 0, 5, 20;
    }          
    .grey-field {
        background-color: #F2F2F2;
        padding: 10, 0;
    }
    .section-heading {
        color: #2E2E2E;
        margin: 10, 25;
        font-size: 20; 
        font-weight: 500;      
    }      
</style>>