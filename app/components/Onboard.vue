<template>
  <Page actionBarHidden="true">
     <GridLayout class="carousel-layout-fix">
        <Carousel id="carousel" @pageChanged="myChangeEvent" ios:indicatorOffset="0,-30" ios:finite="false" ios:bounce="false" showIndicator="true" indicatorAnimation="SWAP"
            indicatorColor="#EE6F94" indicatorColorUnselected="#FED2A3" height="100%" width="100%" debug="true">
            
            <CarouselItem id="slide1" verticalAlignment="middle">
              <ScrollView>
                <GridLayout rows="auto, auto, auto, auto, auto" columns="*" class="slide-layout">
                  <Image row="0" src="~/assets/images/icon.png" height="60" margin="0, 0, 25" horizontalAlignment="center" stretch="aspectFit"/>
                  <Image row="1" src="~/assets/images/onboard1.png" width="200" margin="0, 0, 25" horizontalAlignment="center" stretch="aspectFit"/>
                  <GridLayout row="2" class="slide-strip-heading" margin="0, 0, 25" height="55">
                    <Label class="" horizontalAlignment="center" verticalAlignment="center" text="The adventure awaits" textWrap="true" />
                  </GridLayout>
                  <StackLayout row="3" >
                    <Label class="slide-text" margin="0, 40, 10" horizontalAlignment="center" text="We help you organise your best one yet." textWrap="true" />    
                    <Label class="slide-text" margin="0, 40, 10" horizontalAlignment="center" text="Cut travel costs. Discover or create unique journeys on the cheap." textWrap="true" />                
                    <Label class="slide-text" margin="0, 40, 10" horizontalAlignment="center" text="Make your plans into epic memories and new friends!" textWrap="true" />                
                  </StackLayout>
                  <GridLayout row="4" orientation="horizontal" class="action-button-inverse" margin="20, 30, 0" horizontalAlignment="right" width="85" height="30" @tap="goToLogin()" >             
                      <Label :text="!userLogged ? 'Skip to Login' : 'Skip to Feed'" horizontalAlignment="center" verticalAlignment="center" /> 
                  </GridLayout>                  
                </GridLayout>                  
              </ScrollView>
            </CarouselItem>

            <CarouselItem id="slide2" verticalAlignment="middle">
              <ScrollView>
                <GridLayout rows="auto, auto, auto, auto, auto" columns="*" class="slide-layout">
                  <Image row="0" src="~/assets/images/icons/main_explore_active.png" height="60" margin="0, 0, 25" horizontalAlignment="center" stretch="aspectFit"/>
                  <Image row="1" src="~/assets/images/onboard2.png" width="200" margin="0, 0, 25" horizontalAlignment="center" stretch="aspectFit"/>
                  <GridLayout row="2" class="slide-strip-heading" margin="0, 0, 25" height="55">
                    <Label class="" horizontalAlignment="center" verticalAlignment="center" text="Friends, new and old" textWrap="true" />
                  </GridLayout>
                  <StackLayout row="3" >
                    <Label class="slide-text" margin="0, 40, 10" horizontalAlignment="center" text="Connect with likeminded people. Find that extra person that will make the trip both cheap and fun." textWrap="true" />    
                    <Label class="slide-text" margin="0, 40, 10" horizontalAlignment="center" text="Warning, you might end up with a life-long hiking buddy!" textWrap="true" />                
                  </StackLayout>
                  <GridLayout row="4" orientation="horizontal" class="action-button-inverse" margin="20, 30, 0" horizontalAlignment="right" width="85" height="30" @tap="goToLogin()" >             
                      <Label :text="!userLogged ? 'Skip to Login' : 'Skip to Feed'" horizontalAlignment="center" verticalAlignment="center" /> 
                  </GridLayout>                  
                </GridLayout>                  
              </ScrollView>
            </CarouselItem>

            <CarouselItem id="slide3" verticalAlignment="middle">
              <ScrollView>
                <GridLayout rows="auto, auto, auto, auto, auto" columns="*" class="slide-layout">
                  <Image row="0" src="~/assets/images/icons/friends_icon.png" height="60" margin="0, 0, 25" horizontalAlignment="center" stretch="aspectFit"/>
                  <Image row="1" src="~/assets/images/onboard3.png" width="200" margin="0, 0, 25" horizontalAlignment="center" stretch="aspectFit"/>
                  <GridLayout row="2" class="slide-strip-heading" margin="0, 0, 25" height="55">
                    <Label class="" horizontalAlignment="center" verticalAlignment="center" text="Organise online and face to face" textWrap="true" />
                  </GridLayout>
                  <StackLayout row="3" >
                    <Label class="slide-text" margin="0, 40, 10" horizontalAlignment="center" text="Use familiar tools to orchestrate your trip all within the app: create itineraries, attach travel documents and track your expenses." textWrap="true" />    
                    <Label class="slide-text" margin="0, 40, 10" horizontalAlignment="center" text="Why not even meet up in person and finalise who's carrying the campfire guitar?" textWrap="true" />                
                  </StackLayout>
                  <GridLayout row="4" orientation="horizontal" class="action-button" margin="20, 30, 0" horizontalAlignment="center" width="85" height="30" @tap="goToLogin()" >             
                      <Label :text="!userLogged ? 'Go to Login' : 'Go to Feed'" horizontalAlignment="center" verticalAlignment="center" /> 
                  </GridLayout>                  
                </GridLayout>                  
              </ScrollView>
            </CarouselItem>

        </Carousel>
    </GridLayout>

  </Page>
</template>

<script>
  import * as appSettings from 'tns-core-modules/application-settings'

  import * as carousel from 'nativescript-carousel'

  export default {
    name: 'Onboard',
    props: ['userLogged'],
    data() {
      return {
        
      }
    },

    methods: {

      onTextRecognitionResult() {
        console.log("onTextRecognitionResult");
      },

      myChangeEvent: function(args) {
      var changeEventText = 'Page changed to index: ' + args.index;
      console.log(changeEventText);
      },

      goToLogin() {
        appSettings.setBoolean('showOnboarding', false)
        this.$goTo('login', {}, { clearHistory: true })
      }

    },

    created() {
      console.log("User logged in? " + this.userLogged)
    },

  }
</script>

<style scoped>
  .slide-layout {
    margin: 25, 0;
  }
  .slide-strip-heading {
    font-size: 20;
    color: white;
    background-color: #2C3746;
  }
  .slide-text {
    font-size: 15;
    color: black;
    text-align: center;
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
  .action-button {
      background-color: #2C3746;
      color: white;
      border-width: 1;
      border-color: #2E2E2E;
      border-radius: 7;
      font-size: 11;
      font-weight: 400;
      margin: 30, 30;
  }     
  .carousel-layout-fix{
    padding: 0.1 0;
    margin: -0.1 0;
  }
</style>