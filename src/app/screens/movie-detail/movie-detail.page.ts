import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, InfiniteScrollCustomEvent, ActionSheetController, AlertController } from '@ionic/angular';
import { MoviesService } from 'src/app/services/movies.service';
import { Preferences } from '@capacitor/preferences';
import { ViewWillEnter } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReviewService } from 'src/app/services/review.service';



@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss'],
  standalone: false,
})
export class MovieDetailPage {

  isLoading = true;
  movieId = 0
  presentingElement!: HTMLElement | null;
  movie: any;
  currentTrailerIndex: number = 0;
  criticsReviews: any = [];
  usersReviews: any = [];
  token: any;
  userId: any;

  reviewText = '';
  reviewScore = 0;
  reviewType = 'user';

  isModalCriticsOpen = false;
  isModalUsersOpen = false;
  isReviewModalOpen = false;

  constructor(private actionSheetCtrl: ActionSheetController, private navCtrl: NavController,
    public toastController: ToastController,
    public MovieService: MoviesService,
    private sanitizer: DomSanitizer,
    private ReviewService: ReviewService,
    private alert: AlertController,) { }

  async checkSession() {
    const token = await Preferences.get({ key: 'token' });
    const id = await Preferences.get({ key: 'userId' });

    this.token = token.value;
    this.userId = id.value;
  }

  async handleRefresh(event: any) {
    this.MovieService.movieDetails(this.movieId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.movie = response.movie;

      },
      error: (error: any) => {
        console.log("error: ", error);
      },
      complete: () => event.target.complete()
    });
  }

  async ionViewWillEnter() {
    await this.checkSession()
    console.log("userID", this.userId)
    this.isLoading = false;
    await Preferences.get({ key: 'movie' }).then((data: any) => {
      this.movieId = data.value;
    });
    console.log("movieId:", this.movieId);

    this.MovieService.movieDetails(this.movieId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.movie = response.movie;

      },
      error: (error: any) => {
        console.log("error: ", error);
      }
    });

    this.ReviewService.getReviews(this.movieId).subscribe({
      next: (Response: any) => {
        const criticsReviews = Response.reviews.filter((review: any) => review.by === "critic")
        const usersReviews = Response.reviews.filter((review: any) => review.by === "user")
        this.criticsReviews = criticsReviews;
        this.usersReviews = usersReviews;
        console.log(this.criticsReviews);
        console.log(this.usersReviews)
      },
      error: (error: any) => {
        console.log("error: ", error);
      }
    })
  }

  extractVideoId(url: string): string {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|embed\/|v\/))([\w-]{11})/);
    return match ? match[1] : '';
  }

  getCurrentTrailerUrl() {
    if (!this.movie || !this.movie.trailers || this.movie.trailers.length === 0) {
      return '';
    }
    const videoId = this.extractVideoId(this.movie.trailers[this.currentTrailerIndex]);
    const url = 'https://www.youtube.com/embed/' + videoId;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  prevTrailer() {
    if (this.currentTrailerIndex > 0) {
      this.currentTrailerIndex--;
    }
  }

  nextTrailer() {
    if (this.movie && this.currentTrailerIndex < this.movie.trailers.length - 1) {
      this.currentTrailerIndex++;
    }
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

  getPublicVoteImage() {
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

  getCriticVoteImage() {
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

  async createReview() {
    if (!this.reviewText.trim()) {
      this.showToast('Please enter a review before submitting.', 'danger');
      return;
    }
    console.log("token: ", this.token)
    this.ReviewService.createReview(this.reviewScore, this.reviewText, this.movieId.toString(), "movie", this.token)
      .subscribe({
        next: async () => {
          this.showToast('Review submitted successfully!', 'success');
          this.setOpenCritics(false)
          this.setOpenUsers(false)
          this.setOpenReviewModal(false)
          this.ionViewWillEnter();
        },
        error: (error) => {
          this.showToast(error.error.msg, 'danger');
          console.log('Error submitting review:', error);
        }
      });
    this.reviewText = '';
    this.reviewScore = 0;
    await this.ionViewWillEnter();
  }

  async deleteReview(reviewId: string) {
    const alert = await this.alert.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this review?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Delete action canceled');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.ReviewService.deleteReview(reviewId, this.token).subscribe({
              next: async () => {
                this.showToast('Review deleted successfully!', 'success');
                this.setOpenCritics(false)
                this.setOpenUsers(false)
                this.ionViewWillEnter();
              },
              error: async (error: any) => {
                this.showToast(error.error.msg, 'danger');
                console.log('Error submitting review:', error);
              }
            });
            this.ionViewWillEnter();
          }
        }
      ]
    });

    await alert.present();
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    await toast.present();
  }

  setOpenCritics(isOpen: boolean) {
    this.isModalCriticsOpen = isOpen;
  }

  setOpenUsers(isOpen: boolean) {
    this.isModalUsersOpen = isOpen;
  }

  setOpenReviewModal(isOpen: boolean) {
    this.isReviewModalOpen = isOpen;
  }
}
