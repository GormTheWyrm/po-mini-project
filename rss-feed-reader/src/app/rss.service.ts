import { EventEmitter, Injectable } from '@angular/core';
import { Subscription, BehaviorSubject, Subject } from 'rxjs';
import { Article } from './Article';

@Injectable({
  providedIn: 'root'
})
export class RssService {
  CORS_PROXY = "https://corsanywhere.herokuapp.com/"
  rss_url: string = 'https://www.usda.gov/rss/home.xml'; //change

  articles: Article[] = [];

  urlList: string[] = []; //holds list of urls

  articleEmitter = new Subject<Article[]>();
  //switch to behavior subject...
  //new EventEmitter<Article[]>(); //produced event...

  // subscription:Subscription = [];

  constructor() { }

  setData(rss_url: string): Article[] {
    fetch(this.CORS_PROXY + rss_url
    ).then(res => res.text())
      .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
      .then(data => {
        console.log(data)
        console.log(data.documentElement.getElementsByTagName("title").length)
        //empty data so we dont just add to it...
        this.articles = []; // deletes old list
        for (let i = 0; i < data.documentElement.getElementsByTagName("title").length; i++) {
          if (data.documentElement.getElementsByTagName("description")[i]) {
            let art: Article = {
              'title': data.documentElement.getElementsByTagName("title")[i].innerHTML,
              'description': data.documentElement.getElementsByTagName("description")[i].innerHTML,
              'link': data.documentElement.getElementsByTagName("link")[i].innerHTML
            }
            //may want to strip broken http from this... check abeils code
            this.articles.push(art);
            console.log("articles updated");
          }

        }
        this.articleEmitter.next(this.articles)
        return this.articles;
      })
    //need to add error handling... near here?
    return []; //should only hit if error... because errorhandling not dealt with yet
  }


  //not used yet
  getUrls(): string[] {
    return this.urlList;
  }
  addUrl(url: string) {
    this.urlList.push(url);
  }
  removeUrl() {
    //not implmented...
  }
}

// this needs to be a behavrior subject I believe -otherwise it will be hard to pas around


//.. may try extracting the title {...title}...geez, too tired to remember what thats called