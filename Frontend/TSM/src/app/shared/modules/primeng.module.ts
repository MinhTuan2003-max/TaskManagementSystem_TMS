import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextarea  } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { ProgressBarModule } from 'primeng/progressbar';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { DragDropModule } from 'primeng/dragdrop';

const PRIMENG_MODULES = [
  ButtonModule,
  CardModule,
  InputTextModule,
  PasswordModule,
  TableModule,
  DialogModule,
  ConfirmDialogModule,
  ToastModule,
  DropdownModule,
  CalendarModule,
  InputTextarea,
  CheckboxModule,
  RadioButtonModule,
  MultiSelectModule,
  MenuModule,
  MenubarModule,
  PanelMenuModule,
  TabViewModule,
  AccordionModule,
  ProgressBarModule,
  ChipModule,
  TagModule,
  AvatarModule,
  BadgeModule,
  DragDropModule
];

@NgModule({
  imports: [...PRIMENG_MODULES],
  exports: [...PRIMENG_MODULES]
})
export class PrimeNGModule { }
