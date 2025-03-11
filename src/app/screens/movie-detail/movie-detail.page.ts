import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss'],
  standalone: false,
})
export class MovieDetailPage implements OnInit {

  presentingElement!: HTMLElement | null;

  constructor(private actionSheetCtrl: ActionSheetController) {}

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
  }

  canDismiss = async () => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure?.If you close the screen your review will be lost.',
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    return role === 'confirm';
  };

  likeStatus: 'liked' | 'disliked' | null = null; // Estado de like/dislike

  // Método para manejar el like
  like() {
    if (this.likeStatus === 'liked') {
      this.likeStatus = null; // Desactiva el like si ya está activo
    } else {
      this.likeStatus = 'liked'; // Activa el like
    }
  }

  // Método para manejar el dislike
  dislike() {
    if (this.likeStatus === 'disliked') {
      this.likeStatus = null; // Desactiva el dislike si ya está activo
    } else {
      this.likeStatus = 'disliked'; // Activa el dislike
    }
  }

  //modal reviews
  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }


}
