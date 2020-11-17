<template>
<StackLayout>
    <!-- Itinerary show -->
    <StackLayout margin="10, 0, 0" v-for="(day, index) in tripData.tripItinerary" :key="index + `itinerary`">
        <GridLayout rows="auto" columns="*">
            <Label class="trip-text-heading" :text="`Day ${day.day} (${dayDates(day.day)})`" />
            <Image opacity="0.75" src="~/assets/images/icons/close_icon.png" horizontalAlignment="right" width="15" height="15" stretch="aspectFit" @tap="removeItineraryItem(day)" />
        </GridLayout>     
        <GridLayout columns="auto, *" margin="10, 0, 10" @tap="openDirections(day.destination)" >
            <Image row="0" col="0" class="trip-icon" margin="0" src="~/assets/images/icons/location_icon.png" height="20" horizontalAlignment="left" stretch="aspectFit"/>
            <Label row="0" col="1" class="trip-text" margin="0, 10, 0, 10" :text="day.destination" textWrap="true"/>  
        </GridLayout>      
        <GridLayout columns="auto, *" margin="0, 0, 10">
            <Image row="0" col="0" class="trip-icon" margin="0" src="~/assets/images/icons/list_icon.png" height="20" horizontalAlignment="left" stretch="aspectFit"/>
            <Label row="0" col="1" class="trip-text" margin="0, 10, 0, 10" :text="day.description" textWrap="true"/>  
        </GridLayout> 
        <StackLayout height="1" backgroundColor="#E1E1E1"/>                                                              
    </StackLayout>                         
    <!-- Itinerary input -->
    <StackLayout marginTop="10">
        <GridLayout columns="auto, *" @tap="openItinerarySelector">
            <Image row="0" col="0" class="trip-icon" marginLeft="0" src="~/assets/images/icons/calendar_icon.png" height="15" horizontalAlignment="left" stretch="aspectFit"/>
            <Label ref="itinDay" v-show="!itineraryDay" row="0" col="1" class="trip-text" margin="0, 10, 0, 12" text="Select a day" verticalAlignment="center"/>  
            <Label v-show="itineraryDay" row="0" col="1" class="trip-text" margin="0, 10, 0, 12" :text="`Day ${itineraryDay} (${dayDates(itineraryDay)})`" verticalAlignment="center"/>  
        </GridLayout>                                  
        <GridLayout columns="auto, *">
            <Image row="0" col="0" class="trip-icon" marginLeft="0" src="~/assets/images/icons/location_icon.png" height="20" horizontalAlignment="left" stretch="aspectFit"/>
            <TextField row="0" col="1" class="input-field" margin="0, 10, 0, 10" v-model="itineraryDestination" returnKeyType="done" editable="true" hint="Destination" />  
        </GridLayout>      
        <GridLayout columns="auto, *">
            <Image row="0" col="0" class="trip-icon" marginLeft="0" src="~/assets/images/icons/list_icon.png" height="20" horizontalAlignment="left" stretch="aspectFit"/>
            <TextView row="0" col="1" class="input-field" margin="0, 10, 0, 10" v-model="itineraryDescription" returnKeyType="done" editable="true" hint="Quick description" maxLength="120" @returnPress="addItineraryItem" />  
        </GridLayout>    
        <Label v-show="itineraryFeedback" class="trip-text" margin="5, 0" color="#f55a42" :text="itineraryFeedback" horizontalAlignment="left" />         
        <GridLayout columns="auto, auto, *" marginTop="5" @tap="addItineraryItem">
            <Image row="0" col="0" class="trip-icon" marginLeft="0" src="~/assets/images/icons/plus_icon.png" opacity="0.75" horizontalAlignment="left" height="20" stretch="aspectFit" />
            <Label row="0" col="1" class="trip-text" margin="0, 0, 0, 15" text="Add a day" verticalAlignment="center" horizontalAlignment="left" />            
            <Image row="0" col="2" class="trip-icon" margin="0, 15, 0, 15" src="~/assets/images/icons/input_icon.png" opacity="0.75" horizontalAlignment="right" height="20" stretch="aspectFit" />                
        </GridLayout>                                  
    </StackLayout>    
</StackLayout>
</template>

<script>
import firebase from 'nativescript-plugin-firebase'
const db = firebase.firestore

import ItinerarySelector from './ItinerarySelector'

export default {
    name: 'ItineraryInput',
    props: ['tripLength', 'tripData'],
    data() {
        return {

            itineraryDay: "", //temp storage of new itinerary entry
            itineraryDestination: null, //temp storage of new itinerary entry
            itineraryDescription: null, //temp storage of new itinerary entry

            itineraryFeedback: null,
        }
    },

    computed: {

    },

    methods: {

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
                db.collection('trips').doc(this.tripData.tripID).update({
                    tripItinerary: this.tripData.tripItinerary
                })
                this.itineraryFeedback = null
                console.log("Itinerary entry added " + itinerary)
            } else {
                this.itineraryFeedback = "Fill in all itinerary fields."
                console.log("Fill in all itinerary fields.")
            }
        },

        removeItineraryItem(day) {
            let index = this.tripData.tripItinerary.indexOf(day)
            this.tripData.tripItinerary.splice(index, 1)
            db.collection('trips').doc(this.tripData.tripID).update({
                tripItinerary: this.tripData.tripItinerary
            })            
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

        openDirections(place) {//Use Google Places API to search for the location
            let searchPhrase = encodeURIComponent(place)
            console.log(searchPhrase)
            this.$utils.openUrl('https://www.google.com/maps/search/?api=1&query=' + searchPhrase)
        }        

    }
}
</script>

<style scoped>   
    .input-field{
        font-size: 15;
        margin: 0, 0, 0, 0;
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
    .trip-icon {
        margin: 5, 0, 5, 20;
    }              
</style>