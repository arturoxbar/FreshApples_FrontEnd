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
  userInfo: string = "";

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

  async checkSession() {
    const tokenResult = await Preferences.get({ key: 'token' });
    const emailResult = await Preferences.get({ key: "validateEmail" });
    this.userInfo = emailResult.value || "";

    console.log(tokenResult.value);
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
      // Se llama al método validateUser con el código ingresado y la información del usuario.
      const result = await this.userService.validateUser(this.code.toUpperCase(), this.userInfo).subscribe({
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
    await this.checkSession();
  }
}
