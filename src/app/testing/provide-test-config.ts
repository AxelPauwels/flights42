import { Provider } from '@angular/core';
import { ConfigService } from '../domains/shared/util-common/config-service';

export const provideTestConfig = (): Provider => ({
    provide: ConfigService,
    useValue: {
      baseUrl: '',
      model: '',
    },
})
