import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
/*
  Generated class for the Detail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html'
})
export class DetailPage {
  iconDetails: any;
  sessionActive: any;
  rate: any = 5;
  profile: any = { firstName: 'Hery', lastName: ' Prasetyo', location: 'Jl Abdul Majid no 65', label: 'Universitas Indonesia' };

  constructor(
    public navCtrl: NavController
  ) {
    this.rate = 5;
    this.iconDetails = 'ios-arrow-down-outline';
  }

  ionViewDidLoad() {
    console.log('Hello DetailPage Page');
  }

  sessionDetail(sessionId) {
    if (this.sessionActive != sessionId) {
      this.sessionActive = sessionId;
      this.iconDetails = 'ios-arrow-down-outline';
    }
    else {
      this.sessionActive = null;
      this.iconDetails = 'ios-arrow-forward-outline';
    }
  }

  thousandMask(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
}
