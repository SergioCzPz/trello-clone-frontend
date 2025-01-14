import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { CurrentUserInterface } from '../types/currentUser.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RegisterUserForm } from '../types/registerRequest.interface';
import { LoginUserForm } from '../types/loginRequest.interface';

@Injectable()
export class AuthService {
  currentUser$ = new BehaviorSubject<CurrentUserInterface | null | undefined>(
    undefined,
  );

  isLogged$ = this.currentUser$.pipe(
    filter(currentUser => currentUser !== undefined),
    map(currentUser => Boolean(currentUser)),
  );

  constructor(private readonly http: HttpClient) {}

  getCurrentUser(): Observable<CurrentUserInterface> {
    const url = environment.apiUrl + '/user';
    return this.http.get<CurrentUserInterface>(url);
  }

  register(
    registerRequest: RegisterUserForm,
  ): Observable<CurrentUserInterface> {
    const url = environment.apiUrl + '/users';
    return this.http.post<CurrentUserInterface>(url, registerRequest);
  }

  login(loginRequest: LoginUserForm): Observable<CurrentUserInterface> {
    const url = environment.apiUrl + '/users/login';
    return this.http.post<CurrentUserInterface>(url, loginRequest);
  }

  setToken(currentUser: CurrentUserInterface): void {
    localStorage.setItem('token', currentUser.token);
  }

  setCurrentUser(currentuser: CurrentUserInterface | null): void {
    this.currentUser$.next(currentuser);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser$.next(null);
  }
}
