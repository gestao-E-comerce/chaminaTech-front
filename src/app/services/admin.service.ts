import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Matriz } from '../models/matriz';
import { Admin } from '../models/admin';
import { Mensagem } from '../models/mensagem';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  API: string = 'http://localhost:8080/api/admin';
  http = inject(HttpClient);

  editar(admin: Admin): Observable<Mensagem> {
    return this.http.put<Mensagem>(`${this.API}/${admin.id}`, admin);
  }

  listarMatrizes(
    deletado?: string,
    termoPesquisa?: string,
    ativo?: string
  ): Observable<Matriz[]> {
    let params = new HttpParams();
    if (deletado != null && deletado !== '') {
      params = params.set('deletado', deletado);
    }
    if (termoPesquisa != null && termoPesquisa !== '') {
      params = params.set('termoPesquisa', termoPesquisa);
    }
    if (ativo != null && ativo !== '') {
      params = params.set('ativo', ativo);
    }
    return this.http.get<Matriz[]>(`${this.API}/listarMatrizes`, {
      params,
    });
  }

  buscarChaveApi(): Observable<string> {
    return this.http.get(`${this.API}/chave-api`, { responseType: 'text' });
  }
}
