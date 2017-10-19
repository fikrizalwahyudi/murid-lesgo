import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, Platform } from 'ionic-angular';
import { KelaskatPage } from '../kelaskat/kelaskat';
import { ModalMuridPage } from '../modal-murid/modal-murid';

/*
  Generated class for the Kategori page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-kategori',
  templateUrl: 'kategori.html'
})
export class KategoriPage {
  latLng: any;
  myUserId: any;
  role: any;

  constructor(
    public plt: Platform,
    public navCtrl: NavController,
    public params: NavParams,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController
  ) {

    this.plt.registerBackButtonAction(() => {
      this.navCtrl.popToRoot();
    }, 1);
    let loader = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    loader.present();
    this.myUserId = this.params.get('uid');
    setTimeout(() => {
      let muridModal = this.modalCtrl.create(ModalMuridPage, { types: 'pilih', uid: this.myUserId, source: this.params.get('source') });
      muridModal.present();
      loader.dismiss()
      muridModal.onDidDismiss(data => {
        if (data == 'goHome' || data == null) {
          this.navCtrl.pop();
        } else {
          this.latLng = data;
        }

      })
    }, 2000);

    setTimeout(() => {
      loader.dismiss()
    }, 3000)
  }
  navigateTo(name: string) {
    let loader = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide',
      dismissOnPageChange: true
    });
    loader.present();
    if (name == 'Les') {
      this.navCtrl.push(KelaskatPage, { latLng: this.latLng });
    }
    if (name == 'back') {
      this.navCtrl.pop();
    }

  }

}
