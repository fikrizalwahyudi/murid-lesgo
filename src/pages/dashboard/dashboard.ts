import { Component, Pipe, PipeTransform } from '@angular/core';
import { NavController, NavParams, LoadingController, PopoverController, ModalController } from 'ionic-angular';
import { ListCat } from '../../providers/list-cat';
import { Zapier } from '../../providers/zapier';
import { UserService } from '../../providers/user-service'
import { HomePage } from '../home/home';
import { KategoriPage } from '../kategori/kategori';
import { OrderPage } from '../order/order';
import { PaketPage } from '../paket/paket';
import * as firebase from 'firebase';
import * as _ from 'lodash';
import * as moment from 'moment';

/*
  Generated class for the Dashboard page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Pipe({
  name: 'filterDay',
  pure: false
})
export class FilterDay implements PipeTransform {
  transform(items: any[], filter: any): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter(item => item.day.indexOf(filter.day) !== -1 && item.jam == filter.jam);
  }
}
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
  providers: [ListCat, UserService, Zapier]
})
export class DashboardPage {

  profile: any = [];
  profileGuru: any = 'Detail';
  butOff: any;
  price: any;
  latLng: any;
  userId: any;
  class: any = [];
  jadwal: any;
  matpel: any;
  schedule: any = [];
  jadwalData: any;
  tutorOrder: any = [];
  paketData: any;
  listBlockedDate: any = [];
  moment: any = moment;
  constructor(
    public zapier: Zapier,
    public navCtrl: NavController,
    public listCat: ListCat,
    public userService: UserService,
    public params: NavParams,
    public popoverCtrl: PopoverController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController
  ) {
    this.butOff = 'kelas';
    console.log(this.params.data);
    this.userId = this.params.get('key');
    this.paketData = this.params.get('paket');
    this.latLng = this.params.get('latLng').data;
    console.log(this.latLng);
    this.displayUser(this.userId.userId);
    this.getBookedSession(this.userId.userId);

    this.schedule = this.userId.schedule;
    // this.price = this.params.data.key.price;
    // this.profile = this.getProfile();
    console.log(this.profile);
  }
  test(startDate, uid) {

    let loader = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    loader.present();
    this.zapier.getUnavailability(startDate, uid).subscribe(res => {
      console.log(res);
      if (res != undefined && res.length != 0) {
        this.tutorOrder = res;
        console.log(this.tutorOrder)
        loader.dismissAll();
      }
    })
  }

  getTutorBooked(day, time, jam) {
    var a = _.filter(this.tutorOrder, { day: day });
    var b = _.filter(a, {});
  }

  getBookedSession(uid) {
    let loader = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    loader.present();
    this.userService.getTutorSession(uid).subscribe(data => {
      console.log('data', data)
      this.tutorOrder = [];
      data.forEach(orderData => {
        if (orderData.status == 'booked' || orderData.status == 'pending' || orderData.status == 'cart') {
          orderData.sessions.forEach(sesi => {
            var data = sesi;
            data.date = moment(data.date).format('MM-DD-YYYY');
            this.tutorOrder.push(sesi);
          })
        }
      })
      loader.dismissAll();
      console.log('this.tutorOrder', this.tutorOrder);
    })
  }
  displayUser(theUserId) {
    let lola = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    lola.present();
    // this.test(moment().add(1, 'day').format('DD-MM-YYYY'), this.userId.userId)
    this.userService.viewTeacher(theUserId).once('value', snapshot => {
      var dats = snapshot.val();
      this.profile = dats;
      this.displayClass(this.userId.userId);
      lola.dismiss();
    })
  }
  displayClass(uid) {
    let loads = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    loads.present();
    this.listCat.getTeacherProducts(uid).on("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var data = childSnapshot.val();
        this.class.push(data);
      })
      loads.dismiss();
    });
  };

  onChange(name) {
    let test = this.loadingCtrl.create({ showBackdrop: false, spinner: 'hide' });
    test.present();
    console.log(name);
    if (this.butOff != name) {
      this.butOff = name;
      test.dismiss()
    }
    else {
      this.butOff = 'empty';
      test.dismiss()
    }
  }
  orderMe() {
    console.log('this.userId', this.userId)
    this.navCtrl.push(PaketPage, {
      name: this.profile.fullName, course: this.params.data.key.courses,
      price: this.userId.price, category: this.params.data.key.categoryName,
      type: 'order', data: this.paketData, blocked: this.tutorOrder,
      schedule: this.schedule, profile: this.profile,
      session: this.paketData, check: this.tutorOrder,
      userId: {
        rating: this.userId.rating,
        categoryName: this.userId.categoryName,
      },
      latLng: {
        uid: this.latLng.userId,
        latitude: this.latLng.latitude,
        longitude: this.latLng.longitude,
        firstName: this.latLng.firstName,
        lastName: this.latLng.lastName,
        key: this.latLng.key,
        address: this.latLng.address,
        avatar: this.latLng.avatar,
      },
      isFirst: true
    });
  }
  cekTutor(hour, hari) {
    var data = [];
    for (let i = 0; i < this.tutorOrder.length; i++) {
      if (this.tutorOrder[i].day == hari && this.tutorOrder[i].jam == hour + '') {
        data.push(moment(this.tutorOrder[i].date).format('DD-MMM-YYYY'));
      }
    }
    return data;
  }
  formatDay(day) {
    if (day == "Monday") return "Senin";
    if (day == "Tuesday") return "Selasa";
    if (day == "Wednesday") return "Rabu";
    if (day == "Thursday") return "Kamis";
    if (day == "Friday") return "Jumat";
    if (day == "Saturday") return "Sabtu";
    if (day == "Sunday") return "Minggu";
  }
}
