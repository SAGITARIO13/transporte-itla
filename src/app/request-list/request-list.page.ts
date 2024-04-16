import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, AlertController  } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Commons } from '../common';


@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.page.html',
  styleUrls: ['./request-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  providers: [DatePipe]
})
export class RequestListPage implements OnInit {
  // HTTP HEADER
  public httpOptions:any = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      
    })
  }

  public requests:Array<any> = [];
  public ticketPrice:number = 25;
  public ticketsToPay:Array<string> = [];
  public totalToPay:any = '0.00';

  constructor(private navController: NavController, private http: HttpClient, private commons: Commons, private formatDate: DatePipe, public alertController: AlertController) { }

  ngOnInit() {
  }

  ionViewDidEnter () {
    this.ticketsToPay = [];
    this.totalToPay = '0.00';

    this.GetRequests()
  }

  goBack () {
    this.navController.back();
  }

  async GetRequests () {
    const loading = this.commons.showLoading();

    const data = {
      user_id: this.commons.GetUserId(), // ID DEL USUARIO LOGEADO
    }

    this.http.post(this.commons.apiRoute + 'TicketsController/get_tickets', data, this.httpOptions).subscribe({
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

         this.requests = response.tickets
        }
      },
      error: async (error) => {
        console.log(error)
      }
    })
  }

  SetTicketToPay (ticketId:string, event:any) {
    const isChecked = event.target.checked // CAPTURAR EVENTO Y VALIDAR SI SE CHEQUEO EL CAMPO.
    
    if (isChecked) {
      this.ticketsToPay.push(ticketId)
    } else {
      const ticketIndex = this.ticketsToPay.findIndex( element => element === ticketId )

      ticketIndex !== 0 ?
        this.ticketsToPay.splice(0, 1) : this.ticketsToPay.shift()
    }

    this.totalToPay = (this.ticketsToPay.length * this.ticketPrice).toFixed(2);
  }

  PayTickets () : any {
    if (this.ticketsToPay.length === 0) {
      return this.commons.showMessage('bottom', 'Advertencia! debes seleccionar tickets para pagar');
    }

    const data = {
      user_id: this.commons.GetUserId(),
      tickets: this.ticketsToPay
    }

    this.http.post(this.commons.apiRoute + 'TicketsController/pay_tickets', data, this.httpOptions).subscribe({
      next: async (response:any) => {
        if (response.status) {
          this.commons.showMessage('bottom', 'Tickets pagados exitosamente!');
          this.navController.navigateForward('tabs/reserved-list')
        } else {
          this.commons.showMessage('bottom', response.message)
        }
      },
      error: error => {
        console.log('[PayTickets] -> ', error)
      }
    })

  }

  async DeleteTicket (ticketId:string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        
      })
    };

    const alert = await this.alertController.create({
      header: 'ADVERTENCIA',
      message: '¿Estás seguro que quieres eliminar este ticket?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // NO HACER NADA SI EL USUARIO CANCELA
          }
        }, {
          text: 'SI',
          handler: () => {
            this.http.post(this.commons.apiRoute + 'TicketsController/delete_ticket', { ticketId }, httpOptions).subscribe({
              next: async (response:any) => {
                if ( response.status ) {
                  this.GetRequests()
                  this.commons.showMessage('bottom', 'Ticket eliminado exitosamente!')
                }
              },
              error: error => {
                console.log('[DeleteTicket] ->', error)
              }
            })
          }
        }
      ]
    });
  
    await alert.present();
  }
}
