import "@fontsource-variable/inter/opsz.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./ivory.css";
import type { TemplateModule } from "../../core/types";
import { IvoryAuthFrame } from "./AuthFrame";
import { IvoryLanding } from "./Landing";

const ivory: TemplateModule = { Landing: IvoryLanding, AuthFrame: IvoryAuthFrame };

export default ivory;
