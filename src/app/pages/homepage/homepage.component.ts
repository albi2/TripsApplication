import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export default class HomepageComponent implements OnInit {

  signupMode: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  toggle(n: boolean) {
    this.signupMode= !this.signupMode;
  }

  scroll($element: any) {
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }
}
