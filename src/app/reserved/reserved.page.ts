import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Commons } from '../common';

@Component({
  selector: 'app-reserved',
  templateUrl: './reserved.page.html',
  styleUrls: ['./reserved.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  providers: [DatePipe]
})
export class ReservedPage implements OnInit {
  public reserved:Array<any> = [];

  constructor(public navController: NavController, public http: HttpClient, private commons: Commons, private formatDate: DatePipe) { }

  ngOnInit() {
  }

  goBack () {
    this.navController.back();
  }

  ionViewDidEnter () {
    this.GetRequests()
  }

  async GetRequests () {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        
      })
    };

    const loading = this.commons.showLoading();

    const data = {
      user_id: this.commons.GetUserId(), // ID DEL USUARIO LOGEADO
    }

    this.http.post(this.commons.apiRoute + 'TicketsController/get_reserved_tickets', data, httpOptions).subscribe({
      next: async (response:any) => {
        (await loading).dismiss();

      

        if (response.status) {
          // FORMATEAR FECHAS Y HORARIOS CORRECTAMENTE
          const tickets = response.tickets

          tickets?.forEach( (ticket:any, index:number) => {
            // CONVERTIR FECHA A LETRA
            tickets[index].date = this.commons.formatToStringDate(ticket.date);
            tickets[index].pay_before = this.commons.formatToStringDate(ticket.pay_before);

            // CONVERTIR EL STRING DE FECHA A UN OBJETO TIPO DATE
            const timeString = ticket.time;
            const [hours, minutes, seconds] = timeString.split(':').map(Number);
            const time = new Date();
            time.setHours(hours, minutes, seconds);

            tickets[index].time = this.formatDate.transform(time, 'h:mm a') // FORMATEAR LA FECHA DE 24H A 12H Y METERLA EN EL ARRAY.
          })

         this.reserved = response.tickets
        }
      },
      error: async (error) => {
        console.log(error)
      }
    })
  }
}
