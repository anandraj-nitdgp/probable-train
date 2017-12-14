import { Component, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Player } from '../team-data/player';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { PagedData } from '../util/paged-data';
import { OnChanges, SimpleChanges, Input } from '@angular/core';
import { PlayerName } from '../add-data/add-data.component';
import { NgForm } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Elements } from '../util/elements.enum';
import { CssUtilService } from '../util/css-util.service';

@Component({
  selector: 'app-recent-form',
  templateUrl: './recent-form.component.html',
  styleUrls: ['./recent-form.component.css']
})
export class RecentFormComponent implements OnInit {

  playerNames: PlayerName[];
  private elementsRecieved: Number;
  private page: PagedData;
  private playerId: Number;

  constructor(private http: Http, private cssUtilService: CssUtilService) {
    this.page = new PagedData();
  }

  ngOnInit() {
    const baseEndpoint = environment.serverUrl;
    const nameEndpoint = '/api/players';
    const projection = 'getPlayerNames';
    const page = 0;
    this.playerNames = new Array(1);
    this.cssUtilService.makeTabActive(Elements.recentForm);
    this.http.get(baseEndpoint + nameEndpoint).subscribe(response => {
      this.page = JSON.parse(JSON.stringify(response.json()['page']));
      console.log(this.page.totalElements);
      this.playerNames = new Array(this.page.totalElements.valueOf());
      const that = this;
      that.getData(baseEndpoint + nameEndpoint, projection, this.page.totalElements)
        .subscribe(response2 => {
          that.playerNames = JSON.parse(JSON.stringify(response2.json()['_embedded']['players']));
          that.elementsRecieved = Number(JSON.stringify(response2.json()['page']['size']));
          console.log('Names : ' + JSON.stringify(that.playerNames));
        }, error => {
          that.handleErrorObservable(error);
        });
    });
  }

  private getData(baseEndpoint: String, projection: String, numberOfELements: Number) {
    const url = baseEndpoint + '?projection=' + projection + '&sort=playerName' + '&size=' + numberOfELements;
    console.log('URL: ' + url);
    return this.http.get(url);
  }

  private handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

}
