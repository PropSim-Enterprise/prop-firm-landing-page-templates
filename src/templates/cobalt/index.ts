import "@fontsource-variable/plus-jakarta-sans/wght.css";
import "./cobalt.css";
import type { TemplateModule } from "../../core/types";
import { CobaltAuthFrame } from "./AuthFrame";
import { CobaltLanding } from "./Landing";

const cobalt: TemplateModule = { Landing: CobaltLanding, AuthFrame: CobaltAuthFrame };

export default cobalt;
