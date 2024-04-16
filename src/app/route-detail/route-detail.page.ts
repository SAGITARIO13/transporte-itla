import { Component, OnInit, ElementRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-route-detail',
  templateUrl: './route-detail.page.html',
  styleUrls: ['./route-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class RouteDetailPage implements OnInit {
  @ViewChild('map', { static: true }) mapRef!: ElementRef<HTMLElement>;
  public map!: GoogleMap;
  private socket: any;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.CreateMap()
  }

  async CreateMap () {
    const coordinates = await Geolocation.getCurrentPosition();

    console.log('Current position:', coordinates);
    
    this.map = await GoogleMap.create({
      id: 'map',
      apiKey: 'AIzaSyB8BSjhKngm4OHdMO0NgHbMYAjjbU2fZ38',
      element: this.mapRef.nativeElement,
      forceCreate: true,
      config: {
        center: {
          lat: 18.735693,
          lng: -70.162651,
        },
        zoom: 8
      }
    });
  }

  goBack () {
    this.modalController.dismiss()
  }

}
