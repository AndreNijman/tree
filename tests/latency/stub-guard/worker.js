import { WorkerEntrypoint } from 'cloudflare:workers';

export class NetLog extends WorkerEntrypoint {
  async record(game, log) {
    console.log('NETLOG ' + JSON.stringify({ game, log }));
  }
}

export default { fetch: () => new Response('stub games-guard', { status: 404 }) };
