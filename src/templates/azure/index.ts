import "@fontsource-variable/outfit/wght.css";
import "./azure.css";
import type { TemplateModule } from "../../core/types";
import { AzureAuthFrame } from "./AuthFrame";
import { AzureLanding } from "./Landing";

const azure: TemplateModule = { Landing: AzureLanding, AuthFrame: AzureAuthFrame };

export default azure;
