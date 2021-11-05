import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-panels',
  templateUrl: './panels.component.html',
  styleUrls: ['./panels.component.scss']
})
export class PanelsComponent implements OnInit {
  @Input() signupMode: boolean;
  @Output() toggleMode = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }
  
  toggle(n : boolean ) {
    this.toggleMode.emit(n);
  }
}
