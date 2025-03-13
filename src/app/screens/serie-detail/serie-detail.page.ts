import { Component } from '@angular/core';
import { NavController, ToastController, InfiniteScrollCustomEvent, ActionSheetController } from '@ionic/angular';
import { MoviesService } from 'src/app/services/movies.service';
import { Preferences } from '@capacitor/preferences';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-serie-detail',
  templateUrl: './serie-detail.page.html',
  styleUrls: ['./serie-detail.page.scss'],
  standalone: false,
})
export class SerieDetailPage {

  isLoading = true;
  movieId = 0
  presentingElement!: HTMLElement | null;
  movie: any;

  constructor(private actionSheetCtrl: ActionSheetController, private navCtrl: NavController,
    public toastController: ToastController,
    public MovieService: MoviesService) { }

  async ionViewWillEnter() {
    this.isLoading = false;
    await Preferences.get({ key: 'movie' }).then((data: any) => {
      this.movieId = data.value;
    });
    console.log("movieId:", this.movieId);

    this.MovieService.movieDetails(this.movieId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.movie = response.movie; // Asignamos la película obtenida
      },
      error: (error: any) => {
        console.log("error: ", error);
      }
    });
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

  getPublicVoteImage(): string {
    const average = this.movie?.publicVoteAverage;
    if (average == null) {
      return './assets/fontbolt.png';
    }
    if (average < 37.5) {
      return 'assets/manzana25.png';
    } else if (average < 62.5) {
      return 'assets/manzana50.png';
    } else if (average < 87.5) {
      return 'assets/manzana75.png';
    } else {
      return 'assets/manzana100.png';
    }
  }

  getCriticVoteImage(): string {
    const average = this.movie?.criticVoteAverage;
    if (average == null) {
      return 'assets/manzana25.png';
    }
    if (average < 37.5) {
      return 'assets/manzana25.png';
    } else if (average < 62.5) {
      return 'assets/manzana50.png';
    } else if (average < 87.5) {
      return 'assets/manzana75.png';
    } else {
      return 'assets/manzana100.png';
    }
  }



  like() {
    if (this.likeStatus === 'liked') {
      this.likeStatus = null; // Desactiva el like si ya está activo
    } else {
      this.likeStatus = 'liked'; // Activa el like
    }
  }

  dislike() {
    if (this.likeStatus === 'disliked') {
      this.likeStatus = null; // Desactiva el dislike si ya está activo
    } else {
      this.likeStatus = 'disliked'; // Activa el dislike
    }
  }

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}
