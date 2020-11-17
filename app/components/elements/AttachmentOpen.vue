<template>
    <GridLayout rows="auto, *">
        <!-- Custom Actionbar -->
        <StackLayout row="0">
            <GridLayout rows="auto" columns="*, auto" verticalAlignment="center" margin="15, 15, 0, 15" >
                <Label col="0" class="trip-text-heading" marginRight="10" :text="`${attachmentTypeName(attachment)}: ${attachment.name ? attachment.name : ''}`" horizontalAlignment="left" textWrap="true"/>                
                <Image col="1" opacity="0.75" src="~/assets/images/icons/close_icon.png" horizontalAlignment="right" width="20" height="20" stretch="aspectFit" @tap="$modal.close()"/>                             
            </GridLayout>               
        </StackLayout>  
        <!-- Attachment -->   
        <StackLayout row="1" class="basic-profile-info">
            <Label class="trip-text" :text="attachment.text" textWrap="true" />              
        </StackLayout>
    </GridLayout>  
</template>

<script>
export default {
    name: 'AttachmentOpen',
    props: ['attachment'],
    data() {
        return {
            
        }
    },

    methods: {
        onItemTap(attachment) {
            this.$modal.close()
        },

        attachmentTypeName(attachment) {
            switch (attachment.type) {
                case 'note': return "Note"; break;
                case 'link': return "Link"; break;
                case 'file': return "File"; break;
                case 'list': return "List"; break;                    
            }
        }         
    },

    created() {
        
    }

}
</script>

<style scoped>
    .basic-profile-info {
        margin: 15, 25;
    }  
    .trip-text-heading {
        color: #2E2E2E;
        font-size: 15;
        font-weight: 500;
    }   
    .trip-text {
        color: #2E2E2E;
        margin: 0;
    }    
</style>