import LogIn from '../components/LogIn'
import SignUp from '../components/SignUp'
import SignUpSetup from '../components/SignUpSetup'
import Onboard from '../components/Onboard'

import Feed from '../components/Feed'
import Trips from '../components/Trips'
import Chat from '../components/Chat'

import NewTrip from '../components/NewTrip'
import TripPreview from '../components/TripPreview'
import TripPreviewGo from '../components/TripPreviewGo'
import TripCurrent from '../components/TripCurrent'
import TripCurrentEdit from '../components/TripCurrentEdit'
import Attachments from '../components/Attachments'
import AttachmentOpen from '../components/elements/AttachmentOpen'
import ChatCurrent from '../components/ChatCurrent'
import ChatPrivate from '../components/ChatPrivate'
import Profile from '../components/Profile'
import ProfilePreview from '../components/ProfilePreview'
import EditProfile from '../components/EditProfile'

const routes = {
  login: LogIn,
  signup: SignUp,
  signupsetup: SignUpSetup,
  onboard: Onboard,
  feed: Feed,
  trips: Trips,
  chat: Chat,
  newtrip: NewTrip,
  trippreview: TripPreview,
  trippreviewgo: TripPreviewGo,
  tripcurrent: TripCurrent,
  tripcurrentedit: TripCurrentEdit,
  attachments: Attachments,
  attachmentopen: AttachmentOpen,
  chatcurrent: ChatCurrent,
  chatprivate: ChatPrivate,  
  profile: Profile,
  profilepreview: ProfilePreview,
  editprofile: EditProfile,
}

export default routes