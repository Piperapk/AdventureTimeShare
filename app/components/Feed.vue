<template>
    <Page actionBarHidden="true">
        <GridLayout rows="auto, *, auto">
          <!-- Custom Actionbar -->
          <StackLayout row="0" height="60">
            <GridLayout rows="auto" columns="auto, *, auto" >
                <StackLayout col="0" :isEnabled="!isLoading" margin="15, 0, 0, 25" verticalAlignment="top" height="40" width="40" @tap="$goTo('newtrip')" >
                    <Image horizontalAlignment="left" opacity="0.75" src="~/assets/images/icons/add.png" width="30" height="30" stretch="aspectFit" />
                </StackLayout>
                <StackLayout col="1" :isEnabled="!isLoading" margin="5, 0, 0, 5" verticalAlignment="center" @tap="$goTo('newtrip')" >
                    <Label fontSize="13" color="black" text="Adventureme" textWrap="true" horizontalAlignment="center" /> 
                </StackLayout>                
                <StackLayout col="2" :isEnabled="!isLoading" margin="15, 25, 0, 0" verticalAlignment="top" height="40" width="40" @tap="$goTo('profile')" >
                    <Image horizontalAlignment="right" opacity="1" src="~/assets/images/icons/profile_icon.png" width="30" height="30" stretch="aspectFit" />
                </StackLayout>                
            </GridLayout>               
          </StackLayout>
          <!-- Feed -->
          <StackLayout row="1" v-show="!isLoading">
            <RadListView ref="listView" for="trip in tripsArraySort" loadOnDemandBufferSize="6" itemLoading="getTripCreator" @itemTap="onItemTap">
              <!-- Header -->
              <v-template name="header">
                <GridLayout>
                  <Image src="~/assets/images/onboard2.png" height="250" stretch="aspectFill" verticalAlignment="top" />
                  <GridLayout rows="auto, auto, auto, *" margin="30, 30, 0">
                      <Image row="0" src="~/assets/images/icons/main_trips_white.png" height="35" stretch="aspectFit" horizontalAlignment="left" />
                      <Label row="1" class="trip-title" fontWeight="500" fontSize="30" color="white" text="Adventureme" textWrap="true" />
                      <Label row="2" class="trip-title" fontWeight="500" color="white" text="Unique adventures built by likeminded people" textWrap="true" />
                      <GridLayout row="3" columns="auto, auto" orientation="horizontal" class="action-button-inverse" margin="40, 0, 0" horizontalAlignment="left" width="95" height="30" @tap="$goTo('onboard', { userLogged: userID }, { clearHistory: true })" >             
                          <Label col="0" fontSize="11" text="Learn more" marginLeft="10" horizontalAlignment="left" verticalAlignment="center" /> 
                          <Image col="1" src="~/assets/images/icons/input_icon.png" height="15" style="margin-left: 10;" opacity="0.75" horizontalAlignment="left" verticalAlignment="center" stretch="aspectFit" />
                      </GridLayout>                             
                  </GridLayout>                                               
                </GridLayout>
              </v-template>
              <!-- List -->
              <v-template>
                <GridLayout columns="3*, 2*" rows="auto">
                  <GridLayout row="0" col="0" rows="auto" columns="auto">
                    <Image class="trip-image" :src="trip.tripMedia[0]" width="200" height="356" borderRadius="7" stretch="aspectFill" />
                    <Image v-show="!trip.isFav" class="trip-fav-icon" src="~/assets/images/icons/fav_icon.png" height="25" horizontalAlignment="right" verticalAlignment="bottom" stretch="aspectFit" @tap="addToFavourite(trip)" />
                    <Image v-show="trip.isFav" class="trip-fav-icon" src="~/assets/images/icons/fav_active_icon.png" height="25" horizontalAlignment="right" verticalAlignment="bottom" stretch="aspectFit" @tap="removeFromFavourite(trip)" />
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
                      <Label class="trip-price" :text="$currency.display(averagedCost(trip), trip.tripCurrency)" textWrap="true" />
                  </StackLayout>              
                </GridLayout>
              </v-template>
            </RadListView>                  
          </StackLayout>
          <!-- Bottom navigation -->
          <GridLayout row="2" rows="auto, auto" columns="*, *, *" class="bottom-navigation" height="60" >
              <Image row="0" col="0" marginTop="5" src="~/assets/images/icons/main_explore_active.png" horizontalAlignment="center" height="25" width="50" stretch="aspectFit" />
              <Label row="1" col="0" horizontalAlignment="center" text="EXPLORE" textWrap="true" fontSize="13" />
              <Image row="0" col="1" marginTop="5" src="~/assets/images/icons/main_trips.png" horizontalAlignment="center" height="25" stretch="aspectFit" @tap="$goTo('trips')" />
              <Label row="1" col="1" horizontalAlignment="center" text="TRIPS" textWrap="true" fontSize="13" @tap="$goTo('trips')" /> 
              <Image row="0" col="2" marginTop="5" src="~/assets/images/icons/main_chat.png" horizontalAlignment="center" height="25" stretch="aspectFit" @tap="$goTo('chat')" />
              <Label row="0" col="2" v-show="$store.getters.getChatNotification" margin="1, 0, 0, 25" backgroundColor="#e32b1e" borderRadius="50" horizontalAlignment="center" verticalAlignment="top" height="10" width="10" @tap="$goTo('chat')" />
              <Label row="1" col="2" horizontalAlignment="center" text="CHAT" textWrap="true" fontSize="13"  @tap="$goTo('chat')" />                            
          </GridLayout> 
          <StackLayout row="2" height="1" verticalAlignment="top" backgroundColor="#E1E1E1"/>  
          <ActivityIndicator row="1" col="0" :busy="isLoading" horizontalAlignment="center" verticalAlignment="center" /> 
        </GridLayout>             
    </Page>
</template>

<script >
  import firebase from 'nativescript-plugin-firebase'
  const db = firebase.firestore
  const fstore = firebase.storage

  import NewTrip from './NewTrip'
  import LogIn from './LogIn'
  import Profile from './Profile'
  import TripPreview from './TripPreview'
  import Trips from './Trips'
  import Chat from './Chat'

  export default {
    name: 'Feed',
    data() {
      return {
        userID: null,

        trips: [],
        isLoading: false,
        
        routes: {
            newtrip: NewTrip,
            profile: Profile,
            trippreview: TripPreview,
            trips: Trips,
            chat: Chat
        }        
      }
    },

    computed: {
      tripsArraySort: function() {
        let tripArray = this.trips
        return tripArray.filter(trip => trip.tripSpaces - trip.tripMembers.length != 0)
      }
    },

    methods: {
      goToPage(page) {
          this.$navigateTo(this.routes[page])
      },      

      onItemTap(event) {
        console.log(event.index)
        console.log(event.item.tripID)
        this.$navigateTo(TripPreview, {
          props: {
            tripID: event.item.tripID
          }
        })
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

      averagedCost(trip) { //taking the total cost and averaging it with the number of members + 1 (the potential new member)
        let average = trip.tripMembers.length + 1
        return trip.tripCost/average
      },

      addToFavourite(trip) {
          let index = this.trips.indexOf(trip)
          this.trips[index].isFav = true
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
          let index = this.trips.indexOf(trip)
          this.trips[index].isFav = false
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
      this.$store.dispatch('getCurrentUser').then(() => {
        this.userID = this.$store.getters.getUser        
        console.log("User uid from feed: " + this.userID)
        db.collection('trips').get().then(querySnapshot => {
          this.$store.dispatch('getUserExtraData', this.userID).then(() => { //get users favourites
            this.userExtraData = this.$store.getters.getUserExtraData   
            querySnapshot.forEach(doc => {
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
              this.$store.dispatch('getAnyUserData', trip.userID) //Get user data based on their user id so you can get their name and profile image for rendering
              .then(() => {
                trip.tripCreator = this.$store.getters.getAnyUserData.userFirstName
                trip.tripCreatorImage = this.$backendService.defaultProfiePicture(this.$store.getters.getAnyUserData.userProfileImages[0])
                trip.tripCreatorLocation = this.$store.getters.getAnyUserData.userLocation
                this.trips.push(trip)
                this.isLoading = false
              })            
            })            
          })        
        })
      })
    },

  }
</script>

<style scoped>
    .trip-fav-icon{
      margin: 0, 10, 10, 0;
    }    
    .trip-image {
      margin-top: 35;
      margin-left: 20;
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
    .bottom-navigation {
        background-color: white;
        padding: 5, 25;
    }      
    .action-button-inverse {
        background-color: white;
        color: #2E2E2E;
        border-width: 0;
        border-radius: 7;
        font-size: 11;
        font-weight: 400;
        margin: 30, 30;
    }          
</style>
