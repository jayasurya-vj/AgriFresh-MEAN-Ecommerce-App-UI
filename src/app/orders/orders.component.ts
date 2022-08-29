import { Component, OnInit } from '@angular/core';
import { AgriFreshService } from '../services/agrifresh.service';
import { Order } from '../model/agrifresh.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orderItems: Order[] = [];
  panelOpenState = false;
  isLoading = false;
  orderPlaced: string = '';

  constructor(private agriFreshService: AgriFreshService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.agriFreshService.getOrders();
    this.agriFreshService.getOrdersListener().subscribe((data: Order[]) => {
      if (data) {
        this.orderItems = [...data];
        this.isLoading = false;
      }
    });
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.orderPlaced = queryParams['orderplaced'];
    })
    this.agriFreshService.getLoadedListener().subscribe(loaded=>{
      if(loaded) this.isLoading = false;
    })
  }
  

}
