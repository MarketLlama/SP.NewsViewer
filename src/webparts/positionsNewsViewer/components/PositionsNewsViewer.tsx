import * as React from 'react';
import styles from './PositionsNewsViewer.module.scss';
import { IPositionsNewsViewerProps } from './IPositionsNewsViewerProps';
import { IPositionsNewsViewerState } from './IPositionsNewsViewerState'
import { escape } from '@microsoft/sp-lodash-subset';
import Moment from 'react-moment';
import {sp , Web}  from '@pnp/pnpjs';

export interface newsItem {
  Title : string;
  NewsDate : string;
  PageId : number;
  NewsTeaser : string;
  HighlightNews : boolean;
  NewsContent : string;
}

export default class PositionsNewsViewer extends React.Component<IPositionsNewsViewerProps, IPositionsNewsViewerState> {
  constructor(props) {
    super(props);
    this.state = {
        news : []
    };
  }

  public render(): React.ReactElement<IPositionsNewsViewerProps> {
    return (
      <div className={ styles.positionsNewsViewer }>
        {this.state.news.length == 0? <h2>No News</h2> : this.state.news}
      </div>
    );
  }
  public componentDidMount() {
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
        .select("Title", "NewsDate", "NewsTeaser", "NewsImage", "TopNews", "HighlightNews", "NewsContent","Page/ID")
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
              NewsContent :  item.NewsContent
            });
          });
          resolve(newsItems);
        });
      } catch (error) {
        reject(error);
      }
    });
  }  

  private _renderNewsCell = (item : newsItem, isLast : boolean) : JSX.Element =>{
    return (
      <div className={styles.newsCell}>
        <div className={styles.headline}>
          <h2>{item.Title}</h2>
        </div>
        <div className={styles.date}>
          <i><Moment format="DD/MM/YYYY">{item.NewsDate}</Moment></i>
        </div>
        <div className={styles.content}>
          <p>{item.NewsContent}</p>
        </div>
        {!isLast? <hr/> : null}
      </div>
    );
  }
}
