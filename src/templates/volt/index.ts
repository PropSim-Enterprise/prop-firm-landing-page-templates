import "@fontsource-variable/archivo/wdth.css";
import "./volt.css";
import type { TemplateModule } from "../../core/types";
import { VoltAuthFrame } from "./AuthFrame";
import { VoltLanding } from "./Landing";

const volt: TemplateModule = { Landing: VoltLanding, AuthFrame: VoltAuthFrame };

export default volt;
