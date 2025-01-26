import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent {
  bookForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      author: ['', [Validators.required, Validators.maxLength(50)]],
      category: ['', [Validators.required, Validators.maxLength(50)]],
      isbn: ['', [Validators.required, Validators.pattern(/^\d{10}(\d{3})?$/)]],
      publishDate: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.bookForm.valid) {
      this.bookService.createBook(this.bookForm.value).subscribe({
        next: () => {
          alert('Livro cadastrado com sucesso!');
          this.router.navigate(['/books']);
        },
        error: (err) => {
          console.error('Erro ao cadastrar o livro:', err);
          alert('Erro ao cadastrar o livro.');
        }
      });
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }
}
