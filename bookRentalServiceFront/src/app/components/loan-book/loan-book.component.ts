import { Component, Inject } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Book } from '../../models/book.model';
import { LoanService } from '../../services/loan.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-loan-book',
  templateUrl: './loan-book.component.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./loan-book.component.css']
})
export class LoanBookComponent {
  loanBook: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<LoanBookComponent>,
    @Inject(MAT_DIALOG_DATA) public book: Book
  ) {
    this.loanBook = this.fb.group({
      returnDate: ['', Validators.required],
    });
  }

  onSubmit() {
    var userId = this.authService.getCurrentUser();
    if (userId === null || userId === undefined) {
      alert('Usuário não encontrado. Por favor, faça login primeiro.');
      return;
    }

      if (this.loanBook.valid && this.book && this.book.id) {
      const loanData = {
        user: userId,
        book: this.book.id,
        status: 'Em empréstimo',
        returnDate: new Date(this.loanBook.value.returnDate).toISOString(),
        loanDate: new Date().toISOString(),
      };


      this.loanService.createLoan(loanData).subscribe({
        next: (loan) => {
          console.log('Erro ao criar emprestimo', loan);
          this.dialogRef.close();
          window.location.reload();
        },
        error: (error) => {
          console.error('Erro ao criar emprestimo', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
