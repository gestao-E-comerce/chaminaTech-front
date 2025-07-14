import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Login } from '../models/login';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Mensagem } from '../models/mensagem';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { Config } from '../../config';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly API = `${Config.BACKEND_URL}/login`;
  http = inject(HttpClient);

  logar(login: Login): Observable<Usuario> {
    return this.http.post<Usuario>(this.API, login);
  }
  
  deslogar() {
    this.removerToken();
    window.location.replace('/#/login');
  }
  adken(token: string) {
    localStorage.setItem('token', token);
  }

  removerToken() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
