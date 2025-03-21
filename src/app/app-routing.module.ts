import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'signup',
    loadChildren: () => import('./screens/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./screens/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'verification',
    loadChildren: () => import('./screens/verification/verification.module').then( m => m.VerificationPageModule)
  },
  {
    path: 'sendverification',
    loadChildren: () => import('./screens/sendverification/sendverification.module').then( m => m.SendverificationPageModule)
  },
   {
    path: 'changepassword',
    loadChildren: () => import('./screens/changepassword/changepassword.module').then( m => m.ChangepasswordPageModule)
  },
  {
    path: 'general',
    loadChildren: () => import('./screens/general/general.module').then( m => m.GeneralPageModule)
  },
  {
    path: 'movie-detail',
    loadChildren: () => import('./screens/movie-detail/movie-detail.module').then( m => m.MovieDetailPageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./screens/user/user.module').then( m => m.UserPageModule)
  },
  {
    path: 'serie-detail',
    loadChildren: () => import('./screens/serie-detail/serie-detail.module').then( m => m.SerieDetailPageModule)
  },
    {
    path: 'search',
    loadChildren: () => import('./screens/search/search.module').then( m => m.SearchPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
