export interface Product{
    _id?: string;
    name?: string;
    displayQuantity?: string;
    price?: number;
    cartQuantity?: number;
    cartItemId?: string;
    reqInProgress?:boolean;
}

export interface CartItem{
    _id?: string;
    item?: Product;
    quantity?: number;
    reqInProgress?:boolean;
}

export interface CartItemInput{
    itemId?: string;
    quantity?: number;
}
