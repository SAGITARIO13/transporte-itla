import { Injectable } from '@angular/core';
import { LoadingController, ToastController  } from '@ionic/angular';
import * as fecha from 'moment';
import 'moment/locale/es';

@Injectable({
    providedIn: 'root'
})

export class Commons {
    public apiRoute = 'http://localhost/transporte-itla-api/index.php/'
   

    constructor (private loadingCtrl: LoadingController, private toastController: ToastController) {}

    async showLoading () {
        const loading = await this.loadingCtrl.create({
            message: 'Cargando...',
            duration: 0,
        });
      
        loading.present();

        return loading;
    }

    async showMessage(position: 'top' | 'middle' | 'bottom', message:string) {
        const toast = await this.toastController.create({
          message: message,
          duration: 1500,
          position: position
        });
    
        await toast.present();
    }

    formatToStringDate (date:string) {
        // date = date + 
        const newDate = new Date(date + ' 20:00:00')
        return fecha(newDate).locale('es').format('DD [de] MMMM [del] YYYY');
    }

    GetUserId () {
        const id = localStorage.getItem('ID') ? localStorage.getItem('ID') : 0;
        return id
    }
}