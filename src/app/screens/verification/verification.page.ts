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
  mode: 'verify' | 'reset' = 'verify'; // Nuevo: Modo de verificación

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
    const modeResult = await Preferences.get({ key: 'verificationMode' });

    this.userInfo = infoResult.value || 'nullnose';
    this.mode = (modeResult.value as 'verify' | 'reset') || 'verify';

    console.log(this.mode);

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

      if (this.mode === 'verify') {
        // Verificación de usuario
        await this.userService.validateUser(this.userInfo, this.code.toUpperCase()).subscribe({
          next: async (response) => {
            await this.showAlert("Success", "Verification successful. You can now Login with your account");
            this.resetForm();
            this.navCtrl.navigateForward("/login");
          },
          error: async (error) => {
            console.log("error service", error);
            const errorMessage = error.error?.message || 'Unknown error';
            await this.showAlert('Error', errorMessage);
          }
        });
      } else if (this.mode === 'reset') {
        console.log("user: ", this.userInfo)
        await this.userService.verifyResetCode(this.userInfo, this.code.toUpperCase()).subscribe({
          next: async (response) => {
            await this.showAlert("Success", "Code verified. You can now reset your password");
            this.resetForm();
            this.navCtrl.navigateForward("/changepassword");
          },
          error: async (error) => {
            console.log("error service", error);
            const errorMessage = error.error?.message || 'Unknown error';
            await this.showAlert('Error', errorMessage);
          }
        });
      }
    } catch (error) {
      console.error("Validation error:", error);
      await this.showAlert("Error", "An error occurred while verifying your code.");
    }
  }

  async ngOnInit() {
    await this.checkUserInfo();
  }
}
