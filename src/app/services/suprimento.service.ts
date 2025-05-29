import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Suprimento } from '../models/suprimento';
import { Mensagem } from '../models/mensagem';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SuprimentoService {
  API: string = 'http://localhost:8080/api/suprimento';
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