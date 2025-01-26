import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Loan} from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private apiUrl = 'http://localhost:8080/loans';

  constructor(private http: HttpClient) { }

  getAllLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.apiUrl);
  }

  getUserLoans(): Observable<Loan[]> | null {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userObj = JSON.parse(currentUser);

      return this.http.get<Loan[]>(this.apiUrl + "/user/" + userObj.id);
    }
     return null
  }

  createLoan(loan: Loan): Observable<Loan> {
    return this.http.post<Loan>(this.apiUrl, loan);
  }

  updateLoan(id: number, loan: Loan): Observable<Loan> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Loan>(url, loan);
  }

  deleteLoan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
