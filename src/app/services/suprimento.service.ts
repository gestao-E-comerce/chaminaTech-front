import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Suprimento } from '../models/suprimento';
import { Mensagem } from '../models/mensagem';
import { Observable } from 'rxjs';
import { Config } from '../../config';

@Injectable({
  providedIn: 'root',
})
export class SuprimentoService {
  private readonly API = `${Config.BACKEND_URL}/suprimento`;
  http = inject(HttpClient);

  save(suprimento: Suprimento): Observable<Mensagem> {
    if (suprimento.id) {
      return this.http.put<Mensagem>(`${this.API}/${suprimento.id}`,suprimento);
    } else {
      return this.http.post<Mensagem>(`${this.API}`, suprimento);
    }
  }

  deletar(id: number): Observable<Mensagem> {
    return this.http.delete<Mensagem>(`${this.API}/${id}`);
  }
}