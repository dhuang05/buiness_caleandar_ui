import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalErr } from '../common-model';


@Component({
  selector: 'cal-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  @Input() errorInfo: CalErr| undefined;
  constructor(
    ){
  }

  ngOnInit() {
  }

}
