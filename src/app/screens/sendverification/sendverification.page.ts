import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sendverification',
  templateUrl: './sendverification.page.html',
  styleUrls: ['./sendverification.page.scss'],
  standalone: false,
})
export class SendverificationPage implements OnInit {

  constructor(
    private alert: AlertController,
    private navCtrl: NavController,
    private userService: UserService
  ) { }


  ngOnInit() {
  }

  email = "";
  isLoading = false;


  private validateForm(): boolean {
    if (!this.email) {
      this.showAlert('Error', 'Email is required');
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

  async sendResetCode() {
    if (!this.validateForm()) return;

    this.isLoading = true;
    try {
      await this.userService.sendResetPassword(this.email).subscribe({
        next: async () => {
          await this.showAlert('Success', 'Reset code sent to your email');
          this.navCtrl.navigateForward('/verification');
        },
        error: async (error) => {
          const errorMessage = error.error?.message || 'Unknown error';
          await this.showAlert('Error', errorMessage);
        },
      });
    } catch (error) {
      await this.showAlert('Error', 'An error occurred while sending the code');
    } finally {
      this.isLoading = false;
    }
  }

}
