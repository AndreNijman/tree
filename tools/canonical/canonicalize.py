#!/usr/bin/env python3
"""Canonicalize tree stats to Terraria 1.4.4 classic values.

Sources: tools/canonical/npcs.json (parsed wiki List of NPCs, classic column)
         tools/canonical/items-db.json (wiki Module:Iteminfo item database)

One-shot migration; kept for provenance. Run from repo root: python3 tools/canonical/canonicalize.py
"""
import re, json, sys

npcs = json.load(open('tools/canonical/npcs.json'))
db = json.load(open('tools/canonical/items-db.json'))

def ent(name):
    hits = [r for r in npcs if r['name'].lower() == name.lower()]
    return hits[0] if hits else None

def entp(prefix, variant=None):
    hits = [r for r in npcs if r['name'].lower().startswith(prefix.lower()) and (variant is None or variant.lower() in r['name'].lower())]
    return hits[0] if hits else None

def weapon(name, cls):
    hits = db.get(name) or []
    key = {'melee': 'melee', 'ranged': 'ranged', 'magic': 'magic', 'summon': 'summon'}[cls]
    for h in hits:
        if h.get(key): return h
    return hits[0] if hits else None

# ---------------- ENEMIES ----------------
# project ENT_DEF name -> canonical wiki name (primary or variant)
ENEMY_ALIAS = {
    "Hopping Jack": "Hoppin' Jack",
    "Armored Zombie": "Zombie",                 # vanilla HM zombie keeps classic zombie stats
    "Devourer": "Devourer(Devourer Head)",
    "Wyvern": "Wyvern(Wyvern Head)",
    "Armored Bones": "Blue Armored Bones",
    "Pigron": "Pigron(Corruption Pigron)",
    "Bone Serpent": "Bone Serpent(Bone Serpent Head)",
    "Frost Zombie": "Frozen Zombie",
    "Spore Zombie": "Spore Zombie(Mushroom Zombie)",
    "Goblin": "Goblin Peon",
    "Digger": "Digger(Digger Head)",
    "Dune Splicer": "Dune Splicer(Dune Splicer Head)",
    "Giant Worm": "Giant Worm(Giant Worm Head)",
    "Blood Eel": "Blood Eel(Blood Eel Head)",
    "Crawltipede": "Crawltipede(Solar Crawltipede Head)",
    "Diabolist": "Diabolist(Red Diabolist)",
    "Windy Balloon Slime": "Windy Balloon",
}
# project-specific composites with no canonical counterpart -> leave untouched
ENEMY_SKIP = {"Pink Slime", "Nebula Blaze", "Vile Flyer", "Dungeon Scorpion",
              "Celestial Pillar", "Pirate Shark", "Wall Warrior", "Martian Grunt",
              "Marble Golem"}

# ---------------- BOSSES (makeBoss calls) ----------------
BOSS_STATS = {
    'kingslime': (2000, 40, 10),
    'eyeofcthulhu': (2800, 15, 12),
    'brainofcthulhu': (1250, 30, 14),
    'queenbee': (3400, 30, 8),
    'skeletron': (4400, 32, 10),
    'wallofflesh': (8000, 30, 12),
    'retinazer': (20000, 45, 10),
    'spazmatism': (23000, 50, 10),
    'skelprime': (28000, 47, 24),
    'queenslime': (18000, 60, 26),
    'plantera': (30000, 50, 36),
    'golem': (25000, 64, 20),
    'duke': (60000, 100, 50),
    'empress': (70000, 80, 50),
    'cultist': (32000, 50, 42),
    'moonlord': (145000, 50, 50),
    'deerclops': (7000, 20, 10),
    'mourningwood': (14000, 120, 34),
    'pumpking': (26000, 50, 40),
    'everscream': (13000, 110, 38),
    'santank': (18000, 120, 56),
    'icequeen': (34000, 120, 38),
    'mothron': (6000, 80, 30),
    'darkmage': (800, 40, 18),          # OOA T1 (via oldonesarmy boss table)
    'ogre': (5000, 70, 34),             # T2 values; T3 override below
    'betsy': (50000, 80, 38),
    'lunar': (20000, 0, 20),            # pillars: HP under shield
}

report = {'enemies_applied': 0, 'enemies_skipped': [], 'enemies_missing': [],
          'weapons_applied': 0, 'weapons_missing': [], 'bosses_applied': 0}

# ---------- entities.js ----------
src = open('js/entities.js').read()
def fix_ent(m):
    body = m.group(2)
    nm = re.search(r"name:'((?:[^'\\]|\\.)*)'", body)
    if not nm: return m.group(0)
    name = nm.group(1).replace("\\'", "'")
    if name in ENEMY_SKIP:
        report['enemies_skipped'].append(name)
        return m.group(0)
    cname = ENEMY_ALIAS.get(name, name)
    row = ent(cname) or entp(cname)
    if not row:
        report['enemies_missing'].append(name)
        return m.group(0)
    hp, dmg, df = row['pre']
    if hp is None or dmg is None:
        report['enemies_skipped'].append(name)
        return m.group(0)
    changed = m.group(0)
    if df is not None:
        changed = re.sub(r'\bdef:\d+', f'def:{df}', changed, count=1)
    changed = re.sub(r'\bdmg:\d+', f'dmg:{dmg}', changed, count=1)
    changed = re.sub(r'\bhp:\d+', f'hp:{hp}', changed, count=1)
    if changed != m.group(0): report['enemies_applied'] += 1
    return changed
src = re.sub(r"(\[E\.[A-Z_0-9]+\]:)\s*\{(.*?)\}\s*[\n,]", fix_ent, src, flags=re.S)
open('js/entities.js', 'w').write(src)

# ---------- items.js ----------
src = open('js/items.js').read()
WEAPON_ALIAS = {
    "Copper Sword": "Copper Broadsword", "Tin Sword": "Tin Broadsword",
    "Silver Sword": "Silver Broadsword", "Lead Sword": "Lead Broadsword",
    "Gold Sword": "Gold Broadsword", "Tungsten Sword": "Tungsten Broadsword",
    "Platinum Sword": "Platinum Broadsword", "Demonite Sword": "Light's Bane",
    "The Kraken": "Kraken",

}
YOYO_REACH = {"The Eye of Cthulhu": 12, "Hel-Fire": 12, "Yelets": 13, "Kraken": 14, "Amarok": 14, "Gradient": 15, "Terrarian": 16}

def fix_weapon(m):
    iid, body = m.group(1), m.group(2)
    nm = re.search(r"name:'((?:[^'\\]|\\.)*)'", body)
    typ = re.search(r"type:'([^']+)'", body)
    if not (nm and typ): return m.group(0)
    name = nm.group(1).replace("\\'", "'")
    cls = typ.group(1)
    if cls not in ('melee', 'ranged', 'magic', 'summon'): return m.group(0)
    cname = WEAPON_ALIAS.get(name, name)
    h = weapon(cname, cls)
    if not h or h.get('damage') is None or h.get('damage') <= 0:
        report['weapons_missing'].append(f'{name} ({cls})')
        return m.group(0)
    changed = body
    # damage, use-time (speed = useAnimation/60), knockback, mana
    anim = h.get('useAnimation') or h.get('useTime')
    changed = re.sub(r'(?<![a-zA-Z])dmg:\d+', f'dmg:{h["damage"]}', changed, count=1)
    if anim:
        changed = re.sub(r'\bspeed:[0-9.]+', f'speed:{round(anim / 60, 3)}', changed, count=1)
    kb = h.get('knockBack')
    if kb is not None:
        changed = re.sub(r'\bkb:[0-9.]+', f'kb:{kb}', changed, count=1)
    mana = h.get('mana', 0)
    if mana: changed = re.sub(r'\bmana:\d+', f'mana:{mana}', changed, count=1)
    vel = h.get('shootSpeed')
    if vel and 'proj:' in changed:
        if 'projSpeed:' in changed:
            changed = re.sub(r'projSpeed:[0-9.]+', f'projSpeed:{vel}', changed, count=1)
        else:
            changed = changed.rstrip() + f', projSpeed:{vel}'
    # melee reach: vanilla broadswords ~4 tiles, shortswords 2.5; yoyos/flails/spears use their modes
    if cls == 'melee' and 'meleeMode:' not in changed:
        if 'Shortsword' in name: r = 2.5
        elif name in YOYO_REACH: r = YOYO_REACH[name]
        else: r = 4
        if 'range:' in changed:
            changed = re.sub(r'\brange:[0-9.]+', f'range:{r}', changed, count=1)
        else:
            changed = changed + f', range:{r}'
    if changed != body: report['weapons_applied'] += 1
    return f"defItem(I.{iid}, {{{changed}}});"
src = re.sub(r"defItem\(I\.([A-Z_0-9]+),\s*\{(.*?)\}\);", fix_weapon, src, flags=re.S)
open('js/items.js', 'w').write(src)

# ---------- bosses.js ----------
src = open('js/bosses.js').read()
def fix_boss(m):
    bid, body = m.group(1), m.group(2)
    if bid not in BOSS_STATS: return m.group(0)
    hp, dmg, df = BOSS_STATS[bid]
    changed = re.sub(r'\bdmg:\d+', f'dmg:{dmg}', body, count=1)
    changed = re.sub(r'\bdef:\d+', f'def:{df}', changed, count=1)
    if bid not in ('destroyer', 'eaterofworlds'):
        # plain hp only when not composed from consts
        if 'hp:headHp' not in changed:
            changed = re.sub(r'\bhp:\d+', f'hp:{hp}', changed, count=1)
        if re.search(r'maxHp:\\d', changed) and 'maxHp:headHp' not in changed:
            changed = re.sub(r'\bmaxHp:\d+', f'maxHp:{hp}', changed, count=1)
    if changed != body: report['bosses_applied'] += 1
    return f"makeBoss(game, {{ boss:'{bid}',{changed}}});"
src = re.sub(r"makeBoss\(game,\s*\{\s*boss:'([a-z]+)',(.*?)\}\);", fix_boss, src, flags=re.S)

# Destroyer: vanilla total 80000 shared pool -> head + 62 segs
src = src.replace("var segCount = 62, segHp = 650, headHp = 6200;",
                  "var segCount = 62, segHp = 500, headHp = 49000;")
src = src.replace("hp:headHp + segCount * segHp, maxHp:headHp + segCount * segHp, dmg:75, def:12",
                  "hp:headHp + segCount * segHp, maxHp:headHp + segCount * segHp, dmg:70, def:0")
# Destroyer probes: 200/50/20
src = src.replace("hp: 320, maxHp: 320, dmg: 28, def: 4, dead: false, flash: 0,\n        timer: 1.0 + Math.random(), color: '#ff6d6d', name: 'Probe'",
                  "hp: 200, maxHp: 200, dmg: 50, def: 20, dead: false, flash: 0,\n        timer: 1.0 + Math.random(), color: '#ff6d6d', name: 'Probe'")
# Eater of Worlds: 20 segs x 150 + head 1500 = vanilla 4500 total; head dmg 22, def 2
src = src.replace("var segCount = 18, segHp = 300, headHp = 1800;",
                  "var segCount = 20, segHp = 150, headHp = 1500;")
src = src.replace("hp:headHp + segCount * segHp, maxHp:headHp + segCount * segHp, dmg:35, def:10",
                  "hp:headHp + segCount * segHp, maxHp:headHp + segCount * segHp, dmg:22, def:2")
# Skeletron hands 600/20/14
src = re.sub(r"\{ boss:'skeletron', armType:'hand', parent:e, x:e\.x - 60, y:e\.y \+ 40, w:26, h:26, hp:1200, maxHp:1200, def:6,",
             "{ boss:'skeletron', armType:'hand', parent:e, x:e.x - 60, y:e.y + 40, w:26, h:26, hp:600, maxHp:600, dmg:20, def:14,", src)
src = re.sub(r"\{ boss:'skeletron', armType:'hand', parent:e, x:e\.x \+ 60, y:e\.y \+ 40, w:26, h:26, hp:1200, maxHp:1200, def:6,",
             "{ boss:'skeletron', armType:'hand', parent:e, x:e.x + 60, y:e.y + 40, w:26, h:26, hp:600, maxHp:600, dmg:20, def:14,", src)
# Skeletron Prime arms 9000 hp, def 30
src = src.replace("hp: 2100, maxHp: 2100, dmg: t === 'saw' ? 65 : 45, def: 4,",
                  "hp: 9000, maxHp: 9000, dmg: t === 'saw' ? 67 : 55, def: 30,")
open('js/bosses.js', 'w').write(src)

# ---------- oldonesarmy.js (Etherian roster + boss tiers) ----------
src = open('js/oldonesarmy.js').read()
OOA_MAP = {
    'Etherian Goblin': entp('Etherian Goblin', 'T2'),
    'Etherian Goblin Bomber': entp('Etherian Goblin Bomber', 'T2'),
    'Etherian Javelin Thrower': entp('Etherian Javelin Thrower', 'T2'),
    'Etherian Kobold': entp('Kobold', 'T2') or entp('Etherian Kobold', 'T2'),
    'Etherian Kobold Glider': entp('Kobold Glider', 'T2'),
    'Etherian Wither Beast': entp('Wither Beast', 'T2'),
    'Etherian Drakin': entp('Drakin', 'T2'),
    'Etherian Wyvern': entp('Etherian Wyvern', 'T3'),
    "Old One's Skeleton": entp("Old One's Skeleton", 'T2'),
    'Etherian Lightning Bug': entp('Lightning Bug', 'T3'),
}
for key, row in OOA_MAP.items():
    if not row: continue
    hp, dmg, df = row['pre']
    pat = re.compile(r"(ENT_DEF\[E\.[A-Z_0-9]+\] = \{[^}]*name:'" + re.escape(key) + r"'[^}]*?)\bhp:\d+")
    src = pat.sub(lambda m: m.group(1) + f'hp:{hp}', src)
    pat2 = re.compile(r"(ENT_DEF\[E\.[A-Z_0-9]+\] = \{[^}]*name:'" + re.escape(key) + r"'[^}]*?)\bdmg:\d+")
    src = pat2.sub(lambda m: m.group(1) + f'dmg:{dmg}', src)
    pat3 = re.compile(r"(ENT_DEF\[E\.[A-Z_0-9]+\] = \{[^}]*name:'" + re.escape(key) + r"'[^}]*?)\bdef:\d+")
    src = pat3.sub(lambda m: m.group(1) + f'def:{df}', src)
# OOA boss tiers: darkmage 800/40/18, ogre 5000/70/34 (T2) / 13000/90/40 (T3), betsy 50000/80/38
src = src.replace("darkmage:{ name:'Dark Mage', w:42, h:48, hp:5000, dmg:42, def:12,",
                  "darkmage:{ name:'Dark Mage', w:42, h:48, hp:800, dmg:40, def:18,")
open('js/oldonesarmy.js', 'w').write(src)

json.dump(report, open('tools/canonical/report.json', 'w'), indent=1)
print('enemies applied:', report['enemies_applied'])
print('enemies missing:', report['enemies_missing'])
print('enemies skipped:', report['enemies_skipped'])
print('weapons applied:', report['weapons_applied'])
print('weapons missing:', report['weapons_missing'])
print('bosses applied:', report['bosses_applied'])
