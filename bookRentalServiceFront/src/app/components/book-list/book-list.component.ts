import { Component, OnInit, TemplateRef } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import {NgForOf, NgIf} from '@angular/common';
import {LoanBookComponent} from '../loan-book/loan-book.component';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {BookSearchComponent} from '../book-search/book-search.component';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    BookSearchComponent
  ]
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  editBookForm: FormGroup;
  recommendedBooks: Book[] = [];

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.editBookForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      author: ['', Validators.required],
      category: ['', Validators.required],
      isbn: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadBooks();
    this.loadRecommendedBooks();
  }

  loadBooks() {
    this.bookService.getAllBooks().subscribe({
      next: (books) => (this.books = books),
      error: (error) => console.error('Error loading books:', error),
    });
  }

  onAddBook() {
    this.router.navigate(['/add-book']);
    console.log('Adicionar livro');
  }

  onEditBook(book: Book, templateRef: TemplateRef<any>): void {
    this.editBookForm.setValue({
      id: book.id,
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
    });

    this.dialog.open(templateRef, {
      width: '400px',
    });
  }

  onLoanBook(book: Book): void {
    const dialogRef = this.dialog.open(LoanBookComponent, {
      width: '400px',
      data: book,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Empréstimo realizado:', result);
      }
    });
  }

  onSubmitEdit(): void {
    if (this.editBookForm.invalid) return;

    const updatedBook = { ...this.editBookForm.value };

    this.bookService.updateBook(updatedBook.id, updatedBook).subscribe({
      next: (updatedBook) => {
        this.books = this.books.map((b) =>
          b.id === updatedBook.id ? updatedBook : b
        );
        this.dialog.closeAll();
        window.location.reload();
      },
      error: (err) => console.error('Error updating book:', err),
    });
  }

  cancelEdit(): void {
    this.dialog.closeAll();
  }

  onDeleteBook(book: Book): void {
    if (confirm('Você tem certeza que deseja excluir este livro?') && book.id) {
      this.bookService.deleteBook(book.id).subscribe({
        next: () => {
          this.books = this.books.filter(bookAux => bookAux.id !== book.id);
          console.log('Livro deletado com sucesso!');
          window.location.reload();
        },
        error: (err) => console.error('Error deleting book:', err),
      });
    }
  }

  loadRecommendedBooks(): void {
    var currentUser = this.authService.getCurrentUser()
    if(currentUser){
      this.bookService.getBookRecommendations(currentUser).subscribe({
        next: (books) => {
          this.recommendedBooks = books;
        },
        error: (err) => {
          console.error('Erro ao carregar as recomendações de livros', err);
        },
      });
    }

  }

}
