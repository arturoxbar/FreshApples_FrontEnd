import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, InfiniteScrollCustomEvent } from '@ionic/angular';


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
  hasSession: boolean = false;
  isloading: boolean = false;

  constructor(
    private navCtrl: NavController,
    public toastController: ToastController
  ) { }

  async ngOnInit() {

    // Datos estáticos para populares
    this.popularMedia = {
      series: [
        { idApi: 1, poster: 'https://i.etsystatic.com/37268737/r/il/a9224f/5742583791/il_fullxfull.5742583791_pp96.jpg', name: 'Serie 1' },
        { idApi: 2, poster: 'https://static.displate.com/857x1200/displate/2024-03-26/d917dfbcadcfa54bde60a393632280f9_49c081450ad6946305670ad42ff29722.jpg', name: 'Serie 2' }
      ],
      movies: [
        { idApi: 101, poster: 'https://yc.cldmlk.com/1ybrsw78h5m7ztd0h9ssfehs48/uploads/vertical_813d59a7-32cd-4ca2-8499-bb334963a1c0.jpg', title: 'Película 1' },
        { idApi: 102, poster: 'https://m.media-amazon.com/images/M/MV5BNDQwYWMxMDktZjUwMi00MzE5LTljNTUtZjIzNmNhZTc1ZGJlXkEyXkFqcGc@._V1_.jpg', title: 'Película 2' }
      ]
    };

    // Datos estáticos para tendencias
    this.trendingMedia = [
      { idApi: 201, poster: 'https://yc.cldmlk.com/1ybrsw78h5m7ztd0h9ssfehs48/uploads/vertical_813d59a7-32cd-4ca2-8499-bb334963a1c0.jpg', title: 'Media 1', type: 'movie', overview: 'Descripción de Media 1' },
      { idApi: 202, poster: 'https://m.media-amazon.com/images/M/MV5BNDQwYWMxMDktZjUwMi00MzE5LTljNTUtZjIzNmNhZTc1ZGJlXkEyXkFqcGc@._V1_.jpg', name: 'Media 2', type: 'tv', overview: 'Descripción de Media 2' }
    ];

    // Asigna los datos a los arrays que usa la vista
    this.series = [...this.popularMedia.series];
    this.movies = [...this.popularMedia.movies];
    this.medias = [...this.trendingMedia];

    // Simula un retraso de carga
    setTimeout(() => {
      this.isloading = true;
    }, 1500);
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async handleRefresh(event: any) {
    // Simula una refrescada de datos estáticos
    setTimeout(() => {
      this.isloading = false;

      // Reasigna los datos (en este caso se usan los mismos)
      this.series = [...this.popularMedia.series];
      this.movies = [...this.popularMedia.movies];
      this.medias = [...this.trendingMedia];

      this.isloading = true;
      event.target.complete();
    }, 2000);
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
  //controla el scroll
  onIonInfinite(ev: Event) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }


  

}
