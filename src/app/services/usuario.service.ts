import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  API: string = 'http://localhost:8080/api/usuario';
  http = inject(HttpClient);

  buscarUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(this.API + '/' + `${id}`);
  }
}