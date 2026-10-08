import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private _baseUrl = 'https://demo.angulararchitects.io/api';
  private _model = 'gpt-5-chat-latest';

  get baseUrl() {
    return this._baseUrl;
  }

  get model() {
    return this._model;
  }
}
