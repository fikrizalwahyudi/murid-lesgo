import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { HomePage } from '../home/home';

/*
  Generated class for the Error page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-error',
  templateUrl: 'error.html'
})
export class ErrorPage {

  constructor(
    public plt: Platform,
    public network: Network,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.plt.registerBackButtonAction(() => {
    });
  }

  ionViewDidLoad() {
    let connectSubscription = this.network.onConnect().subscribe(() => {
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {

        connectSubscription.unsubscribe();
        this.navCtrl.pop();
      }, 3000);
    });

  }

}
