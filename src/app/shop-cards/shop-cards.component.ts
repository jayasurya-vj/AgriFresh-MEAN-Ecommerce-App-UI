import { Component, OnInit } from '@angular/core';
import { AgriFreshService } from '../services/agrifresh.service';
import { Product, CartItem, CartItemInput } from '../model/agrifresh.model';

@Component({
  selector: 'app-shop-cards',
  templateUrl: './shop-cards.component.html',
  styleUrls: ['./shop-cards.component.scss']
})
export class ShopCardsComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  constructor(private agriFreshService: AgriFreshService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.agriFreshService.getProducts()
    this.agriFreshService.getModifiedProductsListener().subscribe((data: { products: Product[], cartItems: CartItem[] }) => {
      if (data && data.products) {
        this.products = data.products;
        setTimeout(() => { this.isLoading = false; }, 2009);
      }
    });
  }

  getImgUrl(name) {
    return "/assets/images/_" + name.toLowerCase().replace(' ', '_') + ".jpg"
  }

  changeQuantity(product: Product, quantity: number) {      
    // product.cartQuantity=quantity; //optimistic UI
    if (quantity == 0) {
      this.agriFreshService.deleteCartItem(product.cartItemId);
    } else {
      let cartItemInput: CartItemInput = {
        itemId: product._id,
        quantity
      };

      if (quantity == 1 && !product.cartItemId) {
        this.agriFreshService.addCartItem(cartItemInput);
      } else {
        this.agriFreshService.editCartItem(cartItemInput, product.cartItemId);
      }

    }
  }

}
