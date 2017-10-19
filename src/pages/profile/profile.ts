import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, ActionSheetController, NavParams, ModalController, ToastController, Platform, Content, LoadingController, Loading } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { LoginPage } from '../login/login';
import { MapsPage } from '../maps/maps';
import { ModalMuridPage } from '../modal-murid/modal-murid';
import * as firebase from 'firebase';
// import { ImagePicker,Camera, File, Transfer, FilePath, FileChooser} from 'ionic-native';
// , File, Transfer, FilePath, FileChooser
import { FilePath } from '@ionic-native/file-path';
import { FileOpener } from '@ionic-native/file-opener';
import { FileChooser } from '@ionic-native/file-chooser';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/Camera';
import { TextMaskModule } from 'angular2-text-mask';

declare var cordova: any
declare var window;
// import { GalleryPage } from '../gallery/gallery';
/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [UserService]
})
export class ProfilePage {
  @ViewChild(Content) content: Content;
  mask: any = ['+', '6', '2', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/];
  userGenderState: any = false;
  userAvatar: any;
  userLatLong: any = { lat: 0, long: 0 };
  lastImage: string = null;
  loading: Loading;
  captureDataUrl: any;
  listMurid: any = [];
  numsky: any;
  select: any;
  jumlahMurid: any = 0;
  dataMurid: any = [];
  dataTutor: any = [];
  status: any = true;
  value: any;
  dataUser: any = {
    avatar: "assets/Male.png", firstName: "", lastName: "",
    gender: "", alamat: "", province: "", city: "",
    posCode: "", latitude: "", longitude: "",
    dob: "", userId: "", updatedAt: "", displayAddress: ""
  };


  constructor(
    public Camera: Camera,
    public File: File,
    public FilePath: FilePath,
    public FileChooser: FileChooser,
    public navCtrl: NavController,
    public userService: UserService,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController
  ) {
    this.platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    }, 1);
    var myUserId = firebase.auth().currentUser.uid;
    this.muridTot(myUserId);
    this.displayUser(myUserId);
  }

  muridTot(uid) {
    this.listMurid = [];
    this.userService.getMuridUser(uid).subscribe(dante => {
      dante.forEach(sabi => {
        var data = sabi;
        data['key'] = sabi.$key;
        data['muridId'] = sabi.$key;
        this.listMurid.push(data);
      })
    })
  }

  displayUser(myUserId) {
    this.userService.viewUser(myUserId).once('value', (snapshot) => {
      var data = snapshot.val();
      this.dataUser = data;
      this.dataUser.userId = snapshot.key;
      // this.userTelephone      = snapshot.val().phoneNumber;
      // this.userEmail          = snapshot.val().email;
      // this.userDisplayName    = snapshot.val().firstName + snapshot.val().lastName;
      // this.userAvatar             = snapshot.val().avatar;
      // this.userGender             = snapshot.val().gender;
      // this.userLatLong.lat        = snapshot.val().latitude;
      // this.userLatLong.long       = snapshot.val().longitude;
      // this.userAddress            = snapshot.val().longitude;
    }).then(check => {
      this.numsky = this.dataUser.phoneNumber;
      if (this.dataUser.role == 'guru') {
        this.userService.viewUser(this.dataUser.userId).once('value', (snapshot) => {
          var data = snapshot.val();
          this.dataTutor = data;
        })
      }
      if (this.dataUser.role == 'murid') {
        // this.muridTot(this.dataUser.userId);
      }
    })

  }
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  public uploadImage(data, fileType) {
    // Destination URL
    let storageRef = firebase.storage().ref(this.dataUser.userId);
    const filename = fileType;
    const imageRef = storageRef.child(`${filename}.png`);
    this.loading = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    this.loading.present();
    imageRef.putString(data, 'base64', { contentType: 'image/jpg' }).then((snapshot) => {
      this.userService.viewUser(this.dataUser.userId).update({ avatar: snapshot.downloadURL });
      this.dataUser.avatar = snapshot.downloadURL;
      this.loading.dismissAll()
      this.presentToast('Foto telah tersimpan');
    }, err => {
      this.loading.dismissAll()
    });
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {

    this.File.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
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
  public takePicture(sourceType, fileType) {
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
        this.uploadImage(imagePath, fileType);
      } else {
        this.uploadImage(imagePath, fileType);
      }
    }, (err) => {
    });
  }

  public presentActionSheet(fileType) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(0, fileType);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(1, fileType);
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

  getMurid(value) {
    if (value == 'tambah') {
      let muridModal = this.modalCtrl.create(ModalMuridPage, { types: value, uid: this.dataUser.userId, source: 'profile' });
      muridModal.present();
      muridModal.onDidDismiss(data => {
        this.listMurid = [];
        this.muridTot(this.dataUser.userId);
      });
    } else {
      let muridModal = this.modalCtrl.create(ModalMuridPage, { types: value, uid: this.dataUser.userId, source: 'profile', dataMurid: this.dataMurid });
      muridModal.present();
      muridModal.onDidDismiss(data => {
        this.listMurid = [];
        this.muridTot(this.dataUser.userId);
      });
    }
  }
  openMap(type, val) {
    // if( type == 'user'){
    let filterModal = this.modalCtrl.create(MapsPage);
    filterModal.present();
    filterModal.onDidDismiss(data => {
      if (data != null || data != undefined) {

        this.dataUser.latitude = data.lat;
        this.dataUser.longitude = data.lng;
        this.dataUser.displayAddress = data.address;
      } else {
        return this.presentToast('Area mengajar belum terpilih')
      }
    })
  }

  // }
  // else if(type == 'murid'){
  //   let filterModal = this.modalCtrl.create(MapsPage);
  //   filterModal.present();
  //   filterModal.onDidDismiss(data =>{
  //   this.dataMurid[val].latitude=data.latitude;
  //   this.dataMurid[val].longitude=data.longitude;
  //   this.dataMurid[val].displayAddress=data.address;
  // })
  // }
  // isiMurid(){
  //   this.dataMurid=this.listMurid[this.select];
  // }
  isiMurid() {
    if (this.listMurid.length > 0) {
      this.dataMurid = this.listMurid[this.select];
      this.getMurid('edit');
    }
  }
  saveProfile() {
    if (this.numsky != this.dataUser.phoneNumber) {
      this.dataUser.smsVerificationStatus = false
      let telpon = this.dataUser.phoneNumber.toString().split('');
      telpon = telpon.map((v: any) => {
        return v.replace(' ', '').replace('(', '').replace(')', '').replace("_", '').replace('-', '')
      });
      this.dataUser.phoneNumber = telpon.join('');
    }
    if (!this.dataUser.lastName) this.dataUser.lastName = '';
    firebase.database().ref('users/' + this.dataUser.userId).update(this.dataUser).then(success => {
      this.presentToast('Profile anda telah diubah');
      this.status = true;
    }, error => {
      this.presentToast(error);
    })
  }

}
