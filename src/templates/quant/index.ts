import "@fontsource-variable/jetbrains-mono/wght.css";
import "./quant.css";
import type { TemplateModule } from "../../core/types";
import { QuantAuthFrame } from "./AuthFrame";
import { QuantLanding } from "./Landing";

const quant: TemplateModule = { Landing: QuantLanding, AuthFrame: QuantAuthFrame };

export default quant;
