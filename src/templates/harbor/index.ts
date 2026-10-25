import "@fontsource-variable/manrope/wght.css";
import "./harbor.css";
import type { TemplateModule } from "../../core/types";
import { HarborAuthFrame } from "./AuthFrame";
import { HarborLanding } from "./Landing";

const harbor: TemplateModule = { Landing: HarborLanding, AuthFrame: HarborAuthFrame };

export default harbor;
