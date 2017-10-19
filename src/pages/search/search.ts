import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, AlertController, Modal } from 'ionic-angular';
import { ListCat } from '../../providers/list-cat';
import { UserService } from '../../providers/user-service';
import { DashboardPage } from '../dashboard/dashboard';
import { PreferencePage } from '../preference/preference';
import { PelajaranPage } from '../pelajaran/pelajaran';
import { PaketPage } from '../paket/paket';
import { FilterPage } from '../filter/filter';
import * as _ from 'lodash';
import * as firebase from 'firebase';
/*
  Generated class for the Search page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/


@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers: [ListCat, UserService]
})
export class SearchPage {
  listTeacher: any;
  teachers: any = [];
  teachersBack: any = [];
  teacherData: any = [];
  firstData: any;
  idData: any;
  latLng: any;
  userId: any;
  nameData: any;
  userName: any;
  gender: any;
  data: any;
  paketData: any = [];
  jadwalData: any;
  pelajaranData: any;
  filterData: any;
  preferenceData: any;
  loader: any;

  currentPickByPelajaran: any;
  currentPickByPaket: any;


  constructor(
    public modal: ModalController,
    public alert: AlertController,
    public navCtrl: NavController,
    public listCat: ListCat,
    public userService: UserService,
    public params: NavParams,
    public loadingCtrl: LoadingController
  ) {
    this.idData = this.params.get('data');
    this.teachersBack = this.params.get('users');
    this.teachers = _.filter(this.params.get('users'), { categoryId: this.idData });
    this.currentPickByPelajaran = this.teachers.slice();
    this.currentPickByPaket = this.teachers.slice();

    this.latLng = this.params.get('latLng');
    if (this.teachers.length == 0 || this.teachers == undefined) {
      this.presentAlert('Guru belum tersedia disekitar lokasi belajar anda');
      this.navCtrl.pop();
    }
  };

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide',
      duration: 500
    });
    loader.present();
  }

  showProfile(key) {
    let loader = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide',
      dismissOnPageChange: true
    });
    loader.present();
    if (this.paketData.length == 0) {
      this.paketData = 0;
    }
    this.navCtrl.push(DashboardPage, { key: key, paket: this.paketData, latLng: this.latLng });
    loader.dismiss();
  }

  goPick(name) {
    if (name == 'pelajaran') {
      this.serchByPelajaran();
    }
    if (name == 'paket') {
      this.searchByPaket();
    }
    if (name == 'preference') {
      this.searchByPreference();
    }
  }

  serchByPelajaran() {
    let pelajaranModal = this.modal.create(PelajaranPage, { name: name, data: this.pelajaranData });
    pelajaranModal.present();
    pelajaranModal.onDidDismiss(data => {
      let haveData = Array.isArray(data) ? data.length : data;
      if (!haveData) {
        return pelajaranModal = undefined;
      };
      this.pelajaranData = data;
      var counterByPelajaran = [];
      this.teachers = _.filter(this.teachersBack, { categoryId: this.idData })
      if (data) {
        this.teachersBack.forEach((teacher) => {
          var theData = [];
          for (let i = 0; i < data.length; i++) {
            if (_.findIndex(teacher.courses, data[i]) != -1) {
              theData.push(_.findIndex(teacher.courses, data[i]));
            }
          }
          if (theData.length == data.length) {
            counterByPelajaran.push(teacher);
          }
        });
        if (counterByPelajaran.length) {
          this.teachers = counterByPelajaran;
        } else {
          this.presentAlert('Tidak ada guru dengan filter Pelajaran tersebut')
        }
      }
      this.currentPickByPelajaran = this.teachers.slice();
      this.currentPickByPaket = this.teachers.slice();
      pelajaranModal = undefined;
    })
  }
  searchByPaket() {
    let paketModal = this.modal.create(PaketPage, { type: 'search', data: this.paketData });
    paketModal.present();
    paketModal.onDidDismiss(data => {
      if (!data || !data.frekuensi) {
        return paketModal = undefined;
      }
      console.log(data);
      var counterPickPaket = [];
      this.teachers = this.currentPickByPelajaran.slice();
      if (data && data.frekuensi) {
        this.teachers.forEach((teacher) => {
          var theData = [];
          for (let i = 0; i < data.day.length; i++) {
            if (_.findIndex(teacher.schedule, { "day": data.day[i].day }) != -1) {
              theData.push(_.findIndex(teacher.schedule, { "day": data.day[i].day }));
            }
          }
          if (theData.length == data.day.length) {
            counterPickPaket.push(teacher);
          }
        });
        if (counterPickPaket.length) {
          this.teachers = counterPickPaket;
          this.currentPickByPaket = this.teachers.slice();
        } else {
          this.presentAlert('Tidak ada guru dengan filter Pakat tersebut')
        }
      }
      paketModal = undefined;
    })
  }

  searchByPreference() {
    let preferenceModal: Modal = this.modal.create(PreferencePage, { name: name, data: this.preferenceData });
    preferenceModal.present();
    preferenceModal.onDidDismiss(data => {
      if (!data) {
        return preferenceModal = undefined;
      }
      console.log(data);
      this.preferenceData = data;
      this.teachers = this.currentPickByPaket.slice();
      if (data) {
        let gender = (data.gender != 'dismiss' && _.findIndex(this.teachers, { gender: data.gender }) != -1) || data.gender == 'dismiss';
        let name = (data.tutorName != 'dismiss' && this.teachers.filter((v: any) => {
          return (v.firstName + ' ' + v.lastName).toLowerCase().indexOf(data.tutorName.toLowerCase()) != -1;
        }).length) || data.tutorName == 'dismiss';
        let univ = (data.univ != 'dismiss' && this.teachers.filter((v: any) => {
          return v.universitas.toLowerCase().indexOf(data.univ.toLowerCase()) != -1;
        }).length) || data.univ == 'dismiss';
        if (gender && name && univ) {
          this.teachers = data.gender != 'dismiss' ? _.filter(this.teachers, { gender: data.gender }) : this.teachers;
          console.log(this.teachers)
          this.teachers = data.tutorName != 'dismiss' && this.teachers.length ? this.teachers.filter((v: any) => {
            return (v.firstName + ' ' + v.lastName).toLowerCase().indexOf(data.tutorName.toLowerCase()) != -1;
          }) : this.teachers;
          this.teachers = data.univ != 'dismiss' && this.teachers.length ? this.teachers.filter((v: any) => {
            return v.universitas.toLowerCase().indexOf(data.univ.toLowerCase()) != -1;
          }) : this.teachers;
          if (!this.teachers.length) {
            this.teachers = this.currentPickByPaket.slice();
            this.presentAlert('Tidak ada guru dengan filter Preference tersebut')
          }
        } else {
          this.teachers = this.currentPickByPaket.slice();
          this.presentAlert('Tidak ada guru dengan filter Preference tersebut')
        }
      }
      preferenceModal = undefined;
    })
  }

  goFilter(name) {
    let filterModal = this.modal.create(FilterPage, { name: name, data: this.filterData });
    filterModal.present();
    filterModal.onDidDismiss(data => {
      console.log(data);
      if (data != undefined) {
        if (data.data.rating == 'rendah') {
          this.teachers = _.sortBy(this.teachers, 'ratingNum');
        }
        else if (data.data.rating == 'tinggi') {
          this.teachers = _.reverse(_.sortBy(this.teachers, 'ratingNum'));
        }
        if (data.data.harga == 'mahal') {
          this.teachers = _.reverse(_.sortBy(this.teachers, 'pricefilter'));
          console.log(this.teachers);
        }
        else if (data.data.harga == 'murah') {
          console.log(this.teachers)
          this.teachers = _.sortBy(this.teachers, 'pricefilter');
        }
      }
    })
  }

  refresh() {
    if (this.teachers.length == 0 && this.teachersBack.length != 0) {
      this.teachers = this.teachersBack;
      this.presentAlert('Tidak ada guru dengan data tersebut')
    }
  }

  GetItBack() {
    return this.teachers = this.teachersBack;
  }

  thousandMask(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  presentAlert(message) {
    let alert = this.alert.create({
      title: 'Sorry',
      message: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
