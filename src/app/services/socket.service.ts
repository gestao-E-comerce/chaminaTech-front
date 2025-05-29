// src/app/services/socket.service.ts
import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private stompClient!: Client;

  constructor() {
    const jwt = localStorage.getItem('token');
    if (!jwt) {
      console.warn('⚠️ Token JWT não encontrado');
      return;
    }

    this.stompClient = new Client({
      // ⚠️ aponta para o mesmo /ws (SockJS) que o Spring expõe
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      // 📨 só aqui no CONNECT enviamos o JWT
      connectHeaders: { Authorization: `Bearer ${jwt}` },
      reconnectDelay: 5000,
      debug: str => console.debug('[STOMP]', str),
      onStompError: frame => console.error('❌ STOMP error', frame),
    });

    this.stompClient.activate();
  }

  /**
   * se inscreve num tópico e entrega o JSON-decoded ao handler
   */
  subscribe<T = any>(topic: string, handler: (msg: T) => void): void {
    const attempt = () => {
      if (this.stompClient.connected) {
        this.stompClient.subscribe(topic, m => handler(JSON.parse((m as IMessage).body)));
      } else {
        setTimeout(attempt, 200);
      }
    };
    attempt();
  }
}
