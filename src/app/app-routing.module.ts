import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {AuthGuard} from './auth/auth.guard';
import { ShopCardsComponent } from './shop-cards/shop-cards.component';
import { CartComponent } from './cart/cart.component';
import { OrdersComponent } from './orders/orders.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'shop', component: ShopCardsComponent },
  { path: 'cart', component: CartComponent, canActivate:[AuthGuard] },
  { path: 'orders', component: OrdersComponent, canActivate:[AuthGuard] },
  {path:"user", loadChildren: ()=>import('./auth/auth.module').then(m=>m.AuthModule)},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
