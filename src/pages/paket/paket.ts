import { Component } from '@angular/core';
import { NavController, ViewController, ModalController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import * as _ from 'lodash';
import * as moment from 'moment';
import { OrderPage } from '../order/order';
/*
  Generated class for the Paket page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-paket',
  templateUrl: 'paket.html'
})
export class PaketPage {
  perOrang: any = false;
  perRegular: any = false;
  perDaily: any = false;
  kelompokOrang: any = false;
  kelompokRegular: any = false;
  kelompokDaily: any = false;
  frekuensi: number = 0;
  startDateRegular: any;
  endDateRegular: any;
  jam: any;
  murid: any;
  butOff: any = 'regular';
  data: any = [];
  hari: any = [];
  jamArray: any = [];
  dayArray: any = [];
  days: any = [];
  AM: any = [];
  PM: any = [];
  schedule: any = [];
  scheduleBackup: any = [];
  terOrder: any = [];
  terOrderBackup: any = [];
  types: any;
  loader: any;
  mins: any;
  switch: any = false;
  mins2: any;
  max: any;
  paketData: any;


  blocked: any;
  category: any;
  check: any;
  course: any;
  dataFormDashboard: any;
  price: any;
  profile: any;
  session: any;
  type: any;
  userId: any;
  latLng: any;
  isFirst: boolean;

  blockDays: any[];
  blockDate: any[];

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {
    console.log(this.params);
    var now = moment();
    this.max = moment().add(1, 'month').toISOString();
    this.mins = moment().add(1, 'day').toISOString();
    this.mins2 = moment().add(1, 'day').toISOString();
    this.types = this.params.data.type;

    this.blocked = this.params.data.blocked;
    this.category = this.params.data.category;
    this.check = this.params.data.check;
    this.course = this.params.data.course;
    this.data = this.params.data.data;
    this.price = this.params.data.price;
    this.profile = this.params.data.profile;
    this.session = this.params.data.session;
    this.isFirst = this.params.data.isFirst;
    this.userId = this.params.data.userId;
    this.latLng = this.params.data.latLng;
    this.blockDays = [];
    this.blockDate = [];

    if (this.params.data.data != 0 && this.types == 'order') {
      console.log('masuk');
      this.schedule = this.params.get('schedule');
      this.scheduleBackup = this.params.get('schedule');
      this.terOrder = this.params.get('tutorOrder');
      this.terOrderBackup = this.terOrder;
      this.frekuensi = this.params.data.data.frekuensi;
      this.hari = this.params.data.data.day;
      this.startDateRegular = this.params.data.data.startDate;
      this.endDateRegular = this.params.data.data.endDate;
      for (let i = 0; i < this.params.data.data.day.length; i++) {
        this.whatTime(i);
      }
    } else if (this.types == 'order' && this.params.data.data == 0) {
      this.scheduleBackup = this.params.get('schedule');
      this.schedule = this.params.get('schedule');
      this.terOrder = this.params.get('tutorOrder');
      this.terOrderBackup = this.terOrder;
      this.startDateRegular = moment().add(1, 'day').toISOString();
      this.endDateRegular = moment().add(1, 'day').toISOString();
      this.getDates('regular', null);
      console.log(this.schedule);
      this.frekuensi = 1;
      // this.hari.push({ day: '', jam: '' });
      this.whatTime(0);
    } else if (this.types != 'order') {
      this.startDateRegular = moment().add(1, 'day').toISOString();
      this.endDateRegular = moment().add(1, 'month').toISOString();
      this.getDates('regular', null);
      this.frekuensi = 1;
    }
  }

  getDay() {
    return moment(this.startDateRegular).format('dddd');

  }
  showHidePerOrang() {
    let test = this.loadingCtrl.create({ showBackdrop: false, spinner: 'hide' });
    test.present();
    if (this.perOrang != true) {
      this.perOrang = true;
      this.kelompokOrang = false;
      this.murid = 1;
      test.dismiss();
    }
    else {
      this.perOrang = false;
      test.dismiss();
    }
  }

  showHideKelompok() {
    let test = this.loadingCtrl.create({ showBackdrop: false, spinner: 'hide' });
    test.present();
    if (this.kelompokOrang != true) {
      this.kelompokOrang = true;
      this.perOrang = false;
      test.dismiss();
    }
    else {
      this.kelompokOrang = false;
      test.dismiss();
    }
  }

  getFrekuensi(value: number) {
    this.blockDays = [];
    // if(this.startDateRegular != undefined){
    let test = this.loadingCtrl.create({ showBackdrop: false, spinner: 'hide' });
    test.present();
    this.frekuensi = value;
    this.hari = [];
    for (let i = 0; i < this.frekuensi; i++) {
      this.hari.push({ day: "", jam: "" });
    }
    test.dismiss();
    // }
    // else if(this.startDateRegular ==undefined){
    // alert('Pilih hari terlebih dahulu');
    // }
  }
  dismiss() {
    this.navCtrl.pop();
  }
  send() {
    if (this.startDateRegular == new Date()) {
      return alert('Pembelajaran tidak dapat dimulai di hari yang sama');
    } else if (this.startDateRegular == null || this.endDateRegular == null) {
      return alert('Harap memilih tanggal belajar terlebih dahulu');
    }
    var jenisPaket;
    if (this.butOff === 'daily') {
      this.endDateRegular = this.startDateRegular;
      console.log(this.hari)
      jenisPaket = 'Single Session';
    }
    else {
      jenisPaket = 'Regular';
    }
    var a = moment(this.startDateRegular).format('YYYY-MM-DD');
    var b = moment(this.endDateRegular).format('YYYY-MM-DD');
    var hasHari = this.hari.filter((v) => { return v.day }).length == this.hari.length;
    var hasJam = this.hari.filter((v) => { return v.jam }).length == this.hari.length;
    console.log('this.kelompokOrang', this.kelompokOrang)
    console.log('types', this.types)
    console.log('hasHari', hasHari)
    let condition = this.startDateRegular != undefined && this.endDateRegular != undefined && this.frekuensi != 0 && hasHari && hasJam;
    if (this.types != 'order') {
      condition = this.startDateRegular != undefined && this.endDateRegular != undefined && this.frekuensi != 0 && hasHari;
      if (condition) {
        let data = {
          frekuensi: this.frekuensi, startDate: a, endDate: b,
          day: this.hari, jumlahMurid: this.murid, jenisPaket: jenisPaket
        }
        return this.viewCtrl.dismiss(data)
      }
    }
    console.log('condition', condition)
    if (condition) {
      this.navCtrl.push(OrderPage, {
        paketData: {
          frekuensi: this.frekuensi, startDate: a, endDate: b,
          day: this.hari, jumlahMurid: this.murid, jenisPaket: jenisPaket
        },
        dats: {
          name: this.profile.fullName, course: this.course,
          schedule: this.schedule, session: this.paketData, price: this.price,
          category: this.category, check: this.check
        },
        userId: this.userId,
        latLng: this.latLng,
        profile: this.profile
      });
    }
    else if (this.frekuensi == 0) {
      alert('Harap mengisi frekuensi terlebih dahulu frekuensi');
    }
    else if (this.startDateRegular == undefined || this.endDateRegular == undefined) {
      alert('Harap mengisi tanggal')
    }
    else {
      alert('Harap mengisi kekurangan form')
    }
  }
  whatTime(i) {
    var hari = this.hari[i].day;
    console.log("hari", this.hari[i].day);
    this.jamArray[i] = _.filter(this.schedule, { day: hari });
    console.log("hari", this.hari[i].day);
    console.log("check", this.check);
    // console.log();
    // _.remove(this.jamArray[i][0], (r)=>{ return _.includes([true],r)})

    var endDateCompare = new Date(moment(this.endDateRegular).format('YYYY-MM-DD'));
    endDateCompare = new Date(endDateCompare);
    var startDateCompare = new Date(moment(this.startDateRegular).format('YYYY-MM-DD'));
    startDateCompare = new Date(startDateCompare);
    this.blockDays = this.check.filter((v: any) => {
      console.log("v.date", v.date);
      return this.hari[i].day == v.day && new Date(moment(v.date, "DD-MM-YYYY").format('YYYY-MM-DD')) <= endDateCompare && new Date(moment(v.date, "DD-MM-YYYY").format('YYYY-MM-DD')) >= startDateCompare;
    });
    console.log('this.blockDays', this.blockDays)
  }
  checkDate(value) {
    if (value == 'start' && this.startDateRegular.getTime() > new Date().getTime()) {
      alert('tidak bisa memilih hari sebelumnya');
      return this.startDateRegular = new Date();
    } else if (value == 'end' && this.endDateRegular.getTime() > new Date().getTime()) {
      return this.endDateRegular = new Date();
    } else {
      return;
    }
  }
  // this.navCtrl.pop();
  // buttonClick(frekuensi){
  //     this.fre
  // }
  deleteTime(i) {
    // console.log(this.jamArray)
    if (_.filter(this.hari, this.hari[i]).length == 2) {
      alert('tidak dapat memilih jadwal yang sama');
      this.hari[i].jam = null;
      return;
    }
  }
  getDates(types, dateType: any, dateNext?: any) {
    this.dayArray = [];
    this.jamArray = [];
    this.hari = [{ day: '', jam: '' }];
    var startDateCompare = new Date(moment(this.startDateRegular).format('YYYY-MM-DD'));
    var endDateCompare = new Date(moment(this.endDateRegular).format('YYYY-MM-DD'));
    if (dateType == 'start' && endDateCompare < startDateCompare) {
      this.endDateRegular = this.startDateRegular;
    }
    if (dateType == 'end' && endDateCompare < startDateCompare) {
      this.startDateRegular = this.endDateRegular;
    }
    if (types == 'single') {
      this.endDateRegular = this.startDateRegular;
    }
    if (this.types != 'order') {
      return;
    }

    if (this.startDateRegular != this.endDateRegular && types == 'regular' && this.startDateRegular != undefined && this.endDateRegular != undefined) {
      var a = moment(this.startDateRegular).format('YYYY-MM-DD');
      var b = moment(this.endDateRegular).format('YYYY-MM-DD')
      var date1 = new Date(a);
      var date2 = new Date(b);
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      var diff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      this.dayArray = [];
      var date = [];
      for (var i = 0; i < diff + 1; i++) {
        date[i] = new Date(date1.getTime() + (i * 1000 * 3600 * 24));
        // console.log(date[i]);
        this.dayArray.push({ day: moment(date[i]).format('dddd') })
      }
      _.uniqBy(this.dayArray, 'day');
      // console.log(this.dayArray);
      // console.log(this.schedule);
      this.schedule = _.intersectionBy(this.scheduleBackup, this.dayArray, 'day');
    } else if (types == 'single' && this.startDateRegular != undefined) {
      var a = moment(this.startDateRegular).format('YYYY-MM-DD');
      this.hari = [];
      // console.log(a);
      // console.log();
      var date1 = new Date(a);
      this.dayArray = [];
      // console.log('hari A :'+a);
      this.dayArray.push({ day: moment(date1).format('dddd') });
      this.schedule = _.intersectionBy(this.scheduleBackup, this.dayArray, 'day');
      // console.log(this.hari);
      this.hari.push({ day: moment(date1).format('dddd'), jam: '' });
      this.whatTime(0);
      if (this.schedule.length == 0 && this.switch == false) {
        if (this.types == 'order') alert('guru tidak tersedia pada hari ini');
        return;
      }
      this.switch = false;
    } else if (types == 'regular' && this.startDateRegular == this.endDateRegular) {
      var a = dateNext ? moment(dateNext).format('YYYY-MM-DD') : moment(this.startDateRegular).format('YYYY-MM-DD');
      var date1 = new Date(a);
      this.dayArray.push({ day: moment(date1).format('dddd') });
      this.schedule = _.intersectionBy(this.scheduleBackup, this.dayArray, 'day');
      if (this.isFirst && this.schedule.length == 0) {
        var nextDate = new Date(a);
        nextDate.setDate(nextDate.getDate() + 1);
        this.startDateRegular = moment(nextDate).toISOString();
        this.endDateRegular = moment(nextDate).toISOString();
        return this.getDates('regular', null, nextDate);
      } else if (this.schedule.length) {
        this.isFirst = false;
        return;
      }
      if (this.schedule.length == 0 && this.switch == false) {
        if (this.types == 'order') alert('guru tidak tersedia pada hari ini');
        return;
      }
    }
  }

  changeJam(jam) {
    jam = parseInt(jam);
    let jamArray = [jam - 1, jam, jam + 1].map((v: any) => { return v + '' });
    this.blockDate = this.blockDays.filter((v: any) => {
      return jamArray.indexOf(v.jam + '') != -1;
    }) || [];
    console.log('this.blockDate', this.blockDate)
    if (this.blockDate.length) {
      let block = this.blockDate.map((v: any, i: number) => {
        let br = i != 0 && i % 2 ? '' : '<br>';
        let coma = v.date && i != this.blockDate.length - 1 ? ', ' : '';
        let date = moment(v.date, 'MM-DD-YYYY').format('DD-MMM-YYYY')
        return v.date ? br + `<div class="alert-width">${date + coma}</div>` : '';
      }).join('');
      let myAlert = this.alertCtrl.create({
        title: 'Paket',
        message: `
                <div>Maaf, guru tersebut memiliki jadwal mengajar pada :</div>
                <div class="block-date">${block} </div>
                <div>Pilih order jika ingin tetap memilih dengan jadwal ini</div>
                `,
        buttons: [
          {
            text: 'Ok',
            handler: datas => {
              myAlert.dismiss()
            }
          }]
      })
      myAlert.present();
    }
  }

  parseDay(day: string) {
    if (day == "Monday") return "Senin";
    if (day == "Tuesday") return "Selasa";
    if (day == "Wednesday") return "Rabu";
    if (day == "Thursday") return "Kamis";
    if (day == "Friday") return "Jumat";
    if (day == "Saturday") return "Sabtu";
    if (day == "Sunday") return "Minggu";
  }

  changeJamSingle(jam, date) {
    if (jam) {
      jam = parseInt(jam);
      let jamArray = [jam - 1, jam, jam + 1].map((v: any) => { return v + '' });
      console.log('jam', jam);
      console.log('date', date);
      console.log('this.check', this.check)
      let block = this.check.filter((v: any) => {
        console.log(date);
        console.log("moment 409", moment(date, moment.ISO_8601).format('MM-DD-YYYY'));
        console.log("moment 410", moment(date, "YYYY-MM-DD").format('MM-DD-YYYY'));
        console.log("v.date 441", v.date);
        return v.date == moment(date, moment.ISO_8601).format('DD-MM-YYYY') && jamArray.indexOf(v.jam) != -1;
      })
      console.log('block', block)
      if (block.length) {
        let myAlert = this.alertCtrl.create({
          title: 'Paket',
          message: `
                    <div>Maaf, guru tersebut memiliki jadwal mengajar pada waktu ini, mohon rubah jam</div>
                    `,
          buttons: [
            {
              text: 'Ok',
              handler: datas => {
                myAlert.dismiss()
              }
            }]
        })
        jam = null;
        myAlert.present();
      }
    }
  }
}
