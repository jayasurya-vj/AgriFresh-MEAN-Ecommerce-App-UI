import { Component, OnInit, OnChanges } from '@angular/core';
import {AgriFreshService} from '../services/agrifresh.service';
import { Product, CartItem,CartItemInput } from '../model/agrifresh.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  value:any;
  cartItems: CartItem[]=[];
  displayedColumns: string[] = ["Img", "name",	"price"	, "quantity",	"total"];

  constructor(private agriFreshService:AgriFreshService) { }

  ngOnInit(): void {
    this.agriFreshService.getProducts(); 
    this.agriFreshService.getModifiedProducts().subscribe((data:{products: Product[], cartItems: CartItem[]})=>{
      if(data && data.products){
        this.cartItems = data.cartItems;
        console.log(this.cartItems);
      }
  });
  }

  ngOnChanges(){
    // console.log(this.value,this.dataSource);
  }

  getImgUrl(name){
    return "/assets/images/_" + name.toLowerCase().replace(' ','_') +  ".jpg"
  }

  // changeQuantity(index:number,element:any,event:any,value:number=0){
    // if( value!=null && value>=0 && value<=20) element.quantity=value;
    // else if(event && event.target && event.target.value>=0 && event.target.value<=20)  element.quantity=event.target.value;
    // else element.quantity = element.quantity;

    // if(element.quantity!=0)     element.total=element.quantity * element.price;
    // else {
    //   this.dataSource.splice(index,1);
    //   let temp= this.dataSource;
    //   this.dataSource = [...this.dataSource];
    // }

    // console.log(index,this.value,this.dataSource,element,event);
  // }

  // set cartItems(data:any){
  //   this._cartItems=data;
  // }

  // get cartItems(){
  //   return this._cartItems;
  // }

  changeQuantity(cartItem:CartItem, quantity:number){    
    // cartItem.quantity=quantity; //optimistic UI
    if(quantity==0){
      this.agriFreshService.deleteCartItem(cartItem._id);
    }else{
      let cartItemInput:CartItemInput={
        itemId: cartItem.item._id,
        quantity      
      };
        this.agriFreshService.editCartItem(cartItemInput,cartItem._id);
      }
  }


  

}
