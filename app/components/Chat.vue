<template>
    <Page actionBarHidden="true" loaded="onLoaded" navigatedTo="onNavigatedTo">
        <GridLayout rows="auto, *, auto">
            <!-- Custom Actionbar --> 
            <StackLayout row="0" height="60">
                <GridLayout rows="auto" columns="auto, *, auto" >
                    <StackLayout col="0" :isEnabled="!isLoading" margin="15, 0, 0, 25" height="40" width="40" @tap="navigateBackAndStopChatListener()" >
                        <Image horizontalAlignment="left" verticalAlignment="center" src="~/assets/images/icons/back_button.png" width="26.67" height="30" stretch="aspectFit" />
                    </StackLayout>            
                    <StackLayout col="2" :isEnabled="!isLoading" margin="15, 25, 0, 0" verticalAlignment="top" height="40" width="40" @tap="$goTo('profile')" >
                        <Image horizontalAlignment="right" opacity="1" src="~/assets/images/icons/profile_icon.png" width="30" height="30" stretch="aspectFit" />
                    </StackLayout>  
                </GridLayout>               
            </StackLayout>  
            <!-- Main Content -->          
            <ScrollView v-show="!isLoading" row="1">
                <StackLayout>
                    <!-- Trip Chats -->   
                    <StackLayout class="basic-profile-info" marginTop="0">
                        <Label class="section-heading-text" text="Trip Chats" textWrap="true" /> 
                        <Label v-show="tripChats.length == 0" class="trip-text" margin="10, 0" color="#2E2E2E" text="Chats will show here when you create or join a trip." textWrap="true" />   
                        <GridLayout rows="auto" columns="auto, *" class="chat-item" v-for="(chat, index) in tripChatsSorted" :key="index + `trip`" @tap="goToChat(chat)" >
                            <GridLayout row="0" col="0" rowSpan="2" width="58" height="83" >
                                <Image :src="chat.tripMedia[0]" width="55" height="80" borderRadius="5" stretch="aspectFill" />
                                <Label v-show="!msgReadByUser(chat)" margin="0" backgroundColor="#e32b1e" borderRadius="50" horizontalAlignment="right" verticalAlignment="top" height="11" width="11"/>
                            </GridLayout>
                            <GridLayout row="0" col="1" rows="auto, auto" columns="*, auto">
                                <Label row="0" col="0" class="chat-title" :text="chat.tripLocation.toUpperCase()" textWrap="true" />
                                <Label row="0" col="1" class="chat-title" fontSize="11" horizontalAlignment="right" :text="lastMsgTime(index, 'tripChats')" textWrap="true" />
                                <Label row="1" col="0" colSpan="2" class="chat-msg" :text="chat.chatLastMsg ? chat.chatLastMsg : '' " textWrap="true" />                                
                            </GridLayout>
                        </GridLayout>
                    </StackLayout>  
                    <StackLayout height="1" backgroundColor="#E1E1E1"/>                
                    <!-- Direct Chats -->
                    <StackLayout class="basic-profile-info">
                        <Label class="section-heading-text" text="New Trip Requests" textWrap="true" /> 
                        <Label v-show="directChats.length == 0" class="trip-text" margin="10, 0" color="#2E2E2E" text="Your and other people's join requests will show here." textWrap="true" />   
                        <GridLayout rows="auto" columns="auto, *" class="chat-item" v-for="(chat, index) in directChatsSorted" :key="index + `direct`" @tap="goToPrivateChat(chat)" >
                            <GridLayout row="0" col="0" rowSpan="3" >
                                <Image :src="$backendService.defaultProfiePicture(chat.userProfileImages[0])" width="55" height="55" borderRadius="50" stretch="aspectFill" />
                                <Label v-show="!msgReadByUser(chat)" margin="0" backgroundColor="#e32b1e" borderRadius="50" horizontalAlignment="right" verticalAlignment="top" height="11" width="11"/>
                            </GridLayout>                            
                            <GridLayout row="0" col="1" rows="auto, auto, auto" columns="*, auto">
                                <Label row="0" col="0" class="chat-title" :text="chat.userFirstName" textWrap="true" />
                                <Label row="0" col="1" class="chat-title" fontSize="11" horizontalAlignment="right" :text="lastMsgTime(index, 'directChats')" textWrap="true" />                            
                                <Label row="1" col="0" colSpan="2" class="chat-msg" :text="chat.chatLastMsg" textWrap="true" />    
                                <GridLayout row="2" col="0" columns="auto">
                                    <Label v-show="chat.tripRequestStatus" class="status-btn" :class="chat.tripRequestStatus" :text="inviteStatus(chat.tripRequestStatus)" textWrap="true" />
                                </GridLayout>                                                         
                            </GridLayout>                            
                        </GridLayout>                        
                    </StackLayout>                       
                </StackLayout>                                         
            </ScrollView>
            <!-- Bottom navigation -->
                <GridLayout row="2" rows="auto, auto" columns="*, *, *" class="bottom-navigation" height="60" >
                <Image row="0" col="0" marginTop="5" src="~/assets/images/icons/main_explore.png" horizontalAlignment="center" height="25" width="50" stretch="aspectFit" @tap="$goTo('feed')" />
                <Label row="1" col="0" horizontalAlignment="center" text="EXPLORE" textWrap="true" fontSize="13" @tap="$goTo('feed')" />
                <Image row="0" col="1" marginTop="5" src="~/assets/images/icons/main_trips.png" horizontalAlignment="center" height="25" stretch="aspectFit" @tap="$goTo('trips')" />
                <Label row="1" col="1" horizontalAlignment="center" text="TRIPS" textWrap="true" fontSize="13" @tap="$goTo('trips')" /> 
                <Image row="0" col="2" marginTop="5" src="~/assets/images/icons/main_chat_active.png" horizontalAlignment="center" height="25" stretch="aspectFit" />
                <Label row="1" col="2" horizontalAlignment="center" text="CHAT" textWrap="true" fontSize="13" />                            
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
import Trips from './Trips'
import ChatCurrent from './ChatCurrent'

export default {
    name: 'Chat',
    data() {
        return {

            tripChats: [],
            directChats: [],

            userExtraData: {
                userTrips: [],
                userChats: []
            },

            chatListener: null,

            isLoading: false
        }
    },

    computed: {
        tripChatsSorted: function() { //Sort chats with the latest message on top
            let array = this.tripChats.sort((a, b) => b.chatLastMsgTime - a.chatLastMsgTime)
            return array
        },

        directChatsSorted: function() { //Sort chats with the latest message on top
            let array = this.directChats.sort((a, b) => b.chatLastMsgTime - a.chatLastMsgTime)
            return array
        }        
    },

    methods: {
        
        goToChat(chat) {
            this.$goTo('chatcurrent', {tripAndChatData: chat})
            console.log("Navigating to chay with id: " + chat.chatID)            
        },

        goToPrivateChat(chat) {
            console.log(JSON.stringify(chat.chatMembers))
            this.$goTo('chatprivate', {userAndChatData: chat})
            console.log("Navigating to chay with id: " + chat.chatID)            
        },       
        
        navigateBackAndStopChatListener() {
            this.chatListener()
            console.log("Unsubsribed fron chat listener")
            this.$navigateBack()
        },        

        lastMsgTime(index, type) {
            let chatArray = []
            if(type == "tripChats"){
                chatArray = this.tripChatsSorted[index].chatLastMsgTime             
            } else if(type = "directChats") {
                chatArray = this.directChatsSorted[index].chatLastMsgTime  
            }    

            const time = new Date(chatArray)    
            const timeNow = Date.now()  
            const hoursAndMinutes = time.getHours() + ":" + ('0' + time.getMinutes()).slice(-2)
            const date = `${time.getDate()}/${time.getMonth()}/${time.getFullYear()}`
            if(timeNow > time.setDate(time.getDate() + 1)){
                return date
            } else {
                return hoursAndMinutes 
            }               
        },

        msgReadByUser(chat) {
            let chatMsgReadIsArray = Array.isArray(chat.chatLastMsgRead)
            if (chatMsgReadIsArray){
                console.log(JSON.stringify(chat.chatLastMsgRead))
                let read = chat.chatLastMsgRead.includes(this.userID)
                console.log(`Has user read chat ${chat.chatID}?: ${read}`)
                if(read){
                    return true
                } else {
                    return false
                }
            } else {
                console.log("Message Read is not set up as an array")
            }


        }, 

        inviteStatus(status) {
            switch(status) {
                case "pending":
                    return "Invite pending";
                    break;                    
                case "accepted":
                    return "Invite accepted";
                    break;
                case "declined":
                    return "Invite declined";
                    break;
            }
        }

    },

    created() {
        this.isLoading = true
        this.$store.commit('setChatNotification', false) 
        this.userID = this.$store.getters.getUser //get current user
        console.log("User retreived from Chat " + this.userID)     
        this.$store.dispatch('getUserExtraData', this.userID).then(() => { //get user's data - trips, chats, friends, favs
            this.userExtraData = this.$store.getters.getUserExtraData
            if(this.userExtraData.userChats.length > 0){
                //Listen for live updates to each chat individually and update data accordingly.
                this.chatListener = db.collection('chats').where('chatMembers', 'array-contains' , this.userID).onSnapshot(snapshot => { 
                    snapshot.docChanges().forEach(change => {
                    let thisChat = this.userExtraData.userChats.filter(userChat => userChat.chatID == change.doc.id)
                    console.log(`thisChat: ${JSON.stringify(thisChat)}`)
                    let chat = null
                    chat = change.doc.data()
                    chat.chatLastMsg = change.doc.data().chatMessages.slice(-1)[0].chatMsg
                    chat.chatLastMsgTime = change.doc.data().chatMessages.slice(-1)[0].chatMsgTime   
                    chat.chatLastMsgRead =  change.doc.data().chatMessages.slice(-1)[0].chatMsgRead  
                    chat.tripRequestID = change.doc.data().chatMessages.slice(-1)[0].tripRequestID
                    chat.tripRequestStatus = change.doc.data().chatMessages.slice(-1)[0].tripRequestStatus                               
                    if (change.type === "added") {
                        console.log("New chat: ", change.doc.id)
                        this.$store.dispatch('getUserExtraData', this.userID).then(() => { //Get the user data again as it would've changed when a new chat/trip is added to it. That way we can check if the chat is prviate or not.
                            this.userExtraData = this.$store.getters.getUserExtraData
                            thisChat = this.userExtraData.userChats.filter(userChat => userChat.chatID == change.doc.id)
                            console.log(`thisChat added: ${JSON.stringify(thisChat)}`)
                            if(!thisChat[0].chatIsPrivate){
                                db.collection('trips').doc(thisChat[0].chatID).get().then(doc=> {
                                    let trip = doc.data()
                                    trip.chatID = thisChat[0].chatID
                                    trip.chatMembers = chat.chatMembers                       
                                    trip.chatLastMsg = chat.chatLastMsg
                                    trip.chatLastMsgTime = chat.chatLastMsgTime
                                    trip.chatLastMsgRead =  chat.chatLastMsgRead
                                    this.tripChats.push(trip)
                                    console.log("New trip chat loaded " + trip)
                                    this.isLoading = false
                                })                   
                                console.log(thisChat[0].chatID + " is a trip chat")
                            } else {
                                let directUser = chat.chatMembers.filter(user => user != this.userID) //Get the userID for the private chat to use in FB
                                console.log("Private chat for " + directUser)
                                db.collection('users').doc(directUser[0]).get().then(doc=> {
                                    let directChat = doc.data()
                                    directChat.chatID = thisChat[0].chatID   
                                    directChat.chatMembers = chat.chatMembers                    
                                    directChat.chatLastMsg = chat.chatLastMsg
                                    directChat.chatLastMsgTime = chat.chatLastMsgTime
                                    directChat.chatLastMsgRead =  chat.chatLastMsgRead
                                    directChat.tripRequestID = chat.tripRequestID
                                    directChat.tripRequestStatus = chat.tripRequestStatus
                                    this.directChats.push(directChat)
                                    console.log("New user chat loaded " + directChat)
                                    this.isLoading = false
                                }) 
                                console.log(thisChat[0].chatID + " is a private chat")
                            }                                 
                        })          
                    }
                    if (change.type === "modified") {
                        console.log("Modified chat: ", change.doc.id)
                        thisChat = this.userExtraData.userChats.filter(userChat => userChat.chatID == change.doc.id)
                        console.log(`thisChat modified: ${JSON.stringify(thisChat)}`)
                        if(!thisChat[0].chatIsPrivate){
                            let updateChatIndex = this.tripChats.findIndex(element => element.chatID == change.doc.id)                              
                            db.collection('trips').doc(thisChat[0].chatID).get().then(doc=> {
                                let trip = doc.data()
                                this.tripChats[updateChatIndex].chatID = thisChat[0].chatID
                                this.tripChats[updateChatIndex].chatMembers = chat.chatMembers                       
                                this.tripChats[updateChatIndex].chatLastMsg = chat.chatLastMsg
                                console.log(`thisChat modified chatLastMsg: ${chat.chatLastMsg}`)
                                this.tripChats[updateChatIndex].chatLastMsgTime = chat.chatLastMsgTime
                                this.tripChats[updateChatIndex].chatLastMsgRead = chat.chatLastMsgRead
                                console.log("Trip chat updated " + trip.tripID)
                                this.isLoading = false
                            })                   
                            console.log(thisChat[0].chatID + " is a trip chat")
                        } else {
                            let directUser = chat.chatMembers.filter(user => user != this.userID) //Get the userID for the private chat to use in FB
                            console.log("Private chat for " + directUser)
                            let updateChatIndex = this.directChats.findIndex(element => element.chatID == change.doc.id)                              
                            db.collection('users').doc(directUser[0]).get().then(doc=> {
                                this.directChats[updateChatIndex].chatID = thisChat[0].chatID   
                                this.directChats[updateChatIndex].chatMembers = chat.chatMembers                    
                                this.directChats[updateChatIndex].chatLastMsg = chat.chatLastMsg
                                this.directChats[updateChatIndex].chatLastMsgTime = chat.chatLastMsgTime
                                this.directChats[updateChatIndex].chatLastMsgRead = chat.chatLastMsgRead
                                this.directChats[updateChatIndex].tripRequestID = chat.tripRequestID
                                this.directChats[updateChatIndex].tripRequestStatus = chat.tripRequestStatus                       
                                console.log("User chat updated " + directChat)
                                this.isLoading = false
                            }) 
                            console.log(thisChat[0].chatID + " is a private chat")
                        }                                   
                    }
                    if (change.type === "removed") {
                        console.log("Removed chat: ", change.doc.id)
                    }                         
                    })
                })
            } else {
                this.isLoading = false
            }
        })
    },

    mounted() {
        //ANDROID ONLY: if the physical back button is pressed listen for the event and navigate back properly
        if (this.$application.android) {
            this.$application.android.on(this.$application.AndroidApplication.activityBackPressedEvent, (args) => {
                console.log("Event: " + args.eventName + ", Activity: " + args.activity);
                this.chatListener()
                console.log("Unsubsribed fron chat listener")
                // Set args.cancel = true to cancel back navigation and do something custom.
            });
        }          
    }    
}
</script>

<style scoped>
    .status-btn {
        margin: 5, 0, 0, 10;
        padding: 5, 8;
        background-color: white;
        color: black;
        border-radius: 10;
        font-size: 15;
    }
    .pending {
        background-color: #FFC156;
        color: black;
    }    
    .accepted {
        background-color: #48AC66;
        color: white;
    }
    .declined {
        background-color: #FF5656;
        color: black;
    }
    .basic-profile-info {
        margin: 25, 25;
        color: black;
    }
    .section-heading-text {
        font-size: 20; 
        font-weight: 500; 
        color: black;     
    } 
    .chat-item {
      margin-top: 15;
      margin-left: 0;
    }      
    .chat-title {
        font-size: 15;
        margin-left: 10;
    }
    .chat-msg {
        font-size: 11;
        margin-left: 10;
    }    
    .trip-text {
      text-align: left;
      margin-top: 30;
      margin-left: 10;
      margin-right: 10;
    }    
    .bottom-navigation {
        background-color: white;
        padding: 5, 25;
    } 
</style>