import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Commons } from '../common';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SignUpPage implements OnInit {
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      
    })
  };

  public enrollment:any;
  public firstName:any;
  public lastName:any;
  public email:any;
  public career:any;
  public password:any;
  public confirmPassword:any;

  public careers:any;

  constructor(public http: HttpClient, public commons: Commons, public navController: NavController) { }

  ngOnInit() {
    this.GetCareers()


  }

  async SignUp () {
    if (!this.enrollment || !this.firstName || !this.lastName || !this.email || !this.career || !this.password || !this.confirmPassword) {
      return this.commons.showMessage('bottom', 'Porfavor completa todos los campos')
    }

    if (this.password !== this.confirmPassword) {
      return this.commons.showMessage('bottom', 'Las contrasenas no son iguales!')
    }

    const loading = await this.commons.showLoading();


    const data = {
      enrollment: this.enrollment,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      career: this.career,
      password: this.password
    }

    this.http.post(this.commons.apiRoute + 'AuthController/singUp', data, this.httpOptions).subscribe({
      next: async (response:any) => {
        await loading.dismiss()

        if (response.status) {
          this.navController.navigateForward('')
        }

        this.commons.showMessage('bottom', response.message)
      },
      error: async (error) => {
        console.log('[SignUp] -> ', error);
      }
    })
  }

  async GetCareers () {
    const loading = await this.commons.showLoading();

    this.http.post(this.commons.apiRoute + 'AuthController/get_career', {}, this.httpOptions).subscribe({
      next: async (response:any) => {
        await loading.dismiss()

        if (response.status) {
          this.careers = response.careers
        }
      },
      error: async (error) => {
        console.log('[SignUp] -> ', error);
      }
    })
  }

  back () {
    this.navController.back()
  }
}
