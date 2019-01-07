import {IWebPartContext} from "@microsoft/sp-webpart-base";
import { DisplayMode } from '@microsoft/sp-core-library';

export interface IPositionsNewsViewerProps {
  description: string;
  context : IWebPartContext;
  displayMode : DisplayMode;

}
