import { Component, OnInit } from '@angular/core';
import { AgriFreshService } from '../services/agrifresh.service';
import { Product, CartItem, CartItemInput } from '../model/agrifresh.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  isLoading = false;
  displayedColumns: string[] = ["Img", "name", "price", "quantity", "total"];

  constructor(public agriFreshService: AgriFreshService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.agriFreshService.getProducts();
    this.agriFreshService.getModifiedProductsListener().subscribe((data: { products: Product[], cartItems: CartItem[] }) => {
      if (data && data.products) {
        this.cartItems = [...data.cartItems];
        setTimeout(() => { this.isLoading = false; }, 1009);
      }
    });
  }

  checkout() {
    this.agriFreshService.checkout();
  }

  getImgUrl(name) {
    return "/assets/images/_" + name.toLowerCase().replace(' ', '_') + ".jpg"
  }


  changeQuantity(cartItem: CartItem, quantity: number) {
    // cartItem.quantity=quantity; //optimistic UI
    if (quantity == 0) {
      this.agriFreshService.deleteCartItem(cartItem._id);
    } else {
      let cartItemInput: CartItemInput = {
        itemId: cartItem.item._id,
        quantity
      };
      this.agriFreshService.editCartItem(cartItemInput, cartItem._id);
    }
  }




}
