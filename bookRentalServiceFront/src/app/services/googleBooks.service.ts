import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleBooksService {

  private apiUrl = 'http://localhost:8080/google-books/searchBooks';

  constructor(private http: HttpClient) { }

  searchBooks(title: string): Observable<any> {
    const params = new HttpParams().set('title', `${title}`);
    return this.http.get(this.apiUrl, { params });
  }
}
