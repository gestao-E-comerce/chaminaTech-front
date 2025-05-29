import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImpressoraService {
  // private apiUrl = 'http://localhost:8080/impressoras/listar';
  // http = inject(HttpClient);

  // listarImpressoras(): Observable<string[]> {
  //   return this.http.get<string[]>(this.apiUrl);
  // }
}
