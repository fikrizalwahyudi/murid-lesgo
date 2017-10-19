import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { SearchPage } from '../pages/search/search';
import { DashboardPage, FilterDay } from '../pages/dashboard/dashboard';
import { CartPage } from '../pages/cart/cart';
import { OrderPage } from '../pages/order/order';
import { LessonPage } from '../pages/lesson/lesson';
import { KelaskatPage } from '../pages/kelaskat/kelaskat';
import { KategoriPage } from '../pages/kategori/kategori';
import { FilterPage } from '../pages/filter/filter';
import { PaketPage } from '../pages/paket/paket';
import { PelajaranPage } from '../pages/pelajaran/pelajaran';
import { PreferencePage } from '../pages/preference/preference';
import { CustomerservicePage } from '../pages/customerservice/customerservice';
import { SettingPage } from '../pages/setting/setting';
import { KonsultasiPage } from '../pages/konsultasi/konsultasi';
import { BlankPage } from '../pages/blank/blank';
import { MapsPage } from '../pages/maps/maps';
import { FaqPage } from '../pages/faq/faq';
import { AbsensiPage } from '../pages/absensi/absensi';
import { DetailPage } from '../pages/detail/detail';
import { OrderDetailPage } from '../pages/order-detail/order-detail';
import { ModalMuridPage } from '../pages/modal-murid/modal-murid';
import { Ionic2RatingModule } from 'ionic2-rating';
import { Zapier } from '../providers/zapier';
import { UserService } from '../providers/user-service';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core/services/google-maps-api-wrapper';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { HttpModule } from '@angular/http';
import { FilePath } from '@ionic-native/file-path';
import { FileOpener } from '@ionic-native/file-opener';
import { FileChooser } from '@ionic-native/file-chooser';
import { Transfer } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/Camera';
import { TextMaskModule } from 'angular2-text-mask';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { Network } from '@ionic-native/network';
import { CallNumber } from '@ionic-native/call-number';
import { SMS } from '@ionic-native/sms';
import { AngularFireModule } from 'angularfire2';
import { Push } from '@ionic-native/push';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Calendar } from '@ionic-native/calendar';
import { ErrorPage } from '../pages/error/error';
import { Helper } from '../providers/helper';

const config = {
  apiKey: "AIzaSyBFKhA17tr8f2ki0agybmDZ2Pk_iYu2YLg",
  authDomain: "web-uat-1a4d8.firebaseapp.com",
  databaseURL: "https://web-uat-1a4d8.firebaseio.com",
  storageBucket: "web-uat-1a4d8.appspot.com",
  // messagingSenderId: "732818088048"
};



@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    LoginPage,
    ProfilePage,
    SearchPage,
    DashboardPage,
    CartPage,
    OrderPage,
    KonsultasiPage,
    SettingPage,
    CustomerservicePage,
    KategoriPage,
    KelaskatPage,
    BlankPage,
    PreferencePage,
    PelajaranPage,
    FilterPage,
    PaketPage,
    MapsPage,
    DetailPage,
    OrderDetailPage,
    AbsensiPage,
    ModalMuridPage,
    LessonPage,
    FaqPage,
    ErrorPage,

    FilterDay
  ],
  imports: [
    IonicImageViewerModule,
    TextMaskModule,
    HttpModule,
    Ionic2RatingModule,
    AngularFireModule.initializeApp(config),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCsCcTL_NLswlKyQ0mweNB-DLY3tHVn9P4',
      libraries: ['places']
    }),
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    LoginPage,
    ProfilePage,
    SearchPage,
    DashboardPage,
    CartPage,
    OrderPage,
    KonsultasiPage,
    SettingPage,
    CustomerservicePage,
    KategoriPage,
    KelaskatPage,
    BlankPage,
    PreferencePage,
    PelajaranPage,
    FilterPage,
    PaketPage,
    MapsPage,
    DetailPage,
    OrderDetailPage,
    AbsensiPage,
    ModalMuridPage,
    LessonPage,
    FaqPage,
    ErrorPage
  ],
  providers: [
    Calendar, LocalNotifications, Push,
    CallNumber, SMS, FileChooser, FileOpener,
    FilePath, Transfer, File, Camera,
    Zapier, UserService, Network, Helper
  ]
})
export class AppModule { }
