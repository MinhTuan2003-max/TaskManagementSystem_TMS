import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private connectionStatus = new BehaviorSubject<boolean>(false);
  public connectionStatus$ = this.connectionStatus.asObservable();

  connect(): void {
    // WebSocket connection logic will be implemented later
    console.log('WebSocket service - connect called');
    this.connectionStatus.next(true);
  }

  disconnect(): void {
    console.log('WebSocket service - disconnect called');
    this.connectionStatus.next(false);
  }

  isConnected(): boolean {
    return this.connectionStatus.value;
  }
}
