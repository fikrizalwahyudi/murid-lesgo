import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, AlertController, ActionSheetController, NavParams, ModalController, ToastController, Platform, Content, LoadingController, Loading } from 'ionic-angular';
import { MapsPage } from '../maps/maps';
import { HomePage } from '../home/home';
import * as firebase from 'firebase';
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/Camera';
import { UserService } from '../../providers/user-service';
/*
  Generated class for the ModalMurid page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare var cordova: any;
@Component({
  selector: 'page-modal-murid',
  templateUrl: 'modal-murid.html',
  providers: [UserService]
})
export class ModalMuridPage {
  @ViewChild(Content) content: Content;
  userGenderState: any = false;
  userAvatar: any;
  types: any;
  source: any;
  select: any;
  userLatLong: any = { lat: 0, long: 0 };
  lastImage: string = null;
  loading: Loading;
  jumlahMurid: any = 0;
  dataMurid: any = {
    avatar: "https://firebasestorage.googleapis.com/v0/b/lesgo-dev-test.appspot.com/o/Male.png?alt=media&token=2c4bb71c-d7a4-43d1-ba6d-6e7aad775a8d",
    firstName: "", lastName: "", gender: "",
    address: "", provinceName: "", cityName: "",
    provinceId: "", cityId: "", postalCode: "",
    latitude: "", longitude: "",
    dob: "", uid: "", createdAt: "",
    updatedAt: "",
    displayAddress: "pilih lokasi belajar",
    status: "new", muridId: ""
  };;
  listMurid: any = [];
  arrayProvinceName: any = [];
  arrayCityByProvince: any = [];
  province: any = [
    {
      id: 0,
      name: 'DKI Jakarta'
    },
    {
      id: 1,
      name: 'Bali'
    },
    {
      id: 2,
      name: 'Banten'
    },
    {
      id: 3,
      name: 'Bengkulu'
    },
    {
      id: 4,
      name: 'D.I Yogyakarta'
    },
    {
      id: 5,
      name: 'Gorontalo'
    },
    {
      id: 6,
      name: 'Jambi'
    },
    {
      id: 7,
      name: 'Jawa Barat'
    },
    {
      id: 8,
      name: 'Jawa Tengah'
    },
    {
      id: 9,
      name: 'Jawa Timur'
    },
    {
      id: 10,
      name: 'Kalimantan Selatan'
    },
    {
      id: 11,
      name: 'Kalimantan Tengah'
    },
    {
      id: 12,
      name: 'Kalimantan Timur'
    },
    {
      id: 13,
      name: 'Kalimatan Barat'
    },
    {
      id: 14,
      name: 'Bangka Belitung'
    },
    {
      id: 15,
      name: 'Kepulauan Riau'
    },
    {
      id: 16,
      name: 'Lampung'
    },
    {
      id: 17,
      name: 'Maluku'
    },
    {
      id: 18,
      name: 'Maluku Utara'
    },
    {
      id: 19,
      name: 'Nanggroe Aceh Darussalam'
    },
    {
      id: 20,
      name: 'Nusa Tenggara Barat'
    },
    {
      id: 21,
      name: 'Nusa Tenggara Timur'
    },
    {
      id: 22,
      name: 'Papua'
    },
    {
      id: 23,
      name: 'Papua Barat'
    },
    {
      id: 24,
      name: 'Riau'
    },
    {
      id: 25,
      name: 'Sulawesi Barat'
    },
    {
      id: 26,
      name: 'Sulawesi Selatan'
    },
    {
      id: 27,
      name: 'Sulawesi Tengah'
    },
    {
      id: 28,
      name: 'Sulawesi Tenggara'
    },
    {
      id: 29,
      name: 'Sulawesi Utara'
    },
    {
      id: 30,
      name: 'Sumatera Barat'
    },
    {
      id: 31,
      name: 'Sumatera Selatan'
    },
    {
      id: 32,
      name: 'Sumatera Utara'
    }
  ];

  city: any = [
    {
      id: 0,
      name: ['Jakarta Barat',
        'Jakarta Timur',
        'Jakarta Selatan',
        'Jakarta Pusat',
        'Jakarta Utara',
        'Kep Seribu'],
      provinceId: 0
    },
    {
      id: 1,
      name: ['Badung',
        'Bangli',
        'Buleleng',
        'Denpasar',
        'Gianyar',
        'Jembrana',
        'Karangasem',
        'Klungkung',
        'Tabanan'],
      provinceId: 1
    },
    {
      id: 2,
      name: ['Cilegon',
        'Kabupaten Serang',
        'Kabupaten Tangerang',
        'Lebak',
        'Pandeglang',
        'Serang',
        'Tangerang',
        'Tangerang Selatan'],
      provinceId: 2
    },
    {
      id: 3,
      name: ['Bengkulu',
        'Bengkulu Selatan',
        'Bengkulu Tengah',
        'Bengkulu Utara',
        'Kaur',
        'Kepahiang',
        'Lebong',
        'Muko Muko',
        'Rejang Lebong',
        'Seluma'],
      provinceId: 3
    },
    {
      id: 4,
      name: ['Bantul',
        'Gunung Kidul',
        'Kulon Progo',
        'Sleman',
        'Yogyakarta'],
      provinceId: 4
    },
    {
      id: 5,
      name: ['Boalemo',
        'Bone Bolango',
        'Gorontalo',
        'Gorontalo Utara',
        'Kabupaten Gorontalo',
        'Pahuwato'],
      provinceId: 5
    },
    {
      id: 6,
      name: ['Batang Hari',
        'Bungo',
        'Jambi',
        'Kerinci',
        'Merangin',
        'Muaro Jambi',
        'Sorolangun',
        'Sungai Penuh',
        'Tanjung Jabung Barat',
        'Tanjung Jabung Timur',
        'Tebo'],
      provinceId: 6
    },
    {
      id: 7,
      name: ['Bandung',
        'Bandung Barat',
        'Banjar',
        'Bekasi',
        'Bogor',
        'Ciamis',
        'Cianjur',
        'Cimahi',
        'Depok',
        'Garut',
        'Indramayu',
        'Kabupaten Bandung',
        'Kabupaten Bekasi',
        'Kabupaten Bogor',
        'Kabupaten Cirebon',
        'Kabupaten Sukabumi',
        'Kabupaten Tasikmalaya',
        'Karawang',
        'Kota Cirebon',
        'Kota Sukabumi',
        'Kota Tasikmalaya',
        'Kuningan',
        'Purwakarta',
        'Subang',
        'Sumedang'],
      provinceId: 7
    },
    {
      id: 8,
      name: ['Banjarnegara',
        'Banyumas',
        'Batang',
        'Blora',
        'Boyolali',
        'Brebes',
        'Cilacap',
        'Demak',
        'Grobogan',
        'Kabupaten Pekalongan',
        'Kabupaten Semarang',
        'Kabupaten Tegal',
        'Karanganyar',
        'Kebumen',
        'Kendal',
        'Klaten',
        'Kota Pekalongan',
        'Kota Tegal',
        'Kudus',
        'Magelang',
        'Pati',
        'Pemalang',
        'Purbalingga',
        'Purworejo',
        'Rembang',
        'Salatiga',
        'Semarang',
        'Sragen',
        'Sukoharjo',
        'Surakarta',
        'Temanggung',
        'Wonogiri',
        'Wonosobo'],
      provinceId: 8
    },
    {
      id: 9,
      name: ['Bangkalan',
        'Banyuwangi',
        'Batu',
        'Bojonegoro',
        'Bondowoso',
        'Gresik',
        'Jember',
        'Jombang',
        'Kabupaten Blitar',
        'Kabupaten Kediri',
        'Kabupaten Madiun',
        'Kabupaten Malang',
        'Kabupaten Mojokerto',
        'Kabupaten Pasuruan',
        'Kabupaten Probolinggo',
        'Kota Blitar',
        'Kota Kediri',
        'Kota Madiun',
        'Kota Malang',
        'Kota Mojokerto',
        'Kota Pasuruan',
        'Kota Probolinggo',
        'Lamongan',
        'Lumajang',
        'Magetan',
        'Nganjuk',
        'Ngawi',
        'Pacitan',
        'Pamekasan',
        'Ponorogo',
        'Sampang',
        'Sidoarjo',
        'Situbondo',
        'Sumenep',
        'Surabaya',
        'Trenggalek',
        'Tuban',
        'Tulungagung'],
      provinceId: 9
    },
    {
      id: 10,
      name: ['Balangan',
        'Banjar',
        'Banjarbaru',
        'Banjarmasin',
        'Barito Kuala',
        'Hulu Sungai Selatan',
        'Hulu Sungai Tengah',
        'Hulu Sungai Utara',
        'Kotabaru',
        'Tanah Bumbu',
        'Tanah Laut',
        'Tapin'],
      provinceId: 10
    },
    {
      id: 11,
      name: ['Barito Timur',
        'Barito Selatan',
        'Barito Utara',
        'Gunung Mas',
        'Kapuas',
        'Katingan',
        'Kotawaringin Barat',
        'Kotawaringin Timur',
        'Murung Raya',
        'Palangka Raya',
        'Pulau Pisau',
        'Seruyan',
        'Sukamara'],
      provinceId: 11
    },
    {
      id: 12,
      name: ['Balikpapan',
        'Berau',
        'Bontang',
        'Bulungan',
        'Kutai Barat',
        'Kutai Kertanegara',
        'Kutai Timur',
        'Malinau',
        'Nunukan',
        'Paser',
        'Penajam Paser Utara',
        'Samarinda',
        'Tana Tidung',
        'Tarakan'],
      provinceId: 12
    },
    {
      id: 13,
      name: ['Bengkayang',
        'Kabupaten Pontianak',
        'Kapuas Hulu',
        'Kayong Utara',
        'Ketapang',
        'Kubu Raya',
        'Landak',
        'Melawai',
        'Pontianak',
        'Sambas',
        'Sanggau',
        'Sekadau',
        'Singkawang',
        'Sintang'],
      provinceId: 13
    },
    {
      id: 14,
      name: ['Bangka',
        'Bangka Barat',
        'Bangka Selatan',
        'Bangka Tengah',
        'Belitung',
        'Belitung Timur',
        'Pangkal Pinang'],
      provinceId: 14
    },
    {
      id: 15,
      name: ['Batam',
        'Bintan',
        'Karimun',
        'Kepulauan Anambas',
        'Lingga',
        'Natuna',
        'Tanjung Pinang'],
      provinceId: 15
    },
    {
      id: 16,
      name: ['Bandar Lampung',
        'Lampung Barat',
        'Lampung Selatan',
        'Lampung Tengah',
        'Lampung Timur',
        'Lampung Utara',
        'Mesuji',
        'Metro',
        'Pesawaran',
        'Pringsewu',
        'Tanggamus',
        'Tulang Bawang',
        'Tulang Bawang Barat',
        'Way Kanan'],
      provinceId: 16
    },
    {
      id: 17,
      name: ['Ambon',
        'Buru',
        'Buru Selatan',
        'Kepulauan Aru',
        'Maluku Barat Daya',
        'Maluku Tengah',
        'Maluku Tenggara',
        'Maluku Tenggara Barat',
        'Seram Bagian Barat',
        'Seram Bagian Timur',
        'Tual'],
      provinceId: 17
    },
    {
      id: 18,
      name: ['Halmahera Barat',
        'Halmahera Selatan',
        'Halmahera Tengah',
        'Halmahera Timur',
        'Halmahera Utara',
        'Kepulauan Morotai',
        'Kepulauan Sula',
        'Sofifi',
        'Ternate',
        'Tidore Kepulauan'],
      provinceId: 18
    },
    {
      id: 19,
      name: ['Aceh Barat',
        'Aceh Barat Daya',
        'Aceh Besar',
        'Aceh Jaya',
        'Aceh Selatan',
        'Aceh Singkil',
        'Aceh Tamiang',
        'Aceh Tengah',
        'Aceh Tenggara',
        'Aceh Timur',
        'Aceh Utara',
        'Banda Aceh',
        'Bener Meriah',
        'Bireuen',
        'Gayo Lues',
        'Langsa',
        'Lhokseumawe',
        'Nagan Raya',
        'Pidie',
        'Pidie JayaSabang',
        'Sabang',
        'Simeulue',
        'Subulussalam'],
      provinceId: 19
    },
    {
      id: 20,
      name: ['Dompu',
        'Kabupaten Bima',
        'Kota Bima',
        'Lombok Barat',
        'Lombok Tengah',
        'Lombok Timur',
        'Lombok Utara',
        'Mataram',
        'Sumbawa',
        'Sumbawa Barat'],
      provinceId: 20
    },
    {
      id: 21,
      name: ['Alor',
        'Belu',
        'Ende',
        'Flores Timur',
        'Kabupaten Kupang',
        'Kupang',
        'Lembata',
        'Manggarai',
        'Manggarai Barat',
        'Manggarai Timur',
        'Nagekeo',
        'Ngada',
        'Rote Ndao',
        'Sabu Raijua',
        'Sikka',
        'Sumba Barat',
        'Sumba Barat Daya',
        'Sumba Tengah',
        'Sumba Timur',
        'Timor Tengah Selatan',
        'Timor Tengah Utara'],
      provinceId: 21
    },
    {
      id: 22,
      name: ['Asmat',
        'Biak Numfor',
        'Boven Digoel',
        'Deiyai',
        'Dogiyai',
        'Intan Jaya',
        'Jayapura',
        'Jayawijaya',
        'Kabupaten Jayapura',
        'Keerom',
        'Lanny Jaya',
        'Mamberamo Raya',
        'Mappi',
        'Membramo Tengah',
        'Merauke',
        'Mimika',
        'Nabire',
        'Nduga',
        'Paniai',
        'Pegunungan Bintang',
        'Puncak',
        'Puncak Jaya',
        'Sarmi',
        'Supiori',
        'Tolikara',
        'Yahukimo',
        'Yalimo',
        'Yapen Waropen'],
      provinceId: 22
    },
    {
      id: 23,
      name: ['Fakfak',
        'Kabupaten Sorong',
        'Kaimana',
        'Kota Sorong',
        'Manokwari',
        'Maybrat',
        'Raja Ampat',
        'Sorong Selatan',
        'Tambrauw',
        'Teluk Bintuni',
        'Teluk Wondama'],
      provinceId: 23
    },
    {
      id: 24,
      name: ['Bengkalis',
        'Dumai',
        'Indragiri Hilir',
        'Indragiri Hulu',
        'Kampar',
        'Kepulauan Meranti',
        'Kuantan Singingi',
        'Pekan Baru',
        'Pelalawan',
        'Rokan Hilir',
        'Rokan Hulu',
        'Siak'],

      provinceId: 24
    },
    {
      id: 25,
      name: ['Majene',
        'Mamasa',
        'Mamuju',
        'Mamuju Utara',
        'Polewali Mandar'],
      provinceId: 25
    },
    {
      id: 26,
      name: ['Bantaeng',
        'Barru',
        'Buleleng',
        'Bone',
        'Bulukumba',
        'Enrekang',
        'Gowa',
        'Jeneponto',
        'Kepulauan Selayar',
        'Luwu',
        'Luwu Timur',
        'Luwu Utara',
        'Makassar',
        'Maros',
        'Palopo',
        'Pangkajene Kepulauan',
        'Pare Pare',
        'Pinrang',
        'Sidenreng Rapang',
        'Sinjai',
        'Soppeng',
        'Takalar',
        'Tana Toraja',
        'Toraja Utara',
        'Wajo'],
      provinceId: 26
    },
    {
      id: 27,
      name: ['Banggai',
        'Banggai Kepulauan',
        'Buol',
        'Donggala',
        'Morowali',
        'Palu',
        'Parigi Moutong',
        'Poso',
        'Sigi',
        'Tojo Una Una',
        'Toli Toli'],
      provinceId: 27
    },
    {
      id: 28,
      name: ['Bombana',
        'Wakatobi',
        'Kolaka Utara',
        'Konawe Selatan',
        'Konawe Utara',
        'Buton Utara',
        'Kolaka Timur',
        'Konawe Kepulauan',
        'Konawe',
        'Buton Tengah',
        'Buton Selatan',
        'Muna Barat'],
      provinceId: 28
    },
    {
      id: 29,
      name: ['Bitung',
        'Bolaang Mongondow',
        'Bolaang Mongondow Selatan',
        'Bolaang Mongondow Timur',
        'Bolmong Utara',
        'Kepulauan Sangihe',
        'Kepulauan Siau Tagulandang Biaro',
        'Kepulauan Talaud',
        'Kotamobagu',
        'Manado',
        'Minahasa',
        'Minahasa Selatan',
        'Minahasa Tenggara',
        'Minahasa Utara',
        'Tomohon'],
      provinceId: 29
    },
    {
      id: 30,
      name: ['Agam',
        'Bukittinggi',
        'Dharmasraya',
        'Kepulauan Mentawai',
        'Lima Puluh Kota',
        'Padang',
        'Padang Panjang',
        'Padang Pariaman',
        'Pariaman',
        'Pasaman',
        'Pasaman Barat',
        'Payakumbuh',
        'Pesisir Selatan',
        'Sawah Lunto',
        'Sijunjung',
        'Solok',
        'Solok Selatan',
        'Tanah Datar'],
      provinceId: 30
    },
    {
      id: 31,
      name: ['Banyuasin',
        'Empat Lawang',
        'Lahat',
        'Lubuk Linggau',
        'Muara Enim',
        'Musi Banyuasin',
        'Musi Rawas',
        'Ogan Ilir',
        'Ogan Komering Ilir',
        'Ogan Komering Ulu',
        'Oku Selatan',
        'Oku Timur',
        'Pagar Alam',
        'Palembang',
        'Prabumulih'],
      provinceId: 31
    },
    {
      id: 32,
      name: ['Asahan',
        'Batubara',
        'Binjai',
        'Dairi',
        'Deli Serdang',
        'Gunung Sitoli',
        'Humbang Hasundutan',
        'Karo',
        'Labuhan Batu',
        'Labuhan Batu Selatan',
        'Labuhan Batu Utara',
        'Langkat',
        'Mandailing Natal',
        'Medan',
        'Nias',
        'Nias Barat',
        'Nias Selatan',
        'Nias Utara',
        'Padang Lawas',
        'Padang Lawas Utara',
        'Padang Sidempuan',
        'Pakpak Bharat',
        'Pematang Siantar',
        'Samosir',
        'Serdang Bedagai',
        'Sibolga',
        'Simalungun',
        'Tanjung Balai',
        'Tapanuli Selatan',
        'Tapanuli Tengah',
        'Tapanuli Utara',
        'Tebing Tinggi',
        'Toba Samosir'],
      provinceId: 32
    }
  ];
  sendData: any = [];
  status: any = false;
  max: any = new Date().toISOString();;


  constructor(
    public plt: Platform,
    public Camera: Camera,
    public File: File,
    public FilePath: FilePath,
    public FileChooser: FileChooser,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public params: NavParams,
    public userService: UserService,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) {

    this.plt.registerBackButtonAction(() => {
      this.navCtrl.popToRoot();
    }, 1);
    let loader = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    loader.present();
    console.log(this.listMurid);
    this.muridTot(this.params.data.uid);
    this.getArrayProvince();
    console.log(this.params.data);
    this.source = this.params.data.source;
    if (this.params.data.types == 'pilih') {
      this.types = 'pilih';
      loader.dismiss();
    }
    else if (this.params.data.types == 'edit') {
      console.log(this.params.data);
      var a = this.params.get('dataMurid');
      this.types = 'edit';
      this.dataMurid = a;
      this.getProvince();
      loader.dismiss();
    } else if (this.params.data.types == 'newbie') {
      this.types = 'newbie';
      loader.dismiss();
    }
    else {
      this.types = 'tambah';
      loader.dismiss();
    }
  }

  ionViewDidLoad() {
  }
  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  uploadImage(data) {
    // Destination URL
    let storageRef = firebase.storage().ref(this.params.data.uid);

    const filename = new Date().getTime();
    const imageRef = storageRef.child(`${filename}.png`);

    this.loading = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    this.loading.present();
    imageRef.putString(data, 'base64', { contentType: 'image/png' }).then((snapshot) => {
      this.dataMurid.avatar = snapshot.downloadURL;
      this.loading.dismissAll()
      this.presentToast('Foto telah tersimpan');
    });

  }

  copyFileToLocalDir(namePath, currentName, newFileName) {

    this.File.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    });
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
      encodingType: 1,
      mediaType: 0,
      correctOrientation: true
    };

    // Get the data of an image
    this.Camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      this.uploadImage(imagePath);
    });
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

  openMap(type) {
    let filterModal = this.modalCtrl.create(MapsPage);
    filterModal.present();
    filterModal.onDidDismiss(data => {
      if (data != null || data != undefined) {

        this.dataMurid.latitude = data.lat;
        this.dataMurid.longitude = data.lng;
        this.dataMurid.displayAddress = data.address;
      } else {
        return this.presentToast('Area belajar belum terpilih')
      }
    })
  }

  callFunction() {
    this.content.scrollToBottom(500)
  }
  saveMurid() {
    if (this.dataMurid.latitude == 0 || this.dataMurid.longitude == 0) {
      return this.presentToast('Harap mengisi lokasi terlebih dahulu');
    }
    this.dataMurid.userId = firebase.auth().currentUser.uid;
    if (this.types == 'edit') {
      this.userService.updateMurid(this.dataMurid.muridId, this.dataMurid);
      return this.viewCtrl.dismiss();
    }
    else {
      this.listMurid = [];
      return this.userService.tambahMurid(this.dataMurid.muridId, this.dataMurid).then((updated) => {
        console.log(updated);
        console.log(this.listMurid);
        this.presentToast('Profil anda telah tersimpan');
        if (this.source == 'home') {
          this.dataMurid = [];
          this.dataMurid = {
            avatar: "https://firebasestorage.googleapis.com/v0/b/lesgo-dev-test.appspot.com/o/Male.png?alt=media&token=2c4bb71c-d7a4-43d1-ba6d-6e7aad775a8d", firstName: "", lastName: "", gender: "", address: "",
            provinceName: "", cityName: "", provinceId: "", cityId: "", postalCode: "", latitude: "", longitude: "", dob: "", uid: "", createdAt: "", updatedAt: "", displayAddress: "", status: "new", muridId: ""
          };
          this.types = 'pilih';
        } else if (this.source == 'newbie') {
          this.navCtrl.setRoot(HomePage);
        }
        else {
          this.listMurid = [];
          return this.viewCtrl.dismiss();
        }
      });
    }
  }
  getArrayProvince() {
    return this.province.forEach(e => {
      this.arrayProvinceName.push({ id: e.id, text: e.name });
    })
  }

  getProvince() {
    var index = Number(this.dataMurid.provinceId);
    this.arrayCityByProvince = [];
    for (var key in this.city[index].name) {
      var value = this.city[index].name[key];
      this.arrayCityByProvince.push({ id: key, text: value })
    }
    this.dataMurid.provinceName = this.arrayProvinceName[index].text;
    // return this.arrayCityByProvince;
  }
  getCity() {
    var index = Number(this.dataMurid.cityId);
    console.log(index);
    this.dataMurid.cityName = this.arrayCityByProvince[index].text;

    // return this.arrayCityByProvince;
  }
  muridTot(uid) {
    var that = this;
    this.listMurid = [];

    let loader = this.loadingCtrl.create({
      content: '<img src="./assets/loading.gif"/>',
      spinner: 'hide'
    });
    loader.present();
    this.userService.getMuridUser(uid).subscribe(dante => {
      dante.forEach(sabi => {
        var data = sabi;
        data['key'] = sabi.$key;
        data['muridId'] = sabi.$key;
        that.listMurid.push(data);
      })
      loader.dismissAll();
    })
    // this.userService.loadMurid(uid).on('value',function(dante){
    //     dante.forEach(function(sabi){
    //       var data= sabi.val();
    //       data['key']=sabi.key;
    //       that.listMurid.push(data);
    //     })
    //     that.status=true;
    //     loader.dismiss();
    // })
  }
  isiMurid(i) {
    if (this.listMurid[i] != undefined) {
      this.sendData = this.listMurid[i];
    } else {
      this.presentToast('No user has been selected');
    }
  }
  tambahMurid() {
    this.listMurid = [];
    this.dataMurid = {
      avatar: "https://firebasestorage.googleapis.com/v0/b/lesgo-dev-test.appspot.com/o/Male.png?alt=media&token=2c4bb71c-d7a4-43d1-ba6d-6e7aad775a8d",
      firstName: "", lastName: "", gender: "",
      address: "", provinceName: "", cityName: "",
      provinceId: "", cityId: "", postalCode: "",
      latitude: "", longitude: "",
      dob: "", uid: "", createdAt: "",
      updatedAt: "", displayAddress: "pilih lokasi belajar",
      status: "new", muridId: ""
    };
    this.types = 'tambah';
  }
  send() {
    if (this.sendData.length != 0 && this.sendData != undefined) {
      this.viewCtrl.dismiss({ data: this.sendData })
    }
    else {
      this.presentToast('Harap pilih atau tambah murid')
    }
  }
  goHome() {
    this.viewCtrl.dismiss('goHome');
  }
}
