import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './modules/material.module';
import { PrimeNGModule } from './modules/primeng.module';
import {ComponentsModule} from './modules/components/components.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    PrimeNGModule,
    ComponentsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    PrimeNGModule,
    ComponentsModule
  ]
})
export class SharedModule { }
