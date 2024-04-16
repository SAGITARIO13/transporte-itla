import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Commons } from '../common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  public enrollment:any;
  public password:any;
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      
    })
  };

  constructor(private navController: NavController, public http: HttpClient, public commons: Commons) { }

  ngOnInit() {
  }

  goBack () {
    this.navController.back();
  }
  
  async LogIn () {
    if (!this.enrollment || !this.password) {
      return this.commons.showMessage('bottom', 'Porfavor completa los campos');
    }

    const data = {
      enrollment: this.enrollment,
      password: this.password
    }

    this.http.post(this.commons.apiRoute + 'AuthController/logIn', data, this.httpOptions).subscribe({
      next: async (response: any) => {
        if (response.status) {
          const userData = response.user
          this.commons.showMessage('top', `BIENVENIDO AL SISTEMA DE TRANSPORTE ${userData.firstName}`)

          // SET USER SESSION VALUES
          localStorage.setItem('ID', userData.ID)
          localStorage.setItem('firstName', userData.firstName)
          localStorage.setItem('lastName', userData.lastName)
          localStorage.setItem('enrollment', userData.enrollment)
          localStorage.setItem('balance', userData.balance)
          localStorage.setItem('rol_id', userData.rol_id)

          this.navController.navigateForward('tabs/home')
        } else {
          this.commons.showMessage('bottom', response.message)
        }
        
      },
      error: async (error) => {
        console.log('[LogIn] -> ', error)
      }
    })
  }

  async SignIn () {
    this.navController.navigateForward('sign-up')
  }
}
