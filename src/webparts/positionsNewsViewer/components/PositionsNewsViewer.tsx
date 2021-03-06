import * as React from 'react';
import styles from './PositionsNewsViewer.module.scss';
import { IPositionsNewsViewerProps } from './IPositionsNewsViewerProps';
import { IPositionsNewsViewerState } from './IPositionsNewsViewerState'
import { escape } from '@microsoft/sp-lodash-subset';
import Moment from 'react-moment';
import {sp , Web}  from '@pnp/pnpjs';
import { Environment, EnvironmentType, DisplayMode } from '@microsoft/sp-core-library';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';

export interface newsItem {
  Title : string;
  NewsDate : string;
  PageId : number;
  NewsTeaser : string;
  HighlightNews : boolean;
  NewsContent : string;
  Id : number;
}

export default class PositionsNewsViewer extends React.Component<IPositionsNewsViewerProps, IPositionsNewsViewerState> {

  constructor(props) {
    super(props);
    this.state = {
        news : [],
        pageStatus : false
    };
  }

  public render(): React.ReactElement<IPositionsNewsViewerProps> {
    return (
      <div className={ styles.positionsNewsViewer }>
        {this.state.news.length == 0? <strong>No News</strong> : this.state.news}
      </div>
    );
  }
  public componentDidMount() {
    this._setPageStatus();
    this._renderNewsItems();
  }

  private _renderNewsItems = async () =>{
    let newsItems : newsItem[] = await this._getNews();
    let news = [];
    for (let i = 0; i < newsItems.length ; i++) {
      news.push(this._renderNewsCell(newsItems[i], (i == (newsItems.length-1))));
    }
    this.setState({
      news : news
    });
  }

  private _getNews = async() : Promise<newsItem[]> => {
    return new Promise<newsItem[]>((resolve, reject) =>{
      let newsItems : newsItem[] = [];
      try {
        const PageID = this.props.context.pageContext.listItem.id;
        sp.web.lists.getByTitle('News').items
        .select("Title", "NewsDate", "NewsTeaser", "NewsImage", "TopNews", "HighlightNews", "NewsContent","Page/ID", "Id")
        .orderBy('NewsDate', false)
        .expand("Page")
        .filter('PageId eq ' + PageID).get().then(items =>{
          items.forEach(item =>{
            newsItems.push({
              Title : item.Title,
              NewsDate : item.NewsDate,
              PageId : item.PageId,
              NewsTeaser : item,
              HighlightNews : item.HighlightNews,
              NewsContent :  item.NewsContent,
              Id : item.Id
            });
          });
          resolve(newsItems);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  private _setPageStatus = () => {
    //Detect display mode on classic and modern pages pages
    if(Environment.type == EnvironmentType.ClassicSharePoint){
      let isInEditMode: boolean;
      let interval: any;
      interval = setInterval(function(){
        if (typeof window['SP'].Ribbon !== 'undefined'){
          isInEditMode = window['SP'].Ribbon.PageState.Handlers.isInEditMode();
          if(isInEditMode){
            this.setState({
              pageStatus : true
            });
          }else{
            this.setState({
              pageStatus : false
            });
          }
          clearInterval(interval);
        }
      }.bind(this),100)
    } else if(Environment.type == EnvironmentType.SharePoint){
      if(this.props.displayMode == DisplayMode.Edit){
        this.setState({
          pageStatus : true
        });
      }else if(this.props.displayMode == DisplayMode.Read){
        this.setState({
          pageStatus : false
        });
      }
    }
  }

  private _renderNewsCell = (item : newsItem, isLast : boolean) : JSX.Element =>{
    return (
      <div className={styles.newsCell}>
        <div style={!this.state.pageStatus ? {display : 'none'}: { position: 'absolute', right: 0 , top: '-5px'}}>
              <ActionButton
                onClick = {() => {this._deleteNews(item)} }
              >
              x
            </ActionButton>
          </div>
        <div className={styles.headline}>
          <strong>{item.Title}</strong>
        </div>
        <div className={styles.date}>
          <i><Moment format="YYYY-MM-DD">{item.NewsDate}</Moment></i>
        </div>
        <div className={styles.content}>
          <p dangerouslySetInnerHTML={{__html:item.NewsContent}}></p>
        </div>
        {!isLast? <hr/> : null}
      </div>
    );
  }

  private _deleteNews = (item) =>{
    if(confirm('Continue to delete this news item?')){
      let list = sp.web.lists.getByTitle("News");
      list.items.getById(item.Id).delete().then(_ => {
        this._renderNewsItems();
      });
    }
  }
}
