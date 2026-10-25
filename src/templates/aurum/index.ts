import "@fontsource-variable/inter/opsz.css";
import "@fontsource-variable/cormorant-garamond/wght.css";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "./aurum.css";
import type { TemplateModule } from "../../core/types";
import { AurumAuthFrame } from "./AuthFrame";
import { AurumLanding } from "./Landing";

const aurum: TemplateModule = { Landing: AurumLanding, AuthFrame: AurumAuthFrame };

export default aurum;
