import { Component } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-unauthorized',
  imports: [],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.scss'
})
export class Unauthorized {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
