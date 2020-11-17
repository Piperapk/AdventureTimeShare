<template>
    <StackLayout margin="5, 0, 5">
        <Image margin="15, 15" opacity="0.75" src="~/assets/images/icons/close_icon.png" horizontalAlignment="right" width="20" height="20" stretch="aspectFit" @tap="$modal.close('close')"/> 
        <StackLayout height="1" backgroundColor="#E1E1E1"/>            
        <Label v-show="!tripLength" text="Please select days for the trip" fontSize="15" color="black" margin="10, 0" horizontalAlignment="center" @tap="$modal.close()"/> 
        <ListView for="day in dayList" @itemTap="onItemTap" margin="0, 15" height="80%">
            <v-template>
                <GridLayout verticalAlignment="center" >
                <Label :text="`Day ${day} (${dayDates(day)})`" fontSize="20" color="black" margin="5, 0" horizontalAlignment="center"/> 
                </GridLayout>            
            </v-template>
        </ListView>       
        <StackLayout height="1" backgroundColor="#E1E1E1"/>      
        <Label v-show="tripLength" text="Remove day" fontSize="20" color="black" margin="10, 0" horizontalAlignment="center" @tap="$modal.close()"/> 
    </StackLayout>
</template>

<script>
export default {
    props: ['tripLength', 'tripDateFrom'],
    data() {
        return {
            dayList: []
        }
    },

    methods: {
        onItemTap(day) {
            this.$modal.close(day.item)
        },

        dayDates(day) { //For date rendering
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            let date = null
            let month = null
            if(day == 1) {
                date = this.tripDateFrom.getDate()
                month = monthNames[this.tripDateFrom.getMonth()] 
            } else {
                date = new Date(this.tripDateFrom.getTime() + (1000 * 60 * 60 * 24 * (day - 1) ) ).getDate()
                month = monthNames[new Date(this.tripDateFrom.getTime() + (1000 * 60 * 60 * 24 * (day - 1) ) ).getMonth()] 
            }
            return `${date} ${month}`      
        }
    },

    created() {
        for(let i = 0; i < this.tripLength; i++){
            this.dayList.push(i + 1)
        }            
    }

}
</script>

<style scoped>

</style>