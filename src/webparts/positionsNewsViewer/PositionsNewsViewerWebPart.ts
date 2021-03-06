/**IE Pollyfill */

import 'core-js/es6/array';
import 'es6-map/implement';
import 'core-js/es6/promise';
import 'whatwg-fetch';
import "@pnp/polyfill-ie11";

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'PositionsNewsViewerWebPartStrings';
import PositionsNewsViewer from './components/PositionsNewsViewer';
import { IPositionsNewsViewerProps } from './components/IPositionsNewsViewerProps';
import { loadTheme } from 'office-ui-fabric-react';
import { initializeIcons } from '@uifabric/icons';
initializeIcons();

loadTheme({
  palette: {
    themePrimary: '#5f7800',
    themeLighterAlt: '#f7faf0',
    themeLighter: '#e1e9c4',
    themeLight: '#c9d696',
    themeTertiary: '#97ae46',
    themeSecondary: '#6e8810',
    themeDarkAlt: '#546c00',
    themeDark: '#475b00',
    themeDarker: '#354300',
    neutralLighterAlt: '#f8f8f8',
    neutralLighter: '#f4f4f4',
    neutralLight: '#eaeaea',
    neutralQuaternaryAlt: '#dadada',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c8c8',
    neutralTertiary: '#c2c2c2',
    neutralSecondary: '#858585',
    neutralPrimaryAlt: '#4b4b4b',
    neutralPrimary: '#333333',
    neutralDark: '#272727',
    black: '#1d1d1d',
    white: '#ffffff',
  }
});

export interface ICustomNewsWebPartProps {
  description: string;
}
export interface IPositionsNewsViewerWebPartProps {
  description: string;
}

export default class PositionsNewsViewerWebPart extends BaseClientSideWebPart<IPositionsNewsViewerWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IPositionsNewsViewerProps > = React.createElement(
      PositionsNewsViewer,
      {
        description: this.properties.description,
        context : this.context,
        displayMode: this.displayMode
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
