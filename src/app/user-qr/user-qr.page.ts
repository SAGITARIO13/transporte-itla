import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { QRCodeModule } from 'angularx-qrcode';
import { Commons } from '../common';

@Component({
  selector: 'app-user-qr',
  templateUrl: './user-qr.page.html',
  styleUrls: ['./user-qr.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, QRCodeModule]
})
export class UserQRPage implements OnInit {
  public userId:any;

  constructor(private modalController: ModalController, public commons: Commons) { }

  ngOnInit() {
    this.userId = JSON.stringify(this.commons.GetUserId());
  }

  closeModal () {
    this.modalController.dismiss()
  }
}
