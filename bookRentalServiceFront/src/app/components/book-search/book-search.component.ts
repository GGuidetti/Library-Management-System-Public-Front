import { Component } from '@angular/core';
import { GoogleBooksService } from '../../services/googleBooks.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./book-search.component.css']
})

export class BookSearchComponent {
  books: GoogleBook[] = [];
  searchTitle: string = '';

  constructor(
    private bookService: BookService,
    private googleBooksService: GoogleBooksService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) { }

  onSearch() {
    this.googleBooksService.searchBooks(this.searchTitle).subscribe(
      (response: { items?: { volumeInfo: { title: string, authors?: string[], imageLinks?: { thumbnail: string } } }[] }) => {
        if (response && Array.isArray(response)) {
          this.books = response.map(item => ({
            title: item
          })) || [];
        } else {
          this.snackBar.open('No books found', 'Close', { duration: 2000 });
        }
      },
      (error: any) => {
        this.snackBar.open('Error fetching books', 'Close -' + error, { duration: 2000 });
      }
    );
  }

  onAddToLibrary(book: GoogleBook) {
    this.addBookToLibrary(book);
  }

  addBookToLibrary(book: GoogleBook) {
    const newBook: Book = {
      title: book.title,
      author: 'Autor Desconhecido',
      category: 'Desconhecida (Google Books)',
      isbn: 'Desconhecido',
      publishDate: new Date(0)
    };

    this.bookService.createBook(newBook).subscribe({
      next: () => {
        alert('Livro cadastrado com sucesso!');
        window.location.reload();
      },
      error: (err) => {
        console.error('Erro ao cadastrar o livro:', err);
        alert('Erro ao cadastrar o livro.');
      }
    });
  }

}

interface GoogleBook {
  title: string;
}
