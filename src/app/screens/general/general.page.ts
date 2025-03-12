import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { MoviesService } from 'src/app/services/movies.service';
import { Preferences } from '@capacitor/preferences';
@Component({
  selector: 'app-general',
  templateUrl: './general.page.html',
  styleUrls: ['./general.page.scss'],
  standalone: false,
})
export class GeneralPage implements OnInit {
  series: any[] = [];
  movies: any[] = [];
  medias: any[] = [];
  popularMedia: any;
  trendingMedia: any;
  isloading: boolean = false;
  selectedFilter: string = 'all'; // Filtro seleccionado (all, movies, series)
  filteredMedias: any[] = []; // Medias filtradas

  slideOpts = {
    slidesPerView: 2.5,
    spaceBetween: 10,
    loop: false,
  };


  constructor(
    private navCtrl: NavController,
    public toastController: ToastController,
    public MovieService: MoviesService
  ) { }



  async ngOnInit() {

    this.loadData()

    setTimeout(() => {
      this.isloading = true;
    }, 1500);
  }


  private checkLoadingStatus() {
    // Solo oculta el loading cuando ambas peticiones terminan
    if (this.popularMedia && this.trendingMedia) {
      this.isloading = false;
    }
  }

  // Carga datos iniciales
  private loadData() {
    this.isloading = true;

    // Popular Media
    this.MovieService.popularMedias().subscribe({
      next: (popularData: any) => {
        this.popularMedia = popularData;
        this.series = [...this.popularMedia.series];
        this.movies = [...this.popularMedia.movies];
        this.checkLoadingStatus();
      },
      error: (error: any) => this.handleDataError(error)
    });

    // Trending Media
    this.MovieService.trendingMedias().subscribe({
      next: (trendingData: any) => {
        console.log('Trending Data:', trendingData); // Depuración

        // Combina movies y series en un solo array
        this.trendingMedia = [...trendingData.movies, ...trendingData.series];
        this.medias = [...this.trendingMedia]; // Asigna el array combinado
        this.filteredMedias = [...this.medias]; // Inicializa filteredMedias con todos los datos

        this.checkLoadingStatus();
      },
      error: (error: any) => this.handleDataError(error)
    });
  }


  public applyFilter(event: Event) {
    if (this.selectedFilter === 'movies') {
      // Filtra solo películas
      this.filteredMedias = this.medias.filter(media => media.type === 'movie');
    } else if (this.selectedFilter === 'series') {
      this.filteredMedias = this.medias.filter(media => media.type === 'tv');
    } else {
      // Muestra todo
      this.filteredMedias = [...this.medias];
    }
    event.stopPropagation();
  }

  public setFilter(type: any) {
    if (type) {
      this.filteredMedias = this.medias.filter(media => media.type === type);
    }
    this.filteredMedias = [...this.medias]
  }

  public truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  private handleDataError(error: any) {
    this.isloading = false;
    this.presentToast('Error cargando contenido');
  }

  async handleRefresh(event: any) {
    this.MovieService.trendingMedias().subscribe({
      next: (trendingData: any) => {

        this.trendingMedia = [...trendingData.movies, ...trendingData.series];
        this.medias = [...this.trendingMedia];
        this.filteredMedias = [...this.medias];
        //this.applyFilter();
      },
      complete: () => event.target.complete()
    });
  }

  async goToMovie(id: number) {
    console.log("test")
    await Preferences.set({ key: "movie", value: id.toString() });

    this.navCtrl.navigateForward("/movie-detail");
  }

  async goToSerie(id: number) {
    await Preferences.set({ key: "serie", value: id.toString() });
    this.navCtrl.navigateForward("/serie-detail");
  }

  async goToMedia(id: number, type: string) {
    if (type === 'movie') {
      await this.goToMovie(id);
      return;
    }
    if (type === 'tv') {
      await this.goToSerie(id);
      return;
    }
  }

  test() {
    console.log("test")
  }

  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  private generateItems() {
    const count = this.series.length + 1;
    const count0 = this.medias.length + 1;
    for (let i = 0; i < 8; i++) {
      this.series.push(`Item ${count + i}`);
      this.movies.push(`Item ${count + i}`);
    }
    for (let i = 0; i < 8; i++) {
      this.medias.push(`Item ${count0 + i}`);
    }
  }

  // Controla el scroll
  onIonInfinite(ev: Event) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}







