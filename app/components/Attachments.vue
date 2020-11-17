<template>
    <Page actionBarHidden="true">
        <GridLayout rows="auto, *, auto" >
            <!-- Custom Actionbar -->
            <StackLayout row="0" height="60" v-show="!isLoading">
                <GridLayout rows="auto" columns="auto, *, auto" >

                    <StackLayout col="0" margin="15, 0, 0, 25" verticalAlignment="top" height="40" width="40" @tap="$goTo('tripcurrent', {tripID})" >
                        <Image horizontalAlignment="left" src="~/assets/images/icons/back_button.png" width="26.67" height="30" stretch="aspectFit" />
                    </StackLayout> 
                    <StackLayout col="2" orientation="horizontal" class="action-button" margin="11, 25, 0, 0" width="136" height="36" horizontalAlignment="left" verticalAlignment="top" @tap="addAttachmentSelector()" >   
                        <Image src="~/assets/images/icons/attachment_white_icon.png" height="20" style="margin-left: 10;" horizontalAlignment="left" verticalAlignment="center" stretch="aspectFit" />          
                        <Label text="Add attachment" style="margin-left: 10;" verticalAlignment="center" /> 
                    </StackLayout>                              
                </GridLayout>               
            </StackLayout>
            <StackLayout row="0" height="1" verticalAlignment="bottom" backgroundColor="#E1E1E1" v-show="!isLoading"/> 
            <!-- Attachments -->         
            <ScrollView row="1" v-show="!isLoading">
                <StackLayout class="basic-profile-info" marginTop="0" marginBottom="0">
                    <Label class="trip-title" marginTop="10" :text="tripData.tripTitle" textWrap="true" />
                    <!-- Pinned attachments -->
                    <StackLayout orientation="horizontal">
                        <Image class="icon-image" margin="0" src="~/assets/images/icons/pin_colour_icon.png" opacity="1" height="20" horizontalAlignment="left" stretch="aspectFit"/>                                
                        <Label class="trip-text-heading" margin="10, 10" text="Pinned attachments" textWrap="true" />
                    </StackLayout>
                    <Label v-show="pinnedAttachmentsArray.length == 0" class="trip-text" marginBottom="10" text="No pinned attachments." textWrap="true" />
                    <StackLayout v-show="pinnedAttachmentsArray.length > 0" v-for="(attachment, index) in pinnedAttachmentsArray" :key="index + 'pinnedAttachments'" @longPress="manageAttachmentSelector(attachment)">
                        <GridLayout rows="*" columns="25, *">
                            <StackLayout row="0" col="0" verticalAlignment="center" @tap="manageAttachmentSelector(attachment)" >
                                <Image class="icon-image" margin="0" :src="attachmentTypeImage(attachment)" opacity="0.75" height="15" horizontalAlignment="left" stretch="aspectFit" />
                            </StackLayout>
                            <GridLayout row="0" col="1" columns="*, 15" class="grey-field-box" padding="10" margin="0, 0, 5">
                                <StackLayout col="0" @tap="openAttachment(attachment)">
                                    <Label class="trip-text-heading" :text="`${attachmentTypeName(attachment)}: ${attachment.name ? attachment.name : ''}`" textWrap="true" />
                                    <Label class="trip-text" :text="attachmentTruncateText(attachment)" textWrap="true" />   
                                    <Label v-show="attachment.day" class="trip-text" :text="`Day ${attachment.day} (${dayDates(attachment.day)})`" fontSize="11" textWrap="true" />   
                                </StackLayout>
                                <StackLayout col="1" @tap="manageAttachmentSelector(attachment)" horizontalAlignment="right" verticalAlignment="bottom" >
                                    <Image class="icon-image" margin="0" src="~/assets/images/icons/edit_profile.png" opacity="0.75" height="15" stretch="aspectFit" />                        
                                </StackLayout>
                            </GridLayout>
                        </GridLayout>
                    </StackLayout>                                                    
                    <!-- Upcoming attachments -->
                    <StackLayout orientation="horizontal">
                        <Image class="icon-image" margin="0" src="~/assets/images/icons/calendar_icon.png" opacity="1" height="20" horizontalAlignment="left" stretch="aspectFit"/>                                
                        <Label class="trip-text-heading" margin="10, 10" text="Upcoming attachments" textWrap="true" />
                    </StackLayout>
                    <Label v-show="attachmentData.attachments.length == 0" class="trip-text" marginBottom="10" text="Add an attachment to see it here..." textWrap="true" />
                    <StackLayout v-for="(attachment, index) in upcomingAttachmentsArray" :key="index + 'attachments'" @longPress="manageAttachmentSelector(attachment)">
                        <GridLayout rows="*" columns="25, *" >
                            <StackLayout row="0" col="0" verticalAlignment="center" @tap="manageAttachmentSelector(attachment)" >
                                <Image class="icon-image" margin="0" :src="attachmentTypeImage(attachment)" opacity="0.75" height="15" horizontalAlignment="left" stretch="aspectFit" />
                            </StackLayout>
                            <GridLayout row="0" col="1" columns="*, 15" class="grey-field-box" padding="10" margin="0, 0, 5">
                                <StackLayout col="0" @tap="openAttachment(attachment)">
                                    <Label class="trip-text-heading" :text="`${attachmentTypeName(attachment)}: ${attachment.name ? attachment.name : ''}`" textWrap="true" />
                                    <Label class="trip-text" :text="attachmentTruncateText(attachment)" textWrap="true" />   
                                    <Label v-show="attachment.day" class="trip-text" :text="`Day ${attachment.day} (${dayDates(attachment.day)})`" fontSize="11" textWrap="true" />  
                                </StackLayout>
                                <StackLayout col="1" @tap="manageAttachmentSelector(attachment)" horizontalAlignment="right" verticalAlignment="bottom" >
                                    <Image class="icon-image" margin="0" src="~/assets/images/icons/edit_profile.png" opacity="0.75" height="15" stretch="aspectFit" />                        
                                </StackLayout>
                            </GridLayout>         
                        </GridLayout>
                    </StackLayout> 
                    <StackLayout height="60" backgroundColor="transparent"/>                        
                </StackLayout>             
            </ScrollView>    
            <!-- Bottom add attachment -->
            <StackLayout row="2" >
                <!-- Note -->
                <StackLayout v-show="addAttachIsEnabled == 'note'" class="grey-field-box" margin="0" padding="10, 20">
                    <GridLayout columns="*, auto">
                        <Label v-show="!editModeIsEnabled" col="0" class="trip-text-heading" text="New note:" horizontalAlignment="left" textWrap="true" />
                        <Label v-show="editModeIsEnabled" col="0" class="trip-text-heading" text="Edit note:" horizontalAlignment="left" textWrap="true" />
                        <Image col="1" opacity="0.75" src="~/assets/images/icons/close_icon.png" horizontalAlignment="right" width="15" height="15" stretch="aspectFit" @tap="addAttachIsEnabled = null; bottomNavigationIsEnabled = true; editModeIsEnabled = false; attachmentFeedback = null"/>
                    </GridLayout>
                    <ScrollView orientation="vertical" height="150">
                        <StackLayout>
                            <TextView ref="addNote" class="input-field" hint="Write here..." v-model="addAttachmentText" minHeight="150" maxLength="1000" returnKeyType="done" editable="true" />  
                        </StackLayout>                        
                    </ScrollView>
                    <GridLayout columns="auto, *" margin="10, 0" @tap="openItinerarySelector">
                        <Image row="0" col="0" class="trip-icon" marginLeft="0" src="~/assets/images/icons/calendar_icon.png" height="15" horizontalAlignment="left" stretch="aspectFit"/>
                        <Label ref="itinDay" v-show="!addAttachmentDay" row="0" col="1" class="trip-text" margin="0, 10, 0, 12" text="Select a day (optional)" verticalAlignment="center"/>  
                        <Label v-show="addAttachmentDay" row="0" col="1" class="trip-text" margin="0, 10, 0, 12" :text="`Day ${addAttachmentDay} (${dayDates(addAttachmentDay)})`" verticalAlignment="center"/>  
                    </GridLayout>                       
                    <Label class="trip-text" text="Title (optional):" textWrap="true" />
                    <TextField class="input-field" hint="Name of attachment..." v-model="addAttachmentName" maxLength="50" returnKeyType="done" editable="true" />  
                    <StackLayout v-show="editModeIsEnabled" orientation="horizontal">
                        <Label class="trip-text" text="Pin attachment?" textWrap="true" />
                        <Switch horizontalAlignment="left" v-model="attachIsPinned" color="#2E2E2E" backgroundColor="green" offBackgroundColor="red" @checkedChange="attachIsPinnedSwitch" />                              
                    </StackLayout>
                    <StackLayout v-show="!editModeIsEnabled" orientation="horizontal" marginTop="5" @tap="addAttachmentNote">
                        <Image class="trip-icon" marginLeft="0" src="~/assets/images/icons/plus_icon.png" opacity="0.75" horizontalAlignment="left" height="20" stretch="aspectFit" />
                        <Label class="trip-text" margin="0, 0, 0, 15" text="Add attachment" verticalAlignment="center" />                            
                    </StackLayout> 
                    <StackLayout v-show="editModeIsEnabled" orientation="horizontal" marginTop="5" @tap="addAttachmentNote">
                        <Image class="trip-icon" marginLeft="0" src="~/assets/images/icons/edit_profile.png" opacity="0.75" horizontalAlignment="left" height="20" stretch="aspectFit" />
                        <Label class="trip-text" margin="0, 0, 0, 15" text="Edit attachment" verticalAlignment="center" />                            
                    </StackLayout>                                                                                                                                      
                </StackLayout> 
                <!-- Link -->
                <StackLayout v-show="addAttachIsEnabled == 'link'" class="grey-field-box" margin="0" padding="10, 20">
                    <GridLayout columns="*, auto">
                        <Label v-show="!editModeIsEnabled" class="trip-text-heading" text="New web link:" horizontalAlignment="left" textWrap="true" /> 
                        <Label v-show="editModeIsEnabled" class="trip-text-heading" text="Edit web link:" horizontalAlignment="left" textWrap="true" /> 
                        <Image col="1" opacity="0.75" src="~/assets/images/icons/close_icon.png" horizontalAlignment="right" width="15" height="15" stretch="aspectFit" @tap="addAttachIsEnabled = null; bottomNavigationIsEnabled = true; editModeIsEnabled = false; attachmentFeedback = null"/>
                    </GridLayout>                                              
                    <ScrollView orientation="vertical" height="70">
                        <StackLayout>
                            <TextView ref="addLink" class="input-field" hint="Paste web link here (pages, images, etc.)..." v-model="addAttachmentText" minHeight="70" maxLength="1000" returnKeyType="done" editable="true" />  
                        </StackLayout>                        
                    </ScrollView>    
                    <GridLayout columns="auto, *" margin="10, 0" @tap="openItinerarySelector">
                        <Image row="0" col="0" class="trip-icon" marginLeft="0" src="~/assets/images/icons/calendar_icon.png" height="15" horizontalAlignment="left" stretch="aspectFit"/>
                        <Label ref="itinDay" v-show="!addAttachmentDay" row="0" col="1" class="trip-text" margin="0, 10, 0, 12" text="Select a day (optional)" verticalAlignment="center"/>  
                        <Label v-show="addAttachmentDay" row="0" col="1" class="trip-text" margin="0, 10, 0, 12" :text="`Day ${addAttachmentDay} (${dayDates(addAttachmentDay)})`" verticalAlignment="center"/>  
                    </GridLayout>                                      
                    <Label class="trip-text" text="Title (optional):" textWrap="true" />
                    <TextField class="input-field" hint="Name of attachment..." v-model="addAttachmentName" maxLength="50" returnKeyType="done" editable="true" /> 
                    <StackLayout v-show="editModeIsEnabled" orientation="horizontal">
                        <Label class="trip-text" text="Pin attachment?" textWrap="true" />
                        <Switch horizontalAlignment="left" v-model="attachIsPinned" color="#2E2E2E" backgroundColor="green" offBackgroundColor="red" @checkedChange="attachIsPinnedSwitch" />                              
                    </StackLayout>
                    <StackLayout v-show="!editModeIsEnabled" orientation="horizontal" marginTop="5" @tap="addAttachmentLink">
                        <Image class="trip-icon" marginLeft="0" src="~/assets/images/icons/plus_icon.png" opacity="0.75" horizontalAlignment="left" height="20" stretch="aspectFit" />
                        <Label class="trip-text" margin="0, 0, 0, 15" text="Add attachment" verticalAlignment="center" />                            
                    </StackLayout> 
                    <StackLayout v-show="editModeIsEnabled" orientation="horizontal" marginTop="5" @tap="addAttachmentLink">
                        <Image class="trip-icon" marginLeft="0" src="~/assets/images/icons/edit_profile.png" opacity="0.75" horizontalAlignment="left" height="20" stretch="aspectFit" />
                        <Label class="trip-text" margin="0, 0, 0, 15" text="Edit attachment" verticalAlignment="center" />                            
                    </StackLayout>  
                </StackLayout>      
                <!-- File -->
                <StackLayout v-show="addAttachIsEnabled == 'file'" class="grey-field-box" margin="0" padding="10, 20">
                    <GridLayout columns="*, auto">
                        <Label v-show="!editModeIsEnabled" class="trip-text-heading" text="Upload new file:" horizontalAlignment="left" textWrap="true" /> 
                        <Label v-show="editModeIsEnabled" class="trip-text-heading" text="Edit a file:" horizontalAlignment="left" textWrap="true" /> 
                        <Image col="1" opacity="0.75" src="~/assets/images/icons/close_icon.png" horizontalAlignment="right" width="15" height="15" stretch="aspectFit" @tap="addAttachIsEnabled = null; bottomNavigationIsEnabled = true; editModeIsEnabled = false; attachmentFeedback = null"/>
                    </GridLayout>                                              
                    <ScrollView orientation="vertical" height="30">
                        <StackLayout>
                            <Label class="input-field" :text="fileName"/>  
                        </StackLayout>                        
                    </ScrollView>    
                    <GridLayout columns="auto, *" margin="10, 0" @tap="openItinerarySelector">
                        <Image row="0" col="0" class="trip-icon" marginLeft="0" src="~/assets/images/icons/calendar_icon.png" height="15" horizontalAlignment="left" stretch="aspectFit"/>
                        <Label ref="itinDay" v-show="!addAttachmentDay" row="0" col="1" class="trip-text" margin="0, 10, 0, 12" text="Select a day (optional)" verticalAlignment="center"/>  
                        <Label v-show="addAttachmentDay" row="0" col="1" class="trip-text" margin="0, 10, 0, 12" :text="`Day ${addAttachmentDay} (${dayDates(addAttachmentDay)})`" verticalAlignment="center"/>  
                    </GridLayout>                                      
                    <Label class="trip-text" text="Title (optional):" textWrap="true" />
                    <TextField ref="addFile" class="input-field" hint="Name of attachment..." v-model="addAttachmentName" maxLength="50" returnKeyType="done" editable="true" /> 
                    <StackLayout v-show="editModeIsEnabled" orientation="horizontal">
                        <Label class="trip-text" text="Pin attachment?" textWrap="true" />
                        <Switch horizontalAlignment="left" v-model="attachIsPinned" color="#2E2E2E" backgroundColor="green" offBackgroundColor="red" @checkedChange="attachIsPinnedSwitch" />                              
                    </StackLayout>
                    <StackLayout v-show="!editModeIsEnabled" orientation="horizontal" marginTop="5" @tap="uploadAttachment">
                        <Image class="trip-icon" marginLeft="0" src="~/assets/images/icons/plus_icon.png" opacity="0.75" horizontalAlignment="left" height="20" stretch="aspectFit" />
                        <Label class="trip-text" margin="0, 0, 0, 15" text="Add attachment" verticalAlignment="center" />                            
                    </StackLayout> 
                    <StackLayout v-show="editModeIsEnabled" orientation="horizontal" marginTop="5" @tap="uploadAttachment">
                        <Image class="trip-icon" marginLeft="0" src="~/assets/images/icons/edit_profile.png" opacity="0.75" horizontalAlignment="left" height="20" stretch="aspectFit" />
                        <Label class="trip-text" margin="0, 0, 0, 15" text="Edit attachment" verticalAlignment="center" />                            
                    </StackLayout>                                                                                                                                                              
                </StackLayout>  
                <Label v-show="attachmentFeedback" class="grey-field trip-text" margin="0" padding="0, 20, 20" color="#f55a42" :text="attachmentFeedback" textWrap="true" />                                                                 
                <!-- Bottom actions -->  
                <GridLayout v-show="bottomNavigationIsEnabled && !isLoading" rows="auto, auto" columns="*, *, *" class="bottom-navigation" height="60" >
                    <Image row="0" col="0" marginTop="5" src="~/assets/images/icons/list_icon.png" horizontalAlignment="center" opacity="0.75" height="25" stretch="aspectFit" @tap="addAttachment('note')"/>
                    <Label row="1" col="0" horizontalAlignment="center" color="black" text="Add Note" textWrap="true" fontSize="13" @tap="addAttachment('note')"/>
                    <Image row="0" col="1" marginTop="5" src="~/assets/images/icons/external_link_icon.png" horizontalAlignment="center" opacity="0.75" height="25" stretch="aspectFit" @tap="addAttachment('link')"/>
                    <Label row="1" col="1" horizontalAlignment="center" color="black" text="Add Link" textWrap="true" fontSize="13" @tap="addAttachment('link')"/> 
                    <Image row="0" col="2" marginTop="5" src="~/assets/images/icons/attachment_icon.png" horizontalAlignment="center" opacity="0.75" height="25" stretch="aspectFit" @tap="addAttachment('file')"/>
                    <Label row="1" col="2" horizontalAlignment="center" color="black" text="Add File" textWrap="true" fontSize="13"  @tap="addAttachment('file')"/>                            
                </GridLayout>                              
            </StackLayout>
            <StackLayout row="2" height="1" verticalAlignment="top" backgroundColor="#E1E1E1" v-show="!isLoading"/>   
            <ActivityIndicator row="1" :busy="isLoading" horizontalAlignment="center" verticalAlignment="center" />           
        </GridLayout>
    </Page>
</template>

<script>
import firebase from 'nativescript-plugin-firebase'
const db = firebase.firestore
const fstore = firebase.storage

import * as filePicker from 'nativescript-mediafilepicker'
import * as fileSystemModule from 'file-system'

import AttachmentOpen from './elements/AttachmentOpen'
import ItinerarySelector from './elements/ItinerarySelector'
import { isIOS } from 'tns-core-modules/ui/core/view/view'

export default {
    name: 'Attachments',
    props: ['tripID', 'tripData', 'tripLength'],    
    data() {
        return {
            userID: null,

            isLoading: false,
            isEnabled: true,            

            attachmentData: {
                attachments: []
            },
            addAttachIsEnabled: [], //To store the type of attachment and show the relevant UI elements
            editModeIsEnabled: false, //When entering edit mode it shows and hides the relevant UI elements
            addAttachmentName: null,
            addAttachmentText: null, 
            addAttachmentDay: null,  
            attachIsPinned: false, //Stores isPinned value when editing an attachment      
            bottomNavigationIsEnabled: true, //Shows or hides the quick action toolbar at the bottom
            editAttachIndex: null, //Stores the last attachment when in editing mode so to get its index in the attachments array
            attachmentFeedback: null,

            extentions: [], //insert possible file picker extensions depending on the platform
            fileName: null, // for uploading
            filePath: null, // for uploading            

            metadata: {
                contentType: "attachment",
                customMetadata: {
                "data": "test"
                }
            }

        }
    },

    computed: {

        pinnedAttachmentsArray: function() {
            let array = []
            array = this.attachmentData.attachments.filter(obj => obj.isPinned === true)
            return array
        },

        upcomingAttachmentsArray: function() { //Sort the upcoming attachments array. Also sort any attachments without day values to the bottom of the array
            let array = this.attachmentData.attachments.slice().sort((a, b) => {
                if(!a.day){
                    return 1
                } else if(!b.day) {
                    return -1
                } else {
                    return a.day - b.day
                }
            })
            return array
        }    

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

        openItinerarySelector() {
            this.$showModal(ItinerarySelector, {
                props: {
                    tripLength: this.tripLength,
                    tripDateFrom: this.tripData.tripDateFrom
                }
            }).then(day => {
                if(day != 'close'){
                    this.addAttachmentDay = day
                }
            })
        },         

        openAttachment(attachment) {
            switch (attachment.type) {
                case 'note': 
                    this.$showModal(AttachmentOpen, {
                        props: {
                            attachment: attachment
                        }
                    }).then(day => {
                        console.log("Attachment modal view closed");
                    });          
                    console.log("Opening note");
                    break;
                case 'link': 
                    this.$utils.openUrl(attachment.linkPath);
                    console.log("Opening link"); 
                    break;
                case 'file': 
                    this.$utils.openUrl(attachment.attachmentUrl);
                    console.log("Opening file");
                    break;
                case 'list': 
                    console.log("Opening list");
                    break;                    
            }            
        },        

        attachmentTypeImage(attachment) {
            switch (attachment.type) {
                case 'note': return "~/assets/images/icons/list_icon.png"; break;
                case 'link': return "~/assets/images/icons/external_link_icon.png"; break;
                case 'file': return "~/assets/images/icons/attachment_icon.png"; break;
                case 'list': return "~/assets/images/icons/list_icon.png"; break;                    
            }            
        },

        attachmentTypeName(attachment) {
            switch (attachment.type) {
                case 'note': return "Note"; break;
                case 'link': return "Link"; break;
                case 'file': return "File"; break;
                case 'list': return "List"; break;                    
            }
        },   
        
        attachmentTruncateText(attachment) {
            const turncateLength = 60
            switch (attachment.type) {
                case 'note': 
                    if(attachment.text.length > turncateLength){
                        let text = attachment.text.substring(0, turncateLength);
                        return text + "...";
                    } else {
                        return attachment.text;
                    }             
                    break;
                case 'link': 
                    if(attachment.linkPath.length > turncateLength){
                        let text = attachment.linkPath.substring(0, turncateLength);
                        return text + "...";
                    } else {
                        return attachment.linkPath;
                    }     
                    break;
                case 'file': 
                    let text = attachment.attachmentPath.replace(/^.*[\\\/]/, '');
                    if(text.length > turncateLength){
                        text.substring(0, turncateLength);
                        return text + "...";
                    } else {
                        return text;
                    }   
                    break;
                case 'list': return "List"; break;                    
            }            
        },

        addAttachmentSelector() {    
            action("Add new attachment", "Cancel", ["Note", "Web Link", "File (PDF, text, etc.)"])
            .then(result => {
                switch(result) {
                    case "Note": 
                        this.addAttachIsEnabled = 'note'; 
                        this.bottomNavigationIsEnabled = false;
                        this.addAttachmentName = null;
                        this.addAttachmentText = null;
                        this.addAttachmentDay = null;
                        this.$nextTick(() => {
                            this.$refs.addNote.nativeView.focus();
                        });                                          
                        break;
                    case "Web Link": 
                        this.addAttachIsEnabled = 'link';  
                        this.bottomNavigationIsEnabled = false;
                        this.addAttachmentName = null;
                        this.addAttachmentText = null;
                        this.addAttachmentDay = null;
                        this.$nextTick(() => {
                            this.$refs.addLink.nativeView.focus();
                        });                         
                        break;
                    case "File (PDF, text, etc.)": 
                        this.addAttachIsEnabled = 'file'; 
                        this.bottomNavigationIsEnabled = false;
                        this.addAttachmentName = null;
                        this.addAttachmentText = null;   
                        this.addAttachmentDay = null;                     
                        this.addAttachmentFile();                        
                        break;                        
                    case "Cancel": return null; break;
                }
            })
        },

        addAttachment(type) { //Add attachment through the quick action bar at the bottom
            switch(type) {
                case "note": 
                    this.addAttachIsEnabled = 'note'; 
                    this.bottomNavigationIsEnabled = false;
                    this.addAttachmentName = null;
                    this.addAttachmentText = null;
                    this.addAttachmentDay = null;
                    this.$nextTick(() => {
                        this.$refs.addNote.nativeView.focus();
                    });                                          
                    break;
                case "link": 
                    this.addAttachIsEnabled = 'link';   
                    this.bottomNavigationIsEnabled = false;  
                    this.addAttachmentName = null;             
                    this.addAttachmentText = null;
                    this.addAttachmentDay = null;
                    this.$nextTick(() => {
                        this.$refs.addLink.nativeView.focus();
                    });                         
                    break;
                case "file":            
                    this.addAttachIsEnabled = 'file'; 
                    this.bottomNavigationIsEnabled = false;  
                    this.addAttachmentName = null;             
                    this.addAttachmentText = null;   
                    this.addAttachmentDay = null;                      
                    this.addAttachmentFile();                      
                    break;
            }
        },

        addAttachmentNote() {
            if(this.addAttachmentText) {
                if(!this.editModeIsEnabled){ //If Edit Mode is not enabled save new attachment. Otherwise edit the specific attachment.
                    let newAttachment = {}
                    newAttachment.type = "note"
                    newAttachment.name = this.addAttachmentName
                    newAttachment.text = this.addAttachmentText
                    newAttachment.day = this.addAttachmentDay
                    newAttachment.isPinned = false
                    newAttachment.userID = this.userID
                    this.attachmentData.attachments.push(newAttachment)                    
                } else {
                    const index = this.attachmentData.attachments.indexOf(this.editAttachIndex)
                    let editAttachment = this.attachmentData.attachments[index]
                    editAttachment.name = this.addAttachmentName
                    editAttachment.text = this.addAttachmentText
                    editAttachment.day = this.addAttachmentDay
                    editAttachment.isPinned = this.attachIsPinned         
                }
                db.collection('attachments').doc(this.tripID).update({
                    attachments: this.attachmentData.attachments
                }).then(() => {
                    this.addAttachmentName = null; this.addAttachmentText = null; this.addAttachmentDay = null
                    this.attachIsPinned = false
                    this.bottomNavigationIsEnabled = true
                    this.addAttachIsEnabled = null
                    this.editModeIsEnabled = null 
                    this.editAttachIndex = null
                    console.log("New attachment added/edited")
                    this.attachmentFeedback = null
                }).catch((err) => {
                    console.log(err)
                })
            } else {
                this.attachmentFeedback = "Please enter attachment text"
                console.log("Please enter attachment text")
            }
        },      

        addAttachmentLink() {
            if(this.addAttachmentText) {
                if(!this.editModeIsEnabled){ //If Edit Mode is not enabled save new attachment. Otherwise edit the specific attachment.        
                    let newAttachment = {}
                    newAttachment.type = "link"
                    newAttachment.name = this.addAttachmentName
                    newAttachment.linkPath = this.addAttachmentText
                    newAttachment.day = this.addAttachmentDay
                    newAttachment.isPinned = false
                    newAttachment.userID = this.userID
                    this.attachmentData.attachments.push(newAttachment)                
                } else {
                    const index = this.attachmentData.attachments.indexOf(this.editAttachIndex)
                    let editAttachment = this.attachmentData.attachments[index]
                    editAttachment.name = this.addAttachmentName
                    editAttachment.linkPath = this.addAttachmentText
                    editAttachment.day = this.addAttachmentDay
                    editAttachment.isPinned = this.attachIsPinned  
                }
                db.collection('attachments').doc(this.tripID).update({
                    attachments: this.attachmentData.attachments
                }).then(() => {
                    this.addAttachmentName = null; this.addAttachmentText = null; this.addAttachmentDay = null
                    this.attachIsPinned = false
                    this.bottomNavigationIsEnabled = true
                    this.addAttachIsEnabled = null                
                    this.editModeIsEnabled = null    
                    this.editAttachIndex = null
                    console.log("New attachment added/edited")
                    this.attachmentFeedback = null
                }).catch((err) => {
                    console.log(err)
                })
            } else {
                this.attachmentFeedback = "Please enter attachment text"
                console.log("Please enter attachment text")
            }            
        },      
        
        addAttachmentFile() {
            console.log("Attaching file")
            this.fileName = null
            this.filePath = null            
            let options = {
                android: {
                    extensions: this.extensions,
                    maxNumberFiles: 1
                },
                ios: {
                    extensions: this.extensions,
                    multipleSelection: false
                }
            }

            let mediafilepicker = new filePicker.Mediafilepicker()
            mediafilepicker.openFilePicker(options)

            mediafilepicker.on("getFiles", res => {
                let results = res.object.get('results')
                this.fileName = `${Date.now()}-${results[0].file.replace(/^.*[\\\/]/, '')}`
                this.filePath = results[0].file
                this.$nextTick(() => {
                    this.$refs.addFile.nativeView.focus();
                });                  
                console.log(`File ${this.fileName} / File path ${this.filePath}`)
            })
            mediafilepicker.on("error", function (res) {
                let msg = res.object.get('msg')
                if(msg){
                    this.addAttachIsEnabled = null
                    this.bottomNavigationIsEnabled = true
                    this.editModeIsEnabled = false
                    console.log(msg)
                }
            })
            mediafilepicker.on("cancel", function (res) {
                let msg = res.object.get('msg')
                if(msg){
                    this.addAttachIsEnabled = null
                    this.bottomNavigationIsEnabled = true
                    this.editModeIsEnabled = false
                    console.log(msg)
                }
            })
        },

        uploadAttachment() {
            if(this.fileName){  
                if(!this.editModeIsEnabled){ //If Edit Mode is not enabled save new attachment. Otherwise edit the specific attachment.
                    fstore.uploadFile({
                    remoteFullPath: `uploads/user_attachments/${this.fileName}`,
                    localFullPath: this.filePath,
                    metadata: this.metadata 
                    }) .then(async (uploadedFile) => {
                        await this.insertFirestoreAttachRef(this.fileName)
                        console.log("File uploaded:" + JSON.stringify(uploadedFile))
                    }) .catch(e => console.log("File upload error:" + e))                
                } else {
                    const index = this.attachmentData.attachments.indexOf(this.editAttachIndex)
                    let editAttachment = this.attachmentData.attachments[index]
                    editAttachment.name = this.addAttachmentName
                    editAttachment.day = this.addAttachmentDay
                    editAttachment.isPinned = this.attachIsPinned 
                    db.collection('attachments').doc(this.tripID).update({
                        attachments: this.attachmentData.attachments
                    }).then(() => {
                        this.addAttachmentName = null; this.addAttachmentText = null; this.addAttachmentDay = null
                        this.attachIsPinned = false
                        this.bottomNavigationIsEnabled = true
                        this.addAttachIsEnabled = null                
                        this.editModeIsEnabled = null    
                        this.editAttachIndex = null
                        console.log("Attachment edited")
                        this.attachmentFeedback = null
                    }).catch((err) => {
                        console.log(err)
                    })                       
                }                    
            } else {
                this.attachmentFeedback = "Couldn't upload file"
            }
        },

        async insertFirestoreAttachRef(fileName){
            // Get the attachment URL and store it into the trip's attachments Firestore DB for access. 
            let remotePath = `uploads/user_attachments/${fileName}`
            await fstore.getDownloadUrl({
                remoteFullPath: remotePath
            }) .then((url) => {
                console.log("URL ref created to the attachment's database document: " + url) 
                // Push attachment to the attachment array
                let newAttachment = {}
                newAttachment.type = "file"
                newAttachment.name = this.addAttachmentName
                newAttachment.attachmentUrl = url
                newAttachment.attachmentPath = remotePath
                newAttachment.day = this.addAttachmentDay
                newAttachment.isPinned = false
                newAttachment.userID = this.userID
                this.attachmentData.attachments.push(newAttachment)                  
                db.collection('attachments').doc(this.tripID).update({
                    attachments: this.attachmentData.attachments
                }).then(() => {
                    this.addAttachmentName = null; this.addAttachmentText = null; this.addAttachmentDay = null
                    this.attachIsPinned = false
                    this.bottomNavigationIsEnabled = true
                    this.addAttachIsEnabled = null                
                    this.editModeIsEnabled = null    
                    this.editAttachIndex = null
                    console.log("New attachment added")
                }).catch((err) => {
                    console.log(err)
                })              
            })
        },        

        manageAttachmentSelector(attachment) {
            let pinnedStateText = null //First check if the attachment is pinned or not to give the right text promp for pinning - either pin or unpin
            if(attachment.isPinned == false){
                pinnedStateText = "Pin attachment"
            } else {
                pinnedStateText = "Unpin attachment"
            }
            action("Edit attachment", "Cancel", [pinnedStateText, "Edit attachment", "Delete"])
            .then(result => {
                switch(result) {
                    case pinnedStateText:
                    this.pinAttachment(attachment)
                    break;
                    case "Edit attachment": 
                    this.editAttachment(attachment);
                    break;
                    case "Delete": 
                    this.deleteAttachment(attachment);
                    break;
                    case "Cancel": return null; break;
                }
            })
        },

        editAttachment(attachment) { //Entering edit mode
            switch(attachment.type) {
                case "note": 
                    this.addAttachIsEnabled = 'note';
                    this.bottomNavigationIsEnabled = false;
                    this.editModeIsEnabled = true;
                    this.editAttachIndex = attachment;
                    this.addAttachmentText = attachment.text;
                    this.addAttachmentName = attachment.name;
                    this.addAttachmentDay = attachment.day;
                    this.attachIsPinned = attachment.isPinned;
                    this.$nextTick(() => {
                        this.$refs.addNote.nativeView.focus();
                    });                               
                    console.log("Editing a note attachment")                                 
                    break;
                case "link": 
                    this.addAttachIsEnabled = 'link';   
                    this.bottomNavigationIsEnabled = false;   
                    this.editModeIsEnabled = true;     
                    this.editAttachIndex = attachment;    
                    this.addAttachmentText = attachment.linkPath;
                    this.addAttachmentName = attachment.name;
                    this.addAttachmentDay = attachment.day;
                    this.attachIsPinned = attachment.isPinned;
                    this.$nextTick(() => {
                        this.$refs.addLink.nativeView.focus();
                    });         
                    console.log("Editing a link attachment")                                      
                    break;
                case "file": 
                    this.addAttachIsEnabled = 'file';   
                    this.bottomNavigationIsEnabled = false;   
                    this.editModeIsEnabled = true;     
                    this.editAttachIndex = attachment;    
                    this.fileName = attachment.attachmentPath.replace(/^.*[\\\/]/, '');
                    this.addAttachmentName = attachment.name;
                    this.addAttachmentDay = attachment.day;
                    this.attachIsPinned = attachment.isPinned;
                    this.$nextTick(() => {
                        this.$refs.addFile.nativeView.focus();
                    });                 
                    console.log("Editing a file attachment")                       
                    break;
            }          
        },

        attachIsPinnedSwitch() {
            if(this.attachIsPinned){
                this.attachIsPinned = true
                console.log("Attachment is pinned")
            } else {
                this.attachIsPinned = false
                console.log("Attachment is unpinned")
            }
        },         

        pinAttachment(attachment) {
            const index = this.attachmentData.attachments.indexOf(attachment) 
            if(this.attachmentData.attachments[index].isPinned == false){
                this.attachmentData.attachments[index].isPinned = true
                db.collection('attachments').doc(this.tripID).update({
                    attachments: this.attachmentData.attachments
                }).then(() => {
                    console.log("Attachment removed")
                }) 
            } else {
                this.attachmentData.attachments[index].isPinned = false
                db.collection('attachments').doc(this.tripID).update({
                    attachments: this.attachmentData.attachments
                }).then(() => {
                    console.log("Attachment removed")
                }) 
            }
        },

        deleteAttachment(attachment) {
            const index = this.attachmentData.attachments.indexOf(attachment) 
            if(this.attachmentData.attachments[index].type == 'file'){ //If it's a file delete the attachments hosted file on FB Firestore
                console.log("Starting file deletion")
                fstore.deleteFile({
                    remoteFullPath: this.attachmentData.attachments[index].attachmentPath
                }).then(() => {
                    console.log("Attachment deleted from Firestore")
                })
            } 
            this.attachmentData.attachments.splice(index, 1)
            db.collection('attachments').doc(this.tripID).update({
                attachments: this.attachmentData.attachments
            }).then(() => {
                console.log("Attachment removed")
            })            
        },

    },

    created() {
        this.isLoading = true
        // Get user and document
        this.userID = this.$store.getters.getUser
        console.log("User retreived in Attachments is " + this.userID)
        console.log("Trip ID passed from Current Trip is " + this.tripID)     
        db.collection('attachments').doc(this.tripID).get().then(doc => { //Load attachments or create attachment document in Firebase if one doesn't already exist for the trip.
            if(doc.exists){
                this.attachmentData = doc.data()
                this.isLoading = false
                console.log("Attachments loaded " + JSON.stringify(doc.data()))
            } else {
                console.log("Attachment data doesnt exist.")               
            }
        })           
        // Insert possible file picker extensions depending on the platform        
        if (isIOS) {
            this.extensions = [kUTTypePDF, kUTTypeText] //TODO add more Apple extensions
        } else {
            this.extensions = ["xlsx", "xls", "doc", "docx", "ppt", "pptx", "pdf", "txt"]
        }         
    }
}
</script>

<style scoped>
    .action-bar {
        margin-bottom: 0;
    }
    .action-bar-text {
        margin-left: 35;
        margin-right: 25;
        margin-top: 30;
    }
    .basic-profile-info {
        margin: 25, 25;
        color: black;
    }
    .text-field {
        background-color: transparent;
        border-color: transparent;
    }     
    .trip-title {
        color: #2E2E2E;
        font-size: 20;
        font-weight: 500; 
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
        color: black; 
    }
    .trip-item-icon {
        margin-top: 15;
        margin-left: 30;
    }   
    .trip-item {
        margin-top: 15;
        margin-left: 0;
        margin-right: 25;
    }       
    .trip-profile-image {
      margin-top: 5em;
      border-radius: 50%;
    }     
    .action-button {
        background-color: #2E2E2E;
        color: white;
        border-radius: 7;
        font-size: 11;
        font-weight: 400;
        margin: 30, 30;
    }  
    .action-button-inverse {
        background-color: white;
        color: #2E2E2E;
        border-width: 1;
        border-color: #2E2E2E;
        border-radius: 7;
        font-size: 11;
        font-weight: 400;
        margin: 30, 30;
    }        
    .chat-box {
        background-color: #ebebeb;
        border-radius: 10;
        padding: 3, 3, 3, 3;
        margin-left: 5;
    }
    .chat-msg {
        font-size: 15;
        margin: 0, 10, 0, 5;
    }    
    .chat-time {
        font-size: 11;
        margin: 3, 10, 0, 5;
    }      
    .icon-image {
        margin-top: 15;
    }      
    .bottom-navigation {
        background-color: white;
        padding: 5, 25;
    }       
    /* From TripCurrendEdit itinerary. TODO align styles from Trip Current */
    .input-field{
        font-size: 15;
        margin: 0, 0, 0, 0;
    }    
    .trip-text-heading {
        color: #2E2E2E;
        font-size: 15;
        font-weight: 500;
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
    .section-heading {
        color: #2E2E2E;
        margin: 10, 25;
        font-size: 20; 
        font-weight: 500;      
    }                   
</style>