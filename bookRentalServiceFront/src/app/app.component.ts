import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { LoanBookComponent } from './components/loan-book/loan-book.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoginComponent,
    HomeComponent,
    BookListComponent,
    LoanBookComponent
  ],
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {}
