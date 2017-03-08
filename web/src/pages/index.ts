import { LandingLoader } from './Landing/Loader'
import { Work } from "./Work/Loader";
import { Works } from "./Works/Loader";
import { Profile } from "./Profile/Loader";
import { Blocks } from "./Blocks/Loader";
import { Claim } from "./Blocks/Claim/Loader";
import { SingleBlock } from "./Blocks/SingleBlock/Loader";
import { Portfolio } from "./Portfolio/Loader";
import { Licenses } from "./Licenses/Loader";
import { CreateWork } from "./CreateWork/Loader";
import { Network } from "./Network";
import { Documentation } from "./Documentation";
import { Company } from './Company';
import { Account } from "./Account";

export default [
  LandingLoader,
  Work,
  Works,
  Blocks,
  Claim,
  SingleBlock,
  Profile,
  Portfolio,
  Licenses,
  CreateWork,
  ...Network,
  ...Documentation,
  ...Company,
  ...Account,
]
