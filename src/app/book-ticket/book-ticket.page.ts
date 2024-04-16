import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController  } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Commons } from '../common';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-book-ticket',
  templateUrl: './book-ticket.page.html',
  styleUrls: ['./book-ticket.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  providers: [Commons, DatePipe]
})
export class BookTicketPage implements OnInit {
  public date:any = 'Selecciona una fecha';
  public arrivalRoutes:any = [];
  public exitRoutes:any = [];
  
  //VARIABLES CONECTADAS CON LOS INPUTS
  public selectedDate = new Date().toISOString();
  public arrivalRouteSelected:any = '';
  public exitRouteSelected:any = '';

  constructor(private http: HttpClient, private navController: NavController, public commons: Commons, public loadingCtrl: LoadingController, private formatDate: DatePipe) 
  { }

  ngOnInit() {
    this.GetRoutes()
  }

  SetDate () {
    if (this.selectedDate) {
      this.date = this.selectedDate.split('T')[0]
    }
  }

  goBack () {
    this.navController.back();
  }

  async GetRoutes () {
    const loading = await this.commons.showLoading();

    this.http.post(this.commons.apiRoute + 'RoutesController/get_routes', {}).subscribe({
      next: async ( response:any ) => {
        await loading.dismiss()

        if (response.status) {
          const allRoutes = response.routes

          allRoutes.forEach ( (route: any) => {
            // CONVERTIR EL STRING DE FECHA A UN OBJETO TIPO DATE
            const timeString = route.time;
            const [hours, minutes, seconds] = timeString.split(':').map(Number);
            const time = new Date();
            time.setHours(hours, minutes, seconds);

            route.time = this.formatDate.transform(time, 'h:mm a') // FORMATEAR LA FECHA DE 24H A 12H Y METERLA EN EL ARRAY.

            if (parseInt(route.is_exit) === 1) {
              this.exitRoutes.push(route);
            } else {
              this.arrivalRoutes.push(route)
            }
          })
        }
      },
      error: async error => {
        console.log(error);
      }
    })
  }

  async SaveRequest () {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        
      })
    };

    if (!this.arrivalRouteSelected && !this.exitRouteSelected) {
      return this.commons.showMessage('bottom', 'Debes reservar al menos un ticket!');
    }

    const loading = this.commons.showLoading();

    // OBTENER EL ID DEL HORARIO DE CADA RUTA
    let arrivalRouteSchedule;
    let exitRouteSchedule;

    this.arrivalRoutes.forEach ( (route:any) => {
      if (route.ID === this.arrivalRouteSelected) {
        arrivalRouteSchedule = route.schedule_id
      }
    })

    this.exitRoutes.forEach ( (route:any) => {
      if (route.ID === this.exitRouteSelected) {
        exitRouteSchedule = route.schedule_id
      }
    })
    
    const data = {
      user_id: this.commons.GetUserId(), // ID DEL USUARIO LOGEADO
      date: this.date,
      arrivalRoute: this.arrivalRouteSelected,
      arrivalRouteSchedule,
      exitRoute: this.exitRouteSelected,
      exitRouteSchedule,
    }

    this.http.post(this.commons.apiRoute + 'TicketsController/save_request', data, httpOptions).subscribe({
      next: async (response:any) => {
        (await loading).dismiss();

        if (response.status) {
          this.date = 'Selecciona una fecha'
          this.arrivalRouteSelected = ''
          this.exitRouteSelected = ''
        }

        this.commons.showMessage('top', response.message);
        this.navController.navigateForward('/tabs/request-list')
      },
      error: async (error) => {
        console.log(error)
      }
    })
  }
}
