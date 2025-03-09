import { ParseSourceFile } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { UserService, ExistingUserInterface } from 'src/app/services/user.service';
import { Preferences } from '@capacitor/preferences';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})


export class LoginPage implements OnInit {

  existingUser: ExistingUserInterface = {
    userInfo: '',
    password: ''
  };


  showPassword = false;
  loading = false;
  validationError = '';

  constructor(
    private alert: AlertController,
    private navCtrl: NavController,
    private userService: UserService
  ) { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

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

  private validateForm() {
    if (!this.existingUser.password || !this.existingUser.userInfo) {
      this.validationError = 'All the fields are required';
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
    this.existingUser = {
      userInfo: '',
      password: ''
    }
  }

  async login() {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.validationError = '';
    try {
      console.log(this.existingUser)
      await this.userService.loginUser(this.existingUser).subscribe({
        next: async (response: any) => {
          await this.showAlert('Success', 'User Successfully log in')
          this.resetForm()
          await Preferences.set({
            key: 'token',
            value: response.token,
          });
        },
        error: async (error) => {
          if (error.status === 401) {
            await Preferences.set({ key: "validateInfo", value: this.existingUser.userInfo })
            await Preferences.set({ key: 'verificationMode', value: 'verify' });
            this.navCtrl.navigateForward('/verification');
          }
          const errorMessage = error.error?.message || 'Unknow error';
          await this.showAlert('Error', errorMessage);
        }
      })
    } catch (error) {
      await this.showAlert('Error', 'Unknow error2');
    } finally {
      this.loading = false
    }
  }

}
