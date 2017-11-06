import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ListCat } from '../../providers/list-cat';
import { UserService } from '../../providers/user-service';
import { SearchPage } from '../search/search';
import { LessonPage } from '../lesson/lesson';
import * as _ from 'lodash';


@Component({
  selector: 'page-kelaskat',
  templateUrl: 'kelaskat.html',
  providers: [ListCat, UserService]
})

export class KelaskatPage {
  latLng: any;
  teachersBack: any = [];
  categories: any = new Array(new Array(), new Array(), new Array());

  constructor(
    public userService: UserService,
    public alert: AlertController,
    public navCtrl: NavController,
    public listCat: ListCat,
    public modal: ModalController,
    public params: NavParams,
    public loadingCtrl: LoadingController
  ) {
    this.latLng = this.params.get('latLng');
    this.getData();
    this.displayLesson();
  }
  getData() {
    this.latLng = this.params.get('latLng');
    let loader = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    loader.present();
    this.userService.getTutorProducts().subscribe(snapshot => {

      // console.log(snapshot);
      this.teachersBack = [];
      if (snapshot == undefined || snapshot.length == 0) {
        alert('Tidak ada guru di daerah anda');
        return this.navCtrl.pop();
      }


      snapshot.forEach(childSnapshot => {
        var jarak = this.distance(this.latLng.data.latitude, this.latLng.data.longitude, childSnapshot.latitude, childSnapshot.longitude, "K");
        var data = childSnapshot;
        if (jarak <= 7 && data.status == true) {
          console.log(data);
          data.key = childSnapshot.$key;
          data.dataMurid = this.latLng.data;
          this.userService.getTutorProfile(data.userId).subscribe(updateSnap => {
            console.log(updateSnap);
            if (updateSnap != undefined && updateSnap.published == true) {
              var dats = updateSnap;
              data.avatar = dats.avatar;
              data.schedule = _.filter(dats.schedule, { status: true });
              data.universitas = dats.perguruanTinggi + ' ' + dats.universitas;
              this.userService.getTutorReview(data.userId).subscribe(sayonara => {
                console.log(data);
                var totalReview = sayonara.length;
                var rate = 0;
                sayonara.forEach(val => {
                  rate = rate + val.rate;
                })
                var rating = rate / totalReview;
                if (isNaN(rating) == true) {
                  rating = 0;
                }
                if (rating > 4) {
                  data.rating = "Awesome";
                } else if (rating > 3) {
                  data.rating = "Great";
                } else if (rating > 2) {
                  data.rating = "Very Good";
                } else if (rating > 1) {
                  data.rating = "Good"
                } else {
                  data.rating = "Average"
                }
                data.ratingNum = rating;
                data.pricefilter = parseInt(data.price);
                this.teachersBack.push(data);

              })
            }
          });

        }
      });

      loader.dismiss();
      console.log(this.teachersBack);
    })

  }
  distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist
  }
  displayLesson() {
    this.listCat.getCategory().orderByChild('parent').equalTo(true).on('value', (snapshot) => {
      var counter = 0, i = 0, dataRaw = [];
      snapshot.forEach((childSnapshot) => {
        var raw = childSnapshot.val();
        raw['key'] = childSnapshot.key;
        raw['imageURL'] = 'assets/' + childSnapshot.val().image + '.png';
        console.log(raw['imageURL']);
        i = Math.floor(counter / 2);
        console.log(raw);
        this.categories[i].push(raw);
        counter = counter + 1;
        //data['key'] = childSnapshot.key;
      });
    });
    console.log(this.categories);
    return this.categories;
  }

  goSearch(key) {
    if (key == '-KfQMIxSDCa1-T12Trze') {
      let umumModal = this.modal.create(LessonPage, { data: key, latLng: this.latLng });
      umumModal.present();
      umumModal.onDidDismiss(data => {
        console.log(data);
        if (data != undefined) {
          this.navCtrl.push(SearchPage, { data: data, users: this.teachersBack, latLng: this.latLng });
        } else if (data == 'dismiss') {
          return;
        } else {
          this.presentAlert('Guru belum tersedia disekitar lokasi belajar anda');
        }

      })
    }
    else {
      this.navCtrl.push(SearchPage, { data: key, users: this.teachersBack, latLng: this.latLng });
    }

  }
  goBack() {
    this.navCtrl.pop();
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
