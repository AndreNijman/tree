# tree

A full-progression procedural sandbox game written in plain JavaScript. Mine, craft, build a town, fish, survive invasions and events, and fight bosses from King Slime through the Moon Lord.

**Play:** [tree.andrenijman.com](https://tree.andrenijman.com/)

## Controls

- Move: `A` / `D` or arrow keys
- Jump and fly: `Space` / `W`
- Mine, attack, or use: left click
- Place or interact: right click
- Inventory and crafting: `E`
- Guide recipes: `H`
- Drop selected item: `Q`
- Pause and save: `Esc`

## Multiplayer

- Click **Host** beside any saved world to publish it in the hosted-world browser.
- Enter an optional password before hosting to make the world private.
- Join from the hosted-world list or enter its five-character room code.
- The host owns world simulation and saving; player characters are retained in each guest's browser.
- If the host disconnects, the longest-connected guest is promoted and the synchronized world continues.

## Technology

- Static HTML, CSS, and ES5-style JavaScript
- Procedural Canvas rendering with no asset packs
- Synthesized Web Audio sound effects
- Seeded procedural worlds
- Multiple named local browser saves with automatic account sync when signed in
- Cloudflare Durable Object relay for password lobbies, ordered world snapshots, and live state synchronization

No build step or runtime dependencies are required. Open `index.html` directly or serve this directory with any static web server.
