import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './modules/material.module';
import { PrimeNGModule } from './modules/primeng.module';
import { PipesModule } from './pipes/pipes.module';
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
    ComponentsModule,
    PipesModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    PrimeNGModule,
    ComponentsModule,
    PipesModule
  ]
})
export class SharedModule { }
