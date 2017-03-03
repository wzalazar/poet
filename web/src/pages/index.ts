import { LandingLoader } from './Landing/Loader'
import { Work } from "./Work/Loader";
import { Works } from "./Works/Loader";
import { Profile } from "./Profile/Loader";
import { Blocks } from "./Blocks/Loader";
import { Claim } from "./Blocks/Claim/Loader";
import { SingleBlock } from "./Blocks/SingleBlock/Loader";
import { About } from "./About/Loader";
import { Documentation } from "./Documentation/Loader";
import { Portfolio } from "./Portfolio/Loader";
import { Licenses } from "./Licenses/Loader";
import { CreateWork } from "./CreateWork/Loader";
import { NotificationsPage } from "./Account/Notifications/Loader";
import { UserProfile } from "./Account/Settings/Loader";
import { UserWallet } from "./Account/Wallet/Loader";

export default [
  LandingLoader,
  Work,
  Works,
  Blocks,
  NotificationsPage,
  Claim,
  SingleBlock,
  Profile,
  About,
  Documentation,
  Portfolio,
  Licenses,
  CreateWork,
  UserProfile,
  UserWallet
]
