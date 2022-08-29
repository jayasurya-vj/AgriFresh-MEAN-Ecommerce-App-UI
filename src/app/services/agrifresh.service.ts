import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router,  NavigationEnd } from "@angular/router";
import { Product, CartItem, CartItemInput, Order } from '../model/agrifresh.model';
import { Subject, forkJoin } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: "root" })
export class AgriFreshService {


    domain = environment.apiDomain;
    private _loaded=false;
    private isAuthenticated: boolean = false;
    private _page = "home";
    private products: Product[] = [];
    private cartItems: CartItem[] = [];
    private _noCartItems: number = 0;
    private modifiedProducts = new Subject<{ products: Product[], cartItems: CartItem[] }>();
    private orders = new Subject<Order[]>();
    private pageLoaded = new Subject<boolean>();


    constructor(private http: HttpClient,
        private router: Router,
        private authService: AuthService) {
        router.events.pipe(filter(event => event instanceof NavigationEnd)
        ).subscribe(event => {
            window.scrollTo(0, 0);
            let routeArr = router.url.split("/");
            this.currentPage = routeArr[routeArr.length - 1].split('?')[0];
            console.log(this.currentPage);
        });
        this.isAuthenticated = this.authService.isAuth;
        this.authService.getAuthListener().subscribe(auth => {
            this.isAuthenticated = auth;
        })

    }


    getModifiedProductsListener() {
        return this.modifiedProducts.asObservable();
    }

    getOrdersListener() {
        return this.orders.asObservable();
    }

    getLoadedListener() {
        return this.pageLoaded.asObservable();
    }

    get loaded() {
        return this._loaded;
    }

    set loaded(value) {
        this._loaded = value;
        this.pageLoaded.next(value);
    }

    get currentPage() {
        return this._page;
    }

    set currentPage(value) {
        this._page = value;
    }

    get noCartItems() {
        return this._noCartItems;
    }

    set noCartItems(value: number) {
        this._noCartItems = value;
    }

    getProducts() {
        let getProducts = this.http.get<{ message: string, products: Product[] }>(this.domain + "/api/product");
        let getCartItems = this.http.get<{ message: string, cartItems: CartItem[] }>(this.domain + "/api/cart");

        if (this.isAuthenticated && this.products.length > 0) {
            getCartItems.subscribe(data => {
                if (data.message == "success") {
                    this.modifyProducts(this.products, data.cartItems);
                }
            });
        } else if (this.isAuthenticated && !this.products.length) {
            forkJoin([getProducts, getCartItems]).subscribe(data => {
                if (data[0] && data[0].message == 'success') {
                    if (data[1] && data[1].message == 'success') {
                        this.modifyProducts(data[0].products, data[1].cartItems);
                    } else {
                        this.products = data[0].products;
                        this.cartItems = [];
                        this.noCartItems = 0;
                        this.modifiedProducts.next({ products: this.products, cartItems: this.cartItems });
                    }
                }
            });
        } else if (!this.isAuthenticated) {
            getProducts.subscribe(data => {
                if (data && data.message == 'success') {
                    this.products = data.products;
                    this.cartItems = [];
                    this.noCartItems = 0;
                    this.modifiedProducts.next({ products: this.products, cartItems: this.cartItems });
                }
            });
        }
    }

    modifyProducts(products: Product[], cartItems: CartItem[]) {
        for (let i = 0; i < cartItems.length; i++) {
            let index = [...products].findIndex(x => x._id == cartItems[i].item._id);
            products[index] = {
                ...products[index],
                cartQuantity: cartItems[i].quantity,
                cartItemId: cartItems[i]._id
            };
        }
        this.products = products;
        this.cartItems = cartItems;
        this.noCartItems = this.cartItems.length;
        this.modifiedProducts.next({ products, cartItems });
    }

    getOrders() {
        this.http.get<{ message: string, orders: Order[] }>(this.domain + "/api/order")
            .subscribe(data => {
                if (data.message == "success") {
                    this.orders.next(data.orders);
                }
            });

    }

    addCartItem(cartItemForInsert: CartItemInput) {
        this.http.post<{ message: string, id: string }>(this.domain + "/api/cart", cartItemForInsert)
            .subscribe(data => {
                if (data && data.message == "success") {
                    if (data.id) {
                        let pIndex = this.products.findIndex(p => p._id == cartItemForInsert.itemId);
                        let cartItem: CartItem = {
                            _id: data.id,
                            quantity: 1,
                            item: this.products[pIndex]
                        }
                        this.cartItems.push(cartItem);
                        this.products[pIndex].cartItemId = data.id;
                        this.products[pIndex].cartQuantity = 1;
                        this.noCartItems = this.cartItems.length;
                        this.modifiedProducts.next({ products: this.products, cartItems: this.cartItems });
                    } else { this.getProducts(); }
                }
            });
    }

    editCartItem(cartItemForEdit: CartItemInput, cartItemId: string) {
        this.http.put<{ message: string }>(this.domain + "/api/cart/" + cartItemId, cartItemForEdit)
            .subscribe(data => {
                if (data && data.message == "success") {
                    let cIndex = this.cartItems.findIndex(c => c._id == cartItemId);
                    let pIndex = this.products.findIndex(p => p._id == cartItemForEdit.itemId);
                    this.cartItems[cIndex].quantity = cartItemForEdit.quantity;
                    this.products[pIndex].cartQuantity = cartItemForEdit.quantity;
                    this.noCartItems = this.cartItems.length;
                    this.modifiedProducts.next({ products: this.products, cartItems: this.cartItems });
                }
            });
    }

    deleteCartItem(id: string) {
        this.http.delete<{ message: string }>(this.domain + "/api/cart/" + id,)
            .subscribe(data => {
                if (data && data.message == "success") {
                    let cIndex = this.cartItems.findIndex(c => c._id == id);
                    let pIndex = this.products.findIndex(p => p.cartItemId == id);
                    this.products[pIndex].cartQuantity = 0;
                    this.cartItems.splice(cIndex, 1);
                    this.noCartItems = this.cartItems.length;
                    this.modifiedProducts.next({ products: this.products, cartItems: this.cartItems });
                }
            });
    }

    deleteCart() {
        this.http.delete<{ message: string }>(this.domain + "/api/cart")
            .subscribe(data => {
                if (data && data.message == "success") {
                    this.cartItems = [];
                    this.noCartItems = 0;
                    this.modifiedProducts.next({ products: this.products, cartItems: this.cartItems });
                }
            });
    }

    checkout() {
        this.http.get<{ message: string, data: string, url: string }>(this.domain + "/api/payment")
            .subscribe(d => {
                console.log(d);
                if (d.url) window.location.href = d.url;
            });
    }


}