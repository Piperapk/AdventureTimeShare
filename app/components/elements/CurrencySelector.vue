<template>
    <StackLayout>
        <Image margin="15, 15" opacity="0.75" src="~/assets/images/icons/close_icon.png" horizontalAlignment="right" width="20" height="20" stretch="aspectFit" @tap="$modal.close('close')"/>        
        <ListView for="currency in currencyList" @itemTap="onItemTap" margin="0, 15, 15">
            <v-template>
                <GridLayout verticalAlignment="center" >
                <Label :text="currency" fontSize="20" color="black" margin="5, 0" horizontalAlignment="center"/> 
                </GridLayout>            
            </v-template>
        </ListView> 
    </StackLayout>
</template>

<script>
export default {
    props: ['currencyList'],
    data() {
        return {
            
        }
    },

    methods: {
        onItemTap(currency) {
            this.$modal.close(currency.item)
        }
    }

}
</script>

<style scoped>

</style>