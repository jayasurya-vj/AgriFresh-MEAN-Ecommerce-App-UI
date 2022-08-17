import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { Router } from "@angular/router";
import { Product, CartItem,CartItemInput } from '../model/agrifresh.model';
import {Subject,forkJoin, ignoreElements } from 'rxjs';
import { Subscription } from 'rxjs';
import {AuthService} from '../auth/auth.service';
// import { ConstantPool } from "@angular/compiler";


@Injectable({ providedIn:"root"})
export class AgriFreshService{

    // environment.apiDomain
    domain="http://localhost:5000";
    private token:string;
    private isAuthenticated:boolean = false;
    private products: Product[]=[];
    private cartItems: CartItem[]=[];
    private modifiedProducts = new Subject<{products: Product[], cartItems: CartItem[]}>();
    

    constructor(private http:HttpClient,
         private router :Router,
         private authService:AuthService){
            this.isAuthenticated = this.authService.isAuth;
            this.authService.getAuthListener().subscribe(auth=>{
            this.isAuthenticated=auth;
            })
    }

  
    getModifiedProducts(){
      return this.modifiedProducts.asObservable();
    }

    getProducts(){
        let getProducts = this.http.get<{message:string,products:Product[]}>(this.domain+"/api/product");
        let getCartItems = this.http.get<{message:string,cartItems:CartItem[]}>(this.domain+"/api/cart"); 

        if(this.isAuthenticated && this.products.length==18){            
            getCartItems.subscribe(data=>{
                if(data.message == "success"){
                    this.modifyProducts(this.products,data.cartItems);
                }
            });
        }else if(this.isAuthenticated && !this.products.length){
            forkJoin([getProducts, getCartItems]).subscribe(data => {
                if(data[0] && data[0].message=='success'){
                    if(data[1] && data[1].message=='success'){
                        this.modifyProducts(data[0].products,data[1].cartItems);
                    }else{
                        this.products = data[0].products;
                        this.cartItems = [];
                        this.modifiedProducts.next({products: this.products, cartItems: this.cartItems});
                    }
                }
            });
        }else if(!this.isAuthenticated){
            getProducts.subscribe(data=>{
                if(data && data.message=='success'){
                    this.products = data.products;
                    this.cartItems = [];
                    this.modifiedProducts.next({products: this.products, cartItems: this.cartItems} );
                }
            });
        }
    }

    modifyProducts(products:Product[],cartItems:CartItem[]){
        for(let i=0;i < cartItems.length; i++){
            let index = [...products].findIndex(x => x._id == cartItems[i].item._id);
            products[index] = {
                ...products[index], 
                cartQuantity:cartItems[i].quantity,
                cartItemId:cartItems[i]._id
            };
         }
         this.products = products;
         this.cartItems = cartItems;
         this.modifiedProducts.next({products, cartItems});
    }

    // getCart(){
    //     this.http.get<{message:string,cartItems:CartItem[]}>(this.domain+"/api/cart")
    //     .subscribe(data=>{
    //         console.log(data?.cartItems,data?.cartItems[0]?.item);
    //     });
    // }

    addCartItem(cartItemForInsert:CartItemInput){
        this.http.post<{message:string,id:string}>(this.domain+"/api/cart",cartItemForInsert)
        .subscribe(data=>{
            if(data && data.message=="success"){
                if(data.id){
                    let pIndex = this.products.findIndex(p=>p._id==cartItemForInsert.itemId);
                    let cartItem:CartItem = {
                        _id :data.id,
                        quantity :1,
                        item : this.products[pIndex]
                    }
                    this.cartItems.push(cartItem);
                    this.products[pIndex].cartItemId = data.id;
                    this.products[pIndex].cartQuantity =1; 
                    this.products[pIndex].reqInProgress=false;
                    this.modifiedProducts.next({products:this.products, cartItems:this.cartItems});
                }else{  this.getProducts();}
            }
        });
    }

    editCartItem(cartItemForEdit:CartItemInput,cartItemId:string){
        this.http.put<{message:string}>(this.domain+"/api/cart/"+cartItemId,cartItemForEdit)
        .subscribe(data=>{
            if(data && data.message=="success"){
                // this.getProducts();
                let cIndex = this.cartItems.findIndex(c=>c._id==cartItemId);
                let pIndex = this.products.findIndex(p=>p._id==cartItemForEdit.itemId);
                this.cartItems[cIndex].quantity = cartItemForEdit.quantity;
                this.products[pIndex].cartQuantity = cartItemForEdit.quantity;
                this.products[pIndex].reqInProgress=false;
                this.cartItems[cIndex].reqInProgress=false;
                this.modifiedProducts.next({products:this.products, cartItems:this.cartItems});
            }
        });
    }

    deleteCartItem(id:string){
        this.http.delete<{message:string}>(this.domain+"/api/cart/"+id,)
        .subscribe(data=>{
            if(data && data.message=="success"){
                // this.getProducts();
                let cIndex = this.cartItems.findIndex(c=>c._id==id);
                let pIndex = this.products.findIndex(p=>p.cartItemId==id);
                this.products[pIndex].cartQuantity = 0;
                this.products[pIndex].reqInProgress=false;
                this.cartItems.splice(cIndex,1);
                console.log(this.products)
                this.modifiedProducts.next({products:this.products, cartItems:this.cartItems});
            }
        });
    }

    deleteCart(){
        this.http.delete<{message:string}>(this.domain+"/api/cart")
        .subscribe(data=>{
            if(data && data.message=="success"){
                // this.getProducts();
                this.cartItems = [];
                this.modifiedProducts.next({products: this.products, cartItems: this.cartItems});
            }
        });
    }

    checkout(){
        this.http.get<{message:string,data:string, url: string}>(this.domain+"/api/payment")
        // .subscribe(
        //     { next: (d) => {
        //     console.log(d);
        //     if(d.url) window.location.href = d.url;
        //     }, 
        //     error: console.error(error)}});
        .subscribe(d=>{
            console.log(d);
            if(d.url) window.location.href = d.url;
        }, error => console.error(error));
    }
      

}