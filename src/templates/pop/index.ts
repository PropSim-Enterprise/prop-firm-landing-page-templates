import "@fontsource-variable/space-grotesk/wght.css";
import "./pop.css";
import type { TemplateModule } from "../../core/types";
import { PopAuthFrame } from "./AuthFrame";
import { PopLanding } from "./Landing";

const pop: TemplateModule = { Landing: PopLanding, AuthFrame: PopAuthFrame };

export default pop;
