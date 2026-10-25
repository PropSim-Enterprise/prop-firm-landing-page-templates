import "@fontsource-variable/inter/opsz.css";
import "./onyx.css";
import type { TemplateModule } from "../../core/types";
import { OnyxAuthFrame } from "./AuthFrame";
import { OnyxLanding } from "./Landing";

const onyx: TemplateModule = { Landing: OnyxLanding, AuthFrame: OnyxAuthFrame };

export default onyx;
