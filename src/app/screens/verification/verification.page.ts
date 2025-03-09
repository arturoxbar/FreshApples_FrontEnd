import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
  standalone: false
})
export class VerificationPage implements OnInit {

  code = "";
  userInfo = "";

  constructor(
    private alert: AlertController,
    private navCtrl: NavController,
    private userService: UserService
  ) { }

  private validateForm(): boolean {
    if (!this.code) {
      this.showAlert('Error', "The code is required");
      return false;
    }
    return true;
  }

  private resetForm() {
    this.code = "";
  }

  async checkUserInfo() {
    const tokenResult = await Preferences.get({ key: 'token' });
    const infoResult = await Preferences.get({ key: 'validateInfo' });
    this.userInfo = infoResult.value || 'nullnose';

    console.log(this.userInfo);
    if (tokenResult.value) {
      console.log("tiene sesion");
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async validate() {
    if (!this.validateForm()) {
      return;
    }
    try {
      console.log(this.userInfo);
      const result = await this.userService.validateUser(this.userInfo, this.code.toUpperCase()).subscribe({
        next: async (response) => {
          await this.showAlert("Success", "Verification successful. You can now Login with your account");
          this.resetForm();
          this.navCtrl.navigateForward("/login");
        },
        error: async (error) => {
          console.log("error service", error)
          const errorMessage = error.error?.message || 'Unknow error';
          await this.showAlert('Error', errorMessage);
        }
      });
    } catch (error) {
      console.error("Validation error:", error);
      await this.showAlert("Error", "An error occurred while verifying your code.");
    }
  }

  async ngOnInit() {
    await this.checkUserInfo();
  }
}


