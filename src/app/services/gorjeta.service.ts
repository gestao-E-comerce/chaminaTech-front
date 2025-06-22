import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Mensagem } from '../models/mensagem';
import { Observable } from 'rxjs';
import { Config } from '../../config';
import { Gorjeta } from '../models/gorjeta';

@Injectable({
  providedIn: 'root',
})
export class GorjetaService {
  private readonly API = `${Config.BACKEND_URL}/gorjeta`;
  http = inject(HttpClient);

  save(gorjeta: Gorjeta): Observable<Mensagem> {
    if (gorjeta.id) {
      return this.http.put<Mensagem>(`${this.API}/${gorjeta.id}`, gorjeta);
    } else {
      return this.http.post<Mensagem>(`${this.API}`, gorjeta);
    }
  }

  deletar(id: number): Observable<Mensagem> {
    return this.http.delete<Mensagem>(`${this.API}/${id}`);
  }
}
