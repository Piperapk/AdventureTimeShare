<template>
    <Page actionBarHidden="true" loaded="onLoaded" navigatedTo="onNavigatedTo">
        <GridLayout rows="auto, *, 70">
            <!-- Custom Actionbar --> 
            <StackLayout row="0" height="60">
                <GridLayout rows="auto" columns="auto, *, auto" >
                    <StackLayout col="0" margin="15, 0, 0, 25" height="40" width="40" verticalAlignment="top" @tap="navigateBackAndStopChatListener()" >
                        <Image horizontalAlignment="left" src="~/assets/images/icons/back_button.png" width="26.67" height="30" stretch="aspectFit" />
                    </StackLayout> 
                    <Label col="1" class="action-title" margin="20, 0 , 0, 10" :text="userAndChatData.userFirstName" textWrap="true" horizontalAlignment="left" verticalAlignment="top" />            
                </GridLayout>               
            </StackLayout>       
            <StackLayout row="0" height="1" verticalAlignment="bottom" backgroundColor="#E1E1E1"/>                  
            <!-- Chat messages -->
            <StackLayout row="1">
                <ListView v-show="!isLoading" ref="messages" for="(message, index) in chatData.chatMessages" separatorColor="transparent" >
                    <v-template>                        
                        <StackLayout class="chat-container">
                            <Label v-if="index == 0" class="section-heading-text" margin="15, 0" :text="`Chat with ${userAndChatData.userFirstName}`" textWrap="true" /> 
                            <StackLayout>   
                                <!-- User's messages -->
                                <GridLayout v-show="message.userID != userID" width="100%" columns="40, *" rows="auto, auto, auto, 10" >
                                    <Image row="0" col="0" rowSpan="1" :src="profilePictures(message.userID)" width="35" height="35" borderRadius="50" stretch="aspectFill" verticalAlignment="bottom" @longPress="deleteMessage(message)"/>
                                    <GridLayout row="0" col="1" >
                                        <StackLayout horizontalAlignment="left" class="chat-box" >
                                            <StackLayout orientation="horizontal" >
                                                <Label class="chat-msg" style="font-weight: 500;" :text="msgNames(message.userID)" textWrap="true" />   
                                                <Label class="chat-time" :text="msgTime(index)" textWrap="true" />                                            
                                            </StackLayout>
                                            <Label class="chat-msg" :text="message.chatMsg" textWrap="true" verticalAlignment="top" />                                                                                        
                                        </StackLayout>
                                    </GridLayout>     
                                    <GridLayout v-show="message.tripRequestID" row="1" col="1" marginTop="10" @tap="$goTo('trippreview', {tripID: message.tripRequestID})">
                                        <StackLayout horizontalAlignment="left" class="chat-box" >   
                                            <Label class="chat-msg" fontWeight="500" :text="`Trip invite for ${message.tripTitle}`" textWrap="true" verticalAlignment="top" />
                                            <GridLayout columns="auto" marginLeft="-10">
                                                <Label v-show="message.tripRequestStatus" class="status-btn" :class="message.tripRequestStatus" :text="inviteStatus(message.tripRequestStatus)" textWrap="true" />
                                            </GridLayout>                                                                                                                                 
                                        </StackLayout>                                        
                                    </GridLayout> 
                                    <StackLayout row="2" col="1" v-show="message.tripRequestStatus == 'pending'" orientation="horizontal">
                                        <StackLayout orientation="horizontal" class="status-btn accepted" padding="10" @tap="acceptInvite(message)">
                                            <Label text="Accept" textWrap="true" />
                                            <Image src="~/assets/images/icons/input_icon_white.png" height="20" style="margin-left: 10;" opacity="0.75" horizontalAlignment="left" verticalAlignment="center" stretch="aspectFit" />                                            
                                        </StackLayout>       
                                        <StackLayout orientation="horizontal" class="status-btn declined" padding="10" @tap="declineInvite(message)">
                                            <Label text="Decline" textWrap="true" />
                                            <Image src="~/assets/images/icons/close_icon.png" height="15" style="margin-left: 10;" opacity="0.75" horizontalAlignment="left" verticalAlignment="center" stretch="aspectFit" />                                            
                                        </StackLayout>                                                                                                  
                                    </StackLayout> 
                                </GridLayout> 
                                <!-- Other user's messages -->
                                <GridLayout v-show="message.userID == userID" width="100%" columns="*, 40" rows="auto, 10" @longPress="deleteMessage(message)">
                                    <Image col="1" :src="profilePictures(message.userID)" width="35" height="35" borderRadius="50" stretch="aspectFill" verticalAlignment="bottom" />
                                    <GridLayout col="0" >
                                        <StackLayout horizontalAlignment="right" class="chat-box" style="background-color: #DDEAEE;" >
                                            <StackLayout orientation="horizontal" >
                                                <Label class="chat-msg" fontWeight="500" :text="msgNames(message.userID)" textWrap="true" />   
                                                <Label class="chat-time" :text="msgTime(index)" textWrap="true" />                                            
                                            </StackLayout>
                                            <Label class="chat-msg" :text="message.chatMsg" textWrap="true" verticalAlignment="top" />
                                            <Label v-show="message.tripRequestID" class="chat-msg" fontWeight="500" :text="`Trip invite for ${message.tripTitle}`" textWrap="true" verticalAlignment="top" @tap="$goTo('trippreview', {tripID: message.tripRequestID})"/>
                                            <GridLayout v-show="message.tripRequestStatus" columns="auto" marginLeft="-10">
                                                <Label class="status-btn" :class="message.tripRequestStatus" :text="inviteStatus(message.tripRequestStatus)" textWrap="true" />
                                            </GridLayout>                                            
                                        </StackLayout>
                                    </GridLayout> 
                                </GridLayout>                                                                                                                                                                 
                            </StackLayout>                        
                        </StackLayout>    
                    </v-template>                          
                </ListView>              
            </StackLayout>
            <!-- Bottom msg box -->
            <StackLayout v-show="!isLoading" row="2" class="bottom-navigation" height="70" verticalAlignment="bottom" >
                <GridLayout rows="70" columns="*, auto">
                    <Image row="0" col="1" horizontalAlignment="right" verticalAlignment="center" margin="0, 0, 0, 25" src="~/assets/images/icons/input_icon_white.png" @tap="sendMessage" width="26.67" height="30" stretch="aspectFit" />
                    <TextView ref="messagebox" col="0" class="message-box-text" style="placeholder-color: black;" hint="Type a message..." v-model="messageText" returnKeyType="next" />
                </GridLayout>
            </StackLayout>  
            <ActivityIndicator row="0" col="0" rowSpan="3" :busy="isLoading" horizontalAlignment="center" verticalAlignment="center" />                        
        </GridLayout>
    </Page>  
</template>

<script>
import firebase, { firestore } from 'nativescript-plugin-firebase'
const db = firebase.firestore

import Feed from './Feed'
import Trips from './Trips'
import Chat from './Chat'
import TripCurrent from './TripCurrent'

export default {
    name: 'ChatPrivate',
    props: ['userAndChatData'],
    data() {
        return {
            userID: null,
            userExtraData: {},

            chatData: { //chat messages
                chatMessages: []
            }, 

            membersProfileData: [], //members profile pics, info, names

            messageText: null,
            scrollHeight: null,

            isLoading: false,
            
            routes: {
                feed: Feed,
                trips: Trips,
                chat: Chat
            },

            chatListener: null
        }
    },

    watch: {
        chatData: function() {
            this.scrollToBottom()
        }
    },

    methods: {
        goToPage(page) {
            this.$navigateTo(this.routes[page])
        },

        navigateBackAndStopChatListener() {
            this.chatListener()
            console.log("Unsubsribed fron chat listener")
            this.$navigateBack()
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
        },    

        sendMessage() {    
            if(this.messageText){
                let msg = {}
                msg.chatMsg = this.messageText
                msg.chatMsgRead = [this.userID]
                msg.chatMsgTime = Date.now()
                msg.userID = this.$store.getters.getUser
                db.collection('chats').doc(this.userAndChatData.chatID).update({
                    chatMessages: firebase.firestore.FieldValue.arrayUnion(msg)
                })
                this.messageText = null
                this.$refs.messagebox.nativeView.dismissSoftInput() //dissmisses the keyboard
                this.scrollToBottom()
            }        
        },

        deleteMessage(msg) {
            db.collection('chats').doc(this.userAndChatData.chatID).update({
                chatMessages: firebase.firestore.FieldValue.arrayRemove(msg)
            })                    
        },

        msgTime(index) {
            const time = new Date(this.chatData.chatMessages[index].chatMsgTime)      
            const timeNow = Date.now()  
            const hoursAndMinutes = time.getHours() + ":" + ('0' + time.getMinutes()).slice(-2)
            const date = `${time.getDate()}/${time.getMonth()}/${time.getFullYear()}`
            if(timeNow > time.setDate(time.getDate() + 1)){
                return `${date} ${hoursAndMinutes}`
            } else {
                return hoursAndMinutes 
            }                
        },
        
        msgNames(user) {
            let result = this.membersProfileData.find(member => member.id == user)
            if(!result){
                return "Name"
            } else {
                return result.name
            }            
        },

        profilePictures(user) {
            let result = this.membersProfileData.find(member => member.id == user)
            if(result){
                return result.profileImage
            }           
        },

        scrollToBottom() {
            this.$nextTick(() => {
                let index = this.chatData.chatMessages.length - 1
                console.log("Scroll to index: " + index)
                this.$refs.messages.nativeView.scrollToIndex(index, false);
            })
        },

        acceptInvite(message) {
            console.log("Accepting invite")
            db.collection('trips').doc(message.tripRequestID).get() //Get the trip data
            .then(doc => {
                let tripData = doc.data()
                //Check if the member is not already added to the trip
                let member = this.membersProfileData.filter(user => user.id === message.inviteForUserID)
                let memberIndex = this.membersProfileData.indexOf(member[0])
                let doesIncludeMember = this.membersProfileData[memberIndex].trips.includes(message.tripRequestID)    
                if(!doesIncludeMember){ //If the member is not already added to the trip then add them                
                // if(!tripData.tripMembers.includes(message.userID)){ //Check if the member is not already added to the trip
                    console.log("Adding member")
                    //Add member
                    tripData.tripMembers.push(message.inviteForUserID)
                    db.collection('trips').doc(message.tripRequestID).update({ //Add user as a trip member in Firebase. Usually they should already be because of the invite.
                        tripMembers: firebase.firestore.FieldValue.arrayUnion(message.inviteForUserID)
                    }).catch(err => {console.log('trips' + err)})
                    let userChats = {} 
                    userChats.chatID = message.tripRequestID
                    userChats.chatIsPrivate = false
                    db.collection('user_data').doc(message.inviteForUserID).update({
                        userTrips: firebase.firestore.FieldValue.arrayUnion(message.tripRequestID), //Add the trip to the user's trips in Firebase
                        userChats: firebase.firestore.FieldValue.arrayUnion(userChats)
                    }).catch(err => {console.log('user_data' + err)})    
                    db.collection('chats').doc(message.tripRequestID).update({ //Set the member as a chat members
                        chatMembers: firebase.firestore.FieldValue.arrayUnion(message.inviteForUserID)
                    }).catch(err => {console.log('chats' + err)})   
                    //Update the status of the trip in the message trip invite
                    let msgIndex = this.chatData.chatMessages.indexOf(message)
                    this.chatData.chatMessages[msgIndex].tripRequestStatus = 'accepted'
                    db.collection('chats').doc(this.userAndChatData.chatID).update({ 
                        chatMessages: this.chatData.chatMessages
                    })                                                        
                    console.log(`You've added ${message.inviteForUserID} to the trip`)
                    this.addFriends(message, tripData) //add the user as friend to other members of the trip
                } else {
                    console.log(`${message.inviteForUserID} is already a member of this trip`)
                }
            }) 
        },

        addFriends(message, tripData) { //cross pollinate friends data so everyone in the trip are friends
            console.log("Adding friends")  
            for(let i = 0; i < tripData.tripMembers.length; i++){
                let member = tripData.tripMembers[i]
                console.log("Member " + member)
                if(member != "Anonymous"){     
                    if(member != message.userID){
                        db.collection('user_data').doc(member).update({ //Add the member as a friend to the user. arrayUnion automatically disregards diplicate values so no need to check if they are already friends.
                            userFriends: firebase.firestore.FieldValue.arrayUnion(message.userID)
                        })   
                        console.log(`New trip user ${message.userID} added as a freind to ${member}`)                          
                        db.collection('user_data').doc(message.userID).update({ //Add the member as a friend to the user. arrayUnion automatically disregards diplicate values so no need to check if they are already friends.
                            userFriends: firebase.firestore.FieldValue.arrayUnion(member)
                        })   
                        console.log(`${member} added as a friend to the new trip user ${message.userID}`)     
                    } else {
                        console.log(`${member} is the same user as ${message.userID}`)
                    }
                } else {
                    console.log(`The member is Anonymous: ${member}`)  
                }
            }
            let confirmMessage = {}
            if(message.inviteForUserID == this.userID)
            {
                confirmMessage = {
                    title: "You're part of the trip now!",
                    message: "Go and say hi!",
                    okButtonText: "OK"                    
                }
            }
            else
            {
                confirmMessage = {
                    title: "You've added a new member to the trip!",
                    message: "Go and say hi!",
                    okButtonText: "OK"                    
                }                
            }
            confirm(confirmMessage)
            .then((result) => {
                if(result){
                    this.$goTo('trips')
                }                
            })                    
        },   

        declineInvite(message) {
            let inviteMessages = this.chatData.chatMessages.filter(msg => msg.tripRequestStatus == "pending" && message.tripRequestID == msg.tripRequestID) 
            console.log("inviteMessages " + JSON.stringify(inviteMessages))
            for(let i = 0; i < inviteMessages.length; i++)
            {
                let msgIndex = this.chatData.chatMessages.indexOf(inviteMessages[i])
                console.log("msgIndex " + msgIndex)
                this.chatData.chatMessages[msgIndex].tripRequestStatus = 'declined'
            }
            db.collection('chats').doc(this.userAndChatData.chatID).update({ 
                chatMessages: this.chatData.chatMessages
            })           
            db.collection('trips').doc(message.tripRequestID).update({ //Remove member from the trip members array. That would be the case if they were invited to the trip instead of requesting to join it.
                tripMembers: firebase.firestore.FieldValue.arrayRemove(message.inviteForUserID)
            })                
            console.log("Trip invite declined")
            confirm({
                title: "You've declined the invite.",
                message: "You can message the person with more details.",
                okButtonText: "OK"
            })          
        }

    },

    created() {
        this.isLoading = true
        this.userID = this.$store.getters.getUser //get current user
        console.log("User retreived from Chat Private " + this.userID)       
        this.chatListener = db.collection('chats').doc(this.userAndChatData.chatID).onSnapshot(doc => {
            this.chatData = doc.data()
            this.chatData.chatMessages.filter(msg => msg.tripRequestID).forEach(msg => { //if there's a trip invite get the trip title. Not efficient in Firebase calls as it refreshes everytime the chat data is refreshed.
                db.collection('trips').doc(msg.tripRequestID).get()
                .then(doc => {
                    msg.tripTitle = doc.data().tripTitle
                    console.log("Trip data retrieved")
                })                                
            })
            //Check if the user has read the messages
            for (let i = 0; i < this.chatData.chatMessages.length; i++) {
                let chatMsgReadIsArray = Array.isArray(this.chatData.chatMessages[i].chatMsgRead)
                if(chatMsgReadIsArray) {
                    let read = this.chatData.chatMessages[i].chatMsgRead.includes(this.userID)
                    if(read){
                        //Message alread read
                    } else {
                        this.chatData.chatMessages[i].chatMsgRead.push(this.userID)
                        db.collection('chats').doc(this.userAndChatData.chatID).update({
                            chatMessages: this.chatData.chatMessages
                        })                            
                        //Message now read and FB updated
                    }
                }
            }            
            console.log("Chat data loaded")
        })
        for(let i = 0; i < this.userAndChatData.chatMembers.length; i++){
            db.collection('users').doc(this.userAndChatData.chatMembers[i]).get()
            .then(person => {
                this.$store.dispatch('getAnyUserExtraData', this.userAndChatData.chatMembers[i]).then(() => { //get user's extra data: favs, trips, friends
                    let userExtraData = this.$store.getters.getAnyUserExtraData 
                    let member = {}
                    member.id = person.id           
                    member.name = person.data().userFirstName
                    member.profileImage = this.$backendService.defaultProfiePicture(person.data().userProfileImages[0])
                    member.isDriver = person.data().userTagDriver
                    member.friends = userExtraData.userFriends
                    member.chats = userExtraData.userChats
                    member.trips = userExtraData.userTrips
                    this.membersProfileData.unshift(member)  
                    this.scrollToBottom()
                    this.isLoading = false
                })                   
            })          
        }
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
    .action-title {
        font-size: 15;
        color: black;
    }
    .basic-trip-info {
        margin: 10, 25, 25, 25;
        color: black;
    }
    .trip-button {
        background-color: #2E2E2E;
        color: white;
        font-size: 15;
        border-radius: 7;
        padding: -5, 0;
        margin-left: 15;
    }   
    .trip-info {
        font-size: 15;
        margin-left: 15;
    }          
    .section-heading-text {
        font-size: 20; 
        font-weight: 500; 
        color: black;     
    } 
    .chat-container {
        padding: 0, 25;
        color: black;
    }
    .chat-item {
        margin-top: 15;
        margin-left: 0;
    } 
    .chat-box {
        background-color: #ebebeb;
        border-radius: 10;
        padding: 5, 5, 5, 5;
        margin-left: 5;
        margin-right: 5;
    }
    .chat-msg {
        font-size: 15;
        margin: 0, 10, 0, 5;
    }    
    .chat-time {
        font-size: 11;
        margin: 3, 5, 0, 5;
    }    
    .bottom-navigation {
        background-color: #2E2E2E;
        padding: 5, 25;
    } 
    .message-box-text {
        font-size: 15;
        color: black;
        padding: 11, 15;
        height: 45;
        border: 0;
        border-width: 0;
        border-radius: 25;
        border-color: transparent;
        background-color: white;
    }
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
</style>