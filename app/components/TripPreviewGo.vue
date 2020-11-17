<template>
    <Page actionBarHidden="true">
        <GridLayout rows="auto, *, auto">
          <!-- Custom Actionbar -->
          <StackLayout row="0" height="60">
            <GridLayout rows="auto" columns="*" >
                <Image col="0" horizontalAlignment="left" verticalAlignment="center" margin="15, 0, 0, 25" opacity="0.75" src="~/assets/images/icons/back_button.png" @tap="$navigateBack" width="30" height="30" stretch="aspectFit" />
                <Label col="0" class="action-label" margin="15, 0 , 0, 5" text="Join a trip!" textWrap="true" horizontalAlignment="center" verticalAlignment="center" />            
            </GridLayout>               
          </StackLayout>
          <StackLayout row="0" height="1" verticalAlignment="bottom" backgroundColor="#E1E1E1"/>   
          <!-- Message -->
          <ScrollView row="1">
            <StackLayout>
                    <Image marginTop="30" src="~/assets/images/icon.png" height="60" stretch="aspectFit" verticalAlignment="top" />
                    <StackLayout class="basic-profile-info">
                        <Label class="trip-text" text="1. Message the organiser and let them know why you want to go on this tirp with them." margin="0, 0, 10, 0" horizontalAlignment="left" textWrap="true" />
                        <Label class="trip-text" text="2. Wait for their response. Check your chat notifications." margin="0, 0, 10, 0" horizontalAlignment="left" textWrap="true" />
                        <Label class="trip-text" text="3. Once joined, have fun with your new friends." margin="0, 0, 30, 0" horizontalAlignment="left" textWrap="true" />                    
                        <Label class="trip-text-heading" text="Message:" horizontalAlignment="left" textWrap="true" />
                        <StackLayout class="grey-field-box" margin="10, 0" padding="10">
                            <ScrollView orientation="vertical" height="200">
                                <StackLayout>
                                    <TextView class="input-field" hint="Write here..." v-model="messageText" minHeight="200" maxLength="1000" returnKeyType="done" editable="true" />  
                                </StackLayout>                        
                            </ScrollView>                                                                                                                                              
                        </StackLayout>             
                        <StackLayout orientation="horizontal" class="action-button" margin="10, 0, 0" width="145" height="36" horizontalAlignment="right" @tap="sendMessage()" >             
                            <Label text="Send message" fontSize="15" marginLeft="0" horizontalAlignment="left" verticalAlignment="center" /> 
                            <Image src="~/assets/images/icons/input_icon_white.png" height="20" margin="0, 10" opacity="0.75" horizontalAlignment="left" verticalAlignment="center" stretch="aspectFit" />
                        </StackLayout>                                                   
                    </StackLayout>                  
            </StackLayout>
          </ScrollView>
          <!-- Bottom navigation -->       
        </GridLayout>          
    </Page>
</template>

<script>
import firebase from 'nativescript-plugin-firebase'
const db = firebase.firestore

export default {
    name: 'TripPreviewGo',
    props: ['tripData', 'organiserData', 'membersProfileData'],
    data() {
        return {
            userID: null,

            userData: {
                userFirstName: null,
            },

            messageText: null
        }
    },

    methods: {
        async sendMessage() {
            //See if the direct/private chat doesn't laready exists in the organiser's chats
            let orrganiserIndex = this.membersProfileData.findIndex(member => member.id == this.organiserData.userID) //Get the organisers chats from TripPreview to safe a Firebase call
            let chatIndex = this.membersProfileData[orrganiserIndex].chats.findIndex(chat => chat.chatID.includes(this.userID)) //See if the user has their ID in their chat to detect if there's already a direct chat created
            if(chatIndex < 0){
                //Send the request and create a new direct chat between the users
                let chatName = this.userID + this.organiserData.userID
                console.log("Chat ID is " + chatName)

                let chatMembers = []
                chatMembers.push(this.userID)
                chatMembers.push(this.organiserData.userID)

                let chatMessages = []
                let msg = {}
                msg.chatMsg = this.messageText //Set the first message as the trip join request message
                msg.chatMsgRead = null
                msg.chatMsgTime = Date.now()
                msg.userID = this.userID  
                msg.inviteForUserID = this.userID  
                msg.tripRequestID = this.tripData.tripID   
                msg.tripRequestStatus = 'pending'
                chatMessages.push(msg)   

                await db.collection('chats').doc(chatName).set({ //create chat document
                    chatAdmin: chatMembers,
                    chatCreationDate: Date.now(),
                    chatMembers: chatMembers,
                    chatMessages: chatMessages,
                }).then(() => {
                    console.log("Chat document created")
                })
                for(let i = 0; i < chatMembers.length; i++){ //Save the direct chat in each members chats
                    let userChats = {}
                    userChats.chatID = chatName
                    userChats.chatIsPrivate = true
                    await db.collection('user_data').doc(chatMembers[i]).update({
                        userChats: firebase.firestore.FieldValue.arrayUnion(userChats)
                    }).then(() => {
                    console.log("Chat document created in user_data")
                    })                                     
                }
                this.$goTo('chat', {}, { clearHistory: true })
                console.log("Navigating to Chat")
            } else {
                //Send the request and update the existing chat
                console.log("There's already a private chat between the two users")

                let msg = {}
                msg.chatMsg = this.messageText //the trip join request message
                msg.chatMsgRead = null
                msg.chatMsgTime = Date.now()
                msg.userID = this.userID  
                msg.inviteForUserID = this.userID  
                msg.tripRequestID = this.tripData.tripID   
                msg.tripRequestStatus = 'pending'

                await db.collection('chats').doc(this.membersProfileData[orrganiserIndex].chats[chatIndex].chatID).update({ //Update the chat document
                    chatMessages: firebase.firestore.FieldValue.arrayUnion(msg)
                }).then(() => {
                    console.log("Chat document updated")
                })       
                this.$goTo('chat', {}, { clearHistory: true })
                console.log("Navigating to Chat")                         
            }
        }
    },

    created() {
        this.userID = this.$store.getters.getUser
        console.log("User retreived from TripPreviewGo " + this.userID)
        this.$store.dispatch('getCurrentUserData', this.userID).then(() => { //Get users data based on their user id
            this.userData = this.$store.getters.getUserData
            console.log("User data retreived from TripPreviewGo " + this.userData)
            this.messageText = `Hi ${this.organiserData.userFirstName}, my name is ${this.userData.userFirstName} and I would like to join your trip.` //Set the message text
        })
    }
}
</script>

<style scoped>
    .basic-profile-info {
        margin: 25, 25;
        color: black;
    }
    .grey-field-box {
        background-color: #F2F2F2;
        border-radius: 7;
        padding: 10, 0;
        margin: 10, 20;
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
    .action-button {
        background-color: #2E2E2E;
        color: white;
        border-radius: 7;
        font-size: 11;
        font-weight: 400;
        margin: 30, 30;
    }                   
</style>