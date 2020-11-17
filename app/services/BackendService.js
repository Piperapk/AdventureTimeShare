export function defaultProfiePicture(picture) { //Check if there's a profile picture if not return the defualt app profile image
    if(picture) {
        return picture;
    } else {
        return "~/assets/images/DefaultProfile.png";
    }
};