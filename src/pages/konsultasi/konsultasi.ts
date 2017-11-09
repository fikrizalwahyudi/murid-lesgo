import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController, ToastController, Platform, Content, LoadingController, Loading } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { Zapier } from '../../providers/zapier';
import { FilePath } from '@ionic-native/file-path';
import { FileOpener } from '@ionic-native/file-opener';
import { FileChooser } from '@ionic-native/file-chooser';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/Camera';
import * as firebase from 'firebase';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Helper } from '../../providers/helper';
import { Observable } from 'rxjs/Rx';

/*
  Generated class for the Konsultasi page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare var cordova: any
declare var window;
@Component({
  selector: 'page-konsultasi',
  templateUrl: 'konsultasi.html',
  providers: [UserService, Zapier]
})
export class KonsultasiPage {
  @ViewChild('content') content: ElementRef;
  theChat: any;
  Tutor: any;
  receiver: any;
  uid: any;
  tutorUid: any;
  name: any;
  loading: Loading;
  status: boolean = false;
  chatData: any = [];
  offset: any;
  tutorData: any = [];
  tutorUidNotif: string;
  messages: any[];
  subcribers: any[];
  chatBySubcriber: boolean;
  tutorUidNotifSubscriber: string;

  constructor(
    public zapier: Zapier,
    public Camera: Camera,
    public File: File,
    public FilePath: FilePath,
    public FileChooser: FileChooser,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public userService: UserService,
    public params: NavParams,
    public helper: Helper
  ) {
    this.subcribers = [];
    let subs = this.helper.emitterChatTutor.subscribe((data: any) => {
      if (this.uid) {
        this.chatBySubcriber = true;
        this.tutorUidNotifSubscriber = data.tutorUid;
        this.tutorUidNotif = data.tutorUid;
        this.noTutor(this.uid);
      }
    })
    this.subcribers.push(subs);
  }

  ionViewWillEnter() {
    // this.uid = this.params.get('data');
    this.name = this.params.get('name');
    if (this.params.get('type') == '') {
      this.helper.setDataNotif({});
    }
    this.name = this.params.get('name');
    this.uid = this.params.get('uid');
    console.log(this.params)
    if (this.params.get('tutor')) {
      this.status = true;
      this.Tutor = this.params.get('tutor');
      this.tutorUid = this.Tutor.tutorUid;
      console.log(this.Tutor)
    }
    if (this.params.data.type == 'notification') {
      console.log('this.params.data.type == notif')
      this.tutorUidNotif = this.params.data.tutorUid;
      this.helper.setDataNotif({});
      // this.noTutor(this.uid);
    }
    if (this.Tutor == undefined || this.Tutor == []) {
      this.noTutor(this.uid);
    } else {
      this.chatHim(this.Tutor)
    }
    if (this.chatBySubcriber) {
      this.tutorUidNotif = this.tutorUidNotifSubscriber;
      this.noTutor(this.uid);
      this.chatBySubcriber = false;
    }
  }
  ionViewWillLeave() {
    for (let i = 0; i < this.subcribers.length; i++) {
      this.subcribers[i].unsubscribe();
    }
  }
  noTutor(muridId) {
    let loader = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide',
    });
    loader.present()
    console.log('muridId', muridId)
    this.userService.muridCariTutor(muridId).take(1).subscribe(snapshot => {
      this.tutorData = [];
      var data = snapshot;
      if (snapshot.length == 0 && this.status == true) {
        this.presentAlert('anda belum memesan guru');
        return this.navCtrl.pop();
      }
      console.log('data', data)
      data = _.remove(data, { status: 'booked' });
      data = _.unionBy(data, 'tutorUid');
      console.log('data', data)
      let subscribers = [];
      let dataChild = [];
      data.forEach(a => {
        dataChild.push(a);
        subscribers.push(this.userService.getUserData(a.tutorUid).take(1));
        // this.userService.getUserData(a.tutorUid).take(1).subscribe(child => {
        //   console.log(child);
        //   a.deviceId = child.deviceId;
        //   if (this.tutorUidNotif && a.tutorUid == this.tutorUidNotif) {
        //     console.log("EXECUTE CHAT HIM")
        //     this.chatHim(a);
        //     this.tutorUidNotif = undefined;
        //   }
        //   this.tutorData.push(a);
        // })
      })
      console.log(subscribers.length)
      if (subscribers.length) {
        Observable.forkJoin(subscribers).subscribe((res: any) => {
          res.forEach((child, k) => {
            console.log(child);
            dataChild[k].deviceId = child.deviceId;
            if (this.tutorUidNotif && dataChild[k].tutorUid == this.tutorUidNotif) {
              console.log("EXECUTE CHAT HIM")
              loader.dismissAll()
              setTimeout(() => {
                this.chatHim(dataChild[k]);
                this.tutorUidNotif = undefined;
              })
            }
            this.tutorData.push(dataChild[k]);
          })
          loader.dismissAll()
        })
      } else {
        loader.dismissAll();
      }
      console.log(this.tutorData);
    })
  }
  chatHim(tutor) {
    this.Tutor = tutor;
    console.log('tutor', tutor)
    this.tutorUid = tutor.tutorUid;
    let loader = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide',
    });
    loader.present()
    let chatTutorSubcriber = this.offset = this.userService.newChatTutor(this.uid, tutor.tutorUid).subscribe(snaps => {
      console.log(snaps);
      this.chatData = snaps;
      var count = 0;
      snaps.forEach(e => {
        if (e.position == 'left' && e.status == false) {
          this.userService.updateChatStatusTutor(this.uid, this.tutorUid, e.$key);
          count = count + 1;
        }
      })
      this.status = true;
      setTimeout(() => {
        loader.dismissAll();
        // this.scrollToBottom();
        var i = "chat"+this.chatData.length; 
        // console.log("iiii", i);
        var element = document.getElementById(i);
        // console.log(element);
        element.scrollIntoView();
        // console.log("kepanggil 2 ");
      }, 3000);
    })
    this.subcribers.push(chatTutorSubcriber);
  }
  openThis(name: string) {
    if (name == 'back') {
      this.navCtrl.pop();
    }
  }
  scrollToBottom() {
    console.log('this.content', this.content)
    if (!this.content) return;
    // let dimension = this.content.getContentDimensions();
    // console.log('dimension.scrollHeight', dimension.scrollHeight)
    // this.content.scrollTo(400, dimension.scrollHeight);
    try {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    } catch (err) { }
  }
  sendChat() {
    if (this.theChat) {
      this.userService.sendChatTutorNew(this.theChat, this.uid, this.tutorUid, 'text').then(() => {
        this.theChat = null;
        // let notifChat = { title: 'New chat from ' + this.name, message: this.theChat, to: this.Tutor.deviceId };
        // this.zapier.sendNotification(notifChat).subscribe(mintaReview => {
        //   return this.theChat = null;
        // })
      })
    }
  }

  getDates(dates) {
    let date = moment(dates).format('DD/MM/YYYY HH:mm');
    return date;
  }

  getHour(hour) {
    var a = new Date(hour).getHours();
    var b = new Date(hour).getMinutes();
    if (b > 9) {
      return a + ':' + b;
    } else {
      return a + ':0' + b;
    }
  }

  presentAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Sorry',
      message: message,
      buttons: [{
        text: 'Dismiss', handler: datas => {
          this.navCtrl.pop();
        }
      }]
    });
    alert.present();
  }

  private createFileName() {
    var d = new Date();
    return d.getTime() + ".jpg";
  }

  public uploadImage(data) {
    // Destination URL
    let storageRef = firebase.storage().ref(this.uid + '/' + this.tutorUid);
    const filename = new Date().getTime();
    const imageRef = storageRef.child(`${filename}.png`);
    this.loading = this.loadingCtrl.create({});
    this.loading.present();
    imageRef.putString(data, 'base64', { contentType: 'image/jpg' }).then((snapshot) => {
      this.userService.sendChatTutorNew(snapshot.downloadURL, this.uid, this.tutorUid, 'img');
      this.loading.dismissAll()
    }, err => {
      this.loading.dismissAll()
    });

  }


  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
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
      correctOrientation: true
    };

    // Get the data of an image
    this.Camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      this.uploadImage(imagePath);
    });
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(0);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(1);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  dismiss() {
    this.offset = '';
    this.status = false;
    this.Tutor = [];
    this.tutorData = [];
    this.chatData = [];
    this.tutorUid = undefined;
    this.navCtrl.pop();
  }
  getTutor() {
    this.offset.unsubscribe;
    this.status = false;
    this.tutorUid = undefined;
    this.chatData = [];
    this.noTutor(this.uid);
  }
}
