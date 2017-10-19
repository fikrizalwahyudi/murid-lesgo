import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { AbsensiPage } from '../absensi/absensi';
import { CallNumber } from '@ionic-native/call-number';
import { SMS } from '@ionic-native/sms';
import { KonsultasiPage } from '../konsultasi/konsultasi';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Helper } from '../../providers/helper';

/*
  Generated class for the OrderDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
  providers: [UserService, CallNumber, SMS]
})
export class OrderDetailPage {
  @ViewChild('reviewButton') reviewButton: ElementRef;
  data: any = [];
  orderData: any = [];
  userData: any = [];
  status: any = false;
  rate: any;
  viewReview: boolean;
  viewReviewBySubs: boolean;
  dataBySubs: any;
  subscriber: any[] = [];
  constructor(
    public modal: ModalController,
    public alertCtrl: AlertController,
    public SMS: SMS,
    public CallNumber: CallNumber,
    public navCtrl: NavController,
    public params: NavParams,
    public userService: UserService,
    public helper: Helper,
  ) {
    this.subscriber = [];
    let helperSubs = this.helper.emitterOrderDetail.subscribe((res: any) => {
      this.viewReviewBySubs = res.viewReview;
      this.viewReview = res.viewReview;
      console.log('this.viewReview', this.viewReview)
      console.log(JSON.stringify(res))
      this.data = res.data;
      this.dataBySubs = res.data;
      if (res) {
        this.getOrderById(res.data.orderUid);
      }
    })
    this.subscriber.push(helperSubs)
    // this.data = params.data.data;
    // console.log(this.params);
    // console.log(this.data);
    // if (this.data.sessions) {
    //   this.data.sessions = this.data.sessions.filter((v: any) => {
    //     return v.status != 'replaced'
    //   })
    // }
    // this.viewReview = this.params.data.viewReview;
    // //for notification
    // if (this.data.orderUid) {
    //   console.log('this.data', this.data);
    //   this.getOrderById(this.data.orderUid);
    // } else {
    //   this.getOrder();
    //   this.getName();
    // }
    // this.subscriber = this.helper.emitterOrderDetail.subscribe((res: any) => {
    //   this.viewReview = res.viewReview;
    //   this.getOrderById(res.data.orderUid);
    // })
  }

  ionViewWillEnter() {
    this.data = this.params.data.data;
    this.data = this.dataBySubs ? this.dataBySubs : this.data;
    this.dataBySubs = undefined;
    console.log(this.params);
    console.log(this.data);
    if (this.data.sessions) {
      this.data.sessions = this.data.sessions.filter((v: any) => {
        return v.status != 'replaced'
      })
    }
    this.viewReview = this.params.data.viewReview;
    this.viewReview = this.viewReviewBySubs ? this.viewReviewBySubs : this.viewReview;
    this.viewReviewBySubs = undefined;
    //for notification
    if (this.data.orderUid) {
      console.log('this.data', this.data);
      this.getOrderById(this.data.orderUid);
    } else {
      this.getOrder();
      this.getName();
    }
  }
  ionViewWillLeave() {
    for (let i = 0; i < this.subscriber.length; i++) {
      this.subscriber[i].unsubscribe();
    }
  }
  getOrderById(id: string, viewReview?: boolean) {
    let subscriber = this.userService.listenTransaction(id).subscribe((snap: any) => {
      this.data = Object.assign(this.data, snap)
      if (this.data.sessions) {
        this.data.sessions = this.data.sessions.filter((v: any) => {
          return v.status != 'replaced'
        })
      }
      console.log('data', this.data)
      this.getOrder();
      if (!this.data.userName) this.getName();
    })
    this.subscriber.push(subscriber)
  }

  getOrder() {
    console.log('getOrder execute');
    console.log('this.data', this.data);
    console.log('this.data.tutorUid', this.data.tutorUid);
    let subscriber = this.userService.getTutorReview(this.data.tutorUid).subscribe(o => {
      console.log(o);
      let orderId = this.data.orderUid ? this.data.orderUid : this.data.$key;
      var a = _.findIndex(o, { orderId: orderId });
      if (a == -1) {
        this.status = false;
      } else {
        this.data.totalReview = o.length;
        this.status = true;
        this.rate = o[a].rate;
      }
      if (this.viewReview) {
        this.viewReview = false;
        setTimeout(() => {
          this.reviewTutor();
        }, 200)
      }
    })
    this.subscriber.push(subscriber);
  }
  getName() {
    let subscr = this.userService.getUserDataOnce(this.data.uid).subscribe(snapMe => {
      this.data.userName = snapMe.val().firstName;
    })
    this.subscriber.push(subscr);
  }
  thousandMask(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  timeMask(e) {
    let tanggal = moment(e).format('DD MMMM YYYY');
    let day = moment(e).format('dddd')
    if (day == "Monday") day = "Senin";
    if (day == "Tuesday") day = "Selasa";
    if (day == "Wednesday") day = "Rabu";
    if (day == "Thursday") day = "Kamis";
    if (day == "Friday") day = "Jumat";
    if (day == "Saturday") day = "Sabtu";
    if (day == "Sunday") day = "Minggu";
    return day + ' ' + tanggal;
  }
  callMe() {
    this.CallNumber.callNumber(this.data.phoneNumber, true);
  }
  smsMe() {
    let alert = this.alertCtrl.create({
      title: 'Kirim SMS ke tutor anda',
      message: 'harap isi pesan dibawah',
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'pesan',
          placeholder: 'Pesan anda'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Kirim',
          handler: datas => {
            this.SMS.send(this.data.phoneNumber, datas.pesan);
          }
        }
      ]
    });
    alert.present();
  }
  chatMe() {
    this.navCtrl.push(KonsultasiPage, { uid: this.data.uid, tutor: this.data, name: this.data.userName });
  }
  reviewTutor() {
    let review = this.modal.create(AbsensiPage, { type: 'review', avatar: this.data.tutorAvatar, name: this.data.tutorName });
    review.present();
    review.onDidDismiss(datsky => {
      console.log(datsky);
      this.data.rate = datsky.rate;
      this.data.review = datsky.review;
      this.data.status = 'finish';
      let data = { userId: this.data.uid, orderId: this.data.$key, endDate: moment().format('x'), rate: datsky.rate, review: datsky.review }
      data.orderId = this.data.orderUid ? this.data.orderUid : this.data.$key;
      this.userService.reviewTutor(this.data.tutorUid, data.orderId, data);
    })
  }
  // deleteOrder(){
  //   let goodbye = this.alertCtrl.create({
  //       title: 'Order Cancelled',
  //       enableBackdropDismiss:false,
  //       buttons: [
  //         {
  //           text: 'OK',
  //           handler: () => {
  //             console.log(this.data.$key);
  //             this.userService.catchCartData().child(this.data.$key).remove();
  //             this.navCtrl.pop();
  //           }
  //         }
  //       ]
  //     });
  //     goodbye.present();
  // }
}
