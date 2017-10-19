import { Component } from '@angular/core';
import { NavController, ViewController, ModalController } from 'ionic-angular';

/*
  Generated class for the Filter page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html'
})
export class FilterPage {
  data: any = { rating: '', harga: '' };
  rating: any;
  harga: any;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController
  ) { }

  ionViewDidLoad() {
    console.log('Hello FilterPage Page');
  }
  send() {
    this.data = { rating: this.rating, harga: this.harga };
    this.viewCtrl.dismiss({ data: this.data, name: 'filter' });
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

}
