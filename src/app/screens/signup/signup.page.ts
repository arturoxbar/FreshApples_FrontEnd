import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

interface User {
  name: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  repeat_password: string;
  profilePicture: string;
}
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false
})
export class SignupPage {

  ngOnInit() {
  }

  newUser: User = {
    name: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    repeat_password: '',
    profilePicture: 'imagen.png'
  };

  constructor(
    private alert: AlertController,
    private navCtrl: NavController
  ) { }

  async signup() {

    console.log('Datos de registro:', this.newUser);
    //await this.showAlert('Éxito', 'Registro completado correctamente');
    this.resetForm();
    this.navigateToLogin();
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private resetForm() {
    this.newUser = {
      name: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
      repeat_password: '',
      profilePicture: 'imagen.png'
    };
  }

  private navigateToLogin() {
    this.navCtrl.navigateForward('/login');
  }

}
