import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-historicos',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './historicos.component.html',
  styleUrl: './historicos.component.scss',
})
export class HistoricosComponent implements OnInit {
  globalService = inject(GlobalService);

  usuario!: Usuario;
  ngOnInit() {
    this.globalService
      .getUsuarioAsync()
      .pipe(take(1))
      .subscribe({
        next: (usuario) => {
          this.usuario = usuario;
        },
      });
  }
}
