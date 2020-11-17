<template>
    <Page actionBarHidden="true" loaded="onLoaded" navigatedTo="onNavigatedTo">
        <GridLayout rows="auto, *, 70">
            <!-- Top Navigation and Info -->
            <StackLayout v-show="!isLoading" row="0" class="top-navigation" verticalAlignment="top">
                <!-- Custom Actionbar -->
                <StackLayout height="60">
                    <GridLayout rows="auto" columns="auto, *, auto" >
                        <StackLayout col="0" margin="15, 0, 0, 25" height="40" width="40" @tap="navigateBackAndStopChatListener()" >
                            <Image horizontalAlignment="left" verticalAlignment="center" src="~/assets/images/icons/back_button.png" width="26.67" height="30" stretch="aspectFit" />
                        </StackLayout>    
                        <Label col="1" class="action-title" margin="18, 10, 0, 10" :text="tripAndChatData.tripTitle" textWrap="false" horizontalAlignment="center" verticalAlignment="top" />            
                    </GridLayout>               
                </StackLayout>   
                <!-- Trip Info -->
                <StackLayout class="basic-trip-info" marginTop="0" marginBottom="15">
                    <GridLayout rows="auto, auto" columns="auto, auto, auto, *" class="chat-item" margin="0">
                        <Image row="0" col="0" rowSpan="2" :src="tripAndChatData.tripMedia[0]" width="45" height="70" borderRadius="5" stretch="aspectFill" @tap="navigateToTripPage" />
                        <Label row="0" col="1" class="trip-info" :text="tripDuration" textWrap="true" />
                        <GridLayout row="1" col="1" columns="auto, auto" class="action-button" margin="0, 0, 0, 15" horizontalAlignment="right" verticalAlignment="bottom" width="120" height="36" @tap="navigateToTripPage" >   
                            <Image col="0" src="~/assets/images/icons/main_trips_white.png" marginLeft="10" height="20" horizontalAlignment="left" verticalAlignment="center" stretch="aspectFit" />          
                            <Label col="1" marginLeft="10" verticalAlignment="center" text="Trip Page" /> 
                        </GridLayout>    
                        <StackLayout row="0" col="2" rowSpan="2" margin="0, 10" width="1" height="60" backgroundColor="#E1E1E1"/>   
                        <Label row="0" col="3" rowSpan="2" class="trip-info" fontSize="11" :text="`Trip members: ${memberNames}`" height="70" textWrap="true" />                                 
                    </GridLayout>
                </StackLayout>  
                <StackLayout height="1" backgroundColor="#E1E1E1"/>                
            </StackLayout> 
            <!-- Chat messages -->
            <StackLayout v-show="!isLoading" row="1" >
                <ListView ref="messages" for="(message, index) in chatData.chatMessages" separatorColor="transparent" >
                    <v-template>                        
                        <StackLayout class="chat-container">
                            <Label v-if="index == 0" class="section-heading-text" style="margin: 5, 0;" text="Chat" textWrap="true" /> 
                            <StackLayout>                          
                                <GridLayout v-show="message.userID != userID" width="100%" columns="40, *" rows="auto, 10" >
                                    <Image col="0" :src="profilePictures(message.userID)" width="35" height="35" borderRadius="50" stretch="aspectFill" verticalAlignment="bottom" />
                                    <GridLayout col="1" >
                                        <StackLayout horizontalAlignment="left" class="chat-box" >
                                            <StackLayout orientation="horizontal" >
                                                <Label class="chat-msg" style="font-weight: 500;" :text="msgNames(message.userID)" textWrap="true" @tap="deleteMessage(message)" />   
                                                <Label class="chat-time" :text="msgTime(index)" textWrap="true" @tap="deleteMessage(message)" />                                            
                                            </StackLayout>
                                            <Label class="chat-msg" :text="message.chatMsg" textWrap="true" verticalAlignment="top" @tap="deleteMessage(message)" />
                                        </StackLayout>
                                    </GridLayout> 
                                </GridLayout>  
                                <GridLayout v-show="message.userID == userID" width="100%" columns="*, 40" rows="auto, 10" >
                                    <Image col="1" :src="profilePictures(message.userID)" width="35" height="35" borderRadius="50" stretch="aspectFill" verticalAlignment="bottom" />
                                    <GridLayout col="0" >
                                        <StackLayout horizontalAlignment="right" class="chat-box" backgroundColor="#DDEAEE" >
                                            <StackLayout orientation="horizontal" >
                                                <Label class="chat-msg" style="font-weight: 500;" :text="msgNames(message.userID)" textWrap="true" @tap="deleteMessage(message)" />   
                                                <Label class="chat-time" :text="msgTime(index)" textWrap="true" @tap="deleteMessage(message)" />                                            
                                            </StackLayout>
                                            <Label class="chat-msg" :text="message.chatMsg" textWrap="true" verticalAlignment="top" @tap="deleteMessage(message)" />
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
    name: 'ChatCurrent',
    props: ['tripAndChatData'],
    data() {
        return {
            userID: null,

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

    computed: {
        tripDuration: function() { //Calculate the duration of the trip from the trip dates
            if(this.tripAndChatData.tripDateFrom && this.tripAndChatData.tripDateTo){
                const oneDay = 1000 * 60 * 60 * 24
                let dateDifference = Math.abs(this.tripAndChatData.tripDateTo - this.tripAndChatData.tripDateFrom)
                let tripLength = Math.round(dateDifference / oneDay) + 1
                if(tripLength == 1){
                    return "It's a day trip!"
                } else {
                    return `${tripLength}-days trip`
                }
            }            
        },

        memberNames: function() {
            let names = []
            this.membersProfileData.forEach(member => names.push(member.name))
            return names.join(', ').replace(/,(?!.*,)/gmi, ' and')
        }
    },

    methods: {
        goToPage(page) {
            this.$navigateTo(this.routes[page])
        },
        
        navigateToTripPage() {
            this.$navigateTo(TripCurrent, {
                props: {
                    tripID: this.tripAndChatData.tripID
                }
            })
        },

        navigateBackAndStopChatListener() {
            this.chatListener()
            console.log("Unsubsribed fron chat listener")
            this.$navigateBack()
        },

        sendMessage() {    
            if(this.messageText){
                let msg = {}
                msg.chatMsg = this.messageText
                msg.chatMsgRead = [this.userID]
                msg.chatMsgTime = Date.now()
                msg.userID = this.$store.getters.getUser
                db.collection('chats').doc(this.tripAndChatData.tripID).update({
                    chatMessages: firebase.firestore.FieldValue.arrayUnion(msg)
                })
                this.messageText = null
                this.$refs.messagebox.nativeView.dismissSoftInput() //dissmisses the keyboard
                this.scrollToBottom()
            }        
        },

        deleteMessage(msg) {
            db.collection('chats').doc(this.tripAndChatData.tripID).update({
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
            } else {
                return "~/assets/images/icons/profile_icon.png" //If a member is removed and there's no profile image show a generic one
            }   
        },

        scrollToBottom() {
            this.$nextTick(() => {
                let index = this.chatData.chatMessages.length - 1
                console.log("Scroll to index: " + index)
                this.$refs.messages.nativeView.scrollToIndex(index, false);
            })
        }

    },

    created() {      
        this.isLoading = true
        this.userID = this.$store.getters.getUser //get current user
        console.log("User retreived from Chat " + this.userID)        
        this.chatListener = db.collection('chats').doc(this.tripAndChatData.chatID).onSnapshot(doc => {
            this.chatData = doc.data()
            //Check if the user has read the messages
            for (let i = 0; i < this.chatData.chatMessages.length; i++) {
                let chatMsgReadIsArray = Array.isArray(this.chatData.chatMessages[i].chatMsgRead)
                if(chatMsgReadIsArray) {
                    let read = this.chatData.chatMessages[i].chatMsgRead.includes(this.userID)
                    if(read){
                        //Message alread read
                    } else {
                        this.chatData.chatMessages[i].chatMsgRead.push(this.userID)
                        // let msgIndex = this.chatData.chatMessages.indexOf(this.chatData.chatMessages[i])
                        db.collection('chats').doc(this.tripAndChatData.chatID).update({
                            chatMessages: this.chatData.chatMessages
                        })                            
                        //Message now read and FB updated
                    }
                }
            }
            console.log("Chat data loaded")
        })
        for(let i = 0; i < this.tripAndChatData.tripMembers.length; i++){
            if(this.tripAndChatData.tripMembers[i] == 'Anonymous') {
                let member = {}
                member.id = "Anonymous"           
                member.name = "Anonymous Buddy"
                member.profileImage = "~/assets/images/icons/profile_icon.png"
                this.membersProfileData.unshift(member)
                this.scrollToBottom()
            } else {
                db.collection('users').doc(this.tripAndChatData.tripMembers[i]).get()
                .then(person => {
                    this.$store.dispatch('getAnyUserExtraData', this.tripAndChatData.tripMembers[i]).then(() => { //get user's extra data: favs, trips, friends
                        let userExtraData = this.$store.getters.getAnyUserExtraData 
                        let member = {}
                        member.id = person.id           
                        member.name = person.data().userFirstName
                        member.profileImage = this.$backendService.defaultProfiePicture(person.data().userProfileImages[0])
                        member.isDriver = person.data().userTagDriver
                        member.friends = userExtraData.userFriends
                        member.chats = userExtraData.userChats
                        this.membersProfileData.unshift(member)  
                        this.scrollToBottom()
                        this.isLoading = false
                    })                   
                })
            }            
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
    .action-button {
        background-color: #2E2E2E;
        color: white;
        border-radius: 7;
        font-size: 11;
        font-weight: 400;
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
        padding: 5;
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
    .top-navigation {
        background-color: white;
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
</style>