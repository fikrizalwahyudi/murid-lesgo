import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController, ModalController, ToastController, Platform, Content, LoadingController, Loading } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { FilePath } from '@ionic-native/file-path';
import { FileOpener } from '@ionic-native/file-opener';
import { FileChooser } from '@ionic-native/file-chooser';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/Camera';
import * as firebase from 'firebase';
import * as moment from 'moment';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { Helper } from '../../providers/helper';

/*
  Generated class for the Customeservice page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-customerservice',
  templateUrl: 'customerservice.html',
  providers: [UserService]
})
export class CustomerservicePage {
  @ViewChild('content') content: Content;
  theChat: any;
  receiver: any;
  name: any;
  lastImage: string = null;
  loading: Loading;
  captureDataUrl: any;
  myChat: any = [];
  uid: any;
  offset: any;
  subcribers: any[];

  constructor(
    public Camera: Camera,
    public File: File,
    public FilePath: FilePath,
    public FileChooser: FileChooser,
    public navCtrl: NavController,
    public params: NavParams,
    public userService: UserService,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public helper: Helper,
  ) {
    console.log(this.params);
    // let loader = this.loadingCtrl.create({
    //   content: '<img src="./assets/loading.gif"/>',
    //   spinner: 'hide',
    //   duration: 1000
    // });
    // loader.present()
    // console.log(this.myChat);
  }
  ionViewWillEnter() {
    this.uid = this.params.get('data');
    this.name = this.params.get('name');
    if (this.params.get('type') == '') {
      this.helper.setDataNotif({});
    }
    this.subcribers = [];
    this.updateChat();
  }
  ionViewWillLeave() {
    this.offset = false;
    for (let i = 0; i < this.subcribers.length; i++) {
      this.subcribers[i].unsubscribe();
    }
  }
  updateChat() {
    let loader = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide',
      duration: 1000
    });
    loader.present()
    // check evry convertation
    let userServiceSubcribe = this.userService.newChatCs(this.uid).subscribe(snapshot => {
      this.myChat = snapshot;
      if (snapshot.length == 0) {
        this.userService.sendFirstChat(this.uid, this.name)
      } else {
        // let counterStatusFalse = {};
        let isUpdate = false;
        snapshot.forEach(e => {
          if (e.position == 'left' && e.status == false) {
            // counterStatusFalse[`${e.$key}/status`] = true;
            isUpdate = true;
            this.userService.updateChatStatus(e.$key, this.uid);
          }
        })
      }
      setTimeout(() => {
        this.scrollToBottom();
        loader.dismissAll();
      });
    })
    this.subcribers.push(userServiceSubcribe)
  }
  scrollToBottom() {
    console.log('this.content', this.content)
    if (!this.content) return;
    let dimension = this.content.getContentDimensions();
    console.log('dimension', dimension)

    this.content.scrollTo(300, dimension.scrollHeight);
  }
  openThis(name: string) {
    if (name == 'back') {
      this.navCtrl.pop();
    }
  }
  sendChat() {
    if (this.theChat) {
      this.userService.sendChatCsNew(this.theChat, this.uid, 'text').then(() => {
        this.theChat = null;
      });
    }
  }
  getDates(dates) {
    console.log(dates)
    let date = moment(dates).format('DD/MM/YYYY HH:mm');
    return date;
  }

  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  uploadImage(data) {
    let storageRef = firebase.storage().ref(this.uid + '/cs/');
    const filename = new Date().getTime();
    const imageRef = storageRef.child(`${filename}.png`);
    this.loading = this.loadingCtrl.create({});
    this.loading.present();
    imageRef.putString(data, 'base64', { contentType: 'image/jpg' }).then((snapshot) => {
      this.userService.sendChatCsNew(snapshot.downloadURL, this.uid, 'img');
      this.loading.dismissAll();
    }, err => {
      this.loading.dismissAll();
    });

  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.File.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => { });
  }

  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  takePicture(sourceType) {
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
      if (sourceType == 0) {
        this.uploadImage(imagePath);
      } else {
        this.uploadImage(imagePath);
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => { });
  }

  presentActionSheet() {
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
    this.offset = false;
    this.navCtrl.pop();
  }
}
