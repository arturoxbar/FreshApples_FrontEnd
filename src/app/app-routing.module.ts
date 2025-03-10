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


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
