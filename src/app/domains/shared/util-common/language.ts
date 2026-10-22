import { inject, Provider, REQUEST, Service } from '@angular/core';

export type LanguageConfig = 'default' | 'browser';

export function provideLanguageService(config: LanguageConfig = 'default'): Provider[] {
  if (config === 'browser') {
    return [{ provide: LanguageService, useClass: ClientLanguageService }];
  } else {
    return [{ provide: LanguageService, useClass: DefaultLanguageService }];
  }
}

export abstract class LanguageService {
  abstract getUserLang(): string;
}

// The services are not implementing an interface, but an abstract class instead.
// Because TypeScript removes interfaces during compilation,
//   and we need the base type at runtime to request the configured implementation using inject.
// As abstract classes are preserved during compilation, we use them as base types for exchangeable services.

@Service({ autoProvided: false })
export class DefaultLanguageService implements LanguageService {
  getUserLang(): string {
    return 'en (default)';
  }
}

@Service({ autoProvided: false })
export class ClientLanguageService implements LanguageService {
  getUserLang(): string {
    return navigator.language + ' (browser)';
  }
}

@Service({ autoProvided: false })
export class ServerLanguageService implements LanguageService {
  private request = inject(REQUEST);
  getUserLang(): string {
    return this.request?.headers.get('accept-language') ?? 'en';
  }
}
