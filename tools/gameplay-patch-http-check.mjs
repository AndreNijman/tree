// The same gameplay assertions over HTTP, not a replacement for the file probe.
process.argv.push('--http');
await import('./gameplay-patch-check.mjs');
