import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Lesson0Component } from './components/lesson0/lesson0.component';

const routes: Routes = [
  { path: '', redirectTo: '/lesson0', pathMatch: 'full' },
  { path: 'lesson0', component: Lesson0Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
