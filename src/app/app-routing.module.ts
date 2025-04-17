import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Lesson0Component } from './components/lesson0/lesson0.component';
import { Lesson1Component } from './components/lesson1/lesson1.component';

const routes: Routes = [
  { path: '', redirectTo: '/lesson0', pathMatch: 'full' },
  { path: 'lesson0', component: Lesson0Component },
  { path: 'lesson1', component: Lesson1Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
