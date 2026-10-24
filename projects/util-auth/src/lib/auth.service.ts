import { Service } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Service()
export class AuthService {
  userName = new BehaviorSubject<string>('');
  login(userName: string): void {
    this.userName.next(userName);
  }
}
