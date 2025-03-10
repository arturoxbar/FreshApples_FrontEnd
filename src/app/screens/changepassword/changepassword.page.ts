import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
  standalone: false,
})
export class ChangepasswordPage implements OnInit {

  password1 = "";
  password2 = "";
  showPassword1 = false;
  showPassword2 = false;
  isLoading = false;

  constructor(
    private alert: AlertController,
    private navCtrl: NavController,
    private userService: UserService
  ) { }

  ngOnInit(): void {

  }

  togglePasswordVisibility(field: number) {
    if (field === 1) {
      this.showPassword1 = !this.showPassword1;
    } else if (field === 2) {
      this.showPassword2 = !this.showPassword2;
    }
  }

  private validateForm(): boolean {
    if (!this.password1 || !this.password2) {
      this.showAlert('Error', 'Both fields are required');
      return false;
    }
    if (this.password1 !== this.password2) {
      this.showAlert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async changePassword() {
    if (!this.validateForm()) return;

    this.isLoading = true;
    try {
      const userInfoResult = await Preferences.get({ key: 'validateInfo' });
      const userInfo = userInfoResult.value || '';

      await this.userService.resetPassword(
        userInfo,
        this.password1
      ).subscribe({
        next: async () => {
          await this.showAlert('Success', 'Password changed successfully');
          this.navCtrl.navigateForward('/login');
        },
        error: async (error) => {
          const errorMessage = error.error?.message || 'Unknown error';
          await this.showAlert('Error', errorMessage);
        },
      });
    } catch (error) {
      await this.showAlert('Error', 'An error occurred while changing the password');
    } finally {
      this.isLoading = false;
    }
  }

}
