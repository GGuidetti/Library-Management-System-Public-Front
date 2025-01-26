import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppUser } from '../models/app-user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/app-users';
  private currentUserSubject: BehaviorSubject<AppUser>;
  public currentUser: Observable<AppUser | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<AppUser>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(email: string, password: string): Observable<AppUser> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.post<AppUser>(`${this.apiUrl}/login`,
      { email, password },
      { headers }
    ).pipe(
      map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): number | null {
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
      const userObj = JSON.parse(currentUser);

      return userObj.id;
    }
    return null;
  }
}
