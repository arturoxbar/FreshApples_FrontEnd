import { ParseSourceFile } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { Preferences } from '@capacitor/preferences';

interface User {
  username: string;
  email: string;
  password: string;
  repeat_password: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false
})
export class SignupPage implements OnInit {
  newUser: User = {
    username: '',
    email: '',
    password: '',
    repeat_password: ''
  };

  loading = false;
  validationError = '';

  constructor(
    private alert: AlertController,
    private navCtrl: NavController,
    private userService: UserService
  ) { }

  async checkSession() {
    const token = await Preferences.get({ key: 'token' });
    console.log(token.value);
    if (token.value) {
      console.log("tiene sesion");
    }
  }

  async ngOnInit() {
    await this.checkSession()
  }

  async signup() {

    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.validationError = '';

    try {
      await this.userService.createUser(this.newUser).subscribe({
        next: async (response) => {
          await this.showAlert('Success', 'User successfully created, now check your email for your verification code.');
          await Preferences.set({ key: "validateInfo", value: this.newUser.email })
          this.resetForm();
          this.navCtrl.navigateForward('/verification');
        },
        error: async (error) => {
          console.log("error service", error)
          const errorMessage = error.error?.message || 'Unknow error';
          await this.showAlert('Error', errorMessage);
        }
      });
    } catch (error) {
      await this.showAlert('Error', 'Unknow error2');
    } finally {
      this.loading = false;
    }
  }

  private validateForm() {
    if (!this.newUser.username ||
      !this.newUser.email ||
      !this.newUser.password ||
      !this.newUser.repeat_password) {
      this.validationError = 'All the fields are required';
      this.showAlert('Error', this.validationError);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newUser.email)) {
      this.validationError = 'Invalid Email';
      this.showAlert('Error', this.validationError);
      return false;
    }

    if (this.newUser.password !== this.newUser.repeat_password) {
      this.validationError = "The passwords doesn't match";
      this.showAlert('Error', this.validationError);
      return false;
    }

    if (this.newUser.password.length < 6) {
      this.validationError = 'The password must have at least 6 digits long';
      this.showAlert('Error', this.validationError);
      return false;
    }

    return true;
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
      username: '',
      email: '',
      password: '',
      repeat_password: '',
    };
  }
}
