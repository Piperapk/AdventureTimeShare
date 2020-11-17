<template>
    <Page actionBarHidden="true">
        <GridLayout rows="auto, *" >
          <!-- Custom Actionbar -->
          <StackLayout row="0" height="60" v-show="!isLoading">
            <GridLayout rows="auto" columns="auto, *, auto" >
                <StackLayout col="0" margin="15, 0, 0, 25" @tap="$navigateBack" height="40" width="40" >
                    <Image horizontalAlignment="left" verticalAlignment="center" src="~/assets/images/icons/back_button.png" width="26.67" height="30" stretch="aspectFit" />
                </StackLayout>                
                <Label col="1" margin="15, 0 , 0, 0" fontSize="20" color="black" text="Create a new adventure" textWrap="true" horizontalAlignment="center" verticalAlignment="center" height="40" /> 
                <Image col="2" horizontalAlignment="right" verticalAlignment="top" margin="15, 25, 0, 0" src="~/assets/images/icons/main_trips.png" width="40" height="30" stretch="aspectFit" />                
            </GridLayout>               
          </StackLayout>   
          <!-- Main Content -->         
            <ScrollView row="1">
                <StackLayout>
                    <StackLayout v-show="!isLoading">
                        <!-- Basic Information -->
                        <StackLayout class="grey-field-button">
                            <Label class="trip-text-heading" marginLeft="15" text="Where to" textWrap="true" /> 
                            <Label class="trip-text" fontSize="11" margin="0, 0, 0, 15" text="(required)" textWrap="true" /> 
                            <GridLayout columns="auto, *">
                                <Image row="0" col="0" class="trip-icon" src="~/assets/images/icons/location_icon.png" height="20" horizontalAlignment="left" stretch="aspectFit"/>
                                <TextField row="0" col="1" class="input-field" margin="0, 10, 0, 10" v-model="tripLocation" returnKeyType="done" editable="true" hint="Enter trip location..." @textChange="searchFieldChanged()" @focus="placesAutoHide = false" @blur="placesAutoHide = true" />  
                            </GridLayout> 
                            <StackLayout v-show="!placesAutoHide" class="search-text" v-for="(place, index) in places" :key="index"  >
                                <Label :text="place.description" textWrap="true" @tap="getPlace(place)"/>
                            </StackLayout>                     
                        </StackLayout>
                        <GridLayout rows="auto, auto, auto" columns="*, *" class="basic-profile-info">
                            <Label row="0" col="0" class="trip-text-heading" text="Date from" textWrap="true" /> 
                            <Label row="1" col="0" class="trip-text" fontSize="11" margin="0" text="(required)" textWrap="true" /> 
                            <StackLayout row="2" col="0" orientation="horizontal">
                                <Image class="trip-icon" marginLeft="0" src="~/assets/images/icons/calendar_icon.png" height="15" horizontalAlignment="left" stretch="aspectFit"/>
                                <DatePickerField class="input-field" :minDate="currentDate" @dateChange="onDateChangeFrom" hint="dd/mm/yy" dateFormat="dd MMM yyyy" style="margin: 0, 15;" ></DatePickerField>
                            </StackLayout>
                            <Label row="0" col="1" class="trip-text-heading" text="To" textWrap="true" /> 
                            <Label row="1" col="1" class="trip-text" fontSize="11" margin="0" text="(required)" textWrap="true" /> 
                            <StackLayout row="2" col="1" orientation="horizontal">
                                <Image class="trip-icon" marginLeft="0" src="~/assets/images/icons/calendar_icon.png" height="15" horizontalAlignment="left" stretch="aspectFit"/>
                                <DatePickerField class="input-field" :minDate="tripDateFrom" @dateChange="onDateChangeTo" hint="dd/mm/yy" dateFormat="dd MMM yyyy" style="margin: 0, 15;" ></DatePickerField>
                            </StackLayout>                    
                        </GridLayout>
                        <StackLayout class="grey-field">
                            <Label class="trip-text" margin="0" :text="tripDuration" v-show="tripDateFrom && tripDateTo" horizontalAlignment="center" hint="How many days is the trip..." />
                        </StackLayout>
                        <StackLayout class="basic-profile-info">
                            <Label class="trip-text-heading" text="Trip title" textWrap="true" /> 
                            <Label class="trip-text" fontSize="11" margin="0" text="(required)" textWrap="true" />                         
                            <TextView ref="dissmissPlacesFocus" class="input-field" v-model="tripTitle" hint="Awesome, epic adventure, somewhere?" maxLength="60" returnKeyType="done" />  
                        </StackLayout>
                        <StackLayout class="basic-profile-info">
                            <Label class="trip-text-heading" marginBottom="0" text="Description. What will you and the group do? " textWrap="true" /> 
                            <Label class="trip-text" fontSize="11" margin="0, 0, 10, 0" text="(required)" textWrap="true" />                         
                            <TextView class="input-field grey-field" padding="15" borderRadius="7" v-model="tripDescription" hint="Introduce fully the trip to the group..." height="110" maxLength="1000" returnKeyType="done" /> 
                        </StackLayout>              
                        <!-- Trip Activity -->
                        <GridLayout rows="auto, auto" columns="*" class="grey-field-button" @tap="changeActivityLevel" >
                            <Label row="0" col="0" class="trip-text-heading" marginLeft="15" text="Activity level" textWrap="true" />
                            <Image row="1" col="0" class="trip-icon" src="~/assets/images/icons/activity_level.png" horizontalAlignment="left" height="30" stretch="aspectFit" />
                            <Label row="1" col="0" v-show="!tripActivityLevel" class="input-field" margin="0, 35, 0, 65" text="Set..." horizontalAlignment="left" verticalAlignment="center" textWrap="true"/>
                            <Label row="1" col="0" class="input-field" style="margin-left: 65;" v-model="tripActivityLevel" verticalAlignment="center" textWrap="true" />
                        </GridLayout>
                        <!-- People -->
                        <Label class="section-heading" text="People" />
                        <Label class="trip-text-heading" marginLeft="25" text="Maximum people in the group?" textWrap="true"/>
                        <Label class="trip-text" fontSize="11" margin="0, 0, 0, 25" text="(required)" textWrap="true" />                     
                        <GridLayout rows="auto, auto" columns="auto, auto, *" class="grey-field-button" marginBottom="0" @tap="membersCountIsEnabled ? membersCountIsEnabled = false : membersCountIsEnabled = true">
                            <Image row="1" col="0" class="trip-icon" src="~/assets/images/icons/people_icon.png" horizontalAlignment="left" height="20" stretch="aspectFit" />
                            <Label v-show="tripSpaces == 0 || tripSpaces == null" row="1" col="1" class="input-field" margin="0, 0, 0, 15" text="Select from the dropdown" horizontalAlignment="left" verticalAlignment="center" textWrap="true" />
                            <Label v-show="tripSpaces > 0" row="1" col="1" class="input-field" margin="0, 0, 0, 15" :text="tripSpaces + ' people altogether'" horizontalAlignment="left" verticalAlignment="center" textWrap="true" />
                            <Image row="1" col="2" class="trip-icon" marginRight="15" src="~/assets/images/icons/dropdown_icon.png" horizontalAlignment="right" height="11" stretch="aspectFit" />
                        </GridLayout>
                        <StackLayout v-show="membersCountIsEnabled" class="grey-field-button" marginTop="0">
                            <Label class="trip-text" v-for="(count, index) in membersCount" :key="index + 'memberCount'" :text="index == 0 ? count + ' person. Are you going by yourself?' : count + ' people'" horizontalAlignment="left" textWrap="true" @tap="membersCountSelect(count)" />
                        </StackLayout>
                        <TextField v-show="membersCountExtraOn" ref="memberCountExtra" class="input-field" margin="0, 25" v-model="tripSpaces" hint="More than 10 people? How many..." keyboardType="number" maxLength="2" returnKeyType="done" />
                        <!-- Add and remove members -->
                        <StackLayout class="basic-profile-info"> 
                            <StackLayout orientation="horizontal">
                                <Image class="trip-icon" marginLeft="0" src="~/assets/images/icons/people_icon.png" horizontalAlignment="left" height="20" stretch="aspectFit" />
                                <Label class="trip-text-heading" margin="0, 0, 0, 15" text="Add members" verticalAlignment="center"/>
                                <Label class="trip-text" margin="0, 5, 0" :text="`(${freeSpaces} free spaces left)`" verticalAlignment="center" textWrap="true" />                                          
                            </StackLayout>
                            <WrapLayout orientation="horizontal" >                   
                                <GridLayout rows="65" columns="65" v-for="(member, index) in membersProfileData" :key="index" >
                                    <Image row="0" col="0" class="trip-profile-image" horizontalAlignment="left" :src="member.profileImage" width="50" height="50" stretch="aspectFill" />
                                    <Image row="0" col="0" v-show="index > 0" margin="4, 4, 0, 0" opacity="0.75" src="~/assets/images/icons/close_icon.png" horizontalAlignment="right" verticalAlignment="top" width="15" height="15" stretch="aspectFit" @tap="removeMember(member)" />
                                </GridLayout> 
                                <Image v-show="freeSpaces > 0" horizontalAlignment="left" src="~/assets/images/icons/add.png" width="50" height="50" stretch="aspectFit" @tap="addMemberSelector" />                     
                            </WrapLayout> 
                            <Label v-show="memberNames[0] == null" class="trip-text" margin="5, 0, 0" text="You, plus ..." textWrap="true" />   
                            <Label v-show="memberNames[0] != null" class="trip-text" margin="5, 0, 0" :text="'You, plus ' + memberNames.join(', ').replace(/,(?!.*,)/gmi, ' and')" textWrap="true" />               
                        </StackLayout>
                        <StackLayout class="basic-profile-info" marginBottom="0" marginTop="0">
                            <Label v-show="memberShowSearch" class="trip-text-heading" margin="0" text="Search and pick app members by email:" textWrap="true" /> 
                        <GridLayout columns="auto" v-for="(member, index) in searchPhraseReturn" :key="index + 'memberSearch'">
                            <StackLayout :isEnabled="isEnabled" orientation="horizontal" class="action-button-inverse" margin="5, 15, 0, 0" height="36" @tap="addMember(member)" >   
                                <Label class="trip-text" margin="0, 0, 0, 10" v-show="index <= 4" :text="searchPhraseReturn[index].email" textWrap="true" horizontalAlignment="left" verticalAlignment="center" />                                
                                <Image src="~/assets/images/icons/plus_icon.png" height="15" opacity="0.75" margin="0, 10" horizontalAlignment="left" verticalAlignment="center" stretch="aspectFit" />          
                            </StackLayout>  
                        </GridLayout>   
                            <Label v-show="searchFeedback" class="trip-text" marginTop="10" marginLeft="10" color="#f55a42" :text="searchFeedback" textWrap="true" /> 
                            <TextField ref="search" class="input-field" v-show="memberShowSearch" v-model="searchPhrase" hint="Search for a friend by email ..." returnKeyType="search" @blur="clearSearchText" @textChange="onSearchTextChanged" />
                        </StackLayout>
                        <StackLayout height="1" backgroundColor="#E1E1E1"/>
                        <!-- Meeting point -->
                        <GridLayout rows="auto, auto" columns="*" class="basic-profile-info">
                            <Image row="0" col="0" class="icon-image" marginTop="15" src="~/assets/images/icons/location_icon.png" height="20" horizontalAlignment="left" stretch="aspectFit"/>
                            <Label row="0" col="0" class="trip-text" text="Group's preferred meeting point" textWrap="true" />
                            <TextField row="1" col="0" class="input-field" v-model="tripMeetingLocation" hint="The local cafe or pub? Straight at the airport?" returnKeyType="done" />                        
                        </GridLayout>     
                        <!-- Costings -->
                        <StackLayout class="grey-field">
                            <Label class="section-heading" marginBottom="0" text="Costs (total for the group)" />  
                            <Label class="trip-text" fontSize="11" margin="0, 0, 20, 25" text="(required)" textWrap="true" />                                              
                            <StackLayout backgroundColor="#FFC156" height="50" verticalAlignment="center">
                                <Label class="trip-text" margin="0, 25" text="As costs can be approximate, please provide your best calculated estimate per item." textWrap="true" />
                            </StackLayout>
                            <StackLayout class="basic-profile-info">
                                <GridLayout rows="auto, auto" columns="*">
                                    <TextField row="0" col="0" class="input-field" ref="cost" v-model="costLineItem" hint="Tickets, petrol, food for my cat, etc ..." maxLength="60" returnKeyType="done" />  
                                    <TextField row="1" col="0" class="input-field" v-model="costLinePrice" keyboardType="number" maxLength="10" hint="Price?" returnKeyType="done" @returnPress="addCostLine" /> 
                                </GridLayout>
                                <StackLayout orientation="horizontal" @tap="addCostLine">
                                    <Image class="trip-icon" marginLeft="0" src="~/assets/images/icons/plus_icon.png" opacity="0.75" horizontalAlignment="left" height="20" stretch="aspectFit" />
                                    <Label class="trip-text" margin="0, 0, 0, 15" text="Add line" verticalAlignment="center" />                            
                                </StackLayout>
                                <GridLayout rows="auto" columns="*" marginTop="15" v-for="(cost, index) in tripCostItems" :key="`C` + index" >
                                    <Label row="0" col="0" class="input-field" horizontalAlignment="left" :text="cost.name + ': ' + $currency.display(cost.price, tripCurrency)" textWrap="true" />
                                    <Image row="0" col="0" opacity="0.75" src="~/assets/images/icons/close_icon.png" horizontalAlignment="right" width="15" height="15" stretch="aspectFit" @tap="removeCostLine(cost)" />
                                </GridLayout>
                                <Label class="trip-text" color="black" margin="10, 0, 0" :text="'Cost per person: ' + $currency.display(totalMemberCost, tripCurrency)" textWrap="true" />
                                <Label class="trip-text" color="black" margin="5, 0, 0" :text="'Total cost: ' + $currency.display(tripCost, tripCurrency)" textWrap="true" />                             
                            </StackLayout>   
                            <StackLayout height="1" backgroundColor="#E1E1E1"/>
                            <GridLayout class="basic-profile-info" @tap="openCurrencyList">
                                <Label class="trip-text" margin="5, 0, 0" :text="`The trip's currency is `  + tripCurrency" textWrap="true" />  
                                <Image margin="0" src="~/assets/images/icons/input_icon.png" opacity="0.75" horizontalAlignment="right" height="20" stretch="aspectFit" />
                            </GridLayout>                                          
                        </StackLayout>
                        <StackLayout height="30" backgroundColor="transparent"/>
                        <!-- Other Items -->            
                        <StackLayout class="grey-field" >
                            <StackLayout class="basic-profile-info" >
                                <Label class="trip-text-heading" text="Items required and not included in the cost" />
                                <TextField class="input-field" v-model="otherItem" hint="Headlamp, tent, portable reactor etc ..." maxLength="60" returnKeyType="done" @returnPress="addOtherItem" />  
                                <StackLayout orientation="horizontal" @tap="addOtherItem">
                                    <Image class="trip-icon" marginLeft="0" src="~/assets/images/icons/plus_icon.png" opacity="0.75" horizontalAlignment="left" height="20" stretch="aspectFit" />
                                    <Label class="trip-text" margin="0, 0, 0, 15" text="Add line" verticalAlignment="center" />                            
                                </StackLayout>                        
                                <GridLayout rows="auto" columns="*" marginTop="15" v-for="(item, index) in tripOtherItems" :key="`D` + index" >
                                    <Label row="0" col="0" class="input-field" horizontalAlignment="left" :text="item" textWrap="true" />
                                    <Image row="0" col="0" opacity="0.75" src="~/assets/images/icons/close_icon.png" horizontalAlignment="right" width="15" height="15" stretch="aspectFit" @tap="removeOtherItem(item)" />
                                </GridLayout>                          
                            </StackLayout>                   
                        </StackLayout>
                        <!-- Transport -->
                        <Label class="section-heading" margin="15, 25, 0" text="Transport" />  
                        <StackLayout class="basic-profile-info" >
                            <Label class="trip-text-heading" text="How are you traveling?" />
                            <TextField class="input-field" v-model="tripTransport" hint="Rent a car, plane, yacht ..." maxLength="60" returnKeyType="done" /> 
                        </StackLayout>
                        <!-- Media -->
                        <Label class="section-heading" text="Trip Pictures" marginBottom="0"/> 
                        <Label class="trip-text" fontSize="11" margin="0, 0, 0, 25" text="(required at least 1 image and 6 maximum)" textWrap="true" />    
                        <!-- Trip Images -->
                        <WrapLayout v-show="imagePath.length > 0" orientation="horizontal" class="section-heading">
                            <GridLayout rows="147" columns="105" padding="5, 5, 0, 0" v-for="(pic, index) in imagePath" :key="index + `pictures`" >
                                <Image borderRadius="7" margin="0" horizontalAlignment="center" verticalAlignment="center" :src="pic" width="95" height="137" stretch="aspectFill" @tap="deletePictureSelector(pic)" />
                                <Image class="edit-icon" horizontalAlignment="right" verticalAlignment="top" src="~/assets/images/icons/edit_profile.png" width="35" height="35" stretch="aspectFit" @tap="deletePictureSelector(pic)" />                      
                            </GridLayout> 
                        </WrapLayout>                                                                       
                        <StackLayout class="basic-profile-info" >
                            <Label class="trip-text" margin="0" text="Jazz-up your trip page with pictures and video from the web or your personal library" textWrap="true" />                            
                            <!-- Image Search -->
                            <Label class="trip-text-heading" marginTop="10" text="Search the web for images" />
                            <StackLayout v-show="imagePath.length < 6" >
                                <GridLayout rows="auto" columns="*, auto">
                                    <TextField :isEnabled="isEnabled" row="0" col="0" class="input-field" v-model="imgSearchPhrase" hint="Search for an image of your destination ..." returnKeyType="go" @returnPress="searchForImage" /> 
                                    <Image :isEnabled="isEnabled" row="0" col="1" class="trip-icon" margin="0, 25, 0, 0" src="~/assets/images/icons/main_explore.png" opacity="1" horizontalAlignment="right" height="30" stretch="aspectFit" @tap="searchForImage"/>
                                </GridLayout>       
                                <Label v-show="imgSearchArray.length > 0" class="trip-text" margin="0" text="Select images:" textWrap="true" />        
                                <WrapLayout orientation="horizontal" margin="0">
                                    <GridLayout rows="140, auto" columns="100" padding="5, 5, 0, 0" v-for="(pic, index) in imgSearchArray" :key="index + `searchPictures`" >
                                        <Image row="0" borderRadius="7" margin="0" horizontalAlignment="left" verticalAlignment="bottom" :src="pic.urls.small" width="95" height="137" stretch="aspectFill" @tap="selectUnsplashImage(pic)" />
                                        <Label row="1" class="trip-text" fontSize="11" margin="5, 0, 5" textWrap="true" @tap="$utils.openUrl(`https://unsplash.com/@${pic.user.username}?utm_source=Adventureme&utm_medium=referral`)"> 
                                            <FormattedString>
                                                <Span text="Photo by " />
                                                <Span :text="pic.user.name" fontWeight="bold" textDecoration="underline"/>
                                            </FormattedString>
                                        </Label>                                                         
                                    </GridLayout> 
                                </WrapLayout>                                  
                            </StackLayout>
                            <Label class="trip-text" margin="5, 0, 5" fontSize="13" fontStyle="italic" textWrap="true" @tap="$utils.openUrl('https://unsplash.com/?utm_source=Adventureme&utm_medium=referral')"> 
                                <FormattedString>
                                    <Span text="Photos by " />
                                    <Span text="Unsplash" fontWeight="bold" textDecoration="underline"/>
                                </FormattedString>
                            </Label>
                            <!-- Image URL -->
                            <Label class="trip-text-heading" marginTop="10" text="Paste an image url from the web (https://)" />
                            <GridLayout v-show="imagePath.length < 6" rows="auto" columns="*, auto">
                                <TextField :isEnabled="isEnabled" row="0" col="0" class="input-field" v-model="imageUrl" hint="Paste an image link from the web ..." returnKeyType="go" @returnPress="savePictureUrl" /> 
                                <Image :isEnabled="isEnabled" row="0" col="1" class="trip-icon" margin="0, 25, 0, 15" src="~/assets/images/icons/input_icon.png" opacity="0.75" horizontalAlignment="right" height="20" stretch="aspectFit" @tap="savePictureUrl"/>
                            </GridLayout>
                            <!-- Image Camera -->
                            <Label class="trip-text-heading" marginTop="10" text="Select an image from your phone" />
                            <GridLayout v-show="imagePath.length < 6" rows="auto" columns="auto">
                                <Button :isEnabled="isEnabled" text="Open Gallery" @tap="selectPicture" />                    
                            </GridLayout>
                        </StackLayout>
                        <!-- Itinerary -->
                        <StackLayout class="grey-field">
                            <GridLayout>
                                <Label class="section-heading" text="Create Itinerary" /> 
                                <Switch class="basic-profile-info" horizontalAlignment="right" v-model="tripItineraryEnabled" color="#2E2E2E" backgroundColor="green" offBackgroundColor="red" @checkedChange="tripInItineraryEnabled" />
                            </GridLayout>
                            <StackLayout class="basic-profile-info" v-show="tripItineraryEnabled" >
                                <!-- Itinerary show -->
                                <StackLayout margin="10, 0, 0" v-for="(day, index) in tripItinerary" :key="index + `itinerary`">
                                    <GridLayout rows="auto" columns="*">
                                        <Label class="trip-text-heading" :text="`Day ${day.day} (${dayDates(day.day)})`" />
                                        <Image opacity="0.75" src="~/assets/images/icons/close_icon.png" horizontalAlignment="right" width="15" height="15" stretch="aspectFit" @tap="removeItineraryItem(day)" />
                                    </GridLayout>     
                                    <GridLayout columns="auto, *" margin="10, 0, 10">
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
                        </StackLayout>                              
                        
                        <Label v-show="feedback" marginTop="10" horizontalAlignment="center" color="#f55a42" :text="feedback" textWrap="true" /> 
                        <Button :backgroundColor="saveValidationDone ? '#48AC66' : '#FFC156'" :color="saveValidationDone ? 'white' : 'black'" class="basic-profile-info" text="Create Trip" @tap="createTrip" />   
                        <StackLayout height="30" backgroundColor="transparent"/>                     
                    </StackLayout>      
                    <StackLayout row="1">
                        <ActivityIndicator :busy="isLoading" horizontalAlignment="center" verticalAlignment="center" />  
                    </StackLayout>                            
                </StackLayout>          
            </ScrollView>            
        </GridLayout>
    </Page>
</template>

<script>
import firebase from 'nativescript-plugin-firebase'
const db = firebase.firestore
const fstore = firebase.storage

import * as enums from 'ui/enums';
import * as fileSystemModule from 'file-system'

import * as camera from 'nativescript-camera'
import * as imageSource from 'image-source'
import * as imagepicker from 'nativescript-imagepicker'
import axios from 'axios/dist/axios'

import { GooglePlacesAutocomplete } from 'nativescript-google-places-autocomplete'

import CurrencySelector from './elements/CurrencySelector'
import ItinerarySelector from './elements/ItinerarySelector'

import Feed from './Feed'
import Trips from './Trips'

export default {
    name: 'NewTrip',
    data() {
        return{
            userID: null,
            tripID: null,

            // Trip variables
            tripTitle: null,
            tripLocation: null,
            tripDescription: null,
            tripDateFrom: null,
            tripDateTo: null,
            tripSpaces: null,
            tripMembers: [],
            tripActivityLevel: null,
            tripMeetingLocation: null,
            tripCurrency: "USD",
            tripCost: 0,
            tripCostItems: [],
            tripOtherItems: [],
            tripTransport: null,
            tripMedia: [],
            tripItinerary: [],
            tripItineraryEnabled: true,

            costLineItem: null, //for temp storing the cost of each line
            costLinePrice: null, //for temp storing the cost of each line
            otherItem: null, //for temp storing of other items before being pushed to tripOtherItems

            membersProfileData: [], //for storing the image paths to the profile pictures of the trip members, their names and other data
            memberShowSearch: false,
            membersCountExtraOn: false,
            membersCountIsEnabled: false,
            membersCount: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "11 or more"],
            memberNames: [],
            searchPhrase: null,
            searchPhraseReturn: [],
            appUsers: [],

            tripImages: [], //for gallery selected pictures
            imageFileName: [], //for camera taken pictures
            imagePath: [], //for camera taken pictures
            imageUrl: null, //images pasted from the web
            imgSearchPhrase: "", //for Unsplash image search
            imgSearchArray: [], //to store data from API requests

            places: [], // for Google Places API population
            placesAutoHide: true,
            googlePlacesAutocomplete: null, 
            
            currencyList: Object.keys(this.$currency.currencyToLocale), //get supported currencies for UI selector

            itineraryDay: "", //temp storage of new itinerary entry
            itineraryDestination: null, //temp storage of new itinerary entry
            itineraryDescription: null, //temp storage of new itinerary entry     
            itineraryFeedback: null,       

            feedback: null,
            searchFeedback: null,
            isLoading: false,
            isEnabled: true,

            metadata: {
                contentType: "image/jpg",
                customMetadata: {
                "data": "test"
                }
            }

        }
    },
    computed: {
        tripDuration: function() { //Calculate the duration of the trip from the trip dates
            if(this.tripDateFrom && this.tripDateTo){
                const oneDay = 1000 * 60 * 60 * 24
                let dateDifference = Math.abs(this.tripDateTo - this.tripDateFrom)
                let tripLength = Math.round(dateDifference / oneDay) + 1
                if(tripLength == 1){
                    return "It's a day trip!"
                } else {
                    return `It's a ${tripLength}-days trip!`
                }
            }
        },

        tripLength: function() { //Creates and updates an array of days depending on the length of the trip
            if(this.tripDateFrom && this.tripDateTo){
                const oneDay = 1000 * 60 * 60 * 24
                let dateDifference = Math.abs(this.tripDateTo - this.tripDateFrom)
                let tripLength = Math.round(dateDifference / oneDay) + 1
                return tripLength            
            }        
        },          

        freeSpaces: function() { //Calculate the number of free spaces for UX display
            if(this.tripSpaces == null || this.tripSpaces == 0 || Math.sign(this.tripSpaces) == -1 || this.tripSpaces == "-" ) {
                let spaces = 1
                return spaces - this.tripMembers.length         
            } else {
                return this.tripSpaces - this.tripMembers.length
            }
        },

        currentDate: function() { //Calculate current date in yyyy/mm/dd format
            let utc = new Date().toJSON().slice(0,10).replace(/-/g,'/')
            return utc
        }, 

        totalMemberCost: function() {
            let cost = this.tripCost
            if(this.tripMembers.length == 0){
                return cost
            } else {
                return Number.parseFloat(cost/this.tripMembers.length)
            }            
        },
        
        saveValidationDone: function() {
            if(this.tripTitle && this.tripLocation && this.tripDescription && this.tripDateTo && this.tripDateFrom && this.tripSpaces && this.tripCostItems && this.imagePath.length > 0){
                return true
            } else {
                return false
            }
        }        
    },

    methods: {
        createTrip() {
            // Check if fields are not empty then create the trip in Firebase
            if(this.saveValidationDone) {
                db.collection('trips').add({
                tripID: null,
                tripCreationDate: Date.now(),

                tripTitle: this.tripTitle,
                tripLocation: this.tripLocation,
                tripDescription: this.tripDescription,
                tripDateFrom: this.tripDateFrom,
                tripDateTo: this.tripDateTo,
                tripSpaces: this.tripSpaces,
                tripMembers: this.tripMembers,
                tripActivityLevel: this.tripActivityLevel,
                tripMeetingLocation: this.tripMeetingLocation,

                tripCurrency: this.tripCurrency,
                tripCost: this.tripCost,
                tripCostItems: this.tripCostItems,

                tripOtherItems: this.tripOtherItems,
                
                tripTransport: this.tripTransport,        
                tripItinerary: this.tripItinerary,        
                tripItineraryEnabled: this.tripItineraryEnabled,

                userID: this.userID
                })
                // Then save the trip ID to the all users' data collection. 
                .then((ref) => {
                    this.tripID = ref.id
                    db.collection('trips').doc(this.tripID).update({ //save trip ID inside the trip's document
                        tripID: this.tripID
                    })    
                    //Create and populate the trip's chat
                    let notPendingChatMembers = this.tripMembers.filter(member => member == this.userID || member == "Anonymous") //Filter all members that are permanent ones and not invited (i.e. the trip creator and anonymous members only)
                    let chatMessages = [] //TODO remove when re-implementing messages subcollection
                    let msg = {}
                    msg.chatMsg = "Welcome to this trip to " + this.tripLocation //set a welcome message
                    msg.chatMsgRead = [this.userID]
                    msg.chatMsgTime = Date.now()
                    msg.userID = this.userID     
                    chatMessages.push(msg)               
                    db.collection('chats').doc(this.tripID).set({ //create chat document
                        chatAdmin: this.userID,
                        chatCreationDate: Date.now(),
                        chatMembers: notPendingChatMembers, //set the chat members
                        chatMessages: chatMessages
                    }) 
                    //TODO Re-implement messages sub-collection isntead writing directly to the chat document.
                    // db.collection('chats').doc(this.tripID).collection('messages').add({ //create message subcollection for the chat which will contain the chat room's messages
                    //     chatMsg: "Welcome to this trip to " + this.tripLocation, //set a welcome message
                    //     chatMsgRead: [],
                    //     chatMsgTime: Date.now(),
                    //     userID: this.userID
                    // })                   
                    for(let i = 0; i < notPendingChatMembers.length; i++){ //Save the trip ID and chat room in each member's user data.
                        if(this.tripMembers[i] != "Anonymous"){
                            let userChats = {}
                            userChats.chatID = this.tripID
                            userChats.chatIsPrivate = false
                            db.collection('user_data').doc(this.tripMembers[i]).update({
                                userTrips: firebase.firestore.FieldValue.arrayUnion(this.tripID),
                                userChats: firebase.firestore.FieldValue.arrayUnion(userChats)
                            })                            
                        }
                    }                             
                }).then(() => {
                    this.inviteFriends()
                })
            }
            else {
                this.feedback = "Please input values in the required fields (required)"
            }
        },

        dayDates(day) { //For date rendering in itinerary
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            let date = null
            if(day){
                if(day == 1) {
                    date = this.tripDateFrom.getDate()
                } else {
                    date = this.tripDateFrom.getDate() + day - 1
                }
                const month = monthNames[this.tripDateFrom.getMonth()] 
                return `${date} ${month}`
            } else {
                return ""
            }      
        },           

        getPlace(place) {
            this.googlePlacesAutocomplete.getPlaceById(place.placeId).then((place) => {
                this.tripLocation = place.formattedAddress 
                console.log(place.formattedAddress + "\n latitude: " + place.latitude + "\n longitude: " + place.longitude)
                this.$nextTick(() => {
                    this.$refs.dissmissPlacesFocus.nativeView.focus()
                })
                .then(function () {})
            }, error => {
                console.log(error)
            })
        },

        searchFieldChanged() {
            if(!this.placesAutoHide && this.tripLocation && this.tripLocation.length >= 2){ //Search Google Places when user has inputed at least 2 characters
                this.placesAutoHide = false
                this.googlePlacesAutocomplete.search(this.tripLocation)
                .then((places) => {
                    // place predictions list
                    this.places = []
                    this.places = places
                    console.log(JSON.stringify(this.places))
                }, (error => {
                    console.log(error)
                }))
            }
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

        clearSearchText() {
            this.searchPhrase = null  
            this.memberShowSearch = false          
        },

        membersCountSelect(count) {
            this.membersCountIsEnabled = false
            let index = this.membersCount.indexOf(count)
            if(index == 10){
                this.membersCountExtraOn = true
                this.tripSpaces = null
                this.$nextTick(() => {
                    this.$refs.memberCountExtra.nativeView.focus()
                })                
            } else {
                this.tripSpaces = count
            }            
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

        focusOnAddMember() {
            this.$nextTick(() => {
                this.$refs.search.nativeView.focus()
            })
        },

        addMember(data) { 
            db.collection('users').doc(data.id).get()
            .then(doc => {
                let isMatch = this.membersProfileData.find(obj => obj.id === doc.id) //checking if an member is not already added
                if(!isMatch) { //add member
                    this.tripMembers.push(doc.id)
                    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
                    this.$store.dispatch('getAnyUserExtraData', doc.id).then(() => {
                        let userExtraData = this.$store.getters.getAnyUserExtraData //get the user's extra data favs, trips, friends
                        let member = {}
                        member.id = doc.id           
                        member.name = doc.data().userFirstName
                        member.profileImage = this.$backendService.defaultProfiePicture(doc.data().userProfileImages[0])
                        member.friends = userExtraData.userFriends
                        this.membersProfileData.push(member) 
                        this.memberNames.push(member.name)
                        this.searchFeedback = null
                        this.searchPhrase = null
                        this.memberShowSearch = false
                        console.log("Name added" + JSON.stringify(member))
                    })
                } else {
                    this.searchFeedback = "Trip member already added!"
                    console.log("Name already exists")
                }                
            })         
        },

        addAnonMember() {
            this.tripMembers.push("Anonymous")
            let member = {}
            member.id = "Anonymous"           
            member.name = "Anonymous Buddy"
            member.profileImage = "~/assets/images/icons/profile_icon.png"
            this.membersProfileData.push(member) 
            this.memberNames.push(member.name)
            this.searchFeedback = null
            this.searchPhrase = null
            this.memberShowSearch = false
        },

        removeMember(item) {
            const indexMember = this.membersProfileData.indexOf(item.id)
            const indexMemberData = this.membersProfileData.indexOf(item)
            const indexMemberName = this.memberNames.indexOf(item.name)
            this.membersProfileData.splice(indexMemberData, 1)
            this.memberNames.splice(indexMemberName, 1)
            this.tripMembers.splice(indexMember, 1)
        },

        async inviteFriends() {
            console.log("Inviting friends")  
            let pendingChatMembers = this.tripMembers.filter(member => { //Filter all members that will be invited to the trip
                if(member != "Anonymous")
                {
                    return member != this.userID
                }
                else
                {
                    return false
                }
            })            
            for(let i = 0; i < pendingChatMembers.length; i++)
            {
                console.log("Sending invite message")
                //See if the direct/private chat doesn't laready exists in the organiser's chats
                let inviteeIndex = this.membersProfileData.findIndex(member => member.id == pendingChatMembers[i])
                let inviteeId = this.membersProfileData[inviteeIndex].id
                let creatorIndex = this.membersProfileData.findIndex(member => member.id == this.userID) //Get the inviter chats from TripPreview to safe a Firebase call
                let chatIndex = this.membersProfileData[creatorIndex].chats.findIndex(chat => chat.chatID.includes(inviteeId)) //See if the user has their ID in the organiser's chats to detect if there's already a direct chat created
                let inviteMessage = `Hi ${this.membersProfileData[inviteeIndex].name}, my name is ${this.membersProfileData[creatorIndex].name} and I would like for you to join my trip.` //Set the first message as the trip join request message

                if(chatIndex < 0){
                    //Send the request and create a new direct chat between the users
                    let chatName = inviteeId + this.userID
                    console.log("Chat ID is " + chatName)

                    let chatMembers = []
                    chatMembers.push(inviteeId)
                    chatMembers.push(this.userID)

                    let chatMessages = []
                    let msg = {}
                    msg.chatMsg = inviteMessage //the trip join request message and first message of the chat 
                    msg.chatMsgRead = [this.userID]
                    msg.chatMsgTime = Date.now()
                    msg.userID = this.userID  
                    msg.inviteForUserID = inviteeId
                    msg.tripRequestID = this.tripID   
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
                    for(let j = 0; j < chatMembers.length; j++){ //Save the direct chat in each members chats
                        let userChats = {}
                        userChats.chatID = chatName
                        userChats.chatIsPrivate = true
                        await db.collection('user_data').doc(chatMembers[j]).update({
                            userChats: firebase.firestore.FieldValue.arrayUnion(userChats)
                        }).then(() => {
                        console.log("Chat document created in user_data")
                        })                                     
                    }
                } else {
                    //Send the request and update the existing chat
                    console.log("There's already a private chat between the two users")

                    let msg = {}
                    msg.chatMsg = inviteMessage //the trip join request message
                    msg.chatMsgRead = [this.userID]
                    msg.chatMsgTime = Date.now()
                    msg.userID = this.userID  
                    msg.inviteForUserID = inviteeId
                    msg.tripRequestID = this.tripID  
                    msg.tripRequestStatus = 'pending'

                    await db.collection('chats').doc(this.membersProfileData[creatorIndex].chats[chatIndex].chatID).update({ //Update the chat document
                        chatMessages: firebase.firestore.FieldValue.arrayUnion(msg)
                    }).then(() => {
                        console.log("Chat document updated")
                    }) 
                }  
                                                  
            } 
            console.log("Friends invited, now navigating")
            this.uploadImgAndNavigate()
        },        

        tripInItineraryEnabled() {
            if(this.tripItineraryEnabled){
                this.tripItineraryEnabled = true
                console.log("Itinerary enabled " + this.tripItineraryEnabled)
            } else {
                this.tripItineraryEnabled = false
                console.log("Itinerary disabled " + this.tripItineraryEnabled)
            }
        },  

        addItineraryItem() {
            if(this.itineraryDay && this.itineraryDestination && this.itineraryDescription){
                let itinerary = {
                    day: this.itineraryDay,
                    destination: this.itineraryDestination,
                    description: this.itineraryDescription
                }
                this.tripItinerary.push(itinerary)
                this.tripItinerarySort() //sort the itinerary array 
                this.itineraryDay = null
                this.itineraryDestination = null
                this.itineraryDescription = null
                this.$nextTick(() => {
                    this.$refs.itinDay.nativeView.focus()
                })                   
                this.itineraryFeedback = null
                console.log("Itinerary entry added " + itinerary)
            } else {
                this.itineraryFeedback = "Fill in all itinerary fields."
                console.log("Fill in all itinerary fields.")
            }
        },

        removeItineraryItem(day) {
            let index = this.tripItinerary.indexOf(day)
            this.tripItinerary.splice(index, 1)
        },

        tripItinerarySort() {
            this.tripItinerary.sort((a, b) => {
                return a.day - b.day
            }) 
            console.log("Trip itinerary sorted")           
        },

        openItinerarySelector() {
            this.$showModal(ItinerarySelector, {
                props: {
                    tripLength: this.tripLength,
                    tripDateFrom: this.tripDateFrom
                }
            }).then(day => {
                if(day == 'close'){
                    console.log("Itinerary selector closed")
                } else {
                    this.itineraryDay = day
                }                
            })
        },          

        openCurrencyList() {
            this.$showModal(CurrencySelector, {
                props: {
                    currencyList: this.currencyList
                }
            }).then(currency => {
                if(currency){
                    this.tripCurrency = currency
                }
            })
        },           

        addCostLine() {
            if(this.costLineItem && this.costLinePrice){
                let item = {
                    name: this.costLineItem,
                    price: parseFloat(this.costLinePrice)
                }
                this.tripCostItems.push(item)
                console.log(`Item ${this.costLineItem} added with price of ${this.costLinePrice}`)
                this.tripCost += parseFloat(this.costLinePrice)
                console.log("Total cost now: " + this.tripCost)
                this.costLineItem = null
                this.costLinePrice = null
                this.$nextTick(() => {
                    this.$refs.cost.nativeView.focus()
                })                
            }
        },

        removeCostLine(cost) {
            this.tripCost -= cost.price
            let index = this.tripCostItems.indexOf(cost)
            this.tripCostItems.splice(index, 1)
        },

        addOtherItem() {
            if(this.otherItem){
                this.tripOtherItems.push(this.otherItem)
                this.otherItem = null
                console.log(`Other item ${this.otherItem} added`)
            }
        },

        removeOtherItem(item) {
            this.tripOtherItems = this.tripOtherItems.filter(other => {
                return other != item
            })
        },

        changeActivityLevel() {
            action("What's the trip activity level?", "Cancel", ["Intense", "Active", "Light", "None"])
            .then(result => {
                if(result != "Cancel"){
                    this.tripActivityLevel = result
                } else {
                    this.tripActivityLevel = null
                }
            })
        },

        onDateChangeFrom(date) {
            this.tripDateFrom = date.value
            console.log("From date set to " + date.value)
        },

        onDateChangeTo(date) {
            this.tripDateTo = date.value
            console.log("To date set to " + date.value)
        },  
        
        deletePictureSelector(pic) {
            confirm({title: "Remove this picture?", message: "", okButtonText: "OK", cancelButtonText: "Cancel"})
            .then(result => {
                if(result){
                    let index = this.imagePath.indexOf(pic)
                    this.imagePath.splice(index, 1)
                } else { console.log("Action cancelled") }
            })
        },     
        
        async searchForImage() { //Get images from Unsplash
            try {
                const response = await axios.get('https://api.unsplash.com/search/photos/?client_id=' + this.$store.getters.getUnsplashAPI, {
                    params: { query: this.imgSearchPhrase, page: 1, per_page: 6}
                })
                this.imgSearchArray = response.data.results
                console.log(response.data.results) 
            } catch (error) {console.error(error)}            
        },

        async selectUnsplashImage(pic) {
            //Increment the photo's Unsplash viewcount as per their guidelines. This purely increments the photo website viewcount and does nothing else.
            try {
                const response = await axios.get(pic.links.download_location + "?client_id=" + this.$store.getters.getUnsplashAPI, {
                })
                console.log(JSON.stringify(response.data.url)) 
            } catch (error) {console.error(error)}    
            //Set the picture's url as the imageUrl variable. That saves another variable and extra code as we call and reuse savePictureUrl function
            this.imageUrl = pic.urls.regular //using regular sized Unsplash image    
            this.savePictureUrl()
        },        

        saveToFile(res) {
            // Save the camera image to a file and assign them to the images array
            imageSource.ImageSource.fromAsset(res)
            .then((image) => {
                console.log("Saving to file")
                let folderPath = fileSystemModule.knownFolders.documents().path
                let fileName = `tripImage-${Date.now()}.jpg` //randomize the image file name. Might want to add extra variables than just date
                this.imageFileName.push(fileName)
                let imgPath = fileSystemModule.path.join(folderPath, fileName)
                this.imagePath.push(imgPath)
                let saved = image.saveToFile(imgPath, "jpg")
                if (saved) {
                console.log("Image saved successfully!")
                console.log("Saved: " + imgPath)        
                } else { console.log("No file saved")}
            })
        },  

        selectPicture() {
            // Select pictures from the gallery and save them to the images array
            let context = imagepicker.create({
                mode: "single",
                mediaType: "Image"
            })
            context
            .authorize()
            .then(() => {
                return context.present()
            })
            .then(async (selection) => {
                console.log("Selection done: " + JSON.stringify(selection))
                await selection.forEach((selected) => {
                // process the selected images, resize and save the resized ones to file
                selected.options = {height: 356, keepAspectRatio: true }
                this.saveToFile(selected)   
                })                    
            }).catch((e) => {
                console.log(e)
            })
        },

        savePictureUrl() {
            this.isEnabled = false
            let isUrlValid = this.imageUrl.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)
            console.log(isUrlValid)
            if(isUrlValid){
                //save picture from url, uncropped
                imageSource.ImageSource.fromUrl(this.imageUrl)
                .then((image) => {
                    this.isEnabled = true
                    console.log("Saving picture from url")
                    this.imageUrl = null
                    let folderPath = fileSystemModule.knownFolders.documents().path
                    let fileName = `tripImage-${Date.now()}.jpg` //randomize the image file name. Might want to add extra variables than just date
                    this.imageFileName.push(fileName)
                    let imgPath = fileSystemModule.path.join(folderPath, fileName)
                    this.imagePath.push(imgPath)
                    let saved = image.saveToFile(imgPath, "jpg")
                    if (saved) {
                        console.log("Image saved successfully!")
                        console.log("Saved: " + imgPath)        
                    } else { 
                        console.log("No file saved")
                        }
                })
            } else {
                this.isEnabled = true
                console.log("URL is invalid")
            }
        },
       
        async uploadImgAndNavigate() {
            this.isLoading = true
            // Upload the images array to firebase
            if(this.imagePath) {// if there's an image asset
                console.log("Uploading image to Firebase")                
                for(let i = 0; i < this.imagePath.length; i++) {   
                    //upload file                 
                    await fstore.uploadFile({
                    remoteFullPath: `uploads/trip_pics/${this.imageFileName[i]}`,
                    localFullPath: this.imagePath[i],
                    metadata: this.metadata 
                    }) .then(async (uploadedFile) => {
                        await this.insertFirestoreImgRef(this.imageFileName[i])
                        console.log("File uploaded:" + JSON.stringify(uploadedFile))
                    }) .catch(e => console.log("File upload error:" + e))
                }
            this.isLoading = false
            this.$navigateTo(Trips)  
            console.log("Navigating to Feed")
            }
        },

        async insertFirestoreImgRef(fileName){
            // Get the image URL and store it into the trip's Firestore DB for access 
            let remotePath = `uploads/trip_pics/${fileName}`
            await fstore.getDownloadUrl({
                remoteFullPath: `uploads/trip_pics/${fileName}`
            }) .then((url) => {
                db.collection('trips').doc(this.tripID).update({
                tripMedia: firebase.firestore.FieldValue.arrayUnion(url),
                tripMediaPaths: firebase.firestore.FieldValue.arrayUnion(remotePath)
                }) 
                console.log("URL ref created to the trip's database document: " + url)               
            })
        }

    },

    created() {
        this.googlePlacesAutocomplete = new GooglePlacesAutocomplete(this.$store.getters.getGooglePlacesAPI) //Google places API initiation        
        this.$store.dispatch('getCurrentUser').then(() => {
            this.userID = this.$store.getters.getUser
            console.log("User ID in NewTrip set to " + this.userID)
            this.$store.dispatch('getCurrentUserData', this.userID) //Get user data based on their user id so you can get their name and profile image for rendering. Initial get for the trip creator.
            .then(() => {
                this.tripCurrency = this.$store.getters.getUserData.userCurrency //set the default trip currency to the user's default currency
                this.$store.dispatch('getUserExtraData', this.userID).then(() => { //Get the current user's extra data - friends, favs, etc.
                    this.tripMembers.push(this.$store.getters.getUserData.userID) //add trip member
                    let userExtraData = this.$store.getters.getUserExtraData
                    let member = {}
                    member.id = this.$store.getters.getUserData.userID             
                    member.name = this.$store.getters.getUserData.userFirstName
                    member.profileImage = this.$backendService.defaultProfiePicture(this.$store.getters.getUserData.userProfileImages[0])
                    member.friends = userExtraData.userFriends
                    member.chats = userExtraData.userChats
                    this.membersProfileData.push(member)   
                    })          
            })            
        })
        db.collection('users').get().then(querySnapshot => {
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
    },

    mounted() {
        camera.requestPermissions()
        .then(() => {
            console.log("Camera permission granted")
        })
        .catch(e => {
            console.log('Error requesting camera permission')
        }) 
    }
}
</script>

<style scoped>
    .basic-profile-info {
        margin: 15, 25;
    }    
    .input-field{
        font-size: 15;
        margin: 0, 0, 0, 0;
    }
    .trip-profile-image {
      margin-top: 5;
      border-radius: 50%;
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
    .section-heading {
        color: #2E2E2E;
        margin: 10, 25;
        font-size: 20; 
        font-weight: 500;      
    }       
    .input-heading {
        margin: 10, 20;
        font-size: 15;       
    }    
    .trip-icon {
        margin: 5, 0, 5, 20;
    }          
    .grey-field-button {
        background-color: #F2F2F2;
        border-radius: 7;
        padding: 10, 0;
        margin: 10, 20;
    }
    .grey-field {
        background-color: #F2F2F2;
        padding: 10, 0;
    }    
    .search-text {
        margin: 0, 50, 10;
        font-size: 15;         
    }    
    .edit-icon {
        background: #E5E5E5;
        border-radius: 50%;
        margin: 0;
        padding: 5;
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
</style>