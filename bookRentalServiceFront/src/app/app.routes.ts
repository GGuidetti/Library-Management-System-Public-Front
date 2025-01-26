import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { LoanBookComponent } from './components/loan-book/loan-book.component';
import {AddBookComponent} from './components/add-book/add-book.component';
import {LoansListComponent} from './components/loans-list/loans-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'books', component: BookListComponent },
      { path: 'loan/:id', component: LoanBookComponent },
      { path: 'add-book', component: AddBookComponent },
      { path: 'loans', component: LoansListComponent },
      { path: '', redirectTo: 'books', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
