import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Sangria } from '../models/sangria';
import { Observable } from 'rxjs';
import { Mensagem } from '../models/mensagem';
import { Config } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class SangriaService {
  API: string = `${Config.BACKEND_URL}/sangria`;
  http = inject(HttpClient);

  save(sangria: Sangria): Observable<Mensagem> {
    if (sangria.id) {
      return this.http.put<Mensagem>(`${this.API}/${sangria.id}`,sangria);
    } else {
      return this.http.post<Mensagem>(`${this.API}`, sangria);
    }
  }

  deletar(id: number): Observable<Mensagem> {
    return this.http.delete<Mensagem>(`${this.API}/${id}`);
  }
}