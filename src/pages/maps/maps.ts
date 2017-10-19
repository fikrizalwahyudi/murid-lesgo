import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, Platform, AlertController, ModalController, NavParams, ViewController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { MapsAPILoader, GoogleMapsAPIWrapper } from 'angular2-google-maps/core';

/*
  Generated class for the Maps page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare var google: any;

@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html'
})
export class MapsPage {
  map: any;
  search: any;
  constructor(
    public alert: AlertController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public _loader: MapsAPILoader
  ) {
    this.autocomplete();
    this.loadMap();
    this.map = { lat: -6.174668, lng: 106.827126, zoom: 15 };
  }
  loadMap() {
    Geolocation.getCurrentPosition().then((position) => {
      this.map = { lat: position.coords.latitude, lng: position.coords.longitude, zoom: 15, panning: true, address: 'Ketik lokasi anda untuk memindahkan pin' };
    })
    // this.map = {lat: -6.174668, lng:106.827126, zoom:15, panning:true, address:'Ketik lokasi anda untuk memindahkan pin'}
  }
  autocomplete() {
    this._loader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete').getElementsByTagName('input')[0], {});
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        let place = autocomplete.getPlace();
        this.map.lat = place.geometry.location.lat();
        this.map.lng = place.geometry.location.lng();
        this.map.address = place.formatted_address.substring(0, 50);
        console.log(place);
      });
    });
  }
  send() {
    if (this.map.lat == 0 || this.map.lang == 0) {
      return this.alert.create({
        title: 'Lokasi belum terisi',
        message: 'Harap taruh pin di lokasi atau cari alamat anda melalui pengisian diatas terlebih dahulu'
      })
    }
    this.viewCtrl.dismiss({ lat: this.map.lat, lng: this.map.lng, address: this.search });
  }
  centerChanged(e) {
    this.map.lat = e.lat;
    this.map.lng = e.lng;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat: this.map.lat, lng: this.map.lng } }, (result, status) => {
      console.log(result[0]);
      this.map.address = result[0]['formatted_address'].substring(0, 50);
      this.search = result[0]['formatted_address'];
      // +' No. '+result[0]['address_components'][0]['short_name'];
    })
  }
}
