import { Component, OnInit } from '@angular/core';
import { AgriFreshService } from '../services/agrifresh.service';
import { Product, CartItem, CartItemInput } from '../model/agrifresh.model';
import { Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-shop-cards',
  templateUrl: './shop-cards.component.html',
  styleUrls: ['./shop-cards.component.scss']
})
export class ShopCardsComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  constructor(private agriFreshService: AgriFreshService,
    private authService:AuthService,
    private router :Router) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.agriFreshService.getProducts()
    this.agriFreshService.getModifiedProductsListener().subscribe((data: { products: Product[], cartItems: CartItem[] }) => {
      if (data && data.products) {
        this.products = data.products;
        setTimeout(() => { this.isLoading = false; }, 1009);
      }
    });
    this.agriFreshService.getLoadedListener().subscribe(loaded=>{
      console.log(loaded,"loaded");
      if(loaded) this.isLoading = false;
    });
  }

  getImgUrl(name) {
    return "/assets/images/_" + name.toLowerCase().replace(' ', '_') + ".jpg"
  }

  changeQuantity(product: Product, quantity: number) {      
    // product.cartQuantity=quantity; //optimistic UI    
    if(this.authService.isAuth){
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
    }else{
      this.router.navigate(["/user/login"], { queryParams: { redirect: "shop"}});
    }
  }

}
