import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-autoscale',
  templateUrl: './autoscale.component.html',
  styleUrls: ['./autoscale.component.css']
})
export class AutoscaleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let navTitle = document.getElementById("nav-title");
    if(navTitle != null) {
        navTitle.replaceChildren("Auto Scaling");
    }
  }

}
