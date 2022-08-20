import { Component, OnInit, AfterContentInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterContentInit {
  isLoading = true;

  constructor() { }

  val1: number = 0;
  val2: number = 0;
  val3: number = 0;
  val4: number = 0;

  countInterval: any = setInterval(() => {

    this.val1 = this.val1 + 110;
    this.val2 = this.val2 + 50;
    this.val3 = this.val3 + 260;
    this.val4 = this.val4 + 166;

    if (this.val1 == 11000) {
      clearInterval(this.countInterval);
    }
  }, 10);


  ngOnInit(): void {
    setTimeout(() => { this.isLoading = false; }, 1009);
  }
  ngAfterContentInit() {
  }


}
