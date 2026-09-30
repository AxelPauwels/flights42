import { environment } from '../../../../environments/environment';

export function withDevToolsForDebugMode(name: string) {
  return environment.withDevtools(name);
}
