import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Config } from '../../config';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly API = `${Config.BACKEND_URL}/usuario`;
  http = inject(HttpClient);

  buscarUsuarioPorToken(token: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.API}/token`, token, {
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
