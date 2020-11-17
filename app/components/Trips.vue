<template>
    <Page actionBarHidden="true" loaded="onLoaded" navigatedTo="onNavigatedTo">
        <GridLayout rows="auto, *, auto">
            <!-- Custom Actionbar --> 
            <StackLayout row="0" height="60">
                <GridLayout rows="auto" columns="auto, *, auto" >
                    <StackLayout col="0" :isEnabled="!isLoading" margin="15, 0, 0, 25" height="40" width="40" @tap="$navigateBack" >
                        <Image horizontalAlignment="left" verticalAlignment="center" src="~/assets/images/icons/back_button.png" width="26.67" height="30" stretch="aspectFit" />
                    </StackLayout>            
                    <StackLayout col="2" :isEnabled="!isLoading" margin="15, 25, 0, 0" verticalAlignment="top" height="40" width="40" @tap="$goTo('profile')" >
                        <Image horizontalAlignment="right" opacity="1" src="~/assets/images/icons/profile_icon.png" width="30" height="30" stretch="aspectFit" />
                    </StackLayout>  
                </GridLayout>               
            </StackLayout>
            <!-- Main Content -->
            <ScrollView row="1">
                <StackLayout >
                    <StackLayout v-show="!isLoading" >
                        <!-- Current Trip -->           
                        <StackLayout class="basic-profile-info" marginTop="0">
                            <Label class="section-heading-text" text="Current Trip" textWrap="true" />   
                            <Label v-show="currentTrips.length == 0" class="trip-text" margin="10, 0" color="#2E2E2E" text="No ongoing trips." textWrap="true" />   
                            <Label v-show="currentTrips.length == 0" class="trip-text" margin="0" color="#2E2E2E" text="When a time comes for a trip to start it will be shown here." textWrap="true" />   
                            <GridLayout columns="3*, 2*" rows="auto" v-for="(trip, index) in currentTrips" :key="`A` + index" @tap="onItemTap(trip)" >
                                <Image row="0" col="0" class="trip-image" rowSpan="2" :src="trip.tripMedia[0]" horizontalAlignment="left" width="200" height="356" borderRadius="7" stretch="aspectFill"></Image>
                                <StackLayout row="0" col="1" class="trip-text" orientation="vertical" >
                                    <Label class="trip-items" :text="trip.tripLocation.toUpperCase().substring(0, 60)" textWrap="true" />
                                    <Label class="trip-items" style="margin: 0, 0, 5;" :text="tripDuration(trip)" textWrap="true" />
                                    <Label class="trip-title" :text="trip.tripTitle.substring(0, 60)" textWrap="true" />   
                                    <Label class="trip-items" text="Going" textWrap="true" />
                                    <Label class="trip-items" style="margin: 0, 0, 5;" :text="trip.tripDates" textWrap="true" />
                                    <Label class="trip-items" :text="freeSpaces(trip) + ' FREE SPACES'" textWrap="true" />
                                    <Label class="trip-items" style="margin: 0, 0, 5;" :text="trip.tripSpaces + ' people'" textWrap="true" />                                      
                                </StackLayout>
                                <StackLayout row="0" col="1" class="trip-text" orientation="vertical" verticalAlignment="bottom">
                                    <Image class="trip-profile-image" style="margin: 0, 0, 5;" horizontalAlignment="left" :src="trip.tripCreatorImage" width="35" height="35" stretch="aspectFill" />
                                    <Label class="trip-items" :text="'Organised by ' + trip.tripCreator" textWrap="true" />  
                                    <Label class="trip-items" style="margin: 0, 0, 5;" :text="trip.tripCreatorLocation" textWrap="true" />  
                                    <Label class="trip-price" :text="$currency.display(trip.tripCost/trip.tripMembers.length, trip.tripCurrency)" textWrap="true" />
                                </StackLayout>               
                            </GridLayout>                                         
                        </StackLayout> 
                        <StackLayout height="1" backgroundColor="#E1E1E1"/>
                        <!-- Upcoming Trips -->
                        <StackLayout class="basic-profile-info">
                            <GridLayout rows="auto" columns="auto, *" marginBottom="10">
                                <Image row="0" col="0" horizontalAlignment="left" verticalAlignment="center" margin="0" opacity="0.75" src="~/assets/images/icons/add.png" @tap="$goTo('newtrip')" width="25" height="25" stretch="aspectFit" />
                                <Label row="0" col="1" horizontalAlignment="left" class="section-heading-text" margin="0, 0, 0, 10" color="#1E820B" text="Create a trip" @tap="$goTo('newtrip')" />                           
                            </GridLayout>
                            <Label class="section-heading-text" text="Upcoming Trip" textWrap="true" />
                            <Label v-show="upcomingTrips.length == 0" class="trip-text" margin="10, 0" color="#2E2E2E" text="No upcoming trips." textWrap="true" />   
                            <Label v-show="upcomingTrips.length == 0" class="trip-text" margin="0" color="#2E2E2E" text="Create a new one or join other people's adventures." textWrap="true" />   
                                <GridLayout columns="3*, 2*" rows="auto" v-for="(trip, index) in upcomingTrips" :key="`B` + index" @tap="onItemTap(trip)" >
                                    <GridLayout columns="" row="0" col="0" >
                                        <Image row="0" col="0" class="trip-image" rowSpan="2" :src="trip.tripMedia[0]" horizontalAlignment="left" width="200" height="356" borderRadius="7" stretch="aspectFill"></Image>
                                    </GridLayout>
                                    <StackLayout row="0" col="1" class="trip-text" orientation="vertical" >
                                        <Label class="trip-items" :text="trip.tripLocation.toUpperCase().substring(0, 60)" textWrap="true" />
                                        <Label class="trip-items" style="margin: 0, 0, 5;" :text="tripDuration(trip)" textWrap="true" />
                                        <Label class="trip-title" :text="trip.tripTitle.substring(0, 60)" textWrap="true" />   
                                        <Label class="trip-items" text="Going" textWrap="true" />
                                        <Label class="trip-items" style="margin: 0, 0, 5;" :text="trip.tripDates" textWrap="true" />
                                        <Label class="trip-items" :text="freeSpaces(trip) + ' FREE SPACES'" textWrap="true" />
                                        <Label class="trip-items" style="margin: 0, 0, 5;" :text="trip.tripSpaces + ' people'" textWrap="true" />                                      
                                    </StackLayout>
                                    <StackLayout row="0" col="1" class="trip-text" orientation="vertical" verticalAlignment="bottom">
                                        <Image class="trip-profile-image" style="margin: 0, 0, 5;" horizontalAlignment="left" :src="trip.tripCreatorImage" width="35" height="35" stretch="aspectFill" />
                                        <Label class="trip-items" :text="'Organised by ' + trip.tripCreator" textWrap="true" />  
                                        <Label class="trip-items" style="margin: 0, 0, 5;" :text="trip.tripCreatorLocation" textWrap="true" />  
                                        <Label class="trip-price" :text="$currency.display(trip.tripCost/trip.tripMembers.length, trip.tripCurrency)" textWrap="true" />
                                    </StackLayout>               
                                </GridLayout>                                         
                        </StackLayout>
                        <StackLayout height="1" backgroundColor="#E1E1E1"/>   
                        <!-- Favourites -->         
                        <StackLayout class="basic-profile-info">
                            <Label class="section-heading-text" text="Likes" textWrap="true" />   
                            <Label v-show="favs.length == 0" class="trip-text" margin="10, 0" color="#2E2E2E" text="No favourites." textWrap="true" />   
                            <Label v-show="favs.length == 0" class="trip-text" margin="0" color="#2E2E2E" text="If you find a trip you want to save for later, hit the heart button." textWrap="true" />   
                            <WrapLayout orientation="horizontal">
                                <StackLayout v-for="(trip, index) in favs" :key="`C` + index" width="50%" >
                                    <GridLayout horizontalAlignment="left">
                                        <Image class="trip-image" rowSpan="2" :src="trip.tripMedia[0]" width="150" height="267" borderRadius="7" stretch="aspectFill" @tap="onFavClick(trip)" />
                                        <Image v-show="!trip.isFav" class="trip-fav-icon" rowSpan="2" src="~/assets/images/icons/fav_icon.png" height="25" horizontalAlignment="right" verticalAlignment="bottom" stretch="aspectFit" @tap="addToFavourite(trip)" />
                                        <Image v-show="trip.isFav" class="trip-fav-icon" rowSpan="2" src="~/assets/images/icons/fav_active_icon.png" height="25" horizontalAlignment="right" verticalAlignment="bottom" stretch="aspectFit" @tap="removeFromFavourite(trip)" />                                    
                                    </GridLayout>
                                    <StackLayout class="trip-text" margin="5, 10, 10, 0" orientation="vertical" @tap="onFavClick(trip)" >
                                        <Label class="trip-items" :text="trip.tripLocation.toUpperCase().substring(0, 60)" textWrap="true" />
                                        <Label class="trip-items" style="margin: 0, 0, 5;" :text="favTripDuration(trip)" textWrap="true" />
                                        <Label class="trip-title" :text="trip.tripTitle.substring(0, 60)" textWrap="true" />   
                                        <Label class="trip-items" text="Going" textWrap="true" />
                                        <Label class="trip-items" style="margin: 0, 0, 5;" :text="trip.tripDates" textWrap="true" />
                                        <Label class="trip-items" style="margin: 0, 0, 5;" :text="trip.tripSpaces + ' people'" textWrap="true" /> 
                                        <Label class="trip-price" :text="$currency.display(averagedCost(trip), trip.tripCurrency)" textWrap="true" />                                     
                                    </StackLayout>              
                                </StackLayout>                                                       
                            </WrapLayout>
                        </StackLayout> 
                        <StackLayout height="70" backgroundColor="transparent"/>             
                    </StackLayout>
                </StackLayout>              
            </ScrollView>  
            <!-- Bottom navigation -->
            <GridLayout row="2" rows="auto, auto" columns="*, *, *" class="bottom-navigation" height="60" >
                <Image row="0" col="0" marginTop="5" src="~/assets/images/icons/main_explore.png" horizontalAlignment="center" height="25" width="50" stretch="aspectFit" @tap="$goTo('feed')" />
                <Label row="1" col="0" horizontalAlignment="center" text="EXPLORE" textWrap="true" fontSize="13" @tap="$goTo('feed')" />
                <Image row="0" col="1" marginTop="5" src="~/assets/images/icons/main_trips_active.png" horizontalAlignment="center" height="25" stretch="aspectFit" />
                <Label row="1" col="1" horizontalAlignment="center" text="TRIPS" textWrap="true" fontSize="13" /> 
                <Image row="0" col="2" marginTop="5" src="~/assets/images/icons/main_chat.png" horizontalAlignment="center" height="25" stretch="aspectFit" @tap="$goTo('chat')" />
                <Label row="0" col="2" v-show="$store.getters.getChatNotification" margin="1, 0, 0, 25" backgroundColor="#e32b1e" borderRadius="50" horizontalAlignment="center" verticalAlignment="top" height="10" width="10" @tap="$goTo('chat')" />
                <Label row="1" col="2" horizontalAlignment="center" text="CHAT" textWrap="true" fontSize="13"  @tap="$goTo('chat')" />                            
            </GridLayout> 
            <StackLayout row="2" height="1" verticalAlignment="top" backgroundColor="#E1E1E1"/> 
            <ActivityIndicator row="1" col="0" :busy="isLoading" horizontalAlignment="center" verticalAlignment="center" />           
        </GridLayout>  
    </Page>
</template>

<script>
import firebase from 'nativescript-plugin-firebase'
const db = firebase.firestore

import Feed from './Feed'
import Profile from './Profile'
import NewTrip from './NewTrip'
import Chat from './Chat'
import TripCurrent from './TripCurrent'
import TripPreview from './TripPreview'

export default {
    name: 'Trips',
    data() {
        return {
            userID: null,
            userExtraData: {},
            trips: [],
            favs: [],

            isLoading: false
        }
    },

    computed: {
        currentTrips: function(){
            const currentDate = new Date(Date.now())
            return this.trips.filter(trip => {
                if(trip.tripDateTo.getFullYear() == currentDate.getFullYear() && trip.tripDateTo.getMonth() == currentDate.getMonth() && trip.tripDateTo.getDate() == currentDate.getDate()) {//If the trip is a day one the Date To can't ever be equal in JS miliseconds so Dates are formated to check if that's the case
                    return currentDate >= trip.tripDateFrom
                } else {
                    return currentDate >= trip.tripDateFrom && trip.tripDateTo > currentDate
                }                
            })

        },

        upcomingTrips: function(){
            const currentDate = Date.now()
            return this.trips.filter(trip => {
                return currentDate < trip.tripDateFrom 
            })
        }          
    },

    methods: {

        onItemTap(trip) {
            this.$navigateTo(TripCurrent, {
                props: {
                    tripID: trip.tripID
                }
            })
            console.log("Navigating to trip with id: " + trip.id)
        },

        onFavClick(trip) {
            this.$navigateTo(TripPreview, {
                props: {
                    tripID: trip.tripID
                }
            })
            console.log("Navigating to trip with id: " + trip.id)
        },

        freeSpaces(trip) { //Calculate the number of free spaces for UX display
            const index = this.trips.indexOf(trip)
            return this.trips[index].tripSpaces - this.trips[index].tripMembers.length
        },

        tripDuration(trip) { //Calculate the duration of the trip from the trip dates for UX display
            const oneDay = 1000 * 60 * 60 * 24
            const index = this.trips.indexOf(trip)
            let dateDifference = Math.abs(this.trips[index].tripDateTo - this.trips[index].tripDateFrom)
            return Math.round(dateDifference / oneDay) + "-Days"
        },

        favTripDuration(trip) { //Calculate the duration of the fav from the trip dates for UX display
            const oneDay = 1000 * 60 * 60 * 24
            const index = this.favs.indexOf(trip)
            let dateDifference = Math.abs(this.favs[index].tripDateTo - this.favs[index].tripDateFrom)
            return Math.round(dateDifference / oneDay) + "-Days"
        },

        averagedCost(trip) { //taking the total cost and averaging it with the number of members + 1 (the potential new member)
            let average = trip.tripMembers.length
            return trip.tripCost/average
        },        
        
        addToFavourite(trip) {
            let index = this.favs.indexOf(trip)
            this.favs[index].isFav = true
            db.collection('user_data').doc(this.userID).update({
                userFavs: db.FieldValue.arrayUnion(trip.tripID)
            })
            confirm({
                message: "Trip added to favourites!",
                okButtonText: "OK"
            })            
            console.log("Favourite added")
        },

        removeFromFavourite(trip) {
            let index = this.favs.indexOf(trip)
            this.favs[index].isFav = false
            db.collection('user_data').doc(this.userID).update({
                userFavs: db.FieldValue.arrayRemove(trip.tripID)
            })
            confirm({
                message: "Trip removed from favourites.",
                okButtonText: "OK"
            })                
            console.log("Favourite removed")
        }  

    },

    created() {
        this.isLoading = true
        this.userID = this.$store.getters.getUser
        console.log("User retreived from Trips " + this.userID)
        this.$store.dispatch('getUserExtraData', this.userID).then(() => { //get users favourites and trips
            this.userExtraData = this.$store.getters.getUserExtraData 

            if(this.userExtraData.userFavs.length > 0){ //get users favourites
                for(let i = 0; i < this.userExtraData.userFavs.length; i++){
                    db.collection('trips').doc(this.userExtraData.userFavs[i]).get().then(doc => {
                        let trip = doc.data()
                        trip.id = doc.id
                        //Check if trip is fav for UX rendering
                        let isFav = this.userExtraData.userFavs.includes(doc.id) 
                        trip.isFav = isFav   
                        //Change dates rendering                 
                        const year = trip.tripDateFrom.getFullYear()
                        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                        const monthFrom = trip.tripDateFrom.getDate() + " " + monthNames[trip.tripDateFrom.getMonth()]
                        const monthTo = trip.tripDateTo.getDate() + " " + monthNames[trip.tripDateTo.getMonth()]
                        trip.tripDates = `${monthFrom} - ${monthTo} ${year}`
                        this.favs.push(trip)   
                        this.isLoading = false                 
                    })
                }                
            } else {
                this.isLoading = false
            }
            db.collection('trips').where('tripMembers', 'array-contains', this.userID).get() //get users trips
                .then((querySnapshot) => {
                    querySnapshot.forEach(doc => {
                        let tripAccepted = this.userExtraData.userTrips.includes(doc.id) //false if the user hasn't accepted a trip invite. They are member in the trip as they were invited, but until they accept the trip is not added to userTrips.
                        console.log("Trip accepted? " + doc.id + " " + tripAccepted)
                        if(doc.exists && tripAccepted){
                            let trip = doc.data()
                            trip.id = doc.id
                            const year = trip.tripDateFrom.getFullYear()
                            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                            const monthFrom = trip.tripDateFrom.getDate() + " " + monthNames[trip.tripDateFrom.getMonth()]
                            const monthTo = trip.tripDateTo.getDate() + " " + monthNames[trip.tripDateTo.getMonth()]
                            trip.tripDates = `${monthFrom} - ${monthTo} ${year}`
                            this.$store.dispatch('getAnyUserData', trip.userID) //Get user data based on their user id so you can get their name and profile image for rendering                    
                            .then(() => {
                                trip.tripCreator = this.$store.getters.getAnyUserData.userFirstName
                                trip.tripCreatorImage = this.$backendService.defaultProfiePicture(this.$store.getters.getAnyUserData.userProfileImages[0])
                                trip.tripCreatorLocation = this.$store.getters.getAnyUserData.userLocation
                                this.trips.push(trip)
                                this.isLoading = false
                            })                         
                        } else {
                            this.isLoading = false
                        }
                    })
                })
                .catch(error => console.log("Trouble in getting trips: " + error)) 

        })               
    }
}
</script>

<style scoped>
    .basic-profile-info {
        margin: 25, 25;
        color: black;
    }
    .section-heading-text {
        font-size: 20; 
        font-weight: 500; 
        color: black;     
    } 
    .trip-image {
      margin-top: 35;
    }  
    .trip-text {
      text-align: left;
      margin-top: 30;
      margin-left: 10;
      margin-right: 10;
    }
    .trip-title {
      font-size: 15;
      margin-top: 5;
      color: black;
    }  
    .trip-items {
      font-size: 11;
      margin-top: 5;
    }
    .trip-price {
      font-size: 15;
      margin-top: 5;     
      font-weight: 500; 
    }
    .trip-profile-image {
      margin-top: 5;
      border-radius: 50%;
    }
    .trip-fav-icon{
      margin: 0, 10, 10, 0;
    }       
    .bottom-navigation {
        background-color: white;
        padding: 5, 25;
    }      
</style>