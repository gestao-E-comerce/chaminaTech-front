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
  private readonly API = `${Config.BACKEND_URL}/api/login`;
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

  getUser() {
    return this.decodificarToken() as Usuario;
  }

  decodificarToken() {
    let token = this.getToken();
    if (token) {
      return jwtDecode<JwtPayload>(token);
    }
    return '';
  }

  listarUsers(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API}` + '/lista');
  }

  saveUser(user: Usuario): Observable<Mensagem> {
    if (user.id) {
      return this.http.put<Mensagem>(this.API + '/' + `${user.id}`, user);
    } else {
      return this.http.post<Mensagem>(this.API + '/user', user);
    }
  }

  deletarUser(id: number): Observable<Mensagem> {
    return this.http.delete<Mensagem>(this.API + '/' + `${id}`);
  }
}
