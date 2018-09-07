import { Component } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController, AlertController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
// import { Midtrans  } from '../../providers/midtrans';
import { DetailPage } from '../detail/detail';
import { OrderDetailPage } from '../order-detail/order-detail';
import { HomePage } from '../home/home';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Helper } from '../../providers/helper';
declare var snap;

/*
  Generated class for the Cart page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
  providers: [UserService]
})
export class CartPage {
  user: any = [];
  token: any;
  uid: any;
  getData: any = [];
  butOff: any = 'pesan';
  total: any = 0;
  subtotal: any = 0;
  payment: any;
  promo: any;
  cartStatus: any;
  cartHistoryStatus: any;
  conFee: any = 0;
  lespay: any;
  cartData: any = [];
  historyData: any = [];
  userId: any;
  platformType: any;
  promoCode:any;
  discount:any = 0;
  discountText:any = 0;
  setDiscount:boolean = false;


  constructor(
    public alert: AlertController,
    public http: Http,
    public navCtrl: NavController,
    public params: NavParams,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public platform: Platform,
    public helper: Helper,
  ) {
    if (this.platform.is('android')) {
      this.platformType == 'android';
    } else {
      this.platformType == 'browser';
    }

    this.payment = 'transfer';
    let loader = this.loadingCtrl.create({
      showBackdrop: false, spinner: 'hide'
    });
    loader.present();
    if (this.params.data.type == 'notification') {
      this.uid = this.params.data.additionalData.uid;
      this.butOff = 'riwayat';
      this.helper.setDataNotif({});
    } else {
      this.uid = this.params.data.data;
    }
    console.log('this.uid', this.uid);
    console.log('this.params.data', this.params.data);
    this.getCart(this.uid);
    this.getUser(this.uid);
    loader.dismiss();
  }
  getUser(uid) {
    this.userService.getUserDataOnce(uid).subscribe(user => {
      this.user = user.val();
      this.user.phoneNumber = this.user.phoneNumber.replace("+62 ", "+62").replace("(", "").replace(")", "").replace(" ", "").replace("-", "").replace("_", "").replace("_", "");
    })
  }

  checkPromo(promo){
    console.log(promo);
    this.userService.getPromo(promo).subscribe(data=>{
      console.log(data);
    })
  }
  getCart(uid) {
    this.userService.muridCariTutor(uid).subscribe(snapshot => {
      this.cartData = [];
      this.historyData = [];
      snapshot.forEach(e => {
        var data = e;
        data.orderId = e.$key;
        data.orderUid = e.$key;
        this.historyData.push(data);
      })
      this.cartData = _.remove(this.historyData, { status: 'cart' });
    })
  }
  getToken() {
    var sendData = [];
    var transId = 'LP' + new Date().getTime();
    for (let i = 0; i < this.cartData.length; i++) {
      var fullName = this.cartData[i].tutorName.substring(0, 17) + '.. ';
      // var StringDiscount = "";

      if(this.cartData[i].totalHarga >= 50000 && this.setDiscount == true){
        if(this.discount != 0){
          fullName += '**';
        }
        this.cartData[i].totalHarga = (this.cartData[i].totalHarga - this.discount);
        this.discount = 0;
        // StringDiscount = "potongan " + this.discountText;
      }
      sendData.push({
        "id": this.cartData[i].orderId,
        "price": this.cartData[i].totalHarga,
        "quantity": 1,
        "name": fullName  + this.cartData[i].orderSchedule.startDate + ' - ' + this.cartData[i].orderSchedule.endDate,
        "brand": "Midtrans",
        "category": "Toys",
        "merchant_name": "Midtrans"
      })
    }
    sendData.push({
      "id": "ConvenienceFee",
      "price": this.conFee,
      "quantity": 1,
      "name": "Convenience Fee"
    });

    let loader = this.loadingCtrl.create({
      showBackdrop: false,
      spinner: "hide"
    });
    console.log(sendData)
    loader.present();
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    var body = {
      "transaction_details": {
        "order_id": transId,
        "gross_amount": this.total

      },
      "item_details": sendData,
      "enabled_payments": ["mandiri_clickpay", "cimb_clicks",
        "bca_klikbca", "bca_klikpay", "bri_epay", "telkomsel_cash", "echannel",
        "bbm_money", "xl_tunai", "indosat_dompetku", "mandiri_ecash", "permata_va",
        "bca_va", "other_va", "kioson", "indomaret", "gci"],
      "customer_details": {
        "first_name": this.user.firstName,
        "last_name": this.user.lastName,
        "email": this.user.email,
        "phone": this.user.phoneNumber
      },
      "expiry": {
        "start_time": moment(new Date()).format('YYYY-MM-DD HH:mm:ss Z'),
        "unit": "minutes",
        "duration": 360
      }
    };
    console.log(body);

    let cart = this.cartData.map((v) => {
      let sessions = v.sessions.map((session) => {
        return Object.assign({}, session);
      })
      let matpal = v.matpel.map((matpelV) => {
        return Object.assign({}, matpelV);
      })
      let newV = Object.assign({}, v);
      newV.sessions = sessions;
      newV.matpal = matpal;
      return newV;
    })
    this.http.post('http://13.228.37.52:4000/api/pay', body, options).subscribe(snapshot => {
      try {
        this.token = JSON.parse(snapshot['_body']).token;
      } catch (e) {
        return this.presentAlert('Payment Not Finish', 'Mitra pembayaran online sedang bermasalah, Agar dicoba beberapa saat lagi');
      }
      if (!this.token) {
        return this.presentAlert('Payment Not Finish', 'Mitra pembayaran online sedang bermasalah, Agar dicoba beberapa saat lagi');
      }
      console.log('snapshot', snapshot);
      snap.pay(this.token, {
        onSuccess: (result) => { this.presentAlert('Payment Success', 'Pembayaran Anda sudah diterima'); this.subtotal = 0; this.total = 0 },
        onPending: (result) => {
          this.subtotal = 0;
          this.total = 0;
          console.log('pending', result);
          return this.doUpdateStatus(cart, transId, 'pending').then((res: any) => {
            return this.presentAlert('Konfirmasi Pembayaran', 'Silahkan periksa email Anda atas order ini');
          })
        },
        onError: (result) => {
          this.presentAlert('Error', result);
        },
        onClose: () => {
          let loader = this.loadingCtrl.create({
            showBackdrop: false, spinner: 'hide'
          });
          loader.present();
          this.promoCode = null;
          this.doUpdateStatus(cart, transId, 'cart');
          loader.dismissAll();
          this.presentAlert('Payment Not Finish', 'Pembayaran tidak diselesaikan');
        }
      });
      loader.dismiss();
    }, (err: any) => {
      console.log('err', err)
    });
  };

  async doUpdateStatus(cartList, transId, status) {
    for (let i = 0; i < cartList.length; i++) {
      await this.userService.updateCartStatus(cartList[i].orderId, { status: status, transactionId: transId, createDate: moment().format('x') });
    }
  }

  // updateStatusPromise(cartList, transId, status) {
  //   return new Promise((resolve, reject) => {
  //     this.doUpdateStatus(cartList, transId, status);
  //     resolve('done');
  //   })
  // }

  onChange(name) {
    if (this.butOff != name) {
      this.butOff = name;
    }
    else {
      this.butOff = 'empty';
    }
  }

  bayar() {
    alert('lanjutkan ke proses pembayaran, data anda telah kami terima')
  }

  getSubTotal() {
    this.subtotal = 0;
    for (let i = 0; i < this.cartData.length; i++) {
      this.subtotal = this.subtotal + this.cartData[i].totalHarga;
    }
  }

  theTotal() {
    this.total = 0;
    if (this.payment == "transfer") {
      this.conFee = 5700;
    }
    else if (this.payment == 'creditcard') {
      this.conFee = this.subtotal / 100 * 3.2;
    } 
    this.total = (this.subtotal + this.conFee) - this.discount;
    console.log(this.total);
    console.log(this.subtotal);
  }
  orderDetail(orderid) {
    this.navCtrl.push(DetailPage, { data: orderid });
  }
  orderDetailCart(orderid) {
    this.navCtrl.push(OrderDetailPage, { data: orderid });
  }
  thousandMask(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  dismiss() {
    this.navCtrl.pop();
  }
  removeOrder(id) {
    console.log(id);
    this.subtotal = 0;
    this.userService.removeFromCart(id);
  }
  displayDate(dates) {
    return moment(dates).format("DD-MMM-YYYY");
  }
  presentAlert(title, message) {
    let alert = this.alert.create({
      title: title,
      message: message,
      buttons: ['OK']
    });
    alert.present();
  }

  updateCartStatus(transId, status) {
    return this.userService.updateCartStatus(transId, { status: status });
  }

  getDiscount(code){
    // this.userService.getUserData(this.uid).subscribe(snap=>{
    //   console.log("nih user nyaaa", snap);
    // })
    return this.userService.getDiscount(code).subscribe(snap=>{
      console.log("DISCOUNT ", snap);
      if(this.subtotal <= 100000){
        this.presentAlert('Promo Gagal', 'Diskon hanya untuk pemesanan minimal 100 ribu !');
      }else {
        if(snap.value == null){
          this.discount = 0;
          this.presentAlert('Promo Code Tidak Valid', 'Code yang anda masukkan salah atau sudah expired !');
          console.log("DISCOUNT TIDAK DITEMUKAN");
        }else {
          this.setDiscount = true;
          this.discount = snap.value;
          this.discountText = snap.value;
          console.log("DISCOUNT DITEMUKAN");

        }
      }
    })
  }
}
