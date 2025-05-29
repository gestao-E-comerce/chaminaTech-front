import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Sangria } from '../models/sangria';
import { Observable } from 'rxjs';
import { Mensagem } from '../models/mensagem';

@Injectable({
  providedIn: 'root'
})
export class SangriaService {
  API: string = 'http://localhost:8080/api/sangria';
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