import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { Lesson0Component } from './components/lesson0/lesson0.component';
import { Lesson1Component } from './components/lesson1/lesson1.component';
import { FormsModule } from '@angular/forms';
import { Lesson2Component } from './components/lesson2/lesson2.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    Lesson0Component,
    Lesson1Component,
    Lesson2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
