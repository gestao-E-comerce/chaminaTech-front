import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Login } from '../../models/login';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { NgClass } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-usuario',
  imports: [FormsModule, NgClass],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss',
})
export class UsuarioComponent {
  login: Login = new Login();

  loginService = inject(LoginService);
  toastr = inject(ToastrService);
  activeModal = inject(NgbActiveModal);
  globalService = inject(GlobalService);

  logar() {
    if (!this.login.username || !this.login.senha) {
      this.toastr.error('Preencha os dados corretamente');
      return;
    }
    // Obtém o usuário atual (antes de logar)
    this.globalService.getUsuarioAsync().subscribe({
      next: (usuarioAnterior) => {
        this.loginService.logar(this.login).subscribe({
          next: (usuarioNovo) => {
            // ⚠️ Verifica se o usuário logado é o mesmo
            if (usuarioNovo.id !== usuarioAnterior.id) {
              this.toastr.error('Você deve reautenticar com o mesmo usuário.');
              return;
            }

            // Se for o mesmo usuário, salva token e fecha modal
            this.loginService.adken(usuarioNovo.token);
            this.activeModal.close(usuarioNovo.token);
          },
          error: (erro) => {
            this.toastr.error(erro.error.mensagem);
          },
        });
      },
      error: () => {
        this.toastr.error('Erro ao verificar usuário atual.');
      },
    });
  }
}
