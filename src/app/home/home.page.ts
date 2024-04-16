import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { RouteDetailPage } from '../route-detail/route-detail.page'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Commons } from '../common';
import { UserQRPage } from '../user-qr/user-qr.page';
// import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  providers: [DatePipe]
})
export class HomePage implements OnInit {
  public reportInterval:string = 'day';
  public firstName:any;
  public lastName:any;
  public balance:any;
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  public ticketPrice:number = 25;
  public reserved:any;
  public requests:any;
  public bills:any;
  public routes:any = [];
  public rol_id:any;

  constructor(public modalController: ModalController, public http: HttpClient, public commons: Commons, public formatDate: DatePipe, public navController: NavController) { }

  ngOnInit() {
    this.firstName = localStorage.getItem('firstName') ? localStorage.getItem('firstName') : ''
    this.lastName = localStorage.getItem('lastName') ? localStorage.getItem('lastName') : ''
    this.balance = localStorage.getItem('balance') ? localStorage.getItem('balance') : ''
    this.rol_id = localStorage.getItem('rol_id') ? localStorage.getItem('rol_id') : ''

    let newFirstName = this.firstName.split(' ')
    this.firstName = newFirstName[1] ? newFirstName[0] : this.firstName

    this.lastName = this.lastName.charAt(0)

    this.balance = parseFloat(this.balance).toFixed(2)

    this.GetRoutes()
  }

  ionViewDidEnter () {
    this.GetTicketReport()
  }

  async seeRouteDetails () {
    const modal = await this.modalController.create({
      component: RouteDetailPage
    })

    modal.present()
  }

  setReportInterval (intervalType: string) {
    this.reportInterval = intervalType

    this.GetTicketReport()
  }

  async GetTicketReport () {
    const loading = await this.commons.showLoading()

    const data = {
      user_id: this.commons.GetUserId(),
      date: this.reportInterval
    }

    this.http.post(this.commons.apiRoute + 'TicketsController/get_ticket_report', data, this.httpOptions).subscribe({
      next: async (response:any) => {
        await loading.dismiss()

        if (response.status) {
          const data = response.data

          this.reserved = data.reserverd_tickets
          this.requests = data.request_tickets

          this.bills = parseFloat(this.reserved) * this.ticketPrice
          this.balance = parseFloat(response.balance).toFixed(2)
        }
      },
      error: async (error) => {
        console.log('[GetTicketReport] -> ', error)
      }
    })
  }

  async openQR () {
    const modal = await this.modalController.create({
      component: UserQRPage
    });

    modal.present();
  }

  async GetRoutes () {
    const loading = await this.commons.showLoading()

    this.http.post(this.commons.apiRoute + 'RoutesController/get_routes', {}, this.httpOptions).subscribe({
      next: async (response:any) => {
        await loading.dismiss()

        if (response.status) {
          const routes = response.routes

          routes.forEach( (route:any, index:any) => {
            const timeString = route.time;
            const [hours, minutes, seconds] = timeString.split(':').map(Number);
            const time = new Date();
            time.setHours(hours, minutes, seconds);

            let routeTime = this.formatDate.transform(time, 'h:mm a') // FORMATEAR LA FECHA DE 24H A 12H Y METERLA EN EL ARRAY.

            const routeIndex = this.routes.findIndex((e:any) => e.name === route.name)
            
            if (routeIndex > -1) {
              console.log(routeIndex)
              this.routes[routeIndex].schedule.push(routeTime)
            } else {
              route.schedule = [routeTime]
              this.routes.push(route)
            }
          })

          console.log(this.routes)
        }
      },
      error: async (error) => {
        console.log('[GetRoutes] -> ', error)
      }
    })
  }

  logout () {
    localStorage.removeItem('ID')
    localStorage.removeItem('firstName')
    localStorage.removeItem('lastName')
    localStorage.removeItem('enrollment')
    localStorage.removeItem('balance')
    localStorage.removeItem('rol_id')

    this.commons.showMessage('bottom', 'Session cerrada!')
    this.navController.navigateBack('')
  }

  async scanTicket () {
    // await BarcodeScanner.checkPermission({ force: true });

    // BarcodeScanner.hideBackground();

    // const result = await BarcodeScanner.startScan();

    // if (result.hasContent) {
    //   console.log(result.content);

    //   BarcodeScanner.showBackground();
    //   BarcodeScanner.stopScan();
    // }
  }
}
