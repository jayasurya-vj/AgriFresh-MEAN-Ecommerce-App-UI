import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ShopCardsComponent } from './shop-cards/shop-cards.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'shop', component: ShopCardsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  {path:"user", loadChildren: ()=>import('./auth/auth.module').then(m=>m.AuthModule)},
  { path: '', redirectTo: '/shop', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
