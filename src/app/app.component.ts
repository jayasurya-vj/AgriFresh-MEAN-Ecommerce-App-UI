import { Component } from '@angular/core';
import {AgriFreshService} from './services/agrifresh.service';
import {AuthService} from './auth/auth.service';
import { Product, CartItem,CartItemInput } from './model/agrifresh.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AgriFresh';

  constructor(private agriFreshService:AgriFreshService,
    private authService:AuthService) { 
    this.authService.autoAuthenticate();
  }

  checkout(){
    // this.agriFreshService.checkout();
    // this.agriFreshService.getProducts()
    // this.agriFreshService.getCart();
    // let item:CartItemInput = {
    //   itemId: "62fb70a3ff44367c9ca12f9e",
    //   quantity: 10
    // };
    // this.agriFreshService.addCartItem(item);
    // let CartItem:CartItem = {
    //   _id: "62fbd7ba9c82e200ac89a3a5",
    //   item: {_id: "62fb70a3ff44367c9ca12f9e", name: "Peas", displayQuantity: "500g", price: 9},
    //   quantity: 2
    // };
    // this.agriFreshService.editCartItem(CartItem);
    // this.agriFreshService.deleteCart();
  }
}
