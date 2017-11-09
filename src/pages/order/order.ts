import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController, ModalController, LoadingController } from 'ionic-angular';
import { CartPage } from '../cart/cart';
import { HomePage } from '../home/home';
import { KategoriPage } from '../kategori/kategori';
import { UserService } from '../../providers/user-service'
import * as _ from 'lodash';
import * as moment from 'moment';
import { Helper } from '../../providers/helper';

/*
  Generated class for the Order page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
  providers: [UserService]
})
export class OrderPage {
  // public dats:any;
  data: any;
  name: any;
  price: any;
  session: any;
  course: any;
  category: any;
  date: any;
  total: any;
  check: any;
  status: any;
  sessionAll: any[];
  params2: any = [];

  paketData: any;
  dats: any;
  profile: any;
  userId: any;
  latLng: any;
  statusRegular: boolean;
  userData: any;
  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public params: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public helper: Helper,
  ) {
    console.log(params);
    this.dats = this.params.data.dats;
    this.data = this.params.data.paketData;
    this.name = this.dats.name;
    this.price = this.dats.price;
    this.course = this.dats.course;
    this.category = this.dats.category;
    this.check = this.dats.check;
    this.profile = this.params.data.profile;
    this.userId = this.params.data.userId;
    this.latLng = this.params.data.latLng;

    var umum = ['Professional', 'Metode Matematika', 'Games', 'Hobi', 'Musik', 'Seni', 'Bahasa', 'Olahraga', 'Komputer', 'Mengaji'];
    if (umum.indexOf(this.category) != -1) {
      this.category = 'Umum';
    }
    var jenisPaket = this.data.jenisPaket;
    if (jenisPaket == 'Regular') {
      if (moment(this.data.startDate, 'YYYY-MM-DD').format('DD MM YYYY') != moment(this.data.endDate, 'YYYY-MM-DD').format('DD MM YYYY')) {
        this.session = this.getDays(this.data.startDate, this.data.endDate, this.data);
      }
      if (moment(this.data.startDate, 'YYYY-MM-DD').format('DD MM YYYY') == moment(this.data.endDate, 'YYYY-MM-DD').format('DD MM YYYY')) {
        this.session = this.getDays(this.data.startDate, this.data.endDate, this.data);
      }
    }
    else if (jenisPaket == 'Single Session') {
      this.session = this.getDays(this.data.startDate, this.data.endDate, this.data);
    }
    this.userData = this.helper.getCurrentUser();
  }

  getDays(startDate, endDate, data) {
    console.log('startDate', startDate)
    console.log('endDate', endDate)
    console.log('data', data)
    console.log('this.check', this.check)
    this.status = true;
    this.sessionAll = [];
    var days = [], booking = [], bookingDay = [], bookingJam = [], checks = [], checksJam = [];
    var start = moment(startDate, 'YYYY-MM-DD').toDate();
    var end = moment(endDate, 'YYYY-MM-DD').toDate();
    booking = this.data.day || [];
    bookingDay = _.map(booking, 'day') || [];
    while (start <= end) {
      var dayNow = moment(start).format('dddd');
      var dateNow = moment(start).format("DD-MM-YYYY");
      var bookingDataNow = booking.filter((v: any) => {
        return v.day == dayNow;
      })
      var block = false;
      console.log('dayNow', dayNow)
      console.log('dateNow', dateNow)
      console.log('bookingDataNow', bookingDataNow)
      if (bookingDataNow.length) {
        if (this.check.length) {
          for (let i = 0; i < bookingDataNow.length; i++) {
            let bookingData = bookingDataNow[i];

            checks = _.filter(this.check, { date: moment(dateNow, 'DD-MM-YYYY').format('MM-DD-YYYY') }) || [];
            checksJam = checks.map((v) => { return v.jam + '' });
            let jam = parseInt(bookingData.jam);
            let jamBlock = [jam + '', (jam - 1) + '', (jam + 1) + ''];
            let hasBooking = _.difference(checksJam, jamBlock);
            console.log('checks', checks)
            console.log('checksJam', checksJam)
            console.log('hasBooking', hasBooking)
            if (checksJam.length != hasBooking.length) {
              block = true;
              this.sessionAll.push({ date: dateNow, day: bookingData.day, jam: bookingData.jam, status: 'unbooked', jamStart: 0, jamEnd: 0, review: "" });
            } else {
              days.push({ fullDate: start, date: dateNow, day: bookingData.day, jam: bookingData.jam, status: 'booked', jamStart: 0, jamEnd: 0, review: "" });
              this.sessionAll.push({ fullDate: start, date: dateNow, day: bookingData.day, jam: bookingData.jam, status: 'booked', jamStart: 0, jamEnd: 0, review: "" });
            }
          }
        } else {
          for (let i = 0; i < bookingDataNow.length; i++) {
            let bookingData = bookingDataNow[i];
            days.push({ fullDate: start, date: dateNow, day: bookingData.day, jam: bookingData.jam, status: 'booked', jamStart: 0, jamEnd: 0, review: "" });
            this.sessionAll.push({ fullDate: start, date: dateNow, day: bookingData.day, jam: bookingData.jam, status: 'booked', jamStart: 0, jamEnd: 0, review: "" });
          }
        }
      }
      var newDate = start.setDate(start.getDate() + 1);
      start = new Date(newDate);
    }
    if (!days.length) {
      this.status = false;
      this.statusRegular = true;
    }
    if (this.data.jumlahMurid > 1) {
      var kali = ((this.data.jumlahMurid - 1) * 0.5) + 1;
      this.total = days.length * this.price * kali;
    } else {
      this.total = days.length * this.price * this.data.jumlahMurid;
    }
    return days;
  };

  cancel() {
    this.viewCtrl.dismiss({ totalHarga: this.total, sessionDates: this.session, type: 'cancel' });
  }
  bayar() {
    this.viewCtrl.dismiss({ totalHarga: this.total, sessionDates: this.session, type: 'bayar' });
  }
  tambah() {
    this.viewCtrl.dismiss({ totalHarga: this.total, sessionDates: this.session, type: 'tambah' });
  }
  thousandMask(number) {
    if (number != undefined) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  }
  displayDate(dates) {
    if (dates != undefined) {
      return moment(dates).format("Do MMM YYYY");
    }

  }
  dismiss() {
    this.navCtrl.pop();
  }
  submit() {
    let loader = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    loader.present();
    this.doSubmit().then((res: any) => {
      loader.dismissAll();
      this.alertCart();
    }, (err: any) => {
      loader.dismissAll();
    })
  }

  doSubmit() {
    return new Promise((resolve: any, reject: any) => {
      this.userService.addToCart(
        this.userId.rating, this.profile.phoneNumber,
        this.userId.categoryName, this.profile.avatar,
        this.profile.uid, this.profile.fullName,
        {
          startDate: moment(this.data.startDate).format('YYYY-MM-DD'),
          endDate: moment(this.data.endDate).format('YYYY-MM-DD')
        }, this.session,
        { latitude: this.latLng.latitude, longitude: this.latLng.longitude },
        this.total, this.price, this.data.frekuensi,
        this.data.jumlahMurid, this.data.jenisPaket,
        this.latLng.firstName + ' ' + this.latLng.lastName,
        this.latLng.key, this.latLng.address, this.latLng.avatar,
        this.course, this.userData.firstName).then((res) => {
          resolve(res);
        }, error => {
          reject(error);
          console.log(error);
        });

    })
  }
  getDaySession(data: string) {
    if (data == "Monday") return "Senin";
    if (data == "Tuesday") return "Selasa";
    if (data == "Wednesday") return "Rabu";
    if (data == "Thursday") return "Kamis";
    if (data == "Friday") return "Jumat";
    if (data == "Saturday") return "Sabtu";
    if (data == "Sunday") return "Minggu";
  }
  alertCart() {
    let alert = this.alertCtrl.create({
      title: 'Lanjutkan ke proses pembayaran ?',
      message: 'Pesanan anda telah dimasukkan ke dalam keranjang belanjaan anda',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Tambah Guru',
          handler: datas => {
            return this.navCtrl.setRoot(KategoriPage, { uid: this.latLng.uid });
          }
        },
        {
          text: 'Pembayaran',
          handler: datas => {
            return this.navCtrl.setRoot(HomePage, { data: 'cart' });
          }
        }
      ]
    });
    alert.present();
  }
  formatDate(date: any) {
    console.log('formatDate', date)
    return moment(date, 'DD-MM-YYYY').format('DD-MMM-YYYY')

  }
}
