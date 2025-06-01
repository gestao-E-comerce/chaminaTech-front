import { inject, Injectable } from '@angular/core';
import { Permissao } from '../models/permissao';
import { Observable, switchMap } from 'rxjs';
import { Mensagem } from '../models/mensagem';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { Config } from '../../config';

@Injectable({
  providedIn: 'root',
})
export class PermissaoService {
  private readonly API = `${Config.BACKEND_URL}/api/permissao`;
  http = inject(HttpClient);
  globalService = inject(GlobalService);

  listarPermissaosPorUsuarioId(): Observable<Permissao[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.get<Permissao[]>(`${this.API}/lista/${matriz.id}`);
      })
    );
  }

  listarPermissaosPorUsuarioIdAdmin(): Observable<Permissao[]> {
    return this.globalService.getAdminAsync().pipe(
      switchMap((admin) => {
        return this.http.get<Permissao[]>(`${this.API}/lista/${admin.id}`);
      })
    );
  }

  save(permissao: Permissao): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        permissao.usuario = matriz;
        if (permissao.id) {
          return this.http.put<Mensagem>(
            `${this.API}/${permissao.id}`,
            permissao
          );
        } else {
          return this.http.post<Mensagem>(this.API, permissao);
        }
      })
    );
  }

  saveAdmin(permissao: Permissao): Observable<Mensagem> {
    return this.globalService.getAdminAsync().pipe(
      switchMap((admin) => {
        permissao.usuario = admin;
        if (permissao.id) {
          return this.http.put<Mensagem>(
            `${this.API}/${permissao.id}`,
            permissao
          );
        } else {
          return this.http.post<Mensagem>(this.API, permissao);
        }
      })
    );
  }

  deletar(id: number): Observable<Mensagem> {
    return this.http.delete<Mensagem>(`${this.API}/${id}`);
  }
}
