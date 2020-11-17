<template>
    <Page actionBarHidden="true" loaded="onLoaded" navigatedTo="onNavigatedTo">
        <GridLayout rows="auto, *, auto">
            <!-- Custom Actionbar --> 
            <StackLayout v-show="!isLoading" row="0" height="60">
                <GridLayout rows="auto" columns="auto, *, auto" >
                    <!-- <StackLayout col="0" margin="15, 0, 0, 25" height="40" width="40" @tap="$navigateBack" >
                        <Image horizontalAlignment="left" verticalAlignment="center" src="~/assets/images/icons/back_button.png" width="26.67" height="30" stretch="aspectFit" />
                    </StackLayout> -->
                    <StackLayout col="2" margin="15, 25, 0, 0" :isEnabled="!isLoading" height="40" width="40" verticalAlignment="center" @tap="$goTo('editprofile', {userExtraData})" >
                        <Image horizontalAlignment="right" src="~/assets/images/icons/edit_profile.png" width="23.84" height="30" stretch="aspectFit" />  
                    </StackLayout>
                </GridLayout>               
            </StackLayout>
            <!-- Main Content -->          
            <StackLayout row="1">
                <ScrollView>
                    <StackLayout v-show="!isLoading">
                        <!-- Basic information -->
                        <GridLayout rows="auto, auto, auto, auto" columns="*" class="basic-profile-info" marginTop="5" >
                            <Label row="0" col="0" colSpan="2" class="user-name" :text="userData.userFirstName + ', ' + userCalculatedAge" textWrap="true" />
                            <Label row="1" col="0" colSpan="2" class="profile-text" :text="'Adventuring since ' + signUpDate" textWrap="true" />
                            <Image row="2" col="0" class="icon-image" :src="userData.userIsVerified ? '~/assets/images/icons/verified_icon.png' : '~/assets/images/icons/not_verified_icon.png'" height="20" horizontalAlignment="left" stretch="aspectFit"/>
                            <Label row="2" col="0" class="profile-text profile-item" :text="(userData.userIsVerified ? 'Verified' : 'Not Verified')" textWrap="true" />
                            <Image row="3" col="0" class="icon-image" src="~/assets/images/icons/map_icon.png" height="20" horizontalAlignment="left" stretch="aspectFit"/>
                            <Label row="3" col="0" class="profile-text profile-item" :text="`${ tripCount } Trips`" textWrap="true" />
                            <Image row="0" col="0" rowSpan="4" colSpan="3" class="profile-picture" horizontalAlignment="right" verticalAlignment="center" :src="userImages[0]" width="100" height="100" stretch="aspectFill" />
                        </GridLayout>
                        <StackLayout height="1" backgroundColor="#E1E1E1"/>
                        <!-- About Me -->
                        <StackLayout class="basic-profile-info" marginBottom="0" >
                            <Label class="section-headings" text="About Me" textWrap="true" />
                            <TextView class="profile-text text-field" :text="userData.userAboutMe" editable="false" />
                        </StackLayout> 
                        <StackLayout height="1" margin="15, 50" backgroundColor="#E1E1E1"/>
                        <StackLayout class="basic-profile-info" marginTop="0">
                            <StackLayout v-show="userData.userLocation" orientation="horizontal">
                                <Image class="icon-image" margin="0" src="~/assets/images/icons/home.png" height="15" horizontalAlignment="left" stretch="aspectFit"/>                                
                                <Label class="profile-text" marginLeft="15" :text="'Lives in ' + userData.userLocation" textWrap="true" />
                            </StackLayout>
                            <StackLayout v-show="userData.userLanguages[0]"  orientation="horizontal" marginTop="10">
                                <Image class="icon-image" margin="0" src="~/assets/images/icons/language_icon.png" height="20" horizontalAlignment="left" stretch="aspectFit"/>                                
                                <Label class="profile-text" marginLeft="15" :text="'Speaks ' + userData.userLanguages.join(', ')" textWrap="true" />     
                            </StackLayout>
                        </StackLayout>  
                        <!-- Image Carrousel and extra profile info -->  
                        <GridLayout v-if="hasItems != 0" rows="430">
                            <Carousel ref="myCarousel" debug="true" height="100%" width="100%" color="white" indicatorColor="#fff" indicatorOffset="0, -380" showIndicator="true">                        
                                <CarouselItem v-for="(item, i) in userImages" :key="i" verticalAlignment="middle" >
                                    <GridLayout>
                                        <Image class="profile-images" :src="item" stretch="aspectFill" />
                                        <Label v-if="i == 0 && userData.userEducation" row="0" col="0" class="profile-images-text" margin="370, 35, 0" :text="userData.userEducation" textWrap="true" />
                                        <Label v-if="i == 0 && userData.userWorkplace" row="0" col="0" class="profile-images-text" margin="390, 35, 0" :text="'Works at ' + userData.userWorkplace" textWrap="true" />                                
                                    </GridLayout>
                                </CarouselItem>
                            </Carousel>
                        </GridLayout> 
                        <!-- Person Tags --> 
                        <StackLayout class="person-tag-layout" backgroundColor="#2C3746" > 
                            <WrapLayout orientation="horizontal" itemWidth="" itemHeight="">
                                <GridLayout v-show="userData.userTagDriver" rows="auto" columns="auto, auto" class="person-tag">
                                    <Image row="0" col="0" class="trip-tag-picture" src="~/assets/images/tags/tag_driver.png" height="20" stretch="aspectFit" />
                                    <Label row="0" col="1" class="tag-text" text="Driver" />    
                                </GridLayout>  
                                <GridLayout v-show="userData.userTagActive" rows="auto" columns="auto, auto" class="person-tag">
                                    <Image row="0" col="0" class="trip-tag-picture" src="~/assets/images/tags/tag_active.png" height="20" stretch="aspectFit" />
                                    <Label row="0" col="1" class="tag-text" :text="userData.userTagActive" />    
                                </GridLayout>
                                <GridLayout v-show="userData.userTagSmoke" rows="auto" columns="auto, auto" class="person-tag">
                                    <Image row="0" col="0" class="trip-tag-picture" src="~/assets/images/tags/tag_smoke.png" height="20" stretch="aspectFit" />
                                    <Label row="0" col="1" class="tag-text" :text="userData.userTagSmoke" />    
                                </GridLayout>
                                <GridLayout v-show="userData.userTagPets" rows="auto" columns="auto, auto" class="person-tag">
                                    <Image row="0" col="0" class="trip-tag-picture" src="~/assets/images/tags/tag_pets.png" height="20" stretch="aspectFit" />
                                    <Label row="0" col="1" class="tag-text" :text="userData.userTagPets" />    
                                </GridLayout>
                                <GridLayout v-show="userData.userTagDrinking" rows="auto" columns="auto, auto" class="person-tag">
                                    <Image row="0" col="0" class="trip-tag-picture" src="~/assets/images/tags/tag_drinking.png" height="20" stretch="aspectFit" />
                                    <Label row="0" col="1" class="tag-text" :text="userData.userTagDrinking" />    
                                </GridLayout>                                      
                            </WrapLayout>
                        </StackLayout>
                        <!-- Verified Status --> 
                        <StackLayout class="basic-profile-info" >
                            <Label class="section-headings" :text="`${userData.userFirstName} has verified`" textWrap="true" />
                            <WrapLayout orientation="horizontal">
                                <GridLayout v-show="!userData.userIsVerified" columns="auto, auto" marginRight="30">
                                    <Image col="0" class="icon-image" src="~/assets/images/icons/not_verified_icon.png" height="20" horizontalAlignment="left" stretch="aspectFit"/>
                                    <Label col="1" class="profile-text profile-item" marginLeft="10" text="User hasn't verified their profile yet" textWrap="true" />                            
                                </GridLayout>                                
                                <GridLayout v-show="userData.userIsVerified" columns="auto, auto" marginRight="30">
                                    <Image col="0" class="icon-image" src="~/assets/images/icons/tick_icon.png" height="20" horizontalAlignment="left" stretch="aspectFit"/>
                                    <Label col="1" class="profile-text profile-item" marginLeft="10" text="Email address" textWrap="true" />                            
                                </GridLayout>
                            </WrapLayout>                        
                        </StackLayout>
                        <StackLayout height="1" backgroundColor="#E1E1E1"/>
                        <!-- User's Trips -->
                        <Label class="section-headings" margin="15, 25, -20" :text="userData.userFirstName + `'s Trips`" />
                        <GridLayout columns="3*, 2*" rows="auto" v-for="(trip, index) in trips" :key="index + '-trips'" @tap="onItemTap(trip)" >
                            <Image row="0" col="0" class="trip-image" rowSpan="2" :src="trip.tripMedia[0]" width="200" height="356" borderRadius="7" stretch="aspectFill"></Image>
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
                                <Image class="trip-profile-image" style="margin: 0, 0, 5;" horizontalAlignment="left" :src="$backendService.defaultProfiePicture(userImages[0])" width="35" height="35" stretch="aspectFill" />
                                <Label class="trip-items" :text="'Organised by ' + userData.userFirstName" textWrap="true" />  
                                <Label class="trip-items" style="margin: 0, 0, 5;" :text="userData.userLocation" textWrap="true" />  
                                <Label class="trip-price" :text="'£' + trip.tripCost" textWrap="true" />
                            </StackLayout>               
                        </GridLayout>                       
                        <StackLayout height="70" backgroundColor="transparent"/> 
                    </StackLayout>
                </ScrollView>                  
            </StackLayout>    
            <!-- Bottom navigation -->
            <GridLayout row="2" rows="auto, auto" columns="*, *, *" class="bottom-navigation" height="60" >
                <Image row="0" col="0" marginTop="5" src="~/assets/images/icons/main_explore.png" horizontalAlignment="center" height="25" width="50" stretch="aspectFit" @tap="$goTo('feed')" />
                <Label row="1" col="0" horizontalAlignment="center" text="EXPLORE" textWrap="true" fontSize="13" @tap="$goTo('feed')" />
                <Image row="0" col="1" marginTop="5" src="~/assets/images/icons/main_trips.png" horizontalAlignment="center" height="25" stretch="aspectFit" @tap="$goTo('trips')" />
                <Label row="1" col="1" horizontalAlignment="center" text="TRIPS" textWrap="true" fontSize="13" @tap="$goTo('trips')" /> 
                <Image row="0" col="2" marginTop="5" src="~/assets/images/icons/main_chat.png" horizontalAlignment="center" height="25" stretch="aspectFit" @tap="$goTo('chat')" />
                <Label row="0" col="2" v-show="$store.getters.getChatNotification" margin="1, 0, 0, 25" backgroundColor="#e32b1e" borderRadius="50" horizontalAlignment="center" verticalAlignment="top" height="10" width="10" @tap="$goTo('chat')" />
                <Label row="1" col="2" horizontalAlignment="center" text="CHAT" textWrap="true" fontSize="13"  @tap="$goTo('chat')" />                            
            </GridLayout> 
            <StackLayout row="2" height="1" verticalAlignment="top" backgroundColor="#E1E1E1"/>                   
            <ActivityIndicator row="1" :busy="isLoading" horizontalAlignment="center" verticalAlignment="center" /> 
        </GridLayout>
    </Page>  
</template>

<script>
    import firebase from 'nativescript-plugin-firebase'
    const db = firebase.firestore
    const fstore = firebase.storage

    import carousel from 'nativescript-carousel'

    import Feed from './Feed'
    import EditProfile from './EditProfile'
    import Onboard from './Onboard'

    export default {
        name: 'Profile',
        data() {
            return {
                userID: null,

                trips: [],

                userData: {
                    userLanguages: []
                },
                userExtraData: {
                    userTrips: []
                },
                userImages: [], // TODO you can extrat user images directly from userData

                isLoading: false,

                routes: {
                    feed: Feed,
                    edit: EditProfile,
                    onboard: Onboard
                }
            }
        },

        computed: {
            hasItems () {
                //image carousel
                return this.userImages.length > 0
            },

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

            userCalculatedAge: function() {
                let userDob = Math.floor((new Date() - new Date(this.userData.userAge).getTime()) / 3.15576e+10)
                return userDob
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
            onItemTap(trip) {
                console.log(trip.tripID)
                this.$goTo('trippreview', {tripID: trip.tripID}, {})
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
            }
        },

        created() {
            this.isLoading = true
            //Get current user and querry Firebase for their trips
            this.userID = this.$store.getters.getUser
            console.log("User loaded in Profile " + this.userID)
            db.collection('trips').where('userID', '==', this.userID)
                .get()
                .then((querySnapshot) => {
                    this.isLoading = false
                    querySnapshot.forEach(doc => {
                        let trip = doc.data()
                        trip.id = doc.id
                        this.trips.push(trip)
                        this.isLoading = false
                    })
                })
                .catch(error => {
                    console.log("Trouble in getting trips: " + error)
                    this.isLoading = false
                })
            //Get User's data from Firebase
            db.collection('users').doc(this.userID).get()
                .then((doc) => {
                    if(doc.exists) {
                        let userInfo = doc.data()
                        this.userData = userInfo
                        this.userImages = userInfo.userProfileImages
                        // this.userAboutMe = userInfo.userAboutMe.replace(/_n/g, "\n") //extracting the About Me so we can isert /n paragraphs. Probably not needed as Firebase saves the new line automatically
                        console.log("User info: " + userInfo)
                    } else {console.log("Document doesn't exist")}
                })
            //Get User's extra data from Firebase
            this.$store.dispatch('getAnyUserExtraData',this.userID).then(() => { //get user's extra data: favs, trips, friends
                this.userExtraData = this.$store.getters.getAnyUserExtraData 
                console.log("User extra data loaded: " + JSON.stringify(this.userExtraData))
            })
        }      

    }
</script>

<style scoped>
    .profile-picture {
        border-radius: 50%;
    }
    .user-name {
        margin: 0, 0, 0;
        font-size: 30;
        color: black;             
    }
    .section-headings {
        margin: 0, 0, 5;
        font-size: 20;
        color: black;        
    }
    .edit-profile {
        margin-right: 25;
        margin-top: 20;
    }
    .basic-profile-info {
        margin: 15, 25;
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
    .icon-image {
        margin-top: 15;
    }    
    .text-field {
        background-color: transparent;
        border-color: transparent;
    }
    .profile-images-text {
        color: #ffffff;
        font-size: 15;
    }
    .person-tag-layout {
        padding: 5, 25, 15;
    }
    .person-tag {
        color: #ffffff;
        margin: 10, 10, 0, 0;
        border-color: #ffffff;
        border-width: 1;
        border-radius: 12;
        padding: 3, 10;
    }
    .tag-text {
        margin: 0, 0, 0, 5;
    }
    .trip-tag-picture {
        margin: 1, 1, 1;
    }
    /* User Trips */
    .trip-image {
        margin-top: 35em;
        margin-left: 20em;
    }  
    .trip-text {
        text-align: left;
        margin-top: 30em;
        margin-left: 10em;
        margin-right: 10em;
    }  
    .trip-items {
        font-size: 13em;
        margin-top: 5em;
    }
    .trip-profile-image {
        margin-top: 5em;
        border-radius: 50%;
    }
    .deleteButton {
        margin-right: 20em;
        margin-bottom: 5em;
    } 
    .bottom-navigation {
        background-color: white;
        padding: 5, 25;
    }      
</style>