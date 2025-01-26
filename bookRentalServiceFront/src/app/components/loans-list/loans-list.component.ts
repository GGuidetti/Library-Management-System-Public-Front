import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { LoanService } from '../../services/loan.service';
import { Loan } from '../../models/loan.model';
import {DatePipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-loans-list',
  templateUrl: './loans-list.component.html',
  styleUrls: ['./loans-list.component.css'],
  imports: [
    DatePipe,
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ]
})
export class LoansListComponent implements OnInit {
  editLoanForm: FormGroup;
  loans: Loan[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  editingLoan: Loan | null = null;

  constructor(
    private loanService: LoanService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {

    this.editLoanForm = this.fb.group({
      status: [''],
      returnDate: ['']
    });
  }


  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    // @ts-ignore
    this.loanService.getUserLoans().subscribe({
      next: (data) => {
        this.loans = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar os empréstimos!';
        this.isLoading = false;
      },
    });
  }

  openEditDialog(templateRef: TemplateRef<any>, loan: Loan): void {
    this.editingLoan = loan;

    this.editLoanForm = this.fb.group({
      status: [loan.status, Validators.required],
      returnDate: [
        new Date(loan.returnDate).toISOString().split('T')[0],
        Validators.required,
      ],
    });

    this.dialog.open(templateRef, {
      width: '400px',
    });
  }

  onSubmitEdit(): void {
    if (!this.editLoanForm || !this.editingLoan) return;

    const updatedLoan = {
      ...this.editingLoan,
      ...this.editLoanForm.value,
    };

    this.loanService.updateLoan(updatedLoan.id, updatedLoan).subscribe({
      next: () => {
        this.loans = this.loans.map((loan) =>
          loan.id === updatedLoan.id ? updatedLoan : loan
        );
        this.dialog.closeAll();
      },
      error: (err) => {
        console.error('Erro ao atualizar o empréstimo:', err);
      },
    });
  }

  cancelEdit(): void {
    this.dialog.closeAll();
  }

  onDeleteLoan(loan : Loan): void {
    if (confirm('Você tem certeza que deseja excluir este empréstimo?') && loan.id) {
      this.loanService.deleteLoan(loan.id).subscribe({
        next: () => {
          this.loans = this.loans.filter(loanAux => loanAux.id !== loan.id);
          console.log('Empréstimo deletado com sucesso!');
        },
        error: (err) => console.error('Erro ao deletar o empréstimo:', err),
      });
    }
  }
}
