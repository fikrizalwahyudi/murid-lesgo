import { Component, ViewChild } from '@angular/core';
import {
  NavController,
  ToastController,
  ViewController,
  ActionSheetController,
  Platform,
  AlertController,
  LoadingController,
  NavParams,
  ModalController,
  Loading,
  Content
} from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';
import { UserService } from '../../providers/user-service';
import { Zapier } from '../../providers/zapier';
import { KategoriPage } from '../kategori/kategori';
import { SettingPage } from '../setting/setting';
import { KonsultasiPage } from '../konsultasi/konsultasi';
import { CartPage } from '../cart/cart';
import { ErrorPage } from '../error/error';
import { ModalMuridPage } from '../modal-murid/modal-murid';
import { CustomerservicePage } from '../customerservice/customerservice';
import { FilePath } from '@ionic-native/file-path';
import { FileOpener } from '@ionic-native/file-opener';
import { FileChooser } from '@ionic-native/file-chooser';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/Camera';
import { Network } from '@ionic-native/network';
import * as firebase from 'firebase';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Helper } from '../../providers/helper';
import { OrderDetailPage } from '../order-detail/order-detail';
import { AbsensiPage } from '../absensi/absensi';

declare var cordova: any
declare var window;
/*
  Generated class for the Home page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [UserService, Calendar, Zapier]
})
export class HomePage {
  @ViewChild(Content) content: Content;
  user: any = [];
  today: any = new Date();
  loading: Loading;
  myUserId: any;
  cartData: any = [];
  session: any = 0;
  cart: any = 0;
  pending: any = 0;
  chatCs: any = 0;
  chatData: any = 0;
  csSubscribe: any;
  tutorSubscribe: any;
  cartStatus: any;
  cartId: any;
  schedule: any = [];
  role: any;
  latLng: any = { lat: 0, lng: 0 };
  smsVerification: any;
  murid: any = [];
  status: any;
  count: any = 0;
  smsVerificationCode: any;
  subNotif: any;
  subForground: any;

  constructor(
    public network: Network,
    public localNotif: LocalNotifications,
    public zapier: Zapier,
    public Camera: Camera,
    public File: File,
    public FilePath: FilePath,
    public FileChooser: FileChooser,
    public toast: ToastController,
    public plt: Platform,
    public Calendar: Calendar,
    public navCtrl: NavController,
    public params: NavParams,
    public userService: UserService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public helper: Helper,
  ) {
    this.registerBackButton();
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter home');
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('onDisconnect network')
      if (this.navCtrl.getActive().component.name != 'ErrorPage') this.navCtrl.push(ErrorPage);
    });
    this.getUser();
    this.listenLoad();
  }
  ionViewDidLeave() {
    console.log('ionViewDidLeave home')
  }
  getYear(date) {
    return parseInt(moment(date, 'DD-MM-YYYY').format('YYYY'))
  }
  getMonth(date) {
    return parseInt(moment(date, 'DD-MM-YYYY').format('MM'))
  }
  getDay(date) {
    return parseInt(moment(date, 'DD-MM-YYYY').format('DD'))
  }

  conevertDateToBahasa(date) {
    let tanggal = moment(date, 'MM-DD-YYYY').format('DD MMMM YYYY');
    let day = moment(date).format('dddd')
    if (day == "Monday") day = "Senin";
    if (day == "Tuesday") day = "Selasa";
    if (day == "Wednesday") day = "Rabu";
    if (day == "Thursday") day = "Kamis";
    if (day == "Friday") day = "Jumat";
    if (day == "Saturday") day = "Sabtu";
    if (day == "Sunday") day = "Minggu";
    return day + ' ' + tanggal;
  }

  listenLoad() {
    console.log('listenLoad')
    if (this.subNotif) this.subNotif.unsubscribe();
    if (this.subForground) this.subForground.unsubscribe();
    this.subNotif = this.helper.emitterNotif.subscribe((res: any) => {
      console.log('listenload subNotif');
      this.listenNotification(res);
    });
    this.subForground = this.helper.emitterNotifFourground.subscribe((res: any) => {
      console.log('listen subForground');
      this.listenNotifFourground(res);
    })
  }

  listenNotifFourground(notification: any) {
    let toast = this.toast.create({ message: notification.title, duration: 3500, position: 'top' });
    toast.present();
  }

  listenNotification(data: any) {
    console.log('dataNotif', data)
    console.log('this.navCtrl.getActive().component.name', this.navCtrl.getActive().component.name)
    if (data.additionalData && (data.additionalData.typeNotif == 'order' || data.additionalData.typeNotif == 'finish')) {
      let dataOrderDetail: any = {
        data: data.additionalData
      }
      dataOrderDetail.viewReview = data.additionalData.typeNotif == 'finish' ? true : false;
      if (this.navCtrl.getActive().component.name == 'OrderDetailPage') {
        this.helper.setDataOrderDetail(dataOrderDetail);
        return undefined;
      }
      return this.navCtrl.push(OrderDetailPage, dataOrderDetail);
    }
    if (data.additionalData && data.additionalData.typeNotif == 'sesi') {
      let dataOrderDetail: any = {
        data: data.additionalData
      }
      if (this.navCtrl.getActive().component.name == 'OrderDetailPage') {
        this.helper.setDataOrderDetail(dataOrderDetail);
        return undefined;
      }
      return this.navCtrl.push(OrderDetailPage, dataOrderDetail);
    }
    if (data.additionalData && data.additionalData.typeNotif == 'chat') {
      if (data.additionalData.type == 'user') {
        let dataNotif = {
          tutorUid: data.additionalData.uid,
          uid: firebase.auth().currentUser.uid,
          name: data.additionalData.name,
          type: 'notification'
        }
        if (this.navCtrl.getActive().component.name == 'KonsultasiPage') return this.helper.emitterChatTutor.emit(dataNotif);
        return this.navCtrl.push(KonsultasiPage, dataNotif);
      }
      if (data.additionalData.type == 'cs') {
        if (this.navCtrl.getActive().component.name == 'CustomerservicePage') return undefined;
        return this.navCtrl.push(CustomerservicePage, {
          data: firebase.auth().currentUser.uid,
          name: data.additionalData.name,
          type: 'notification'
        });
      }
    }
  }

  registerBackButton() {
    this.plt.registerBackButtonAction(() => {
      this.count = this.count + 1;
      if (this.count <= 1) {
        let toaster = this.toast.create({ message: 'press back once more to exit the app', duration: 2000, position: 'bottom' });
        toaster.present();
      }
      setTimeout(() => {
        if (this.count > 1) {
          this.plt.exitApp();
        }
      }, 2000)
    }, 1);
  }
  getUser() {
    let loader = this.loadingCtrl.create({ content: '<img src="./assets/loading.gif"/>', spinner: 'hide' });
    loader.present();
    setTimeout(() => {
      this.myUserId = firebase.auth().currentUser.uid;
      this.userService.getUserData(this.myUserId).take(1).subscribe(snapshot => {
        var data = snapshot;
        this.user = data;
        this.user.userId = snapshot.$key;
        console.log('this.user', this.user);
        loader.dismissAll();
        if (data.smsVerificationStatus != true) {
          let smsobj = {
            uid: this.myUserId,
            phoneNumber: data.phoneNumber,
            email: data.email,
            verificationCode: data.smsVerificationCode,
            textMessage: "Ini adalah verification code dari LESGO!"
          };
          let alert = this.alertCtrl.create({
            title: 'Verifikasi HP',
            message: 'Kode Verifikasi anda sedang dalam proses pengiriman',
            enableBackdropDismiss: false,
            inputs: [{
              name: 'code',
              placeholder: 'Kode Anda'
            }],
            buttons: [{
              text: 'Resend Code',
              handler: datas => {
                // this.resendSMS(smsobj);
                this.sendverivicationCode(this.user);
                alert.setMessage('Pengiriman ulang ke nomor telah dilaksanakan ' + data.phoneNumber);
                return false
              }
            }, {
              text: 'Confirm',
              handler: datas => {
                if (datas.code != data.smsVerificationCode) {
                  alert.setMessage('Kode verifikasi yang anda masukkan salah ');
                  return false
                } else {
                  this.updateUserStatus(this.myUserId);
                  let muridModal = this.modalCtrl.create(ModalMuridPage, {
                    types: 'newbie',
                    uid: firebase.auth().currentUser.uid,
                    source: 'newbie'
                  });
                  muridModal.onDidDismiss(data => {
                    return true
                  });
                  muridModal.present();
                  return muridModal;
                }
              }
            }]
          });
          alert.present();
          this.userService.sendVerificationCode(this.user).subscribe(res => {
            if (res.result) {
              alert.setMessage('<span style="color:green !important;">Kode verifikasi Anda telah terkirim ke nomor ' + data.phoneNumber + '</span>');
              return false;
            } else {
              alert.setMessage('<span style="color:green !important;">Kode verifikasi Anda gagal dikirim ke nomor ' + data.phoneNumber + ' tolong kontak CS utk kode verifikasi</span>');
              return false;
            }
          });
        } else {
          this.helper.setCurrentUser(data);
          this.getCart(this.myUserId);
          this.chatNotificationCs();
          this.chatNotificationMurid();
          this.status = true;
          this.setCalendar();
        }
      })
    }, 3000);
  }

  chatNotificationCs() {
    this.csSubscribe = this.userService.getChatCsStatus(this.myUserId).subscribe(snapshot => {
      this.chatCs = 0;
      let data = [];
      if (snapshot.length) {
        snapshot.forEach(o => {
          if (o.status == false && o.position == 'left') data.push(o);
        })
        this.chatCs = data.length;
      }
      console.log('this.chatCs', this.chatCs)
    })
  }
  chatNotificationMurid() {
    this.tutorSubscribe = this.userService.getChatTutorStatus(this.myUserId).subscribe(snapshot => {
      this.chatData = 0;
      let data = [];
      if (snapshot.length) {
        snapshot.forEach(o => {
          for (let k in o.messages) {
            if (o.messages[k].status == false && o.messages[k].position == 'left') data.push(o.messages[k]);
          }
        })
      }
      this.chatData = data.length;
    })
  }
  getCart(uid) {
    var today = moment(new Date()).format('x');
    return this.userService.muridCariTutor(uid).subscribe(snaps => {
      if (!snaps || !snaps.length) return;
      this.cartData = snaps;
      this.cart = 0;
      this.pending = 0;
      this.session = 0;
      if (this.params.data.data == 'cart') {
        this.params.data.data = undefined;
        return this.navigateMe('CartPage');
      } else if (this.params.data.data == 'tambah') {
        this.params.data.data = undefined;
        return this.navigateMe('KategoriPage');
      }
      return snaps.forEach(order => {
        if (order.status == 'cart') this.cart = this.cart + 1;
        if (order.status == 'booked') {
          this.pending = this.pending + 1;
          order.sessions.forEach(session => {
            if (session.status == 'booked') this.session = this.session + 1;
          })
        }
      })
    })
  }

  navigateMe(name: string) {
    if (name == 'CartPage') this.navCtrl.push(CartPage, { data: this.myUserId, cartData: this.cartData, cartStatus: this.cartStatus });
    if (name == 'KategoriPage') this.navCtrl.push(KategoriPage, { uid: this.myUserId, source: 'home' });
    if (name == 'CustomerservicePage') this.navCtrl.push(CustomerservicePage, { data: this.myUserId, name: this.user.firstName });
    if (name == 'KonsultasiPage') this.navCtrl.push(KonsultasiPage, { uid: this.myUserId, name: this.user.firstName });
    if (name == 'MyschedulePage') this.setCalendar(true);
    if (name == 'SettingPage') this.navCtrl.push(SettingPage, { uid: this.myUserId });
  }

  setCalendar(openCalendar?: any) {
    console.log('change')
    // this.initDataCalendar(openCalendar)
    this.Calendar.hasReadWritePermission().then((result) => {
      if (result === false) {
        this.Calendar.requestReadWritePermission().then((v) => {
          console.log('go to init calendar');
          this.initDataCalendar(openCalendar);
        }, (r) => {
          console.log("Rejected");
        })
      } else {
        this.initDataCalendar(openCalendar)
      }
    })
  }

  initDataCalendar(openCalendar?: any) {
    this.loading = this.loadingCtrl.create({ content: '<img src="./assets/loading.gif"/>', spinner: 'hide' });
    this.loading.present();
    this.userService.getCart(firebase.auth().currentUser.uid).once('value', (res: any) => {
      let val = res.val();
      console.log('res.val', val)
      this.loading.dismissAll();
      if (!val) {
        this.loading.dismissAll();
        if (openCalendar) {
          return this.Calendar.openCalendar(new Date());
        }
        return;
      }
      let allOrder = Object.keys(val).map((key) => { return val[key]; });
      return this.cekSchedule(allOrder, openCalendar);
    })
  }

  cekSchedule(allOrder: any[], openCalendar?: any) {
    console.log('this checkSchedule')
    let list: any[] = [];
    this.loading = this.loadingCtrl.create({ content: '<img src="./assets/loading.gif"/>', spinner: 'hide' });
    this.loading.present();
    console.log(allOrder)
    for (let i = 0; i < allOrder.length; i++) {
      if (allOrder[i].status == 'booked') {
        let matpel = allOrder[i].matpel.map((v: any) => { return v.text }).join(', ');
        let jenisPaket = allOrder[i].jenisPaket;
        let tutorName = allOrder[i].tutorName;
        let category = allOrder[i].categoryName;
        let namaMurid = allOrder[i].namaMurid;
        let alamat = allOrder[i].alamatMurid ? allOrder[i].alamatMurid : 'Rumah Murid';
        let schedule = allOrder[i].sessions.map((v: any, key: number) => {
          let newV = {
            title: `Lesgo sesi ke ${key + 1} ${matpel} untuk murid ${namaMurid}`,
            location: alamat,
            note: ` Sesi ke ${key + 1}, mata pelajaran ${matpel} untuk murid ${namaMurid} dengan guru ${tutorName}`,
            startDate: new Date(this.getYear(v.date), this.getMonth(v.date) - 1, this.getDay(v.date), parseInt(v.jam), 0, 0),
            endDate: new Date(this.getYear(v.date), this.getMonth(v.date) - 1, this.getDay(v.date), parseInt(v.jam) + 1, 30, 0)
          };
          return newV;
        })
        console.log('schedule', schedule)
        list = list.concat(schedule);
      }
    }
    console.log('before delete calendar');
    return this.Calendar.listCalendars().then((res: any) => {
      console.log('list calendar')
      console.log(res)
      if (res.map(v => { return v.name }).indexOf('Lesgo') != -1) {
        let hasOpen = false;
        this.Calendar.deleteCalendar('Lesgo').then((res: any) => {
          console.log('success delete calendar');
          if (hasOpen) return;
          this.doSetCalendar(list, openCalendar);
          hasOpen = true;
        }, (err: any) => {
          console.log('err delete calendar');
          if (hasOpen) return;
          this.doSetCalendar(list, openCalendar);
          hasOpen = true;
        })
        setTimeout(() => {
          if (hasOpen) return;
          this.doSetCalendar(list, openCalendar);
          hasOpen = true;
        }, 5000)
      } else {
        return this.doSetCalendar(list, openCalendar);
      }
    })
  }
  doSetCalendar(list: any[], openCalendar?: boolean) {
    console.log('in doSetCalendar', list)
    let options = this.Calendar.getCalendarOptions();
    options.calendarName = "Lesgo";
    options.firstReminderMinutes = 360;
    options.secondReminderMinutes = 60;
    this.setScheduleData(list, options).then((res: any) => {
      console.log('set scheduleDate');
      this.loading.dismissAll();
      if (openCalendar) {
        setTimeout(() => {
          this.Calendar.openCalendar(new Date());
        }, 100)
      }
    }, (err: any) => {
      console.log('err setSCheduleData');
      this.loading.dismissAll();
      if (openCalendar) {
        setTimeout(() => {
          this.Calendar.openCalendar(new Date());
        }, 100)
      }
    })
  }

  async setScheduleData(list: any[], options) {
    for (let k in list) {
      await this.Calendar.createEventWithOptions(list[k].title, list[k].location, list[k].note, list[k].startDate, list[k].endDate, options)
    }
  }

  public uploadImage(data, fileType) {
    // Destination URL
    console.log('data upload', data)
    console.log('fileType upload', fileType)
    let storageRef = firebase.storage().ref(this.myUserId);
    const filename = fileType;
    const imageRef = storageRef.child(`${filename}.png`);
    this.loading = this.loadingCtrl.create({ content: '<img src="./assets/loading.gif"/>', spinner: 'hide' });
    this.loading.present();
    imageRef.putString(data, 'base64', { contentType: 'image/jpg' }).then((snapshot) => {
      this.userService.viewUser(this.myUserId).update({ avatar: snapshot.downloadURL });
      this.user.avatar = snapshot.downloadURL;
      this.loading.dismissAll()
      this.presentToast('Foto telah tersimpan');
    }, err => {
      this.loading.dismissAll()
    });
  }
  private presentToast(text) {
    let toast = this.toast.create({ message: text, duration: 3000, position: 'top' });
    toast.present();
  }

  public takePicture(sourceType, fileType) {
    const options: CameraOptions = {
      quality: 50,
      sourceType: sourceType,
      saveToPhotoAlbum: true,
      allowEdit: true,
      targetWidth: 600,
      targetHeight: 600,
      destinationType: 0,
      encodingType: this.Camera.EncodingType.JPEG,
      mediaType: 0,
      correctOrientation: true,
      cameraDirection: 1,
    };

    this.Camera.getPicture(options).then((imagePath) => {
      console.log('success', imagePath)
      this.uploadImage(imagePath, fileType);
    }, (err) => {
      console.log('err get picture', err)
    });
  }

  public presentActionSheet(fileType) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.takePicture(0, fileType);
        }
      }, {
        text: 'Use Camera',
        handler: () => {
          this.takePicture(1, fileType);
        }
      }, {
        text: 'Cancel',
        role: 'cancel'
      }]
    });
    actionSheet.present();
  }
  sendverivicationCode(data: any) {
    this.userService.sendVerificationCode(data).take(1).subscribe()
  }
  updateUserStatus(uid) {
    this.userService.updateUserData(uid, { smsVerificationStatus: true }).then(() => {
      this.status = true;
      return true
    })
  }
}
