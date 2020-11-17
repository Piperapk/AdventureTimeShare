<template>
    <Page actionBarHidden="true" loaded="onLoaded" navigatedTo="onNavigatedTo">
        <GridLayout rows="auto, *, auto">
            <!-- Custom Actionbar --> 
            <StackLayout v-show="!isLoading" row="0" height="60">
                <GridLayout rows="auto" columns="auto, *, auto" >
                    <StackLayout col="0" margin="15, 0, 0, 25" verticalAlignment="top" height="40" width="40" @tap="$navigateBack" >
                        <Image horizontalAlignment="left" src="~/assets/images/icons/back_button.png" width="26.67" height="30" stretch="aspectFit" />
                    </StackLayout>                       
                    <GridLayout col="1" columns="auto, auto" class="action-button" margin="13, 25, 0, 0" horizontalAlignment="right" verticalAlignment="top" width="136" height="36" @tap="navigateToChatPage" >   
                        <Image col="0" src="~/assets/images/icons/main_chat_white.png" marginLeft="10" height="20" horizontalAlignment="left" verticalAlignment="center" stretch="aspectFit" />          
                        <Label col="1" marginLeft="10" verticalAlignment="center" text="Group Chat" /> 
                    </GridLayout>   
                    <StackLayout v-show="tripData.userID == userID" col="2" margin="15, 25, 0, 0" height="40" width="40" verticalAlignment="top" @tap="navigateToTripEdit" >
                        <Image horizontalAlignment="right" src="~/assets/images/icons/edit_profile.png" width="23.84" height="30" stretch="aspectFit" />  
                    </StackLayout>                                     
                </GridLayout>               
            </StackLayout>
            <!-- Main Content -->   
            <ScrollView v-show="!isLoading" row="1">
                <StackLayout>
                    <!-- Basic trip information -->  
                    <GridLayout rows="auto, auto, auto" columns="*" class="basic-profile-info" marginTop="0">
                        <StackLayout row="0" col="0" orientation="horizontal" @tap="openDirections(tripData.tripLocation)">
                            <Image class="icon-image" src="~/assets/images/icons/location_icon.png" height="20" horizontalAlignment="left" stretch="aspectFit"/>
                            <Label class="trip-text trip-item" marginLeft="10" :text="this.tripData.tripLocation.toUpperCase()" textWrap="true" />
                        </StackLayout>
                        <Label row="1" col="0" class="trip-text" :text="tripDates" textWrap="true" />
                        <Label row="2" col="0" class="trip-title" :text="tripData.tripTitle" textWrap="true" />
                    </GridLayout>          
                    <StackLayout height="1" backgroundColor="#E1E1E1"/>
                    <ScrollView orientation="horizontal">
                        <WrapLayout orientation="horizontal" itemHeight="145" style="background-color: #F2F2F2;">
                            <GridLayout rows="145" columns="100" v-for="(image, index) in tripData.tripMedia" :key="index" >
                                <Image class="trip-picture" horizontalAlignment="right" verticalAlignment="center" :src="image" width="100" height="145" stretch="aspectFill" />                    
                            </GridLayout>                                                        
                        </WrapLayout>           
                    </ScrollView>
                    <StackLayout height="1" backgroundColor="#E1E1E1"/>
                    <StackLayout class="basic-profile-info">
                        <Label class="section-heading-text" text="DESCRIPTION" textWrap="true" />
                        <TextView :text="this.tripData.tripDescription" class="text-field trip-text" editable="false" />                        
                    </StackLayout>       
                    <StackLayout height="1" backgroundColor="#E1E1E1"/>
                    <!-- Attachments   -->
                    <StackLayout class="basic-profile-info">
                        <Label class="section-heading-text" text="ATTACHMENTS" textWrap="true" /> 
                        <!-- Pinned attachments -->
                        <StackLayout>
                            <StackLayout orientation="horizontal">
                                <Image class="icon-image" margin="0" src="~/assets/images/icons/pin_colour_icon.png" opacity="1" height="20" horizontalAlignment="left" stretch="aspectFit"/>                                
                                <Label class="trip-text-heading" margin="10, 5" text="Pinned attachments" textWrap="true" />
                            </StackLayout>
                            <Label v-show="pinnedAttachmentsArray.length == 0" class="trip-text" marginBottom="10" text="No pinned attachments." textWrap="true" />
                            <StackLayout v-show="pinnedAttachmentsArray.length > 0" v-for="(attachment, index) in pinnedAttachmentsArray.slice(0, 3)" :key="index + 'pinnedAttachments'" @longPress="manageAttachmentSelector(attachment)">
                                <GridLayout rows="*" columns="25, *">
                                    <Image row="0" col="0" class="icon-image" margin="0" :src="attachmentTypeImage(attachment)" opacity="0.75" height="15" horizontalAlignment="left" stretch="aspectFit" @tap="manageAttachmentSelector(attachment)"/>
                                    <StackLayout row="0" col="1" class="grey-field-box" padding="5, 10" margin="0, 0, 5" @tap="openAttachment(attachment)" >
                                        <Label class="trip-text-heading" :text="`${attachmentTypeName(attachment)}: ${attachment.name ? attachment.name : ''}`" textWrap="true" />
                                        <Label class="trip-text" :text="attachmentTruncateText(attachment)" textWrap="true" />                  
                                        <Label v-show="attachment.day" class="trip-text" :text="`Day ${attachment.day} (${dayDates(attachment.day)})`" fontSize="11" textWrap="true" />                    
                                    </StackLayout>
                                </GridLayout>
                            </StackLayout>                              
                        </StackLayout>                       
                        <!-- Upcoming attachments -->
                        <Label class="trip-text-heading" margin="10, 0" text="Upcoming attachments" textWrap="true" />
                        <Label v-show="attachmentData.attachments.length == 0" class="trip-text" marginBottom="10" text="Add an attachment to see it here..." textWrap="true" />
                        <StackLayout v-for="(attachment, index) in upcomingAttachmentsArray.slice(0, 3)" :key="index + 'attachments'" @longPress="manageAttachmentSelector(attachment)">
                            <GridLayout rows="*" columns="25, *">
                                <Image row="0" col="0" class="icon-image" margin="0" :src="attachmentTypeImage(attachment)" opacity="0.75" height="15" horizontalAlignment="left" stretch="aspectFit" @tap="manageAttachmentSelector(attachment)"/>
                                <StackLayout row="0" col="1" class="grey-field-box" padding="10" margin="0, 0, 5" @tap="openAttachment(attachment)" >
                                    <Label class="trip-text-heading" :text="`${attachmentTypeName(attachment)}: ${attachment.name ? attachment.name : ''}`" textWrap="true" />
                                    <Label class="trip-text" :text="attachmentTruncateText(attachment)" textWrap="true" />     
                                    <Label v-show="attachment.day" class="trip-text" :text="`Day ${attachment.day} (${dayDates(attachment.day)})`" fontSize="11" textWrap="true" />                               
                                </StackLayout>
                            </GridLayout>
                        </StackLayout>    
                        <!-- Attachment actions -->
                        <GridLayout columns="*, auto">
                            <StackLayout col="0" orientation="horizontal" class="action-button" margin="10, 0, 0" width="136" height="36" horizontalAlignment="left" @tap="addAttachmentSelector()" >   
                                <Image src="~/assets/images/icons/attachment_white_icon.png" height="20" style="margin-left: 10;" horizontalAlignment="left" verticalAlignment="center" stretch="aspectFit" />          
                                <Label text="Add attachment" style="margin-left: 10;" verticalAlignment="center" /> 
                            </StackLayout>    
                            <StackLayout col="1" orientation="horizontal" class="action-button-inverse" margin="10, 0, 0" width="120" height="36" @tap="$goTo('attachments', {tripID, tripData, tripLength})" >             
                                <Label text="All attachments" style="margin-left: 10;" horizontalAlignment="left" verticalAlignment="center" /> 
                                <Image src="~/assets/images/icons/input_icon.png" height="20" style="margin-left: 10;" opacity="0.75" horizontalAlignment="left" verticalAlignment="center" stretch="aspectFit" />
                            </StackLayout>                                                      
                        </GridLayout>  
                        <!-- Add attachment --> 
                        <!-- Note -->
                        <StackLayout v-show="addAttachIsEnabled == 'note'" class="grey-field-box" margin="10, 0" padding="10">
                            <GridLayout columns="*, auto">
                                <Label v-show="!editModeIsEnabled" col="0" class="trip-text-heading" text="New note:" horizontalAlignment="left" textWrap="true" />
                                <Label v-show="editModeIsEnabled" col="0" class="trip-text-heading" text="Edit note:" horizontalAlignment="left" textWrap="true" />
                                <Image col="1" opacity="0.75" src="~/assets/images/icons/close_icon.png" horizontalAlignment="right" width="15" height="15" stretch="aspectFit" @tap="addAttachIsEnabled = null; editModeIsEnabled = false; attachmentFeedback = null"/>
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
                            <Label class="trip-text=" text="Title (optional):" textWrap="true" />
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
                        <StackLayout v-show="addAttachIsEnabled == 'link'" class="grey-field-box" margin="10, 0" padding="10">
                            <GridLayout columns="*, auto">
                                <Label v-show="!editModeIsEnabled" class="trip-text-heading" text="New web link:" horizontalAlignment="left" textWrap="true" /> 
                                <Label v-show="editModeIsEnabled" class="trip-text-heading" text="Edit web link:" horizontalAlignment="left" textWrap="true" /> 
                                <Image col="1" opacity="0.75" src="~/assets/images/icons/close_icon.png" horizontalAlignment="right" width="15" height="15" stretch="aspectFit" @tap="addAttachIsEnabled = null; editModeIsEnabled = false; attachmentFeedback = null"/>
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
                            <Label class="trip-text=" text="Title (optional):" textWrap="true" />
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
                        <Label v-show="attachmentFeedback" class="trip-text" color="#f55a42" :text="attachmentFeedback" textWrap="true" />                                                 
                    </StackLayout>                   
                    <StackLayout height="1" backgroundColor="#E1E1E1"/>
                    <!-- Trip Chat   -->
                    <StackLayout class="basic-profile-info">
                        <Label class="section-heading-text" text="CHAT SUMMARY" textWrap="true" /> 
                        <StackLayout style="margin-top: 15;" >
                            <GridLayout v-for="(message, index) in chatSummary" :key="index" width="100%" columns="40, *" rows="auto, 10" >
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
                        </StackLayout>
                        <StackLayout row="0" col="0" horizontalAlignment="right">
                            <StackLayout orientation="horizontal" class="action-button-inverse" margin="15, 0, 0" width="136" height="36" @tap="navigateToChatPage" >   
                                <Image src="~/assets/images/icons/main_chat.png" height="20" style="margin-left: 10;" horizontalAlignment="left" verticalAlignment="center" stretch="aspectFit" />          
                                <Label text="Group Chat" style="margin-left: 10;" verticalAlignment="center" /> 
                            </StackLayout>
                        </StackLayout>                                            
                    </StackLayout>
                    <StackLayout height="1" backgroundColor="#E1E1E1"/>
                    <!-- Members -->
                    <StackLayout class="basic-profile-info">
                        <Label class="section-heading-text" text="MEMBERS" textWrap="true" />   
                        <Label class="trip-text" :text="freeSpaces + ' free spaces left.'" textWrap="true" /> 
                        <WrapLayout orientation="horizontal" >                   
                            <GridLayout rows="65" columns="65" v-for="(member, index) in membersProfileData" :key="index" >
                                <Image row="0" col="0" class="trip-profile-image" horizontalAlignment="left" :src="member.profileImage" width="50" height="50" stretch="aspectFill" @tap="navigateToProfile(member.id)" />
                                <Image row="0" col="0" v-show="index > 0 && removeIsEnabled" margin="4, 4, 0, 0" opacity="0.75" src="~/assets/images/icons/close_icon.png" horizontalAlignment="right" verticalAlignment="top" width="15" height="15" stretch="aspectFit" @tap="removeMember(member)" />
                            </GridLayout> 
                            <GridLayout rows="65" columns="65" v-for="(free, index) in freeSpaces ? freeSpaces : 0" :key="`A` + index" >
                                <Image row="0" col="0" v-show="freeSpaces > 0" horizontalAlignment="left" src="~/assets/images/icons/add.png" opacity="0.75" width="50" height="50" stretch="aspectFit" @tap="addMemberSelector" />                     
                            </GridLayout>
                        </WrapLayout>    
                        <Label class="trip-text" :text="memberNames" textWrap="true" />
                        <Label v-show="memberShowSearch" class="trip-text-heading" marginTop="10" text="Search and pick app members by email:" textWrap="true" /> 
                        <GridLayout columns="auto" v-for="(member, index) in searchPhraseReturn" :key="index + 'memberSearch'">
                            <StackLayout :isEnabled="isEnabled" orientation="horizontal" class="action-button-inverse" margin="5, 15, 0, 0" height="36" @tap="addMember(member)" >   
                                <Label class="trip-text" marginLeft="10" v-show="index <= 4" :text="searchPhraseReturn[index].email" textWrap="true" horizontalAlignment="left" verticalAlignment="center" />                                
                                <Image src="~/assets/images/icons/plus_icon.png" height="15" opacity="0.75" margin="0, 10" horizontalAlignment="left" verticalAlignment="center" stretch="aspectFit" />          
                            </StackLayout>  
                        </GridLayout>   
                        <Label v-show="searchFeedback" class="trip-text" marginTop="10" color="#f55a42" :text="searchFeedback" textWrap="true" /> 
                        <TextField ref="search" class="trip-text" v-show="memberShowSearch" v-model="searchPhrase" hint="Search for a friend by email..." returnKeyType="search" @blur="searchPhrase = null" @textChange="onSearchTextChanged" />                        
                        <!-- Members actions --> 
                        <WrapLayout orientation="horizontal">
                                <StackLayout orientation="horizontal" class="action-button-inverse" margin="15, 15, 0, 0" height="36" @tap="addMemberSelector" >   
                                    <Label text="Add member" style="margin-left: 10;" verticalAlignment="center" /> 
                                    <Image src="~/assets/images/icons/plus_icon.png" height="15" opacity="0.75" margin="0, 10" horizontalAlignment="left" verticalAlignment="center" stretch="aspectFit" />          
                                </StackLayout>      
                                <StackLayout orientation="horizontal" class="action-button-inverse" margin="15, 15, 0, 0" height="36" @tap="removeIsEnabled ? removeIsEnabled = false : removeIsEnabled = true" >   
                                    <Label :text="removeIsEnabled ? 'Cancel removal' : 'Remove member'" margin="0, 10" verticalAlignment="center" />        
                                </StackLayout>                                                          
                                <GridLayout columns="auto" orientation="horizontal" class="action-button-inverse" margin="15, 15, 0, 0" height="36" @tap="leaveTrip" >            
                                    <Label text="Leave Trip" margin="0, 10" verticalAlignment="center" /> 
                                </GridLayout>  
                                <GridLayout v-show="tripData.userID == userID" columns="auto" orientation="horizontal" class="action-button-inverse" margin="15, 15, 0, 0" height="36" @tap="deleteTrip" >            
                                    <Label text="Delete Trip" margin="0, 10" verticalAlignment="center" /> 
                                </GridLayout>                                                                                 
                        </WrapLayout>  
                        <Label v-show="feedback" class="trip-item" :text="feedback" textWrap="true" /> 
                    </StackLayout>  
                    <StackLayout height="1" backgroundColor="#E1E1E1"/>
                    <!-- Meeting point -->
                    <StackLayout class="basic-profile-info" marginTop="10">    
                        <GridLayout :isEnabled="tripData.tripMeetingLocation != ''" rows="auto, auto" columns="*" @tap="openDirections(tripData.tripMeetingLocation)" >
                            <Image row="0" col="0" class="icon-image" src="~/assets/images/icons/location_icon.png" height="20" horizontalAlignment="left" stretch="aspectFit"/>
                            <Label row="0" col="0" class="trip-text trip-item-icon" text="Group's preferred meeting point" textWrap="true" />
                            <Label row="1" col="0" class="trip-text" style="margin-top: 10;" :text="tripData.tripMeetingLocation ? '- ' + tripData.tripMeetingLocation : '- Not set by the trip organiser'" textWrap="true" />                        
                        </GridLayout>                          
                    </StackLayout>   
                    <StackLayout height="1" backgroundColor="#E1E1E1"/>
                    <!-- Costings -->
                    <StackLayout class="grey-field">
                        <StackLayout>
                            <Label class="section-heading-text" margin="0, 25, 10"  text="Costs (per person)" textWrap="true" /> 
                            <Label class="trip-text" style="background-color: #FFC156; color: black; padding: 5, 25;" text="Costs are approximate and can vary depending on when the final bookings and purchases are made between the group." textWrap="true" />  
                            <Label class="trip-text" color="black"  margin="15, 25, 0" horizontalAlignment="left" text="Items:" textWrap="true" />
                        </StackLayout>
                        <GridLayout rows="auto" columns="*" margin="10, 25, 0" v-for="(cost, index) in tripData.tripCostItems" :key="index + `cost`" >
                            <Label row="0" col="0" class="trip-text" horizontalAlignment="left" :text="cost.name + ': ' + $currency.display(cost.price/membersCount, tripData.tripCurrency)" textWrap="true" />
                        </GridLayout>   
                        <Label class="trip-text" margin="10, 25, 0" color="black" :text="'Total cost: ' + $currency.display(totalCost, tripData.tripCurrency)" textWrap="true" />                                            
                    </StackLayout>
                    <StackLayout height="1" backgroundColor="#E1E1E1" />  
                    <!-- Trip overview -->
                    <StackLayout class="grey-field">
                        <Label text="Trip overview" class="section-heading-text basic-profile-info" marginTop="5" marginBottom="0" textWrap="true" />
                        <GridLayout rows="auto, auto" columns="*, *" class="basic-profile-info" marginTop="15" marginBottom="15" >

                            <StackLayout row="0" col="0" marginBottom="15" marginRight="10">
                                <StackLayout orientation="horizontal">
                                    <Image margin="0" src="~/assets/images/icons/transport_icon.png" height="15" horizontalAlignment="left" verticalAlignment="center" style="margin-bottom: 5;" stretch="aspectFit"/>
                                    <Label class="trip-text" marginLeft="10" fontWeight="500" text="TRANSPORT" textWrap="true" />
                                </StackLayout>
                                <Label v-show="tripData.tripTransport" class="trip-text" marginRight="5" :text="tripData.tripTransport" textWrap="true" />
                                <Label class="trip-text" marginRight="5" :text="numberOfDrivers + ' Driver(s) in the group'" textWrap="true" />                                
                            </StackLayout>

                            <StackLayout row="0" col="1" marginBottom="15" marginRight="10">
                                <StackLayout orientation="horizontal">
                                    <Image margin="0" src="~/assets/images/icons/activity_level.png" height="20" horizontalAlignment="left" verticalAlignment="top" stretch="aspectFit"/>
                                    <Label class="trip-text" marginLeft="10" fontWeight="500" text="ACTIVITY LEVEL" textWrap="true" />
                                </StackLayout>
                                <Label class="trip-text" marginRight="5" :text="tripData.tripActivityLevel" textWrap="true" />                                
                            </StackLayout>

                            <StackLayout row="1" col="0" colSpan="2" marginBottom="0" >
                                <StackLayout orientation="horizontal">
                                    <Image margin="0" src="~/assets/images/icons/list_red_icon.png" height="20" horizontalAlignment="left" verticalAlignment="top" stretch="aspectFit"/>
                                    <Label class="trip-text" marginLeft="10" fontWeight="500" text="NOT INCLUDED (in costs)" textWrap="true" />
                                </StackLayout>
                                <Label class="trip-text" marginRight="5" :text="tripData.tripOtherItems.join(', ')" textWrap="true" />                                
                            </StackLayout>
                        </GridLayout>   
                    </StackLayout>
                    <!-- Itinerary -->    
                    <Label class="section-heading" text="Itinerary" /> 
                    <StackLayout class="grey-field">
                        <StackLayout class="basic-profile-info" marginTop="0"  v-show="tripData.tripItineraryEnabled" >
                            <ItineraryInput :tripLength="tripLength" :tripData="tripData" />
                        </StackLayout>                        
                    </StackLayout>
                    <StackLayout height="70" backgroundColor="transparent"/>          
                </StackLayout>
            </ScrollView>
            <!-- Bottom navigation -->
            <GridLayout row="2" rows="auto, auto" columns="*, *, *" class="bottom-navigation" height="60" >
                <Image row="0" col="0" marginTop="5" src="~/assets/images/icons/main_explore.png" horizontalAlignment="center" height="25" width="50" stretch="aspectFit" @tap="$goTo('feed')" />
                <Label row="1" col="0" horizontalAlignment="center" text="EXPLORE" textWrap="true" fontSize="13" @tap="$goTo('feed')" />
                <Image row="0" col="1" marginTop="5" src="~/assets/images/icons/main_trips_active.png" horizontalAlignment="center" height="25" stretch="aspectFit" @tap="$goTo('trips')" />
                <Label row="1" col="1" horizontalAlignment="center" text="TRIPS" textWrap="true" fontSize="13" @tap="$goTo('trips')" /> 
                <Image row="0" col="2" marginTop="5" src="~/assets/images/icons/main_chat.png" horizontalAlignment="center" height="25" stretch="aspectFit" @tap="$goTo('chat')" />
                <Label row="0" col="2" v-show="$store.getters.getChatNotification" margin="1, 0, 0, 25" backgroundColor="#e32b1e" borderRadius="50" horizontalAlignment="center" verticalAlignment="top" height="10" width="10" stretch="aspectFit" @tap="$goTo('chat')" />
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

import * as filePicker from 'nativescript-mediafilepicker'
import * as fileSystemModule from 'file-system'
import { isIOS } from 'tns-core-modules/ui/core/view/view'

import AttachmentOpen from './elements/AttachmentOpen'
import ItinerarySelector from './elements/ItinerarySelector'
import ItineraryInput from './elements/ItineraryInput'

export default {
    name: 'TripCurrent',
    props: ['tripID'],
    components: {ItineraryInput},
    data() {
        return {
            userID: null,
            membersProfileData: [], //for storing the image paths to the profile pictures of the trip members, their names and other data

            searchPhrase: null,
            searchPhraseReturn: [], 
            memberShowSearch: false,            
            appUsers: [], //all users in the app to filter through search                       

            feedback: null,
            searchFeedback: null,  
            isLoading: false,
            isEnabled: true,
            removeIsEnabled: false,
            chatIsEnabled: true,
            bottomNavigationIsEnabled: true, //Shows or hides the bottom navigation           

            chatData: {
                chatMessages:[{chatMsgRead:[],chatMsg:"Chat message",chatMsgTime:1583593539105,userID:"pEfyQkmr7VdKAPtmg1ObLhN0gYF3"}]
            },
            
            tripData: {
                tripOtherItems: [],
                tripCostItems: [],
                tripMembers: [],
                tripMedia: [],
                tripLocation: "",
                tripDateFrom: new Date(),
            },

            attachmentData: {
                attachments: []
            },
            addAttachIsEnabled: [], //To store the type of attachment and show the relevant UI elements
            editModeIsEnabled: false, //When entering edit mode it shows and hides the relevant UI elements
            addAttachmentName: null,
            addAttachmentText: null, 
            addAttachmentDay: null,  
            attachIsPinned: false, //Stores isPinned value when editing an attachment      
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
        tripAndChatData: function() { //combine trip and chat data so a redirect to the trip group chat is possible. Introduces slight delay in making the button work.
            let currentUserChats = this.membersProfileData[0]
            currentUserChats = currentUserChats.chats.filter(chat => chat.chatID == this.tripData.tripID)
            let combinedData = this.tripData
            combinedData.chatID = currentUserChats[0].chatID
            return combinedData
        },

        tripLength: function() { //Creates and updates an array of days depending on the length of the trip
            if(this.tripData.tripDateFrom && this.tripData.tripDateTo){
                const oneDay = 1000 * 60 * 60 * 24
                let dateDifference = Math.abs(this.tripData.tripDateTo - this.tripData.tripDateFrom)
                let tripLength = Math.round(dateDifference / oneDay) + 1
                return tripLength            
            }        
        },    
        
        totalCost: function() {
            let cost = this.tripData.tripCost
            return Number.parseFloat(cost/this.membersCount)
        },        

        freeSpaces: function() {
            return this.tripData.tripSpaces - this.tripData.tripMembers.length 
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

        membersCount: function() {
            return this.tripData.tripMembers.length
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
        
        chatSummary: function() {
            let summary = []
            if(this.chatData.chatMessages.length == 0){ //if there's no chat messages fill in an empty object
                summary = {chatMessages: [{chatMsg:"", chatMsgTime:"" ,userID: ""}]}
                return summary
            } else {
                if(this.chatData.chatMessages.length == 1){ //if theres 1 messages show the last message
                    summary.push(this.chatData.chatMessages.slice(-1)[0])
                    return summary                    
                } else { //if there's more than 1 message in the chat show the last two messages
                    summary.push(this.chatData.chatMessages.slice(-2)[0])
                    summary.push(this.chatData.chatMessages.slice(-1)[0])
                    return summary                                           
                }
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

        navigateToTripEdit() {
            this.$goTo('tripcurrentedit', {tripID: this.tripID})
        },     

        navigateToChatPage() {
            if(this.membersProfileData[0].chats){ //checks if the members' data is loaded before navigating as props relaying on that data are passed to the chat page
                this.$goTo('chatcurrent', {tripAndChatData: this.tripAndChatData})
            } else {
                console.log("Can't navigate at the moment")
            }

        },        

        navigateToProfile(member) {
            if(member != "Anonymous"){
                this.$goTo('profilepreview', {sourceUserId: member})                
            }
        },

        msgTime(index) {
            const time = new Date(this.chatSummary[index].chatMsgTime)      
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
            if(!result){
                return "~/assets/images/icons/profile_icon.png"
            } else {
                return result.profileImage
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
        
        openDirections(place) {//Use Google Places API to search for the location
            let searchPhrase = encodeURIComponent(place)
            console.log(searchPhrase)
            this.$utils.openUrl('https://www.google.com/maps/search/?api=1&query=' + searchPhrase)
        },

        addMemberSelector() {
            action("Add new trip member", "Cancel", ["Add a friend", "Add an anonymous friend (one who doesn't use the app)"])
            .then(result => {
                switch(result) {
                    case "Add a friend": this.memberShowSearch = true; this.focusOnAddMember(); break
                    case "Add an anonymous friend (one who doesn't use the app)": return this.addAnonMember(); break
                    case "Cancel": return null; break
                }
            })
        },   

        onSearchTextChanged() { //Dinamically populate an array with search results for autocomplete
            if(this.searchPhrase && this.searchPhrase.length >= 6){
                this.searchPhraseReturn = this.appUsers.filter(user => {
                    return user.email.includes(this.searchPhrase.toLowerCase())
                })  
            } else {
                this.searchPhraseReturn = []
            }                   
        },        
        
        focusOnAddMember() {
            this.$nextTick(() => {
                this.$refs.search.nativeView.focus()
            })
        },       
        
        clearSearchText() {
            this.searchPhrase = null  
            this.memberShowSearch = false          
        },    
        
        addMember(data) { 
            this.isEnabled = false
            db.collection('users').doc(data.id).get()
            .then(doc => {
                let isMatch = this.membersProfileData.find(obj => obj.id === doc.id) //checking if an member is not already added
                if(!isMatch) { //add member
                    this.tripData.tripMembers.push(doc.id)
                    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
                    this.$store.dispatch('getAnyUserExtraData', doc.id).then(() => {
                        let userExtraData = this.$store.getters.getAnyUserExtraData //get the user's extra data favs, trips, friends
                        let member = {}
                        member.id = doc.id           
                        member.name = doc.data().userFirstName
                        member.profileImage = doc.data().userProfileImages[0]
                        member.friends = userExtraData.userFriends
                        member.chats = userExtraData.userChats
                        this.membersProfileData.push(member) 
                        //Add member to trip's data
                        db.collection('trips').doc(this.tripData.tripID).update({
                            tripMembers: this.tripData.tripMembers
                        })
                        this.searchFeedback = null
                        this.searchPhrase = null
                        this.memberShowSearch = false
                        this.isEnabled = true
                        this.sendMessage(member) //send the member a trip invitation to join, until then they'll be just a placeholder in the trip
                        console.log("Name added")                                                                  
                    })
                } else {
                    this.searchFeedback = "Trip member already added!"
                    this.isEnabled = true
                    console.log("Name already exists")
                }                
            })         
        },    

        async sendMessage(member) {
            console.log("Sending invite message")
            //See if the direct/private chat doesn't laready exists in the organiser's chats
            let inviterIndex = this.membersProfileData.findIndex(member => member.id == this.userID) //Get the inviter chats from TripPreview to safe a Firebase call
            let chatIndex = this.membersProfileData[inviterIndex].chats.findIndex(chat => chat.chatID.includes(member.id)) //See if the user has their ID in the organiser's chats to detect if there's already a direct chat created
            let inviteMessage = `Hi ${member.name}, my name is ${this.membersProfileData[inviterIndex].name} and I would like for you to join my trip.` //Set the first message as the trip join request message

            if(chatIndex < 0){
                //Send the request and create a new direct chat between the users
                let chatName = member.id + this.userID
                console.log("Chat ID is " + chatName)

                let chatMembers = []
                chatMembers.push(member.id)
                chatMembers.push(this.userID)

                let chatMessages = []
                let msg = {}
                msg.chatMsg = inviteMessage //the trip join request message and first message of the chat 
                msg.chatMsgRead = [this.userID]
                msg.chatMsgTime = Date.now()
                msg.userID = this.userID  
                msg.inviteForUserID = member.id
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
                confirm({
                    title: `You've invited ${member.name} to the trip!`,
                    message: `Go can go to your chats where you can further message ${member.name}.`,
                    okButtonText: "OK"
                }) 
            } else {
                //Send the request and update the existing chat
                console.log("There's already a private chat between the two users")

                let msg = {}
                msg.chatMsg = inviteMessage //the trip join request message
                msg.chatMsgRead = [this.userID]
                msg.chatMsgTime = Date.now()
                msg.userID = this.userID  
                msg.inviteForUserID = member.id
                msg.tripRequestID = this.tripData.tripID  
                msg.tripRequestStatus = 'pending'

                await db.collection('chats').doc(this.membersProfileData[inviterIndex].chats[chatIndex].chatID).update({ //Update the chat document
                    chatMessages: firebase.firestore.FieldValue.arrayUnion(msg)
                }).then(() => {
                    console.log("Chat document updated")
                })       
                confirm({
                    title: `You've invited ${member.name} to the trip!`,
                    message: `Go can go to your chats where you can further message ${member.name}.`,
                    okButtonText: "OK"
                })                     
            }
        },        
        
        addAnonMember() { //add annonymous member to the trip and insert it into Firebase
            let member = {}
            member.id = "Anonymous"           
            member.name = "Anonymous Buddy"
            member.profileImage = "~/assets/images/icons/profile_icon.png"
            this.tripData.tripMembers.push("Anonymous")
            db.collection('trips').doc(this.tripData.tripID).update({
                tripMembers: this.tripData.tripMembers
            }).then(() => {
                db.collection('chats').doc(this.tripData.tripID).update({
                    chatMembers: this.tripData.tripMembers
                })                
                this.membersProfileData.push(member)             
                this.searchFeedback = null
                this.searchPhrase = null
                this.memberShowSearch = false
                console.log("Annonymous member added")
            })
        },      
        
        removeMember(item) { //item is the member
            const isCreator = this.tripData.userID == item.id
            const isCurrentUser = this.userID == item.id
            if(!isCreator && !isCurrentUser){ //check if it's not the creator or the current user and then remove the select user from the trip
                const indexMemberData = this.membersProfileData.indexOf(item)
                const indexMember = this.tripData.tripMembers.indexOf(item.id)                               
                db.collection('trips').doc(this.tripID).update({ //Remove user as a trip member
                    tripMembers: firebase.firestore.FieldValue.arrayRemove(item.id)
                }).then(() => {
                    if(item.id != "Anonymous"){
                        let filteredChats = this.membersProfileData[indexMemberData].chats.filter(chat => 
                            chat.chatID != this.tripID
                        )                                        
                        db.collection('user_data').doc(item.id).update({ //Remove the trip from their user data
                            userTrips: firebase.firestore.FieldValue.arrayRemove(this.tripID),
                            userChats: filteredChats
                        }) 
                        db.collection('chats').doc(this.tripID).update({ //Remove user as the trip's chat member
                            chatMembers: firebase.firestore.FieldValue.arrayRemove(item.id)
                        })  
                        //Update current UI
                        this.membersProfileData.splice(indexMemberData, 1)
                        this.tripData.tripMembers.splice(indexMember, 1)  
                        this.removeIsEnabled = false                           

                        //If they've only have been send a pending invite, decline it.
                        for(let i = 0; i < this.membersProfileData.length; i++) //Check all users chats for the invite sent to the user and decline it. Otherwise they can be removed from the trip but still accept it at a later date.
                        {
                            if(this.membersProfileData[i].id != item.id) //if the user is not the one being removed
                            {
                                console.log("Invite remover: " + this.membersProfileData[i].id)
                                let chatIndex = this.membersProfileData[i].chats.findIndex(chat => chat.chatID.includes(item.id)) //See if the removed user has their ID in the remover's chats to detect if there's already a direct chat created
                                if(chatIndex < 0)
                                {
                                    console.log("There is no invite to delete as the users don't have a common chat")
                                } 
                                else 
                                {
                                    console.log("Common chat found, searching for invites and declining them")
                                    let privateChatID = this.membersProfileData[i].chats[chatIndex].chatID
                                    console.log("privateChatID: " + privateChatID)       

                                    db.collection('chats').doc(privateChatID).get() //Get the private chat and then ammend the message from pending to declined
                                    .then(doc => {
                                        let chatData = doc.data()
                                        let inviteMessages = chatData.chatMessages.filter(message => message.tripRequestStatus == "pending" && message.tripRequestID == this.tripData.tripID) 
                                        console.log("inviteMessages " + JSON.stringify(inviteMessages))
                                        for(let j = 0; j < inviteMessages.length; j++)
                                        {
                                            let msgIndex = chatData.chatMessages.indexOf(inviteMessages[j])
                                            console.log("msgIndex " + msgIndex)
                                            chatData.chatMessages[msgIndex].tripRequestStatus = 'declined'
                                        }                                   
                                        db.collection('chats').doc(privateChatID).update({ 
                                            chatMessages: chatData.chatMessages
                                        }) 
                                        console.log("Invite declined")
                                    })                                        
                                }
                            }
                        }                 
                        console.log("Member removed")
                    } else {
                        this.membersProfileData.splice(indexMemberData, 1)
                        this.tripData.tripMembers.splice(indexMember, 1)      
                        db.collection('chats').doc(this.tripID).update({
                            chatMembers: this.tripData.tripMembers
                        })     
                        this.removeIsEnabled = false                                   
                        console.log("Anonymous member removed")                       
                    }
                })                         
            } else {
                this.removeIsEnabled = false
                console.log("You're a creator or current user of the trip. You can remove other users")
            }                 
        },        

        deleteTrip(){
            this.chatIsEnabled = false
            confirm({
            title: "Do you want to delete this trip?",
            message: "If deleted, no data can be restored.",
            okButtonText: "Yes",
            cancelButtonText: "Cancel"
            }).then(result => {
                if(result) {
                    let trip = this.tripID
                    for(let i = 0; i < this.tripData.tripMembers.length; i++){ //remove trip id from user's Firebase data 
                        if(this.tripData.tripMembers[i] != "Anonymous"){
                            console.log(this.tripData.tripMembers[i])
                            //get index of member to filter their chats and remove the chat for this trip
                            const index = this.membersProfileData.findIndex(member => member.id == this.tripData.tripMembers[i]) 
                            let filteredChats = this.membersProfileData[index].chats.filter(chat => 
                                chat.chatID != this.tripID
                            ) 
                            //remove the trip and chat from the user           
                            db.collection('user_data').doc(this.tripData.tripMembers[i]).update({
                            userTrips: firebase.firestore.FieldValue.arrayRemove(trip),
                            userChats: filteredChats
                            })             
                            console.log("Trip removed from user " + this.tripData.tripMembers[i])                        
                        }
                    }   
                    for(let j = 0; j < this.tripData.tripMediaPaths.length; j++) { //delete Firestore files associated with the trip
                        fstore.deleteFile({
                        remoteFullPath: this.tripData.tripMediaPaths[j]
                        })
                        console.log(this.tripData.tripMediaPaths[j] + " deleted")
                    }    
        
                    db.collection('trips').doc(trip).delete() //delete trip
                    .then(async () => {
                        console.log("Trip deleted.")
                        await this.$goTo('feed', {}, { clearHistory: true })
                        await db.collection('chats').doc(trip).delete() //delete chat    
                    })                        
                } else {
                    this.chatIsEnabled = true
                    console.log("Trip deletion cancelled")
                }
            })            
        },
        
        leaveTrip() {
            if(this.tripData.userID == this.userID){
                console.log("Can't leave trip as you're the creator")
                this.feedback = "You're the trip's creator you can only delete it. You can't leave it"
            } else {
                const index = this.membersProfileData.findIndex(member => member.id == this.userID)
                let filteredChats = this.membersProfileData[index].chats.filter(chat => 
                    chat.chatID != this.tripID
                )
                db.collection('user_data').doc(this.userID).update({
                userTrips: firebase.firestore.FieldValue.arrayRemove(this.tripID),
                userChats: filteredChats
                }) 
                db.collection('trips').doc(this.tripID).update({
                tripMembers: firebase.firestore.FieldValue.arrayRemove(this.userID)
                })   
                db.collection('chats').doc(this.tripID).update({
                chatMembers: firebase.firestore.FieldValue.arrayRemove(this.userID)
                })                               
                console.log("Trip left")
                this.feedback = null
                this.$goTo('feed')
            }
        }
    },

    created() {
        this.isLoading = true
        // Get user and document
        this.userID = this.$store.getters.getUser
        console.log("User retreived from Trip Current " + this.userID)
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
                                this.isLoading = false
                                this.membersProfileData.push(member)                                  
                            })                   
                        })
                    }
                }             
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
        db.collection('users').get().then(querySnapshot => {//Get users for search
          querySnapshot.forEach(doc => {
                let user = {}
                user.id = doc.id
                if(!doc.data().userEmail){
                    user.email = ""
                } else {
                    user.email = doc.data().userEmail
                }                               
                this.appUsers.push(user)
            })
        })       
        db.collection('chats').doc(this.tripID).onSnapshot(doc => { //load live chat data
            if(this.chatIsEnabled && doc.exists){
                this.chatData = doc.data()
                console.log("Live chat data loaded " + doc.data())
            } else {
                this.$goTo('trips', {}, { clearHistory: true })
                console.log("Live chat data not enabled")                
            }
        })
        db.collection('attachments').doc(this.tripID).get().then(doc => { //Load attachments or create attachment document in Firebase if one doesn't already exist for the trip.
            if(doc.exists){
                this.attachmentData = doc.data()
                console.log("Attachments loaded " + JSON.stringify(doc.data()))
            } else {
                console.log("Attachment data doesnt exist. Creating new attachment document")  
                db.collection('attachments').doc(this.tripID).set(({
                    attachments: []
                })).then(() => {
                    console.log("New attachment document created for this trip")
                })              
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
    /* From TripCurrendEdit itinerary. TODO align styles from TripCurrendEdit */
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