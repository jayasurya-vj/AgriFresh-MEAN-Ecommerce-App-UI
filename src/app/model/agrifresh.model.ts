export interface Product {
    _id?: string;
    name?: string;
    displayQuantity?: string;
    price?: number;
    cartQuantity?: number;
    cartItemId?: string;
    reqInProgress?: boolean;
}

export interface CartItem {
    _id?: string;
    item?: Product;
    quantity?: number;
    reqInProgress?: boolean;
}

export interface CartItemInput {
    itemId?: string;
    quantity?: number;
}

export interface OrderedItems {
    item?: Product;
    quantity?: number;
}

export interface ShippingDetails {
    address?: Address;
    name?: string;
}

export interface Address {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string;
    postal_code?: string;
    state?: string;
}

export interface Order {
    orderedItems?: OrderedItems[],
    shipping_details?: ShippingDetails;
    amount_subtotal?: number;
    amount_total?: number;
    amount_shipping?: number;
    payment_status?: string;
    created_at?: string;
}
