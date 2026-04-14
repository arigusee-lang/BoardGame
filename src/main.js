import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const BOARD_WIDTH = 10;
const BOARD_LENGTH = 18;
const WIDTH_LABELS = 'ABCDEFGHIJ'.split('');
const TURN_DRAW_COUNT = 5;
const MAX_ENERGY = 30;
const STARTING_SUPPLY = 300;
const BASE_MAX_HIT_POINTS = 50;
const TILE_SIZE = 2.6;
const UNIT_MODEL_SCALE = 2;
const BUILDING_UPGRADE_SUPPLY_COST = 100;
const DAMAGE_TYPES = {
  ATTACK: 'ATTACK',
  SYSTEM: 'SYSTEM'
};
const ATTACK_TYPES = {
  NORMAL: 'NORMAL',
  EMP: 'EMP'
};
const SUPPLY_HARVEST_SQUARES = new Set(['A9', 'A10', 'J9', 'J10']);
const PURPLE_SQUARES = new Set(['E9', 'E10', 'F9', 'F10']);
const SUPPLY_HARVEST_REWARD = 20;
const COMPANY_NAMES = [
  'Coca Cola',
  'Mitsubishi',
  'Toyota',
  'Samsung',
  'Sony',
  'Siemens',
  'Boeing',
  'Intel',
  'Nokia',
  'Shell',
  'PepsiCo',
  'Nestle'
];
const BUILD_CARD_LIBRARY = {
  ARMORY: {
    id: 'ARMORY',
    cardName: 'The Armory',
    supplyCost: 100,
    buildingType: 'ARMORY'
  },
  REPLICATOR: {
    id: 'REPLICATOR',
    cardName: 'The Replicator',
    supplyCost: 100,
    buildingType: 'REPLICATOR'
  },
  WORKSHOP: {
    id: 'WORKSHOP',
    cardName: 'The Workshop',
    supplyCost: 100,
    buildingType: 'WORKSHOP'
  },
  DATACENTER: {
    id: 'DATACENTER',
    cardName: 'Datacenter',
    supplyCost: 65,
    buildingType: 'DATACENTER'
  },
  GEAR_STATION: {
    id: 'GEAR_STATION',
    cardName: 'Gear Station',
    supplyCost: 65,
    buildingType: 'GEAR_STATION'
  },
  ASSEMBLY_LINE: {
    id: 'ASSEMBLY_LINE',
    cardName: 'Assembly Line',
    supplyCost: 65,
    buildingType: 'ASSEMBLY_LINE'
  },
  FOUNDATION: {
    id: 'FOUNDATION',
    cardName: 'Foundation',
    supplyCost: 20,
    buildingType: 'FOUNDATION'
  }
};

const CARD_LIBRARY = {
  HARVEST_DATA: {
    id: 'HARVEST_DATA',
    cardName: 'Harvest Data',
    cardType: 'perk_absorb',
    cardCategory: 'Ability',
    energyCost: 5
  },
  SYSTEM_SHOCK: {
    id: 'SYSTEM_SHOCK',
    cardName: 'System Shock',
    cardType: 'perk_system_shock',
    cardCategory: 'Perk',
    energyCost: 5
  },
  SHIELDING: {
    id: 'SHIELDING',
    cardName: 'Shielding',
    cardType: 'perk_shielding',
    cardCategory: 'Perk',
    energyCost: 10
  },
  SHIMMERING_CLOAK: {
    id: 'SHIMMERING_CLOAK',
    cardName: 'Shimmering Cloak',
    cardType: 'perk_shimmering_cloak',
    cardCategory: 'Perk',
    energyCost: 5
  },
  CREATE_GHOSTBLADE: {
    id: 'CREATE_GHOSTBLADE',
    cardName: 'Ghostblade',
    cardType: 'unit_summon',
    cardCategory: 'Drone',
    energyCost: 25,
    summonUnitId: 'GHOSTBLADE_UNIT'
  },
  PAWN_DRONE: {
    id: 'PAWN_DRONE',
    cardName: 'Pawn Drone',
    cardType: 'unit_summon',
    cardCategory: 'Drone',
    energyCost: 10,
    summonUnitId: 'PAWN_DRONE_UNIT'
  },
  TANK_DRONE: {
    id: 'TANK_DRONE',
    cardName: 'Tank Drone',
    cardType: 'unit_summon',
    cardCategory: 'Drone',
    energyCost: 15,
    summonUnitId: 'TANK_DRONE_UNIT'
  },
  SUPPORT_DRONE: {
    id: 'SUPPORT_DRONE',
    cardName: 'Support Drone',
    cardType: 'unit_summon',
    cardCategory: 'Drone',
    energyCost: 15,
    summonUnitId: 'SUPPORT_DRONE_UNIT'
  },
  ARTILLERY: {
    id: 'ARTILLERY',
    cardName: 'Artillery',
    cardType: 'unit_summon',
    cardCategory: 'Drone',
    energyCost: 25,
    summonUnitId: 'ARTILLERY_UNIT'
  },
  SPECIALIST: {
    id: 'SPECIALIST',
    cardName: 'Specialist',
    cardType: 'unit_summon',
    cardCategory: 'Drone',
    energyCost: 20,
    summonUnitId: 'SPECIALIST_UNIT'
  }
};

const UNIT_LIBRARY = {
  PAWN_DRONE_UNIT: {
    unitName: 'Pawn Drone',
    maxHitPoints: 8,
    attackDamage: 4,
    attackRange: 3,
    moveRange: 3
  },
  TANK_DRONE_UNIT: {
    unitName: 'Tank Drone',
    maxHitPoints: 20,
    attackDamage: 3,
    attackRange: 1,
    moveRange: 2
  },
  SUPPORT_DRONE_UNIT: {
    unitName: 'Support Drone',
    maxHitPoints: 10,
    attackDamage: 2,
    attackRange: 2,
    moveRange: 4
  },
  GHOSTBLADE_UNIT: {
    unitName: 'Ghostblade',
    maxHitPoints: 14,
    attackDamage: 8,
    attackRange: 1,
    moveRange: 4
  },
  ARTILLERY_UNIT: {
    unitName: 'Artillery',
    maxHitPoints: 13,
    attackDamage: 7,
    attackRange: 6,
    moveRange: 1
  },
  SPECIALIST_UNIT: {
    unitName: 'Specialist',
    maxHitPoints: 7,
    attackDamage: 2,
    attackRange: 4,
    moveRange: 3
  }
};

const BUILDING_PERK_DRAFT_POOL = {
  ARMORY: ['FACE_EATER', 'TOUGH', 'GROUNDED', 'BULWARK', 'BEACON', 'ATAKK'],
  REPLICATOR: ['TRUE_P', 'JOLTING', 'SHOTGUNS', 'ENERGIZE', 'KNIGHT', 'STEADY'],
  WORKSHOP: ['OPERATOR', 'SPD', 'MECHA', 'PROVIDER', 'ENGINEER', 'SMART'],
  DATACENTER: ['SNIPER', 'SCHOLAR', 'SALVO', 'VIRUS'],
  GEAR_STATION: ['RAGE', 'SHELL', 'TANGO'],
  ASSEMBLY_LINE: ['GAUSS', 'DRONES', 'BALLISTIC']
};

const DRONE_STATUS_LIBRARY = {
  TOUGH: {
    id: 'TOUGH',
    statusName: 'Tough',
    iconGlyph: '&#128737;&#65039;&#10084;&#65039;',
    iconSymbol: '\u{1F6E1}\uFE0F',
    description: 'Adds 3 HP',
    effects: {
      maxHitPointsBonus: 3
    }
  },
  GROUNDED: {
    id: 'GROUNDED',
    statusName: 'Grounded',
    iconGlyph: '&#129521;',
    iconSymbol: 'рџ§±',
    description: 'Receive -1 DMG per attack while Planted',
    effects: {
      plantedDamageReduction: 1
    }
  },
  BULWARK: {
    id: 'BULWARK',
    statusName: 'Bulwark',
    iconGlyph: '&#128737;&#65039;',
    iconSymbol: '\u{1F6E1}\uFE0F',
    description: 'Core Magnet offers 100% frontal resistance at 3 Squares.',
    effects: {
      bulwarkCoreMagnet: true
    }
  },
  BEACON: {
    id: 'BEACON',
    statusName: 'Beacon',
    iconGlyph: '&#128678;',
    iconSymbol: '\u{1F6A6}',
    description: 'No CD for Core Magnet. Can use or Cancel at any time.',
    effects: {
      beaconCoreMagnet: true
    }
  },
  ATAKK: {
    id: 'ATAKK',
    statusName: 'Atakk',
    iconGlyph: '&#128299;',
    iconSymbol: '\u{1F52B}',
    description: 'Gains +2 MOV when at full HP',
    effects: {
      moveBonusAtFullHp: 2
    }
  },
  FACE_EATER: {
    id: 'FACE_EATER',
    statusName: 'Face-Eater',
    iconGlyph: '&#128121;',
    iconSymbol: 'рџ‘№',
    description: '+4 Attack. Tank Drone attacks have 2-turn cooldown',
    effects: {
      attackDamageBonus: 4
    }
  },
  TRUE_P: {
    id: 'TRUE_P',
    statusName: 'True P',
    iconGlyph: '&#128165;',
    iconSymbol: '\u{1F4A5}',
    description: 'Explode for 5 DMG on death',
    effects: {
      onDeathExplosionDamage: 5,
      onDeathExplosionRadiusSquares: 6,
      onDeathHitsAdjacentDrones: true,
      onDeathHitsEnemyBase: true,
      onDeathHitsOwnBase: false
    }
  },
  JOLTING: {
    id: 'JOLTING',
    statusName: 'Jolting',
    iconGlyph: '&#9889;',
    iconSymbol: 'вљЎ',
    description: 'Tactical Dash CD is 1 Turn',
    effects: {
      tacticalDashCooldownTurns: 1
    }
  },
  SHOTGUNS: {
    id: 'SHOTGUNS',
    statusName: 'Shotguns?',
    iconGlyph: '&#129492;&#128684;',
    iconSymbol: '\u{1F9D4}',
    description: '+2ATT, but -1 Range',
    effects: {
      attackDamageBonus: 2,
      attackRangeDelta: -1
    }
  },
  ENERGIZE: {
    id: 'ENERGIZE',
    statusName: 'Energize',
    iconGlyph: '&#128268;',
    iconSymbol: '\u26A1',
    description: 'Deal 1 System DMG per attack. Any bonus DMG deal as System DMG',
    effects: {
      systemDamagePerAttack: 1,
      convertAttackBonusesToSystemDamage: true
    }
  },
  KNIGHT: {
    id: 'KNIGHT',
    statusName: 'Knight',
    iconGlyph: '&#129689;',
    iconSymbol: '\u{1FA96}',
    description: 'Double any Shield gained',
    effects: {
      doubleShieldGained: true
    }
  },
  STEADY: {
    id: 'STEADY',
    statusName: 'Steady',
    iconGlyph: '&#127919;',
    iconSymbol: '\u{1F3AF}',
    description: "Gain 1 Range, if didn't move this turn",
    effects: {
      rangeBonusIfDidNotMove: 1
    }
  },
  PROVIDER: {
    id: 'PROVIDER',
    statusName: 'Provider',
    iconGlyph: '&#9935;',
    iconSymbol: '\u26CF',
    description: 'Add +3 Supply per Harvest',
    effects: {
      flatSupplyBonusOnDroneGain: 3
    }
  },
  ENGINEER: {
    id: 'ENGINEER',
    statusName: 'Engineer',
    iconGlyph: '&#128679;',
    iconSymbol: '\u{1F477}',
    description: "Repair permanently increases Target's ATT by 1",
    effects: {
      repairAddsPermanentAttackToTarget: 1
    }
  },
  SMART: {
    id: 'SMART',
    statusName: 'Smart',
    iconGlyph: '&#128161;',
    iconSymbol: '\u{1F4A1}',
    description: 'No Energy cost for Repair',
    effects: {
      repairEnergyCostOverride: 0
    }
  },
  OPERATOR: {
    id: 'OPERATOR',
    statusName: 'Operator',
    iconGlyph: '&#128269;',
    iconSymbol: '\u{1F50D}',
    description: '+2 to Range, but -2 Movement',
    effects: {
      attackRangeDelta: 2,
      moveRangeBonus: -2
    }
  },
  SPD: {
    id: 'SPD',
    statusName: 'Spd',
    iconGlyph: '&#128760;',
    iconSymbol: '\u{1F6DE}\uFE0F',
    description: 'Add +1 MOV',
    effects: {
      moveRangeBonus: 1
    }
  },
  MECHA: {
    id: 'MECHA',
    statusName: 'Mecha',
    iconGlyph: '&#128295;',
    iconSymbol: '\u{1F527}',
    description: '+2 Hit Points on any Repair for Target and this Drone',
    effects: {
      repairBonusToTarget: 2,
      repairBonusToSelf: 2
    }
  },
  SNIPER: {
    id: 'SNIPER',
    statusName: 'Sniper',
    iconGlyph: '&#128299;',
    iconSymbol: '\u{1F52B}',
    description: 'Add +6 ATT, but EMP CD is +3 turns',
    effects: {
      attackDamageBonus: 6,
      specialistEmpCooldownBonus: 3
    }
  },
  SCHOLAR: {
    id: 'SCHOLAR',
    statusName: 'Scholar',
    iconGlyph: '&#128214;',
    iconSymbol: '\u{1F4D6}',
    description: 'Copy Repair from Support Drone, including all Upgrades',
    effects: {
      grantsSpecialistRepair: true
    }
  },
  SALVO: {
    id: 'SALVO',
    statusName: 'Salvo',
    iconGlyph: '&#128163;&#128163;',
    iconSymbol: '\u{1F4A3}',
    description: "Can use two EMP per turn, but can't get Shield",
    effects: {
      specialistEmpExtraUsePerTurn: 1,
      cannotGainShield: true
    }
  },
  VIRUS: {
    id: 'VIRUS',
    statusName: 'Virus',
    iconGlyph: '&#128027;&#65038;',
    iconSymbol: '\u{1F41B}\uFE0E',
    description: "On hit, deduct target's ATT for next turn, equal to Specialist's ATT",
    effects: {
      specialistVirusOnHit: true
    }
  },
  RAGE: {
    id: 'RAGE',
    statusName: 'Rage',
    iconGlyph: '&#128545;',
    iconSymbol: '\u{1F621}',
    description: 'Can Attack after moving, if not at full health',
    effects: {
      ghostbladeCanAttackAfterMoveWhenDamaged: true
    }
  },
  SHELL: {
    id: 'SHELL',
    statusName: 'Shell',
    iconGlyph: '&#128034;',
    iconSymbol: '\u{1F422}\uFE0E',
    description: 'Resist 75% Damage dealt at any first attack during the turn.',
    effects: {
      shellFirstHitAttackResistance: 0.75
    }
  },
  TANGO: {
    id: 'TANGO',
    statusName: 'Tango',
    iconGlyph: '&#9876;&#65039;',
    iconSymbol: '\u2694\uFE0F',
    description: 'Attack first enemy Drone to move in range',
    effects: {
      ghostbladeReactiveAttackOnEnemyMove: true
    }
  },
  GAUSS: {
    id: 'GAUSS',
    statusName: 'Gauss',
    iconGlyph: '&#9473;',
    iconSymbol: '\u2501',
    description: 'Shoot a straight beam at 5 squares',
    effects: {
      artilleryGaussLineAttack: true
    }
  },
  DRONES: {
    id: 'DRONES',
    statusName: 'Drones',
    iconGlyph: '&#128641;',
    iconSymbol: '\u{1F681}',
    description: 'Recon Drones increase Artillery range by 1, but -2DMG per Square',
    effects: {
      attackRangeDelta: 1,
      attackDamageBonus: -2
    }
  },
  BALLISTIC: {
    id: 'BALLISTIC',
    statusName: 'Ballistic',
    iconGlyph: '&#128640;',
    iconSymbol: '\u{1F680}',
    description: 'Deals 16 Base DMG at 1 Square or 10 DMG to Drone',
    effects: {
      artilleryBallisticAttackMode: true
    }
  }
};

const BASE_SQUARES = {
  A: new Set(['E1', 'F1', 'E2', 'F2']),
  B: new Set(['E17', 'F17', 'E18', 'F18'])
};
const BASE_ARTILLERY_FRONT_SQUARES = {
  A: new Set(['E2', 'F2']),
  B: new Set(['E17', 'F17'])
};

const BASE_COLORS = {
  A: 0x2f72ff,
  B: 0xd73a49
};

const UNIT_COLORS = {
  A: 0x7aa4ff,
  B: 0xff7e86
};

let unitIdCounter = 1;

const state = {
  currentPlayerId: 'A',
  winner: null,
  mode: 'idle',
  hoverSquareKey: null,
  selectedCardHandIndex: null,
  selectedUnitId: null,
  coreMagnetPreviewUnitId: null,
  coreMagnetBulwarkTargetSquareKey: null,
  repairTargetingCasterId: null,
  overloadTargetingBuildingId: null,
  systemShockCasterId: null,
  ghostbladeTeleportCasterId: null,
  specialistEmpCasterId: null,
  pendingSystemShockLevel: null,
  pendingSystemShockSourceSlot: null,
  pendingShieldingLevel: null,
  pendingShieldingSourceSlot: null,
  pendingShimmeringLevel: null,
  pendingShimmeringSourceSlot: null,
  pendingShimmeringSquares: [],
  placingBuildingType: null,
  pendingArmorySquareKey: null,
  pendingArmoryStatusId: null,
  pendingArmoryDraftStatusIds: [],
  pendingReplicatorSquareKey: null,
  pendingReplicatorStatusId: null,
  pendingWorkshopSquareKey: null,
  pendingWorkshopStatusId: null,
  pendingDatacenterSquareKey: null,
  pendingDatacenterStatusId: null,
  pendingGearStationSquareKey: null,
  pendingGearStationStatusId: null,
  pendingAssemblyLineSquareKey: null,
  pendingAssemblyLineStatusId: null,
  pendingUpgradeBuildingId: null,
  pendingUpgradeStatusId: null,
  pendingUpgradeStatusOptions: [],
  pendingFoundationTargetBuildingId: null,
  players: {
    A: createPlayer('A'),
    B: createPlayer('B')
  },
  units: [],
  shimmeringCloaks: []
};

const app = document.querySelector('#app');
app.innerHTML = `
  <div class="game-shell">
    <div class="top-bar">
      <div class="status" id="turnStatus"></div>
      <button id="endTurnBtn" class="end-turn">End Turn (Space)</button>
    </div>

    <div class="center-flash" id="centerFlash"></div>

    <div class="board-wrap">
      <div id="board3d"></div>
      <div class="axis axis-top" id="axisTop"></div>
      <div class="axis axis-left" id="axisLeft"></div>
      <div class="process-echo-panel left" id="processEchoLeft">
        <div class="process-echo-title">Process Echo</div>
        <div class="process-echo-buttons">
          <button class="process-echo-btn" type="button">X</button>
          <button class="process-echo-btn" type="button">1</button>
          <button class="process-echo-btn" type="button">2</button>
          <button class="process-echo-btn" type="button">3</button>
        </div>
      </div>
      <div class="process-echo-panel right" id="processEchoRight">
        <div class="process-echo-title">Process Echo</div>
        <div class="process-echo-buttons">
          <button class="process-echo-btn" type="button">X</button>
          <button class="process-echo-btn" type="button">1</button>
          <button class="process-echo-btn" type="button">2</button>
          <button class="process-echo-btn" type="button">3</button>
        </div>
      </div>
      <div class="drone-stats-side left" id="droneStatsLeft"></div>
      <div class="drone-stats-side right" id="droneStatsRight"></div>
    </div>

    <div class="bottom-ui">
      <div class="pile pile-a" id="pileA"></div>
      <div class="hand" id="hand"></div>
      <div class="pile pile-b" id="pileB"></div>
    </div>

    <div class="log" id="log"></div>
  </div>
`;

const boardEl = document.getElementById('board3d');
const handEl = document.getElementById('hand');
const pileAEl = document.getElementById('pileA');
const pileBEl = document.getElementById('pileB');
const turnStatusEl = document.getElementById('turnStatus');
const logEl = document.getElementById('log');
const axisTopEl = document.getElementById('axisTop');
const axisLeftEl = document.getElementById('axisLeft');
const endTurnBtn = document.getElementById('endTurnBtn');
const droneStatsLeftEl = document.getElementById('droneStatsLeft');
const droneStatsRightEl = document.getElementById('droneStatsRight');
const centerFlashEl = document.getElementById('centerFlash');
const overlayEl = document.createElement('div');
overlayEl.id = 'overlayRoot';
app.appendChild(overlayEl);

let camera;
let scene;
let renderer;
let controls;
let raycaster;
let mouse;
const pressedKeys = new Set();

const clock = new THREE.Clock();
const activeEffects = [];

const boardGroup = new THREE.Group();
const effectsGroup = new THREE.Group();
const squareMeshesByKey = new Map();
const clickableMeshes = [];
const unitVisualsById = new Map();
const buildingVisualsById = new Map();
const baseMeshesByPlayer = new Map();
const movementAnimations = new Map();
let moveRangeBorderLines = null;
const unitStatusBadgeTextureCache = new Map();
const healPlusTexture = createHealPlusTexture();
const coinTexture = createCoinTexture();
const bulwarkShieldTexture = createHexShieldTexture();

initAxisLabels();
initThree();
initBoard();
startGame();

function createPlayer(playerId) {
  return {
    id: playerId,
    baseHitPoints: BASE_MAX_HIT_POINTS,
    baseMaxHitPoints: BASE_MAX_HIT_POINTS,
    baseDestroyed: false,
    maxEnergy: MAX_ENERGY,
    energy: MAX_ENERGY,
    supply: STARTING_SUPPLY,
    deck: createStarterDeck(),
    hand: [],
    discard: [],
    processEcho: createEmptyProcessEcho(),
    processEchoPlayedThisTurn: false,
    buildings: [],
    openingHandDrawn: false,
    buildingsPlayedThisTurn: 0
  };
}

function createStarterDeck() {
  const deck = [
    { cardId: CARD_LIBRARY.PAWN_DRONE.id, producedAt: 'Base' },
    { cardId: CARD_LIBRARY.PAWN_DRONE.id, producedAt: 'Base' },
    { cardId: CARD_LIBRARY.SUPPORT_DRONE.id, producedAt: 'Base' },
    { cardId: CARD_LIBRARY.SUPPORT_DRONE.id, producedAt: 'Base' },
    { cardId: CARD_LIBRARY.TANK_DRONE.id, producedAt: 'Base' },
    { cardId: CARD_LIBRARY.TANK_DRONE.id, producedAt: 'Base' },
    { cardId: CARD_LIBRARY.HARVEST_DATA.id, producedAt: 'Base' },
    { cardId: CARD_LIBRARY.SHIELDING.id, producedAt: 'Base' },
    { cardId: CARD_LIBRARY.SYSTEM_SHOCK.id, producedAt: 'Base' },
    { cardId: CARD_LIBRARY.SHIMMERING_CLOAK.id, producedAt: 'Base' },
  ];
  return shuffle(deck);
}

function createEmptyProcessEcho() {
  return {
    X: null,
    1: null,
    2: null,
    3: null
  };
}

function initAxisLabels() {
  axisTopEl.innerHTML = WIDTH_LABELS.map((label) => `<span>${label}</span>`).join('');
  axisLeftEl.innerHTML = Array.from({ length: BOARD_LENGTH }, (_, i) => `<span>${i + 1}</span>`).join('');
}

function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x10161d);

  camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.set(0, 42, 38);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  boardEl.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = true;
  controls.zoomSpeed = 1.1;
  controls.minDistance = 16;
  controls.maxDistance = 120;
  controls.enableDamping = true;
  controls.target.set(0, 0, 0);
  controls.mouseButtons.LEFT = THREE.MOUSE.NONE;
  controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
  controls.mouseButtons.MIDDLE = THREE.MOUSE.NONE;

  const ambient = new THREE.AmbientLight(0xffffff, 0.62);
  scene.add(ambient);

  const directional = new THREE.DirectionalLight(0xffffff, 0.95);
  directional.position.set(8, 20, 10);
  directional.castShadow = true;
  scene.add(directional);

  scene.add(boardGroup);
  scene.add(effectsGroup);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  renderer.domElement.addEventListener('contextmenu', (event) => event.preventDefault());
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  window.addEventListener('resize', onResize);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  endTurnBtn.addEventListener('click', endTurn);

  onResize();
  renderer.setAnimationLoop(animate);
}

function initBoard() {
  const squareGeometry = new THREE.BoxGeometry(TILE_SIZE * 0.95, 0.14, TILE_SIZE * 0.95);
  const basePlateGeometry = new THREE.BoxGeometry(TILE_SIZE * 0.95, 0.2, TILE_SIZE * 0.95);

  for (let z = 0; z < BOARD_LENGTH; z += 1) {
    for (let x = 0; x < BOARD_WIDTH; x += 1) {
      const squareKey = toSquareKey(x, z);
      const owner = getBaseOwnerAtSquare(squareKey);
      const isDark = (x + z) % 2 === 0;
      const isHarvestSquare = SUPPLY_HARVEST_SQUARES.has(squareKey);
      const isPurpleSquare = PURPLE_SQUARES.has(squareKey);
      const squareMaterial = new THREE.MeshStandardMaterial({
        color: owner
          ? owner === 'A'
            ? 0x294889
            : 0x7a2730
          : isPurpleSquare
            ? isDark
              ? 0x5a2f8a
              : 0x6d3fa8
          : isHarvestSquare
            ? isDark
              ? 0xa48012
              : 0xbe9719
            : isDark
              ? 0x22303e
              : 0x2c3d4f,
        roughness: 0.85,
        metalness: 0.05
      });

      const squareMesh = new THREE.Mesh(squareGeometry, squareMaterial);
      squareMesh.receiveShadow = true;
      squareMesh.position.copy(gridToWorld(x, z));
      squareMesh.userData = {
        type: 'square',
        x,
        z,
        squareKey,
        isDark,
        isHarvestSquare,
        isPurpleSquare,
        isBaseSquare: Boolean(owner),
        owner: owner ?? null
      };

      boardGroup.add(squareMesh);
      squareMeshesByKey.set(squareKey, squareMesh);
      clickableMeshes.push(squareMesh);

      if (owner) {
        const basePlate = new THREE.Mesh(
          basePlateGeometry,
          new THREE.MeshStandardMaterial({
            color: BASE_COLORS[owner],
            roughness: 0.7,
            metalness: 0.15
          })
        );
        basePlate.position.copy(gridToWorld(x, z));
        basePlate.position.y = 0.19;
        basePlate.userData = {
          type: 'base',
          owner,
          x,
          z,
          squareKey
        };
        basePlate.castShadow = true;
        basePlate.receiveShadow = true;
        boardGroup.add(basePlate);
        clickableMeshes.push(basePlate);

        if (!baseMeshesByPlayer.has(owner)) {
          baseMeshesByPlayer.set(owner, []);
        }
        baseMeshesByPlayer.get(owner).push(basePlate);
      }
    }
  }
}

function startGame() {
  addLog('Dev mode started. Right mouse button rotates camera. Left mouse button selects cards/units/targets.');
  startTurn('A');
}

function startTurn(playerId) {
  if (state.winner) {
    return;
  }

  state.currentPlayerId = playerId;
  state.mode = 'idle';
  state.hoverSquareKey = null;
  state.selectedCardHandIndex = null;
  state.selectedUnitId = null;
  state.coreMagnetPreviewUnitId = null;
  state.coreMagnetBulwarkTargetSquareKey = null;
  state.repairTargetingCasterId = null;
  state.overloadTargetingBuildingId = null;
  state.systemShockCasterId = null;
  state.ghostbladeTeleportCasterId = null;
  state.specialistEmpCasterId = null;
  state.pendingSystemShockLevel = null;
  state.pendingSystemShockSourceSlot = null;
  state.pendingShieldingLevel = null;
  state.pendingShieldingSourceSlot = null;
  state.pendingShimmeringLevel = null;
  state.pendingShimmeringSourceSlot = null;
  state.pendingShimmeringSquares = [];
  state.placingBuildingType = null;
  state.pendingArmorySquareKey = null;
  state.pendingArmoryStatusId = null;
  state.pendingArmoryDraftStatusIds = [];
  state.pendingReplicatorSquareKey = null;
  state.pendingReplicatorStatusId = null;
  state.pendingWorkshopSquareKey = null;
  state.pendingWorkshopStatusId = null;
  state.pendingDatacenterSquareKey = null;
  state.pendingDatacenterStatusId = null;
  state.pendingGearStationSquareKey = null;
  state.pendingGearStationStatusId = null;
  state.pendingAssemblyLineSquareKey = null;
  state.pendingAssemblyLineStatusId = null;
  state.pendingUpgradeBuildingId = null;
  state.pendingUpgradeStatusId = null;
  state.pendingUpgradeStatusOptions = [];
  state.pendingFoundationTargetBuildingId = null;

  const player = state.players[playerId];
  const playerMaxEnergy = refreshPlayerMaxEnergy(playerId, true);
  player.turnCounter = (player.turnCounter ?? 0) + 1;
  player.processEchoPlayedThisTurn = false;
  tickShimmeringCloaksForPlayer(playerId);
  player.energy = playerMaxEnergy;
  player.buildingsPlayedThisTurn = 0;
  for (const building of player.buildings) {
    if (building.createTankDroneCooldown > 0) {
      building.createTankDroneCooldown -= 1;
    }
    if (building.createPawnDroneCooldown > 0) {
      building.createPawnDroneCooldown -= 1;
    }
    if (building.createSupportDroneCooldown > 0) {
      building.createSupportDroneCooldown -= 1;
    }
    if (building.createSpecialistCooldown > 0) {
      building.createSpecialistCooldown -= 1;
    }
    if (building.createGhostbladeCooldown > 0) {
      building.createGhostbladeCooldown -= 1;
    }
    if (building.createArtilleryCooldown > 0) {
      building.createArtilleryCooldown -= 1;
    }
    building.obtainUsedThisTurn = false;
    building.overloadUsedThisTurn = false;
  }
  if (!player.openingHandDrawn) {
    drawOpeningHand(player);
    player.openingHandDrawn = true;
  } else {
    drawCards(player, TURN_DRAW_COUNT);
  }

  state.units
    .filter((unit) => unit.owner === playerId)
    .forEach((unit) => {
      if ((unit.virusDebuffPendingTurns ?? 0) > 0) {
        unit.virusDebuffPendingTurns -= 1;
        unit.virusDebuffActiveTurns = 1;
        unit.virusAttackPenaltyActive = Math.max(unit.virusAttackPenaltyActive ?? 0, unit.virusAttackPenaltyPending ?? 0);
        unit.virusAttackPenaltyPending = 0;
      }
      if (unit.empStunPendingTurns > 0) {
        unit.empStunnedTurns = Math.max(unit.empStunnedTurns ?? 0, unit.empStunPendingTurns);
        unit.empStunPendingTurns = 0;
      }
      if (
        unit.unitTypeId === 'GHOSTBLADE_UNIT' &&
        unitHasStatus(unit, DRONE_STATUS_LIBRARY.SHELL.id) &&
        !unit.shellGuardActive
      ) {
        unit.shellGuardActive = true;
      }
      if (unit.unitTypeId === 'GHOSTBLADE_UNIT' && unitHasStatus(unit, DRONE_STATUS_LIBRARY.TANGO.id)) {
        unit.tangoGuardActive = false;
      }
      unit.hasMoved = false;
      unit.hasAttacked = false;
      unit.movementUsedThisTurn = 0;
      unit.tacticalDashActiveThisTurn = false;
      if (unit.coreMagnetTurnsLeft > 0 && !hasBeaconCoreMagnet(unit)) {
        unit.coreMagnetTurnsLeft -= 1;
        if (unit.coreMagnetTurnsLeft <= 0) {
          unit.coreMagnetBulwarkCenterSquareKey = null;
        }
      }
      if (unit.tacticalDashCooldown > 0) {
        unit.tacticalDashCooldown -= 1;
      }
      if (unit.coreMagnetCooldown > 0) {
        unit.coreMagnetCooldown -= 1;
      }
      if (unit.repairCooldown > 0) {
        unit.repairCooldown -= 1;
      }
      if (unit.ghostbladeTeleportCooldown > 0) {
        unit.ghostbladeTeleportCooldown -= 1;
      }
      if (unit.artillerySetUpCooldown > 0) {
        unit.artillerySetUpCooldown -= 1;
      }
      if (unit.specialistEmpCooldown > 0) {
        unit.specialistEmpCooldown -= 1;
      }
      unit.specialistEmpUsesThisTurn = 0;
      unit.specialistEmpPendingCooldown = false;
      if (unit.tankFaceEaterAttackCooldown > 0) {
        unit.tankFaceEaterAttackCooldown -= 1;
      }
      unit.artillerySetUpUsedThisTurn = false;
      unit.systemShockFollowUpReady = false;
      unit.overloadBonusMovementThisTurn = 0;
    });

  addLog(`Player ${playerId} turn begins: energy restored to ${playerMaxEnergy}, drew ${TURN_DRAW_COUNT} cards.`);
  syncBoardVisualState();
  renderUI();
}

function drawCards(player, count) {
  for (let i = 0; i < count; i += 1) {
    if (player.deck.length === 0) {
      if (player.discard.length === 0) {
        break;
      }
      player.deck = shuffle(player.discard);
      player.discard = [];
      addLog(`Player ${player.id} shuffled discard pile back into deck.`);
    }

    const card = player.deck.pop();
    player.hand.push(card);
  }
}

function drawOpeningHand(player) {
  drawCards(player, TURN_DRAW_COUNT);
}

function advanceProcessEcho(player) {
  const echo = player.processEcho;
  if (!echo) {
    player.processEcho = createEmptyProcessEcho();
    return;
  }
  let movedAny = false;
  if (!echo[3] && echo[2]) {
    echo[3] = echo[2];
    echo[2] = null;
    movedAny = true;
  }
  if (!echo[2] && echo[1]) {
    echo[2] = echo[1];
    echo[1] = null;
    movedAny = true;
  }
  if (!echo[1] && echo.X) {
    echo[1] = echo.X;
    echo.X = null;
    movedAny = true;
  }
  if (movedAny) {
    addLog(`Player ${player.id} Process Echo advanced.`);
  }
}

function applyProcessEchoPlayResult(player, playedSlot) {
  const echo = player.processEcho ?? createEmptyProcessEcho();
  player.processEcho = echo;
  const playedCard = echo[playedSlot];
  if (!playedCard) {
    return;
  }

  echo[playedSlot] = null;
  const playedLevel = Number.parseInt(playedSlot, 10);
  for (let slot = playedLevel - 1; slot >= 1; slot -= 1) {
    const fromKey = String(slot);
    const toKey = String(slot + 1);
    if (echo[fromKey]) {
      echo[toKey] = echo[fromKey];
      echo[fromKey] = null;
    }
  }
  if (echo.X) {
    echo['1'] = echo.X;
    echo.X = null;
  }

  if (echo.X) {
    player.discard.push(echo.X);
  }
  echo.X = playedCard;
  player.processEchoPlayedThisTurn = true;
}

function endTurn() {
  if (state.winner) {
    return;
  }

  const currentPlayer = getCurrentPlayer();
  advanceProcessEcho(currentPlayer);
  state.units
    .filter((unit) => unit.owner === currentPlayer.id)
    .forEach((unit) => {
      if (unit.unitTypeId === 'GHOSTBLADE_UNIT' && unitHasStatus(unit, DRONE_STATUS_LIBRARY.TANGO.id)) {
        unit.tangoGuardActive = true;
      }
      if ((unit.empStunnedTurns ?? 0) > 0) {
        unit.empStunnedTurns -= 1;
      }
      if ((unit.virusDebuffActiveTurns ?? 0) > 0) {
        unit.virusDebuffActiveTurns -= 1;
        if (unit.virusDebuffActiveTurns <= 0) {
          unit.virusAttackPenaltyActive = 0;
        }
      }
      if (
        unit.unitTypeId === 'SPECIALIST_UNIT' &&
        unitHasStatus(unit, DRONE_STATUS_LIBRARY.SALVO.id) &&
        unit.specialistEmpPendingCooldown &&
        unit.specialistEmpCooldown <= 0
      ) {
        unit.specialistEmpCooldown = getSpecialistEmpCooldownTurns(unit);
        unit.specialistEmpPendingCooldown = false;
      }
    });
  processSupplyHarvest(currentPlayer);
  if (currentPlayer.hand.length > 0) {
    currentPlayer.discard.push(...currentPlayer.hand);
    addLog(`Player ${currentPlayer.id} discarded ${currentPlayer.hand.length} unused card(s).`);
    currentPlayer.hand = [];
  }

  const nextPlayer = state.currentPlayerId === 'A' ? 'B' : 'A';
  state.mode = 'idle';
  state.hoverSquareKey = null;
  state.selectedCardHandIndex = null;
  state.selectedUnitId = null;
  state.coreMagnetPreviewUnitId = null;
  state.coreMagnetBulwarkTargetSquareKey = null;
  state.repairTargetingCasterId = null;
  state.overloadTargetingBuildingId = null;
  state.systemShockCasterId = null;
  state.ghostbladeTeleportCasterId = null;
  state.specialistEmpCasterId = null;
  state.pendingSystemShockLevel = null;
  state.pendingSystemShockSourceSlot = null;
  state.pendingShieldingLevel = null;
  state.pendingShieldingSourceSlot = null;
  state.pendingShimmeringLevel = null;
  state.pendingShimmeringSourceSlot = null;
  state.pendingShimmeringSquares = [];
  state.placingBuildingType = null;
  state.pendingArmorySquareKey = null;
  state.pendingArmoryStatusId = null;
  state.pendingArmoryDraftStatusIds = [];
  state.pendingReplicatorSquareKey = null;
  state.pendingReplicatorStatusId = null;
  state.pendingWorkshopSquareKey = null;
  state.pendingWorkshopStatusId = null;
  startTurn(nextPlayer);
}

function processSupplyHarvest(player) {
  const harvestingUnits = state.units.filter((unit) => {
    if (unit.owner !== player.id) {
      return false;
    }
    const squareKey = toSquareKey(unit.x, unit.z);
    return SUPPLY_HARVEST_SQUARES.has(squareKey);
  });

  if (harvestingUnits.length === 0) {
    return;
  }

  let gainedSupply = 0;
  for (const unit of harvestingUnits) {
    gainedSupply += awardSupplyFromDrone(player, unit, SUPPLY_HARVEST_REWARD, 'harvest');
    playSupplyHarvestCoins(unit.id);
  }
  if (gainedSupply <= 0) {
    return;
  }
  flashSupplyHarvested();
  addLog(
    `Player ${player.id} harvested ${gainedSupply} Supply from ${harvestingUnits.length} drone(s) on yellow squares.`
  );
}

function summonUnit(owner, squareKey, unitTypeId, cardBonuses = null) {
  const template = UNIT_LIBRARY[unitTypeId];
  if (!template) {
    addLog('Cannot summon unknown unit type.');
    return;
  }
  const square = fromSquareKey(squareKey);
  const hpBonus = cardBonuses?.hpBonus ?? 0;
  const attackBonus = cardBonuses?.attackBonus ?? 0;
  const grantedStatusIds = cardBonuses?.grantedStatusIds ?? [];
  const moveBonusFromAdjacency = cardBonuses?.moveBonus ?? 0;
  const grantedStatusInstances = grantedStatusIds
    .map((statusId) => createStatusInstance(statusId))
    .filter(Boolean);
  let grantedHpBonus = 0;
  let grantedAttackBonus = 0;
  let grantedRangeDelta = 0;
  let grantedMoveBonus = 0;
  for (const statusId of grantedStatusIds) {
    const effects = DRONE_STATUS_LIBRARY[statusId]?.effects;
    grantedHpBonus += effects?.maxHitPointsBonus ?? 0;
    grantedAttackBonus += effects?.attackDamageBonus ?? 0;
    grantedRangeDelta += effects?.attackRangeDelta ?? 0;
    grantedMoveBonus += effects?.moveRangeBonus ?? 0;
  }
  const maxHitPoints = Math.max(1, template.maxHitPoints + hpBonus + grantedHpBonus);
  const computedAttackDamage = Math.max(0, template.attackDamage + attackBonus + grantedAttackBonus);
  const hasEnergizePawn = unitTypeId === 'PAWN_DRONE_UNIT' && grantedStatusIds.includes(DRONE_STATUS_LIBRARY.ENERGIZE.id);
  const systemDamagePerAttackBonus = hasEnergizePawn
    ? (DRONE_STATUS_LIBRARY.ENERGIZE.effects.systemDamagePerAttack ?? 1) + Math.max(0, computedAttackDamage - template.attackDamage)
    : 0;
  const attackDamage = hasEnergizePawn ? template.attackDamage : computedAttackDamage;
  const isMeleeLocked = template.attackRange === 1;
  const attackRange = isMeleeLocked ? 1 : Math.max(1, template.attackRange + grantedRangeDelta);
  const moveRange = Math.max(0, template.moveRange + grantedMoveBonus + moveBonusFromAdjacency);
  const adjacencyStatuses = cardBonuses?.statuses ?? [];
  const hasShellStatus = unitTypeId === 'GHOSTBLADE_UNIT' && grantedStatusIds.includes(DRONE_STATUS_LIBRARY.SHELL.id);

  state.units.push({
    id: `u${unitIdCounter++}`,
    owner,
    unitName: template.unitName,
    unitTypeId,
    hitPoints: maxHitPoints,
    maxHitPoints,
    shieldHitPoints: 0,
    attackDamage,
    baseAttackDamage: template.attackDamage,
    additionalSystemDamagePerAttack: systemDamagePerAttackBonus,
    attackRange,
    moveRange,
    movementUsedThisTurn: 0,
    overloadBonusMovementThisTurn: 0,
    tacticalDashCooldown: 0,
    tacticalDashActiveThisTurn: false,
    coreMagnetCooldown: 0,
    coreMagnetTurnsLeft: 0,
    coreMagnetBulwarkCenterSquareKey: null,
    coreMagnetLastHealTurnTag: null,
    repairCooldown: 0,
    ghostbladeTeleportCooldown: 0,
    specialistEmpCooldown: 0,
    specialistEmpUsesThisTurn: 0,
    specialistEmpPendingCooldown: false,
    virusAttackPenaltyPending: 0,
    virusAttackPenaltyActive: 0,
    virusDebuffPendingTurns: 0,
    virusDebuffActiveTurns: 0,
    shellGuardActive: hasShellStatus,
    tangoGuardActive: false,
    empStunnedTurns: 0,
    empStunPendingTurns: 0,
    artillerySetUpActive: false,
    artillerySetUpCooldown: 0,
    artillerySetUpUsedThisTurn: false,
    tankFaceEaterAttackCooldown: 0,
    augmentedAttackBonus: 0,
    systemShockAbilityLevel: 0,
    systemShockFollowUpReady: false,
    canAttackAfterMove: unitTypeId !== 'GHOSTBLADE_UNIT',
    isMeleeLocked,
    damageType: DAMAGE_TYPES.ATTACK,
    x: square.x,
    z: square.z,
    hasMoved: false,
    hasAttacked: false,
    adjacencyStatuses,
    passiveStatuses: grantedStatusInstances,
    grantedStatusIds
  });

  addLog(`Player ${owner} summoned ${template.unitName} on ${squareKey}.`);
  syncBoardVisualState();
}

function applyUnitAttack(attacker, targetUnit, options = {}) {
  normalizeEnergizeSystemDamage(attacker);
  const damageType = options.damageType ?? DAMAGE_TYPES.ATTACK;
  const attackType = options.attackType ?? ATTACK_TYPES.NORMAL;
  const bypassDefenses = damageType === DAMAGE_TYPES.SYSTEM;
  let resolvedTarget = targetUnit;
  if (!options.skipCoreMagnetRedirect && !bypassDefenses) {
    const interception = getCoreMagnetInterception(attacker, targetUnit.x, targetUnit.z);
    if (interception?.type === 'block') {
      const impactSquare = fromSquareKey(interception.impactSquareKey);
      const impactPos = gridToWorld(impactSquare.x, impactSquare.z);
      impactPos.y = 0.85;
      playRifleShot(attacker.id, impactPos);
      playExplosionAt(impactPos, { particleCount: 10, duration: 0.45, speedMin: 0.8, speedMax: 1.6 });
      attacker.hasAttacked = true;
      addLog('Bulwark Core Magnet shield blocked the shot.');
      return;
    }
    if (interception?.type === 'redirect' && interception.unit.id !== targetUnit.id) {
      resolvedTarget = interception.unit;
      addLog(`Core Magnet redirected the shot to ${interception.unit.unitName}.`);
    }
  }

  const targetPos = getUnitWorldPosition(resolvedTarget.id);
  if (!options.skipAttackVisual) {
    playRifleShot(attacker.id, targetPos);
  }
  playHitEffect(resolvedTarget.id);

  let damage = options.damageAmount ?? getUnitCurrentAttackDamage(attacker);
  if (
    !bypassDefenses &&
    isUnitPlanted(resolvedTarget) &&
    resolvedTarget.grantedStatusIds?.includes(DRONE_STATUS_LIBRARY.GROUNDED.id)
  ) {
    damage = Math.max(0, damage - 1);
  }
  if (attackType !== ATTACK_TYPES.EMP) {
    const shellGuardOutcome = applyGhostbladeShellGuard(resolvedTarget, damage, damageType);
    damage = shellGuardOutcome.damage;
    if (shellGuardOutcome.consumed) {
      if (shellGuardOutcome.reduced) {
        addLog(`${resolvedTarget.unitName} Shell reduced incoming Attack damage by 75%.`);
      } else {
        addLog(`${resolvedTarget.unitName} Shell guard was consumed.`);
      }
    }
  }

  let damageToHealth = damage;
  if (attackType === ATTACK_TYPES.EMP) {
    damageToHealth = 0;
    const dispelledShield = removeUnitShield(resolvedTarget);
    if (dispelledShield > 0) {
      damageToHealth += dispelledShield;
      addLog(`${resolvedTarget.unitName} lost ${dispelledShield} Shield from EMP.`);
    }
    const cloakRemoved = removeShimmeringCloakFromSquare(toSquareKey(resolvedTarget.x, resolvedTarget.z));
    if (cloakRemoved > 0) {
      addLog(`EMP removed Shimmering Cloak from ${toSquareKey(resolvedTarget.x, resolvedTarget.z)}.`);
    }
    const hadActiveChanneling = hasActiveChannelingAbility(resolvedTarget);
    if (hadActiveChanneling) {
      breakCoreMagnetChannel(resolvedTarget, 'EMP');
      resolvedTarget.empStunnedTurns = Math.max(resolvedTarget.empStunnedTurns ?? 0, 1);
      resolvedTarget.empStunPendingTurns = 0;
      addLog(`${resolvedTarget.unitName} became Dazzled and cannot move or attack for 1 turn.`);
    }
  } else if (!bypassDefenses) {
    const shieldBefore = resolvedTarget.shieldHitPoints ?? 0;
    if (shieldBefore > 0 && damageToHealth > 0) {
      const absorbed = Math.min(shieldBefore, damageToHealth);
      resolvedTarget.shieldHitPoints = shieldBefore - absorbed;
      damageToHealth -= absorbed;
      addLog(`${resolvedTarget.unitName} absorbed ${absorbed} damage with Shield.`);
    }
  }

  if (attackType === ATTACK_TYPES.EMP) {
    const shellGuardOutcome = applyGhostbladeShellGuard(resolvedTarget, damageToHealth, damageType);
    damageToHealth = shellGuardOutcome.damage;
    if (shellGuardOutcome.consumed) {
      addLog(`${resolvedTarget.unitName} Shell guard was consumed.`);
    }
  }

  resolvedTarget.hitPoints -= damageToHealth;
  if (options.hasBreakProperty) {
    breakCoreMagnetChannel(resolvedTarget, 'BREAK');
  }
  attacker.hasAttacked = true;
  addLog(
    `${attacker.owner} ${attacker.unitName} hit enemy ${resolvedTarget.unitName} for ${Math.max(0, damageToHealth)} (${damageType}${attackType !== ATTACK_TYPES.NORMAL ? `, ${attackType}` : ''}).`
  );

  if (
    attackType === ATTACK_TYPES.NORMAL &&
    attacker.unitTypeId === 'SPECIALIST_UNIT' &&
    unitHasStatus(attacker, DRONE_STATUS_LIBRARY.VIRUS.id) &&
    resolvedTarget.owner !== attacker.owner &&
    resolvedTarget.hitPoints > 0
  ) {
    const penalty = Math.max(0, getUnitCurrentAttackDamage(attacker));
    if (penalty > 0) {
      resolvedTarget.virusAttackPenaltyPending = Math.max(resolvedTarget.virusAttackPenaltyPending ?? 0, penalty);
      resolvedTarget.virusDebuffPendingTurns = Math.max(resolvedTarget.virusDebuffPendingTurns ?? 0, 1);
      addLog(`${resolvedTarget.unitName} was infected with Virus: -${penalty} ATT on its next turn.`);
    }
  }

  if (
    hasEnergizeStatus(attacker) &&
    attackType === ATTACK_TYPES.NORMAL &&
    !options.skipEnergizeBonusSystemDamage &&
    resolvedTarget.hitPoints > 0
  ) {
    const bonusSystemDamage = Math.max(0, attacker.additionalSystemDamagePerAttack ?? 0);
    if (bonusSystemDamage > 0) {
      resolvedTarget.hitPoints -= bonusSystemDamage;
      addLog(`${attacker.unitName} Energize dealt ${bonusSystemDamage} bonus System damage.`);
    }
  }

  if (resolvedTarget.hitPoints <= 0) {
    if (attacker.owner === state.currentPlayerId && attacker.owner !== resolvedTarget.owner) {
      const defeatedEnergy = getEnergyCostForUnitType(resolvedTarget.unitTypeId);
      const baseKillSupply = Math.floor(defeatedEnergy * 0.5);
      if (baseKillSupply > 0) {
        const ownerPlayer = state.players[attacker.owner];
        const gained = awardSupplyFromDrone(ownerPlayer, attacker, baseKillSupply, 'kill');
        addLog(
          `Player ${attacker.owner} gained ${gained} Supply for destroying ${resolvedTarget.unitName} (base ${baseKillSupply}).`
        );
      }
    }
    addLog(`${resolvedTarget.unitName} of Player ${resolvedTarget.owner} was destroyed.`);
    playExplosionAt(targetPos);
    removeUnit(resolvedTarget.id);
  }
}

function applyBaseAttack(attacker, targetPlayerId, targetSquareKey, damageType = DAMAGE_TYPES.ATTACK, damageAmount = null) {
  const bypassDefenses = damageType === DAMAGE_TYPES.SYSTEM;
  const targetSquare = fromSquareKey(targetSquareKey);
  if (!bypassDefenses) {
    const interception = getCoreMagnetInterception(attacker, targetSquare.x, targetSquare.z);
    if (interception?.type === 'block') {
      const impactSquare = fromSquareKey(interception.impactSquareKey);
      const impactPos = gridToWorld(impactSquare.x, impactSquare.z);
      impactPos.y = 0.85;
      playRifleShot(attacker.id, impactPos);
      playExplosionAt(impactPos, { particleCount: 10, duration: 0.45, speedMin: 0.8, speedMax: 1.6 });
      attacker.hasAttacked = true;
      addLog('Bulwark Core Magnet shield blocked the shot.');
      return;
    }
    if (interception?.type === 'redirect') {
      addLog('Core Magnet redirected the shot away from the base.');
      applyUnitAttack(attacker, interception.unit, {
        skipCoreMagnetRedirect: true,
        damageType
      });
      return;
    }
  }

  const baseOwner = state.players[targetPlayerId];
  const damage = Math.max(0, damageAmount ?? getUnitCurrentAttackDamage(attacker));
  const appliedDamage = damageType === DAMAGE_TYPES.SYSTEM ? 0 : damage;
  if (damageType === DAMAGE_TYPES.SYSTEM) {
    addLog(`System Damage does not affect Player ${targetPlayerId} base.`);
  }
  baseOwner.baseHitPoints = Math.max(0, baseOwner.baseHitPoints - appliedDamage);
  attacker.hasAttacked = true;

  const basePos = gridToWorld(targetSquare.x, targetSquare.z);
  basePos.y = 0.3;
  playRifleShot(attacker.id, basePos);
  playExplosionAt(basePos, { particleCount: 16, duration: 0.62, speedMin: 1.3, speedMax: 2.6 });

  addLog(`${attacker.owner} ${attacker.unitName} hit Player ${targetPlayerId} base for ${appliedDamage} (${damageType}).`);

  if (baseOwner.baseHitPoints <= 0) {
    destroyBase(targetPlayerId);
    state.winner = attacker.owner;
    addLog(`Player ${attacker.owner} wins by destroying Player ${targetPlayerId} base.`);
  }
}

function getCoreMagnetInterception(attacker, targetX, targetZ) {
  const shotPath = getSquaresAlongLine(attacker.x, attacker.z, targetX, targetZ);
  const candidates = state.units.filter(
    (unit) =>
      unit.owner !== attacker.owner &&
      unit.unitTypeId === 'TANK_DRONE_UNIT' &&
      unit.coreMagnetTurnsLeft > 0 &&
      unit.hitPoints > 0
  );

  let best = null;
  for (const candidate of candidates) {
    const coveredSquares = getCoreMagnetCoverageSquareKeys(candidate);
    let firstHitIndex = -1;
    for (let i = 1; i < shotPath.length; i += 1) {
      if (coveredSquares.has(shotPath[i])) {
        firstHitIndex = i;
        break;
      }
    }
    if (firstHitIndex < 0) {
      continue;
    }
    const interceptionType = unitHasStatus(candidate, DRONE_STATUS_LIBRARY.BULWARK.id) ? 'block' : 'redirect';
    const score = firstHitIndex;
    if (
      !best ||
      score < best.score ||
      (score === best.score &&
        interceptionType === 'redirect' &&
        best.type === 'redirect' &&
        getDistance(attacker.x, attacker.z, candidate.x, candidate.z) <
          getDistance(attacker.x, attacker.z, best.unit.x, best.unit.z))
    ) {
      best = {
        type: interceptionType,
        unit: candidate,
        impactSquareKey: shotPath[firstHitIndex],
        score
      };
    }
  }

  return best;
}

function getCoreMagnetCoverageSquareKeys(unit) {
  if (
    unit.unitTypeId === 'TANK_DRONE_UNIT' &&
    unitHasStatus(unit, DRONE_STATUS_LIBRARY.BULWARK.id) &&
    unit.coreMagnetBulwarkCenterSquareKey
  ) {
    return getBulwarkCoverageSquareKeys(unit, unit.coreMagnetBulwarkCenterSquareKey);
  }
  const keys = new Set();
  for (let dx = -1; dx <= 1; dx += 1) {
    for (let dz = -1; dz <= 1; dz += 1) {
      const x = unit.x + dx;
      const z = unit.z + dz;
      if (isInsideBoard(x, z)) {
        keys.add(toSquareKey(x, z));
      }
    }
  }
  return keys;
}

function getBulwarkAdjacentSquareKeys(unit) {
  const keys = [];
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];
  for (const [dx, dz] of directions) {
    const x = unit.x + dx;
    const z = unit.z + dz;
    if (isInsideBoard(x, z)) {
      keys.push(toSquareKey(x, z));
    }
  }
  return keys;
}

function getBulwarkCoverageSquareKeys(unit, centerSquareKey) {
  const center = fromSquareKey(centerSquareKey);
  const dx = center.x - unit.x;
  const dz = center.z - unit.z;
  if (Math.abs(dx) + Math.abs(dz) !== 1) {
    return new Set();
  }

  const keys = new Set([centerSquareKey]);
  const leftX = center.x - dz;
  const leftZ = center.z + dx;
  const rightX = center.x + dz;
  const rightZ = center.z - dx;
  if (isInsideBoard(leftX, leftZ)) {
    keys.add(toSquareKey(leftX, leftZ));
  }
  if (isInsideBoard(rightX, rightZ)) {
    keys.add(toSquareKey(rightX, rightZ));
  }
  return keys;
}

function getSquaresAlongLine(x0, z0, x1, z1) {
  const squares = [];
  let x = x0;
  let z = z0;
  const dx = Math.abs(x1 - x0);
  const dz = Math.abs(z1 - z0);
  const sx = x0 < x1 ? 1 : -1;
  const sz = z0 < z1 ? 1 : -1;
  let err = dx - dz;

  while (true) {
    squares.push(toSquareKey(x, z));
    if (x === x1 && z === z1) {
      break;
    }
    const e2 = 2 * err;
    if (e2 > -dz) {
      err -= dz;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      z += sz;
    }
  }

  return squares;
}

function removeUnit(unitId) {
  state.units = state.units.filter((unit) => unit.id !== unitId);
  movementAnimations.delete(unitId);
  if (state.selectedUnitId === unitId) {
    state.selectedUnitId = null;
  }
  if (state.coreMagnetPreviewUnitId === unitId) {
    state.coreMagnetPreviewUnitId = null;
  }
  if (state.repairTargetingCasterId === unitId) {
    state.repairTargetingCasterId = null;
  }
  if (state.systemShockCasterId === unitId) {
    state.systemShockCasterId = null;
  }
  if (state.ghostbladeTeleportCasterId === unitId) {
    state.ghostbladeTeleportCasterId = null;
  }
  if (state.specialistEmpCasterId === unitId) {
    state.specialistEmpCasterId = null;
  }
}

function destroyBase(playerId) {
  const player = state.players[playerId];
  if (player.baseDestroyed) {
    return;
  }

  player.baseDestroyed = true;

  const baseMeshes = baseMeshesByPlayer.get(playerId) ?? [];
  for (const mesh of baseMeshes) {
    boardGroup.remove(mesh);
    const idx = clickableMeshes.indexOf(mesh);
    if (idx >= 0) {
      clickableMeshes.splice(idx, 1);
    }
  }
  baseMeshesByPlayer.set(playerId, []);

  for (const squareKey of BASE_SQUARES[playerId]) {
    const squareMesh = squareMeshesByKey.get(squareKey);
    if (!squareMesh) {
      continue;
    }
    squareMesh.userData.isBaseSquare = false;
    squareMesh.userData.owner = null;
  }

  player.buildings = [];
  refreshAdjacencyBonusesForPlayerCards(playerId);
  refreshPlayerMaxEnergy(playerId, true);
  for (const [buildingId, visual] of buildingVisualsById.entries()) {
    if (visual.owner !== playerId) {
      continue;
    }
    boardGroup.remove(visual.root);
    buildingVisualsById.delete(buildingId);
  }

  addLog(`Player ${playerId} base was destroyed and removed from the field.`);
}

function onPointerDown(event) {
  if (event.button !== 0 || state.winner) {
    return;
  }

  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersections = raycaster.intersectObjects(clickableMeshes, false);
  if (intersections.length === 0) {
    if (state.mode === 'attack_targeting') {
      addLog('Select an enemy unit or enemy base within attack range.');
      return;
    }
    if (
      state.mode === 'armory_status_pick' ||
      state.mode === 'replicator_status_pick' ||
      state.mode === 'workshop_status_pick' ||
      state.mode === 'datacenter_status_pick' ||
      state.mode === 'gear_station_status_pick' ||
      state.mode === 'assembly_line_status_pick' ||
      state.mode === 'building_upgrade_status_pick' ||
      state.mode === 'foundation_confirm'
    ) {
      return;
    }
    if (state.mode === 'harvest_absorb') {
      addLog('Select a Drone card in hand to Absorb, or click Harvest Data again to cancel.');
      return;
    }
    if (state.mode === 'system_shock_card') {
      addLog('Select an eligible enemy drone to cast System Shock Level 1, or click Process Echo X to store it.');
      return;
    }
    if (state.mode === 'shielding_card') {
      addLog('Select your drone to apply Shielding Level 1, or click Process Echo X to store Shielding.');
      return;
    }
    if (state.mode === 'shimmering_card') {
      addLog('Select a board square for Shimmering Cloak, or click Process Echo X to store it.');
      return;
    }
    if (state.mode === 'system_shock_targeting_echo') {
      addLog('Select an eligible enemy drone to cast System Shock from Process Echo.');
      return;
    }
    if (state.mode === 'shielding_equip_instant' || state.mode === 'shielding_equip_echo') {
      addLog('Select one of your drones to apply Shielding.');
      return;
    }
    if (state.mode === 'shimmering_targeting_instant' || state.mode === 'shimmering_targeting_echo') {
      addLog('Select a square for Shimmering Cloak.');
      return;
    }
    if (state.mode === 'ghostblade_teleport_targeting') {
      addLog('Select an empty square to teleport Ghostblade.');
      return;
    }
    if (state.mode === 'artillery_attack_targeting') {
      const artillery = getSelectedUnit();
      if (artillery && hasBallisticStatus(artillery)) {
        addLog('Select an enemy Drone or vulnerable enemy base square for Ballistic strike.');
      } else if (artillery && unitHasStatus(artillery, DRONE_STATUS_LIBRARY.GAUSS.id)) {
        addLog('Select an adjacent direction square (or its highlighted line) for Gauss strike.');
      } else {
        addLog('Select a 2x2 area for Artillery strike.');
      }
      return;
    }
    if (state.mode === 'specialist_emp_targeting') {
      addLog('Select a 2x2 area for Specialist EMP.');
      return;
    }
    if (state.mode === 'core_magnet_bulwark_targeting') {
      addLog('Select one adjacent square to aim Bulwark Core Magnet.');
      return;
    }
    if (state.mode === 'foundation_targeting') {
      addLog('Select one of your buildings to destroy with Foundation.');
      return;
    }
    if (state.mode === 'overload_targeting') {
      addLog('Select a friendly drone target for Overload.');
      return;
    }
    clearSelection();
    renderUI();
    return;
  }

  const hit = intersections[0].object;
  const hitType = hit.userData.type;

  if (state.mode === 'system_shock_card') {
    handleSystemShockTargetClick(hit, { source: 'hand', level: 1 });
    return;
  }
  if (state.mode === 'shielding_card') {
    if (hitType !== 'unit') {
      addLog('Click your drone to apply Shielding Level 1, or click Process Echo X to store Shielding.');
      return;
    }
    state.mode = 'shielding_equip_instant';
    handleShieldingTargetClick(hit);
    return;
  }
  if (state.mode === 'shimmering_card') {
    if (hitType !== 'square' && hitType !== 'base') {
      addLog('Select a board square for Shimmering Cloak.');
      return;
    }
    state.mode = 'shimmering_targeting_instant';
    handleShimmeringSquareClick(hit);
    return;
  }

  if (state.mode === 'play_card') {
    handleCardTargetClick(hit);
    return;
  }

  if (state.mode === 'place_building') {
    handleBuildingPlacementClick(hit);
    return;
  }
  if (state.mode === 'foundation_targeting') {
    handleFoundationTargetClick(hit);
    return;
  }

  if (state.mode === 'repair_targeting') {
    handleRepairTargetClick(hit);
    return;
  }
  if (state.mode === 'overload_targeting') {
    handleOverloadTargetClick(hit);
    return;
  }

  if (state.mode === 'system_shock_targeting_echo') {
    handleSystemShockTargetClick(hit, { source: 'echo', level: state.pendingSystemShockLevel ?? 1 });
    return;
  }
  if (state.mode === 'shielding_equip_instant' || state.mode === 'shielding_equip_echo') {
    handleShieldingTargetClick(hit);
    return;
  }
  if (state.mode === 'shimmering_targeting_instant' || state.mode === 'shimmering_targeting_echo') {
    handleShimmeringSquareClick(hit);
    return;
  }
  if (state.mode === 'ghostblade_teleport_targeting') {
    handleGhostbladeTeleportTargetClick(hit);
    return;
  }
  if (state.mode === 'artillery_attack_targeting') {
    handleArtilleryAttackTargetClick(hit);
    return;
  }
  if (state.mode === 'specialist_emp_targeting') {
    handleSpecialistEmpTargetClick(hit);
    return;
  }
  if (state.mode === 'core_magnet_bulwark_targeting') {
    handleCoreMagnetBulwarkTargetClick(hit);
    return;
  }

  if (
    state.mode === 'armory_status_pick' ||
    state.mode === 'replicator_status_pick' ||
    state.mode === 'workshop_status_pick' ||
    state.mode === 'datacenter_status_pick' ||
    state.mode === 'gear_station_status_pick' ||
    state.mode === 'assembly_line_status_pick' ||
    state.mode === 'building_upgrade_status_pick' ||
    state.mode === 'foundation_confirm'
  ) {
    if (state.mode === 'foundation_confirm') {
      addLog('Confirm or cancel Foundation action in the prompt.');
    } else {
      addLog('Pick a Drone Status and confirm to build this factory.');
    }
    return;
  }

  if (state.mode === 'harvest_absorb') {
    addLog('Select a Drone card in hand to Absorb, or click Harvest Data again to cancel.');
    return;
  }

  if (hitType === 'unit') {
    handleUnitClick(hit.userData.unitId);
    return;
  }

  if (hitType === 'base') {
    handleBaseClick(hit.userData.owner, hit.userData.squareKey);
    return;
  }

  if (hitType === 'square') {
    handleSquareClick(hit.userData.squareKey);
  }
}

function onPointerMove(event) {
  if (
    state.mode !== 'artillery_attack_targeting' &&
    state.mode !== 'specialist_emp_targeting' &&
    state.mode !== 'core_magnet_bulwark_targeting' &&
    state.mode !== 'shimmering_targeting_instant' &&
    state.mode !== 'shimmering_targeting_echo'
  ) {
    return;
  }
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersections = raycaster.intersectObjects(clickableMeshes, false);
  if (intersections.length === 0) {
    if (state.hoverSquareKey) {
      state.hoverSquareKey = null;
      if (state.mode === 'core_magnet_bulwark_targeting') {
        state.coreMagnetBulwarkTargetSquareKey = null;
      }
      syncBoardVisualState();
    }
    return;
  }
  const hit = intersections[0].object;
  const key = hit.userData.squareKey ?? null;
  if (state.hoverSquareKey !== key) {
    state.hoverSquareKey = key;
    if (state.mode === 'core_magnet_bulwark_targeting') {
      const unit = state.coreMagnetPreviewUnitId ? getUnitById(state.coreMagnetPreviewUnitId) : null;
      if (unit) {
        const options = new Set(getBulwarkAdjacentSquareKeys(unit));
        state.coreMagnetBulwarkTargetSquareKey = key && options.has(key) ? key : null;
      } else {
        state.coreMagnetBulwarkTargetSquareKey = null;
      }
    }
    syncBoardVisualState();
  }
}

function handleCardTargetClick(hit) {
  const currentPlayer = getCurrentPlayer();
  const selectedCard = currentPlayer.hand[state.selectedCardHandIndex];
  if (!selectedCard) {
    clearSelection();
    renderUI();
    return;
  }

  const cardTemplate = CARD_LIBRARY[selectedCard.cardId];
  if (!cardTemplate || cardTemplate.cardType !== 'unit_summon') {
    addLog('This card does not target board squares.');
    return;
  }
  const targetSquare = hit.userData.squareKey;

  if (hit.userData.type !== 'square') {
    addLog('Select a board square to summon the unit.');
    return;
  }

  if (!getSummonSquares(currentPlayer.id).includes(targetSquare)) {
    addLog(`Invalid summon target. Unit must be summoned adjacent to Player ${currentPlayer.id} base.`);
    return;
  }

  const cardEnergyCost = getCardEnergyCost(selectedCard);
  if (currentPlayer.energy < cardEnergyCost) {
    addLog('Not enough energy to play this card.');
    return;
  }

  currentPlayer.energy -= cardEnergyCost;
  currentPlayer.hand.splice(state.selectedCardHandIndex, 1);
  currentPlayer.discard.push(selectedCard);

  summonUnit(currentPlayer.id, targetSquare, cardTemplate.summonUnitId, {
    ...(selectedCard.adjacencyBonuses ?? {}),
    grantedStatusIds: selectedCard.grantedStatusIds ?? []
  });
  clearSelection();
  renderUI();
}

function executeHarvestDataAbsorb(sourceIndex, targetIndex) {
  const currentPlayer = getCurrentPlayer();
  const sourceCard = currentPlayer.hand[sourceIndex];
  const targetCard = currentPlayer.hand[targetIndex];
  if (!sourceCard || !targetCard) {
    clearSelection();
    renderUI();
    return;
  }

  if (sourceCard.cardId !== CARD_LIBRARY.HARVEST_DATA.id) {
    clearSelection();
    renderUI();
    return;
  }

  if (sourceIndex === targetIndex) {
    addLog('Select a Drone card to Absorb.');
    return;
  }

  const sourceTemplate = CARD_LIBRARY[sourceCard.cardId];
  const absorbedTemplate = CARD_LIBRARY[targetCard.cardId];
  if (!absorbedTemplate || absorbedTemplate.cardCategory !== 'Drone') {
    addLog('Harvest Data can only Absorb Drone cards.');
    return;
  }

  if (currentPlayer.energy < sourceTemplate.energyCost) {
    addLog(`Not enough Energy to use ${sourceTemplate.cardName}.`);
    return;
  }

  currentPlayer.energy -= sourceTemplate.energyCost;
  const absorbedEnergyCost = getCardEnergyCost(targetCard);
  currentPlayer.supply += absorbedEnergyCost;
  currentPlayer.hand = currentPlayer.hand.filter((_, index) => index !== sourceIndex && index !== targetIndex);
  currentPlayer.discard.push(sourceCard);

  addLog(
    `Player ${currentPlayer.id} used Harvest Data: absorbed ${absorbedTemplate.cardName} and gained ${absorbedEnergyCost} Supply.`
  );
  clearSelection();
  renderUI();
}

function handleUnitClick(unitId) {
  const clickedUnit = getUnitById(unitId);
  if (!clickedUnit) {
    return;
  }

  const currentPlayerId = state.currentPlayerId;
  const selectedUnit = getSelectedUnit();

  if (clickedUnit.owner === currentPlayerId) {
    state.selectedUnitId = clickedUnit.id;
    state.mode = state.mode === 'attack_targeting' ? 'attack_targeting' : 'unit_selected';
    renderUI();
    return;
  }

  if (!selectedUnit || selectedUnit.owner !== currentPlayerId) {
    addLog('Select one of your units first.');
    return;
  }

  if (!canPlayerDirectlyTargetUnit(currentPlayerId, clickedUnit)) {
    addLog('This Drone is hidden by Shimmering Cloak and cannot be directly targeted by you.');
    return;
  }

  if (isUnitPlanted(selectedUnit)) {
    if (!hasBeaconCoreMagnet(selectedUnit)) {
      addLog('This Tank Drone is planted and cannot attack while channeling Core Magnet.');
      return;
    }
  }
  if (isUnitMovementStunned(selectedUnit)) {
    addLog('This Drone is Dazzled and cannot attack this turn.');
    return;
  }

  if (selectedUnit.unitTypeId === 'ARTILLERY_UNIT' && state.mode !== 'artillery_attack_targeting') {
    addLog('Artillery can attack only through Attack: Shell ability.');
    return;
  }

  if (selectedUnit.hasMoved && !canUnitAttackAfterMoving(selectedUnit)) {
    addLog('Ghostblade cannot attack after moving unless it is damaged with Rage or gets a special improvement.');
    return;
  }
  const tankFaceEaterCooldown = getTankFaceEaterAttackCooldown(selectedUnit);
  if (tankFaceEaterCooldown > 0) {
    addLog(`Face-Eater attack cooldown: ${tankFaceEaterCooldown} turn(s) remaining.`);
    return;
  }

  if (selectedUnit.hasAttacked && !consumeSystemShockFollowUp(selectedUnit, 'attack')) {
    addLog('This unit has already attacked this turn.');
    return;
  }

  const currentAttackRange = getUnitCurrentAttackRange(selectedUnit);
  const distance = getDistance(selectedUnit.x, selectedUnit.z, clickedUnit.x, clickedUnit.z);
  if (distance > currentAttackRange) {
    addLog(`Target out of attack range (${currentAttackRange}).`);
    return;
  }

  applyUnitAttack(selectedUnit, clickedUnit);
  if (selectedUnit.unitTypeId === 'TANK_DRONE_UNIT' && unitHasStatus(selectedUnit, DRONE_STATUS_LIBRARY.FACE_EATER.id)) {
    selectedUnit.tankFaceEaterAttackCooldown = 3;
  }
  if (state.mode === 'attack_targeting') {
    state.mode = 'unit_selected';
  }
  syncBoardVisualState();
  renderUI();
}

function handleBaseClick(baseOwner, squareKey) {
  const currentPlayerId = state.currentPlayerId;
  if (baseOwner === currentPlayerId) {
    addLog('That is your own base.');
    return;
  }

  const selectedUnit = getSelectedUnit();
  if (!selectedUnit || selectedUnit.owner !== currentPlayerId) {
    addLog('Select one of your units first.');
    return;
  }

  if (isUnitPlanted(selectedUnit)) {
    if (!hasBeaconCoreMagnet(selectedUnit)) {
      addLog('This Tank Drone is planted and cannot attack while channeling Core Magnet.');
      return;
    }
  }
  if (isUnitMovementStunned(selectedUnit)) {
    addLog('This Drone is Dazzled and cannot attack this turn.');
    return;
  }

  if (selectedUnit.unitTypeId === 'ARTILLERY_UNIT') {
    addLog('Artillery cannot directly target bases with Attack.');
    return;
  }

  if (selectedUnit.hasMoved && !canUnitAttackAfterMoving(selectedUnit)) {
    addLog('Ghostblade cannot attack after moving unless it is damaged with Rage or gets a special improvement.');
    return;
  }
  const tankFaceEaterCooldown = getTankFaceEaterAttackCooldown(selectedUnit);
  if (tankFaceEaterCooldown > 0) {
    addLog(`Face-Eater attack cooldown: ${tankFaceEaterCooldown} turn(s) remaining.`);
    return;
  }

  if (selectedUnit.hasAttacked && !consumeSystemShockFollowUp(selectedUnit, 'attack')) {
    addLog('This unit has already attacked this turn.');
    return;
  }

  const baseSquare = fromSquareKey(squareKey);
  const currentAttackRange = getUnitCurrentAttackRange(selectedUnit);
  const distance = getDistance(selectedUnit.x, selectedUnit.z, baseSquare.x, baseSquare.z);
  if (distance > currentAttackRange) {
    addLog(`Enemy base is out of attack range (${currentAttackRange}).`);
    return;
  }

  applyBaseAttack(selectedUnit, baseOwner, squareKey);
  if (selectedUnit.unitTypeId === 'TANK_DRONE_UNIT' && unitHasStatus(selectedUnit, DRONE_STATUS_LIBRARY.FACE_EATER.id)) {
    selectedUnit.tankFaceEaterAttackCooldown = 3;
  }
  if (state.mode === 'attack_targeting') {
    state.mode = 'unit_selected';
  }
  syncBoardVisualState();
  renderUI();
}

function handleSquareClick(squareKey) {
  if (state.mode === 'attack_targeting') {
    addLog('Select an enemy unit or enemy base within attack range.');
    return;
  }

  const selectedUnit = getSelectedUnit();
  if (!selectedUnit || selectedUnit.owner !== state.currentPlayerId) {
    clearSelection();
    renderUI();
    return;
  }

  if (isUnitMovementStunned(selectedUnit)) {
    addLog('This Drone is Dazzled and cannot move this turn.');
    return;
  }

  if (isUnitPlanted(selectedUnit)) {
    addLog('This Tank Drone is planted and cannot move while channeling Core Magnet.');
    return;
  }
  if (selectedUnit.unitTypeId === 'ARTILLERY_UNIT' && selectedUnit.artillerySetUpActive) {
    addLog('Artillery cannot move while Set Up is active.');
    return;
  }

  if (selectedUnit.hasAttacked && !selectedUnit.tacticalDashActiveThisTurn) {
    if (!consumeSystemShockFollowUp(selectedUnit, 'move')) {
      addLog('This unit cannot move after attacking without Tactical Dash.');
      return;
    }
  }

  if (isActiveBaseSquare(squareKey)) {
    addLog('Units cannot move onto base squares.');
    return;
  }

  if (!isSquareWalkable(squareKey)) {
    addLog('That square is occupied or blocked.');
    return;
  }

  const target = fromSquareKey(squareKey);
  const currentMoveRange = getUnitCurrentMoveRange(selectedUnit);
  const movementUsed = selectedUnit.movementUsedThisTurn ?? 0;
  const movementRemaining = currentMoveRange - movementUsed;
  if (movementRemaining <= 0) {
    addLog('This unit has no remaining movement this turn.');
    return;
  }

  const distance = getDistance(selectedUnit.x, selectedUnit.z, target.x, target.z);
  if (distance > movementRemaining) {
    addLog(`Target out of remaining move range (${movementRemaining}).`);
    return;
  }

  const tangoReactorAtStart = getTangoReactorForPosition(selectedUnit, selectedUnit.x, selectedUnit.z);
  if (tangoReactorAtStart) {
    triggerTangoReaction(tangoReactorAtStart, selectedUnit);
    if (!getUnitById(selectedUnit.id)) {
      syncBoardVisualState();
      renderUI();
      return;
    }
    addLog(`${selectedUnit.unitName} movement was interrupted by Tango.`);
    syncBoardVisualState();
    renderUI();
    return;
  }

  const fromX = selectedUnit.x;
  const fromZ = selectedUnit.z;
  selectedUnit.x = target.x;
  selectedUnit.z = target.z;
  selectedUnit.movementUsedThisTurn = movementUsed + distance;
  selectedUnit.hasMoved = selectedUnit.movementUsedThisTurn > 0;
  addLog(`${selectedUnit.owner} ${selectedUnit.unitName} moved to ${squareKey}.`);
  startUnitMoveAnimation(selectedUnit.id, fromX, fromZ, target.x, target.z);

  const tangoReactorAtDestination = getTangoReactorForPosition(selectedUnit, target.x, target.z);
  if (tangoReactorAtDestination) {
    triggerTangoReaction(tangoReactorAtDestination, selectedUnit);
  }

  syncBoardVisualState();
  renderUI();
}

function handleRepairTargetClick(hit) {
  const caster = getUnitById(state.repairTargetingCasterId);
  if (!caster || caster.owner !== state.currentPlayerId || !casterHasRepairAbility(caster)) {
    clearSelection();
    renderUI();
    return;
  }

  if (hit.userData.type !== 'unit') {
    addLog('Select an allied drone target for Repair.');
    return;
  }

  const target = getUnitById(hit.userData.unitId);
  if (!target) {
    return;
  }

  if (target.id === caster.id) {
    addLog('This Drone cannot target itself with Repair.');
    return;
  }

  if (target.owner !== caster.owner) {
    addLog('Repair can only target allied drones.');
    return;
  }

  if (!canPlayerDirectlyTargetUnit(state.currentPlayerId, target)) {
    addLog('This Drone is hidden by Shimmering Cloak and cannot be targeted by your abilities.');
    return;
  }

  const distance = getDistance(caster.x, caster.z, target.x, target.z);
  if (distance > caster.attackRange) {
    addLog(`Target out of Repair range (${caster.attackRange}).`);
    return;
  }

  const currentPlayer = getCurrentPlayer();
  const repairEnergyCost = unitHasStatus(caster, DRONE_STATUS_LIBRARY.SMART.id) ? 0 : 5;
  if (currentPlayer.energy < repairEnergyCost) {
    addLog('Not enough Energy to use Repair.');
    return;
  }

  if (caster.repairCooldown > 0) {
    addLog('Repair is on cooldown.');
    return;
  }

  applyRepairAbility(caster, target);
}

function getSystemShockTargetableEnemyUnits(playerId) {
  const friendlies = state.units.filter((unit) => unit.owner === playerId);
  if (friendlies.length === 0) {
    return [];
  }
  const enemies = state.units.filter((unit) => unit.owner !== playerId);
  return enemies.filter((enemy) => {
    if (!canPlayerDirectlyTargetUnit(playerId, enemy)) {
      return false;
    }
    return friendlies.some((friendly) => {
      const range = getUnitCurrentAttackRange(friendly);
      return getDistance(friendly.x, friendly.z, enemy.x, enemy.z) <= range;
    });
  });
}

function handleSystemShockTargetClick(hit, context = { source: 'hand', level: 1 }) {
  if (hit.userData.type === 'base') {
    addLog('System Shock cannot target enemy bases. Select an enemy drone.');
    return;
  }

  if (hit.userData.type !== 'unit') {
    addLog('Select an enemy drone target for System Shock.');
    return;
  }

  const target = getUnitById(hit.userData.unitId);
  if (!target) {
    return;
  }
  if (target.owner === state.currentPlayerId) {
    addLog('System Shock can only target enemy drones.');
    return;
  }
  const eligibleTargets = getSystemShockTargetableEnemyUnits(state.currentPlayerId);
  const eligibleIds = new Set(eligibleTargets.map((unit) => unit.id));
  if (!eligibleIds.has(target.id)) {
    addLog('This enemy drone is not eligible for System Shock. Keep a friendly drone within attack range of it.');
    return;
  }

  const currentPlayer = getCurrentPlayer();
  const source = context.source ?? 'hand';
  const safeLevel = Math.max(1, Math.min(3, context.level ?? 1));
  if (source === 'hand') {
    const sourceCard = currentPlayer.hand[state.selectedCardHandIndex];
    if (!sourceCard || sourceCard.cardId !== CARD_LIBRARY.SYSTEM_SHOCK.id) {
      clearSelection();
      renderUI();
      return;
    }
    if (currentPlayer.energy < CARD_LIBRARY.SYSTEM_SHOCK.energyCost) {
      addLog('Not enough Energy to use System Shock.');
      return;
    }
    currentPlayer.energy -= CARD_LIBRARY.SYSTEM_SHOCK.energyCost;
    currentPlayer.hand.splice(state.selectedCardHandIndex, 1);
    currentPlayer.discard.push(sourceCard);
  } else {
    const slot = state.pendingSystemShockSourceSlot;
    if (!slot) {
      clearSelection();
      renderUI();
      return;
    }
    const slotCard = currentPlayer.processEcho?.[slot];
    if (!slotCard || slotCard.cardId !== CARD_LIBRARY.SYSTEM_SHOCK.id) {
      addLog('That Process Echo slot is empty.');
      clearSelection();
      renderUI();
      return;
    }
    applyProcessEchoPlayResult(currentPlayer, slot);
  }

  const shockDamage = safeLevel >= 2 ? 8 : 5;
  const targetId = target.id;
  const targetHead = getUnitHeadWorldPosition(target.id);
  const targetPos = getUnitWorldPosition(target.id);

  playSystemShockImpact(targetHead, target.id);
  const shellGuardOutcome = applyGhostbladeShellGuard(target, shockDamage, DAMAGE_TYPES.SYSTEM);
  target.hitPoints -= shellGuardOutcome.damage;
  addLog(`Player ${currentPlayer.id} cast System Shock Level ${safeLevel} on ${target.unitName} for ${shellGuardOutcome.damage} (${DAMAGE_TYPES.SYSTEM}).`);
  if (shellGuardOutcome.consumed) {
    addLog(`${target.unitName} Shell guard was consumed.`);
  }
  if (target.hitPoints <= 0) {
    addLog(`${target.unitName} of Player ${target.owner} was destroyed.`);
    playExplosionAt(targetPos);
    removeUnit(target.id);
  }

  if (safeLevel >= 3 && !getUnitById(targetId)) {
    currentPlayer.energy = Math.min(getPlayerMaxEnergy(currentPlayer), currentPlayer.energy + 10);
    addLog(`System Shock Level 3 bonus: Player ${currentPlayer.id} gained 10 Energy.`);
  }

  clearSelection();
  syncBoardVisualState();
  renderUI();
}

function handleShieldingTargetClick(hit) {
  if (hit.userData.type !== 'unit') {
    addLog('Select one of your drones to apply Shielding.');
    return;
  }

  const unit = getUnitById(hit.userData.unitId);
  if (!unit) {
    return;
  }
  if (!canPlayerDirectlyTargetUnit(state.currentPlayerId, unit)) {
    addLog('This Drone is hidden by Shimmering Cloak and cannot be targeted by your abilities.');
    return;
  }
  if (unit.owner !== state.currentPlayerId) {
    addLog('Shielding can only target your own drones.');
    return;
  }
  if (unitHasStatus(unit, DRONE_STATUS_LIBRARY.SALVO.id)) {
    addLog('This Drone cannot gain Shield because of Salvo status.');
    return;
  }

  if (state.mode === 'shielding_equip_instant') {
    const currentPlayer = getCurrentPlayer();
    const sourceCard = currentPlayer.hand[state.selectedCardHandIndex];
    if (!sourceCard || sourceCard.cardId !== CARD_LIBRARY.SHIELDING.id) {
      clearSelection();
      renderUI();
      return;
    }
    const cardTemplate = CARD_LIBRARY.SHIELDING;
    if (currentPlayer.energy < cardTemplate.energyCost) {
      addLog(`Not enough Energy to play ${cardTemplate.cardName}.`);
      return;
    }
    currentPlayer.energy -= cardTemplate.energyCost;
    currentPlayer.hand.splice(state.selectedCardHandIndex, 1);
    currentPlayer.discard.push(sourceCard);
    applyShieldingEffectToUnit(unit, 1);
    return;
  }

  if (state.mode === 'shielding_equip_echo') {
    const currentPlayer = getCurrentPlayer();
    const slot = state.pendingShieldingSourceSlot;
    const level = state.pendingShieldingLevel;
    if (!slot || !level) {
      clearSelection();
      renderUI();
      return;
    }
    const slotCard = currentPlayer.processEcho?.[slot];
    if (!slotCard || slotCard.cardId !== CARD_LIBRARY.SHIELDING.id) {
      addLog('That Process Echo slot is empty.');
      clearSelection();
      renderUI();
      return;
    }
    applyProcessEchoPlayResult(currentPlayer, slot);
    applyShieldingEffectToUnit(unit, level);
  }
}

function applyShieldingEffectToUnit(unit, level) {
  const safeLevel = Math.max(1, Math.min(3, level));
  const shieldAmount = safeLevel >= 2 ? 5 : 2;
  const canStack = safeLevel >= 3;
  applyShieldToUnit(unit, shieldAmount, { allowStack: canStack });
  state.mode = 'unit_selected';
  state.selectedUnitId = unit.id;
  state.selectedCardHandIndex = null;
  state.pendingShieldingLevel = null;
  state.pendingShieldingSourceSlot = null;
  state.pendingShimmeringLevel = null;
  state.pendingShimmeringSourceSlot = null;
  state.pendingShimmeringSquares = [];
  state.systemShockCasterId = null;
  const modeText = canStack ? 'stacked' : 'applied';
  addLog(`Player ${unit.owner} ${modeText} ${shieldAmount} Shield on ${unit.unitName} (Shielding Lv.${safeLevel}).`);
  syncBoardVisualState();
  renderUI();
}

function handleShimmeringSquareClick(hit) {
  if (hit.userData.type !== 'square' && hit.userData.type !== 'base') {
    addLog('Select a board square for Shimmering Cloak.');
    return;
  }
  const squareKey = hit.userData.squareKey;
  if (!squareKey) {
    return;
  }

  const level =
    state.mode === 'shimmering_targeting_instant'
      ? 1
      : Math.max(1, Math.min(3, state.pendingShimmeringLevel ?? 1));
  const requiredSquares = level >= 3 ? 2 : 1;
  const selected = state.pendingShimmeringSquares ?? [];
  if (selected.includes(squareKey)) {
    state.pendingShimmeringSquares = selected.filter((key) => key !== squareKey);
    addLog(`Removed ${squareKey} from Shimmering Cloak selection.`);
    syncBoardVisualState();
    renderUI();
    return;
  }
  state.pendingShimmeringSquares = [...selected, squareKey].slice(0, requiredSquares);
  if (state.pendingShimmeringSquares.length < requiredSquares) {
    addLog(`Selected ${squareKey}. Select ${requiredSquares - state.pendingShimmeringSquares.length} more square(s).`);
    syncBoardVisualState();
    renderUI();
    return;
  }
  applyShimmeringCloakSelection(level, state.pendingShimmeringSquares);
}

function applyShimmeringCloakSelection(level, squareKeys) {
  const currentPlayer = getCurrentPlayer();
  const safeLevel = Math.max(1, Math.min(3, level));
  const turns = safeLevel >= 2 ? 2 : 1;
  const targetSquares = [...new Set(squareKeys)];

  if (state.mode === 'shimmering_targeting_instant') {
    const sourceCard = currentPlayer.hand[state.selectedCardHandIndex];
    if (!sourceCard || sourceCard.cardId !== CARD_LIBRARY.SHIMMERING_CLOAK.id) {
      clearSelection();
      renderUI();
      return;
    }
    const cardTemplate = CARD_LIBRARY.SHIMMERING_CLOAK;
    if (currentPlayer.energy < cardTemplate.energyCost) {
      addLog(`Not enough Energy to play ${cardTemplate.cardName}.`);
      return;
    }
    currentPlayer.energy -= cardTemplate.energyCost;
    currentPlayer.hand.splice(state.selectedCardHandIndex, 1);
    currentPlayer.discard.push(sourceCard);
  } else if (state.mode === 'shimmering_targeting_echo') {
    const slot = state.pendingShimmeringSourceSlot;
    if (!slot) {
      clearSelection();
      renderUI();
      return;
    }
    const slotCard = currentPlayer.processEcho?.[slot];
    if (!slotCard || slotCard.cardId !== CARD_LIBRARY.SHIMMERING_CLOAK.id) {
      addLog('That Process Echo slot is empty.');
      clearSelection();
      renderUI();
      return;
    }
    applyProcessEchoPlayResult(currentPlayer, slot);
  }

  addShimmeringCloak(currentPlayer.id, targetSquares, turns);
  addLog(
    `Player ${currentPlayer.id} cast Shimmering Cloak Level ${safeLevel} on ${targetSquares.join(', ')} for ${turns} turn(s).`
  );
  clearSelection();
  syncBoardVisualState();
  renderUI();
}

function handleGhostbladeTeleportTargetClick(hit) {
  if (hit.userData.type !== 'square' && hit.userData.type !== 'base') {
    addLog('Select an empty board square for Teleport.');
    return;
  }
  const caster = getUnitById(state.ghostbladeTeleportCasterId);
  if (!caster || caster.owner !== state.currentPlayerId || caster.unitTypeId !== 'GHOSTBLADE_UNIT') {
    clearSelection();
    renderUI();
    return;
  }
  if (caster.ghostbladeTeleportCooldown > 0) {
    addLog('Teleport is on cooldown.');
    return;
  }
  const currentPlayer = getCurrentPlayer();
  if (currentPlayer.energy < 10) {
    addLog('Not enough Energy to use Teleport.');
    return;
  }

  const squareKey = hit.userData.squareKey;
  if (!squareKey) {
    return;
  }
  if (getUnitAt(fromSquareKey(squareKey).x, fromSquareKey(squareKey).z)) {
    addLog('Teleport target must be empty.');
    return;
  }
  const baseOwner = getBaseOwnerAtSquare(squareKey);
  if (baseOwner && baseOwner !== caster.owner) {
    addLog('Teleport cannot target enemy base squares.');
    return;
  }
  const enemyBuilding = getBuildingAtSquare(caster.owner === 'A' ? 'B' : 'A', squareKey);
  const ownBuilding = getBuildingAtSquare(caster.owner, squareKey);
  if (enemyBuilding || ownBuilding) {
    addLog('Teleport target must not contain a building.');
    return;
  }

  const startPos = gridToWorld(caster.x, caster.z);
  const target = fromSquareKey(squareKey);
  const targetPos = gridToWorld(target.x, target.z);
  playTeleportBlinkAt(startPos, caster.owner);
  playTeleportBlinkAt(targetPos, caster.owner);

  caster.x = target.x;
  caster.z = target.z;
  caster.hasMoved = true;
  caster.ghostbladeTeleportCooldown = 5;
  currentPlayer.energy -= 10;

  const affected = state.units.filter((unit) => {
    if (unit.owner === caster.owner) {
      return false;
    }
    return getDistance(target.x, target.z, unit.x, unit.z) <= 1;
  });
  const ghostbladeDamage = getUnitCurrentAttackDamage(caster);
  for (const unit of affected) {
    applyUnitAttack(caster, unit, {
      damageType: DAMAGE_TYPES.ATTACK,
      damageAmount: ghostbladeDamage,
      skipCoreMagnetRedirect: true
    });
  }
  addLog(`${caster.owner} Ghostblade teleported to ${squareKey} and dealt ${ghostbladeDamage} AoE damage.`);
  state.mode = 'unit_selected';
  state.ghostbladeTeleportCasterId = null;
  syncBoardVisualState();
  renderUI();
}

function getArtilleryAreaSquareKeys(squareKey) {
  const origin = fromSquareKey(squareKey);
  const anchorX = Math.max(0, Math.min(BOARD_WIDTH - 2, origin.x));
  const anchorZ = Math.max(0, Math.min(BOARD_LENGTH - 2, origin.z));
  return [
    toSquareKey(anchorX, anchorZ),
    toSquareKey(anchorX + 1, anchorZ),
    toSquareKey(anchorX, anchorZ + 1),
    toSquareKey(anchorX + 1, anchorZ + 1)
  ];
}

function getGaussDirectionFromTargetSquare(artillery, squareKey) {
  if (!artillery || !squareKey) {
    return null;
  }
  const target = fromSquareKey(squareKey);
  const dx = target.x - artillery.x;
  const dz = target.z - artillery.z;
  if (dx === 0 && dz === 0) {
    return null;
  }
  const absDx = Math.abs(dx);
  const absDz = Math.abs(dz);
  const chebyshev = Math.max(absDx, absDz);
  const maxSquares = getGaussLineMaxSquares(artillery);
  if (chebyshev < 1 || chebyshev > maxSquares) {
    return null;
  }
  const aligned = dx === 0 || dz === 0 || absDx === absDz;
  if (!aligned) {
    return null;
  }
  return {
    stepX: Math.sign(dx),
    stepZ: Math.sign(dz)
  };
}

function getGaussLineMaxSquares(artillery) {
  if (!artillery) {
    return 5;
  }
  return unitHasStatus(artillery, DRONE_STATUS_LIBRARY.DRONES.id) ? 6 : 5;
}

function getGaussLineSquareKeys(artillery, stepX, stepZ) {
  if (!artillery || (stepX === 0 && stepZ === 0)) {
    return [];
  }
  const keys = [];
  const maxSquares = getGaussLineMaxSquares(artillery);
  for (let i = 1; i <= maxSquares; i += 1) {
    const x = artillery.x + stepX * i;
    const z = artillery.z + stepZ * i;
    if (x < 0 || x >= BOARD_WIDTH || z < 0 || z >= BOARD_LENGTH) {
      break;
    }
    keys.push(toSquareKey(x, z));
  }
  return keys;
}

function getGaussLineSquareKeysFromTarget(artillery, squareKey) {
  const direction = getGaussDirectionFromTargetSquare(artillery, squareKey);
  if (!direction) {
    return [];
  }
  return getGaussLineSquareKeys(artillery, direction.stepX, direction.stepZ);
}

function hasBallisticStatus(unit) {
  return unit?.unitTypeId === 'ARTILLERY_UNIT' && unitHasStatus(unit, DRONE_STATUS_LIBRARY.BALLISTIC.id);
}

function getArtilleryBallisticDamageAgainstUnit(artillery) {
  const bonus = Math.max(0, getUnitCurrentAttackDamage(artillery) - (artillery.baseAttackDamage ?? 0));
  return Math.max(0, 10 + bonus);
}

function getArtilleryBallisticDamageAgainstBase(artillery) {
  const bonus = Math.max(0, getUnitCurrentAttackDamage(artillery) - (artillery.baseAttackDamage ?? 0));
  return Math.max(0, 16 + bonus);
}

function getMinDistanceToAreaFromUnit(unitX, unitZ, areaKeys) {
  let minDistance = Number.POSITIVE_INFINITY;
  for (const squareKey of areaKeys) {
    const square = fromSquareKey(squareKey);
    const distance = getDistance(unitX, unitZ, square.x, square.z);
    if (distance < minDistance) {
      minDistance = distance;
    }
  }
  return minDistance;
}

function handleArtilleryAttackTargetClick(hit) {
  const artillery = getSelectedUnit();
  if (!artillery || artillery.owner !== state.currentPlayerId || artillery.unitTypeId !== 'ARTILLERY_UNIT') {
    clearSelection();
    renderUI();
    return;
  }
  if (!artillery.artillerySetUpActive) {
    addLog('Artillery must have Set Up status to attack.');
    return;
  }
  if (isUnitMovementStunned(artillery)) {
    addLog('This Drone is Dazzled and cannot attack this turn.');
    return;
  }
  if (artillery.hasAttacked) {
    addLog('This unit has already attacked this turn.');
    return;
  }

  const artilleryRange = getUnitCurrentAttackRange(artillery);
  const hasBallistic = hasBallisticStatus(artillery);
  if (hasBallistic) {
    if (hit.userData.type !== 'unit' && hit.userData.type !== 'base') {
      addLog('Ballistic targeting: select an enemy Drone or vulnerable enemy base square.');
      return;
    }
    if (hit.userData.type === 'unit') {
      const targetUnit = getUnitById(hit.userData.unitId);
      if (!targetUnit || targetUnit.owner === artillery.owner) {
        addLog('Ballistic can target only enemy drones.');
        return;
      }
      const distance = getDistance(artillery.x, artillery.z, targetUnit.x, targetUnit.z);
      if (distance > artilleryRange) {
        addLog(`Ballistic target out of range (${artilleryRange}).`);
        return;
      }
      const targetPos = gridToWorld(targetUnit.x, targetUnit.z);
      playArtilleryShellShot(artillery.id, targetPos);
      const ballisticDamage = getArtilleryBallisticDamageAgainstUnit(artillery);
      applyUnitAttack(artillery, targetUnit, {
        damageType: DAMAGE_TYPES.ATTACK,
        damageAmount: ballisticDamage,
        skipCoreMagnetRedirect: true,
        skipAttackVisual: true
      });
      artillery.hasAttacked = true;
      artillery.hasMoved = true;
      artillery.movementUsedThisTurn = getUnitCurrentMoveRange(artillery);
      addLog(`${artillery.owner} Artillery Ballistic struck ${targetUnit.unitName} for ${ballisticDamage}.`);
      state.mode = 'unit_selected';
      state.hoverSquareKey = null;
      state.ghostbladeTeleportCasterId = null;
      syncBoardVisualState();
      renderUI();
      return;
    }
    const targetBaseOwner = hit.userData.owner;
    const targetSquareKey = hit.userData.squareKey;
    if (!targetBaseOwner || !targetSquareKey || targetBaseOwner === artillery.owner) {
      addLog('Ballistic can target only enemy base vulnerable squares.');
      return;
    }
    if (!BASE_ARTILLERY_FRONT_SQUARES[targetBaseOwner]?.has(targetSquareKey)) {
      addLog('Ballistic can only target base vulnerable frontal squares.');
      return;
    }
    const sq = fromSquareKey(targetSquareKey);
    const distance = getDistance(artillery.x, artillery.z, sq.x, sq.z);
    if (distance > artilleryRange) {
      addLog(`Ballistic base target out of range (${artilleryRange}).`);
      return;
    }
    const targetPos = gridToWorld(sq.x, sq.z);
    playArtilleryShellShot(artillery.id, targetPos);
    const ballisticBaseDamage = getArtilleryBallisticDamageAgainstBase(artillery);
    applyBaseAttack(artillery, targetBaseOwner, targetSquareKey, DAMAGE_TYPES.ATTACK, ballisticBaseDamage);
    artillery.hasAttacked = true;
    artillery.hasMoved = true;
    artillery.movementUsedThisTurn = getUnitCurrentMoveRange(artillery);
    addLog(`${artillery.owner} Artillery Ballistic struck Player ${targetBaseOwner} base for ${ballisticBaseDamage}.`);
    state.mode = 'unit_selected';
    state.hoverSquareKey = null;
    state.ghostbladeTeleportCasterId = null;
    syncBoardVisualState();
    renderUI();
    return;
  }

  if (hit.userData.type !== 'square' && hit.userData.type !== 'base') {
    addLog('Select a target area for Artillery.');
    return;
  }

  const hasGauss = unitHasStatus(artillery, DRONE_STATUS_LIBRARY.GAUSS.id);
  if (hasGauss) {
    const lineKeys = getGaussLineSquareKeysFromTarget(artillery, hit.userData.squareKey);
    if (lineKeys.length === 0) {
      addLog('Gauss targeting: choose an adjacent square or one of its highlighted line squares.');
      return;
    }
    const firstSquare = fromSquareKey(lineKeys[0]);
    const lastSquare = fromSquareKey(lineKeys[lineKeys.length - 1]);
    const firstWorld = gridToWorld(firstSquare.x, firstSquare.z);
    const lastWorld = gridToWorld(lastSquare.x, lastSquare.z);
    playArtilleryGaussBeam(artillery.id, firstWorld, lastWorld);
    const targets = state.units.filter((unit) => lineKeys.includes(toSquareKey(unit.x, unit.z)));
    const artilleryDamage = getUnitCurrentAttackDamage(artillery);
    for (const unit of targets) {
      applyUnitAttack(artillery, unit, {
        damageType: DAMAGE_TYPES.ATTACK,
        damageAmount: artilleryDamage,
        skipCoreMagnetRedirect: true,
        skipAttackVisual: true
      });
    }
    for (const basePlayerId of ['A', 'B']) {
      const baseOwner = state.players[basePlayerId];
      const frontalSquares = BASE_ARTILLERY_FRONT_SQUARES[basePlayerId];
      let baseHits = 0;
      for (const squareKey of lineKeys) {
        if (frontalSquares?.has(squareKey)) {
          baseHits += 1;
          const sq = fromSquareKey(squareKey);
          const pos = gridToWorld(sq.x, sq.z);
          playExplosionAt(new THREE.Vector3(pos.x, 0.5, pos.z), {
            particleCount: 14,
            duration: 0.62,
            speedMin: 1.2,
            speedMax: 2.4
          });
        }
      }
      if (baseHits > 0 && !baseOwner.baseDestroyed) {
        const totalBaseDamage = artilleryDamage * baseHits;
        baseOwner.baseHitPoints = Math.max(0, baseOwner.baseHitPoints - totalBaseDamage);
        addLog(`${artillery.owner} Artillery Gauss hit Player ${basePlayerId} base for ${totalBaseDamage} via vulnerable square(s).`);
        if (baseOwner.baseHitPoints <= 0) {
          destroyBase(basePlayerId);
          state.winner = artillery.owner;
          addLog(`Player ${artillery.owner} wins by destroying Player ${basePlayerId} base.`);
        }
      }
    }
    artillery.hasAttacked = true;
    artillery.hasMoved = true;
    artillery.movementUsedThisTurn = getUnitCurrentMoveRange(artillery);
    addLog(`${artillery.owner} Artillery fired Gauss beam through ${lineKeys.join(', ')} for ${artilleryDamage} each square.`);
    state.mode = 'unit_selected';
    state.hoverSquareKey = null;
    state.ghostbladeTeleportCasterId = null;
    syncBoardVisualState();
    renderUI();
    return;
  }

  const areaKeys = getArtilleryAreaSquareKeys(hit.userData.squareKey);
  let minDistanceToArea = Number.POSITIVE_INFINITY;
  for (const squareKey of areaKeys) {
    const sq = fromSquareKey(squareKey);
    const distance = getDistance(artillery.x, artillery.z, sq.x, sq.z);
    if (distance < minDistanceToArea) {
      minDistanceToArea = distance;
    }
  }
  if (minDistanceToArea < 2) {
    addLog('Attack: Shell cannot target areas closer than 2 squares to Artillery.');
    return;
  }

  const center = new THREE.Vector3();
  for (const key of areaKeys) {
    center.add(gridToWorld(fromSquareKey(key).x, fromSquareKey(key).z));
  }
  center.multiplyScalar(1 / areaKeys.length);
  playArtilleryShellShot(artillery.id, center);

  const targets = state.units.filter((unit) => areaKeys.includes(toSquareKey(unit.x, unit.z)));
  const artilleryDamage = getUnitCurrentAttackDamage(artillery);
  for (const unit of targets) {
    applyUnitAttack(artillery, unit, {
      damageType: DAMAGE_TYPES.ATTACK,
      damageAmount: artilleryDamage,
      skipCoreMagnetRedirect: true,
      skipAttackVisual: true
    });
  }

  for (const basePlayerId of ['A', 'B']) {
    const baseOwner = state.players[basePlayerId];
    const frontalSquares = BASE_ARTILLERY_FRONT_SQUARES[basePlayerId];
    let baseHits = 0;
    for (const squareKey of areaKeys) {
      if (frontalSquares?.has(squareKey)) {
        baseHits += 1;
        const sq = fromSquareKey(squareKey);
        const pos = gridToWorld(sq.x, sq.z);
        playExplosionAt(new THREE.Vector3(pos.x, 0.5, pos.z), {
          particleCount: 14,
          duration: 0.62,
          speedMin: 1.2,
          speedMax: 2.4
        });
      }
    }
    if (baseHits > 0 && !baseOwner.baseDestroyed) {
      const totalBaseDamage = artilleryDamage * baseHits;
      baseOwner.baseHitPoints = Math.max(0, baseOwner.baseHitPoints - totalBaseDamage);
      addLog(`${artillery.owner} Artillery hit Player ${basePlayerId} base for ${totalBaseDamage} via vulnerable square(s).`);
      if (baseOwner.baseHitPoints <= 0) {
        destroyBase(basePlayerId);
        state.winner = artillery.owner;
        addLog(`Player ${artillery.owner} wins by destroying Player ${basePlayerId} base.`);
      }
    }
  }

  playExplosionAt(new THREE.Vector3(center.x, 0.55, center.z), {
    particleCount: 20,
    duration: 0.8,
    speedMin: 1.2,
    speedMax: 2.9
  });
  artillery.hasAttacked = true;
  artillery.hasMoved = true;
  artillery.movementUsedThisTurn = getUnitCurrentMoveRange(artillery);
  addLog(`${artillery.owner} Artillery bombarded ${areaKeys.join(', ')} for ${artilleryDamage} each square.`);
  state.mode = 'unit_selected';
  state.hoverSquareKey = null;
  state.ghostbladeTeleportCasterId = null;
  syncBoardVisualState();
  renderUI();
}

function playArtilleryShellShot(attackerId, landingPos) {
  const visual = unitVisualsById.get(attackerId);
  if (!visual) {
    return;
  }
  const start = new THREE.Vector3();
  visual.muzzle.getWorldPosition(start);
  const end = new THREE.Vector3(landingPos.x, 0.55, landingPos.z);
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 10, 10),
    new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.35, metalness: 0.5 })
  );
  shell.position.copy(start);
  effectsGroup.add(shell);
  activeEffects.push({
    duration: 0.9,
    elapsed: 0,
    update(effect, delta) {
      effect.elapsed += delta;
      const t = Math.min(effect.elapsed / effect.duration, 1);
      const x = start.x + (end.x - start.x) * t;
      const z = start.z + (end.z - start.z) * t;
      const yArc = Math.sin(Math.PI * t) * 5.2;
      const y = start.y + (end.y - start.y) * t + yArc;
      shell.position.set(x, y, z);
    },
    complete() {
      effectsGroup.remove(shell);
    }
  });
}

function playArtilleryGaussBeam(attackerId, fromWorld, toWorld) {
  const visual = unitVisualsById.get(attackerId);
  if (!visual) {
    return;
  }
  const start = new THREE.Vector3(fromWorld.x, 0.95, fromWorld.z);
  const end = new THREE.Vector3(toWorld.x, 0.95, toWorld.z);
  const direction = end.clone().sub(start);
  const length = Math.max(0.2, direction.length() + TILE_SIZE * 0.9);
  const center = start.clone().add(end).multiplyScalar(0.5);

  const beam = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.24, length),
    new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      emissive: 0x22d3ee,
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0.88
    })
  );
  beam.position.copy(center);
  beam.lookAt(end);
  effectsGroup.add(beam);

  activeEffects.push({
    duration: 0.28,
    elapsed: 0,
    update(effect, delta) {
      effect.elapsed += delta;
      const t = Math.min(effect.elapsed / effect.duration, 1);
      beam.material.opacity = 0.9 * (1 - t);
      beam.material.emissiveIntensity = 1.2 + Math.sin(effect.elapsed * 36) * 0.18;
    },
    complete() {
      effectsGroup.remove(beam);
    }
  });
}

function handleSpecialistEmpTargetClick(hit) {
  if (hit.userData.type !== 'square' && hit.userData.type !== 'base') {
    addLog('Select a target area for Specialist EMP.');
    return;
  }
  const specialist = getUnitById(state.specialistEmpCasterId);
  if (!specialist || specialist.owner !== state.currentPlayerId || specialist.unitTypeId !== 'SPECIALIST_UNIT') {
    clearSelection();
    renderUI();
    return;
  }
  if (specialist.specialistEmpCooldown > 0) {
    addLog('EMP is on cooldown.');
    return;
  }
  const hasSalvo = hasSalvoEmpStatus(specialist);
  const empUsesThisTurn = specialist.specialistEmpUsesThisTurn ?? 0;
  if (hasSalvo && empUsesThisTurn >= 2) {
    addLog('Salvo: this Specialist already used EMP twice this turn.');
    return;
  }
  if (specialist.hasAttacked && !hasSalvo) {
    addLog('Specialist cannot use EMP after attacking this turn.');
    return;
  }
  const currentPlayer = getCurrentPlayer();
  if (currentPlayer.energy < 5) {
    addLog('Not enough Energy to use EMP.');
    return;
  }

  const areaKeys = getArtilleryAreaSquareKeys(hit.userData.squareKey);
  const specialistRange = getUnitCurrentAttackRange(specialist);
  const nearestSquareDistance = getMinDistanceToAreaFromUnit(specialist.x, specialist.z, areaKeys);
  if (nearestSquareDistance > specialistRange) {
    addLog(`EMP target area is out of range (${specialistRange}).`);
    return;
  }

  currentPlayer.energy -= 5;
  specialist.specialistEmpUsesThisTurn = empUsesThisTurn + 1;
  if (hasSalvo) {
    if (specialist.specialistEmpUsesThisTurn >= 2) {
      specialist.specialistEmpCooldown = getSpecialistEmpCooldownTurns(specialist);
      specialist.specialistEmpPendingCooldown = false;
    } else {
      specialist.specialistEmpPendingCooldown = true;
    }
  } else {
    specialist.specialistEmpCooldown = getSpecialistEmpCooldownTurns(specialist);
  }
  specialist.hasAttacked = true;

  const targets = state.units.filter((unit) => areaKeys.includes(toSquareKey(unit.x, unit.z)));
  for (const unit of targets) {
    applyUnitAttack(specialist, unit, {
      attackType: ATTACK_TYPES.EMP,
      damageType: DAMAGE_TYPES.ATTACK,
      damageAmount: 0,
      skipCoreMagnetRedirect: true,
      skipAttackVisual: true
    });
  }
  const center = new THREE.Vector3();
  for (const key of areaKeys) {
    center.add(gridToWorld(fromSquareKey(key).x, fromSquareKey(key).z));
  }
  center.multiplyScalar(1 / areaKeys.length);
  playExplosionAt(new THREE.Vector3(center.x, 0.5, center.z), {
    particleCount: 16,
    duration: 0.55,
    speedMin: 1.0,
    speedMax: 2.2
  });
  addLog(
    `${specialist.owner} Specialist used EMP on ${areaKeys.join(', ')}.` +
      (hasSalvo ? ` (Salvo uses: ${specialist.specialistEmpUsesThisTurn}/2)` : '')
  );
  state.mode = 'unit_selected';
  state.hoverSquareKey = null;
  state.specialistEmpCasterId = null;
  syncBoardVisualState();
  renderUI();
}

function playTeleportBlinkAt(worldPos, owner) {
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.18, 1.05, 32),
    new THREE.MeshBasicMaterial({
      color: owner === 'A' ? 0x60a5fa : 0xfb7185,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false
    })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(worldPos.x, 0.15, worldPos.z);
  effectsGroup.add(ring);

  activeEffects.push({
    duration: 0.35,
    elapsed: 0,
    update(effect, delta) {
      effect.elapsed += delta;
      const t = Math.min(effect.elapsed / effect.duration, 1);
      ring.scale.setScalar(1 + t * 1.8);
      ring.material.opacity = 0.85 * (1 - t);
    },
    complete() {
      effectsGroup.remove(ring);
    }
  });
}

function playSystemShockImpact(headPosition, targetId) {
  const boltMaterial = new THREE.MeshBasicMaterial({
    color: 0xb3e5ff,
    transparent: true,
    opacity: 0.95
  });
  const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.075, 2.2, 7), boltMaterial);
  bolt.position.copy(headPosition);
  bolt.position.y += 1.1;
  effectsGroup.add(bolt);

  const halo = new THREE.Mesh(
    new THREE.RingGeometry(0.08, 0.44, 24),
    new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      depthWrite: false
    })
  );
  halo.rotation.x = -Math.PI / 2;
  halo.position.copy(headPosition);
  halo.position.y += 0.08;
  effectsGroup.add(halo);

  activeEffects.push({
    duration: 0.24,
    elapsed: 0,
    update(effect, delta) {
      effect.elapsed += delta;
      const t = Math.min(effect.elapsed / effect.duration, 1);
      bolt.material.opacity = 0.95 * (1 - t);
      bolt.scale.set(1 + t * 0.12, 1, 1 + t * 0.12);
      halo.material.opacity = 0.8 * (1 - t);
      const pulse = 1 + t * 1.6;
      halo.scale.set(pulse, pulse, pulse);
    },
    complete() {
      effectsGroup.remove(bolt);
      effectsGroup.remove(halo);
    }
  });

  playSystemShockSmoke(targetId);
}

function playSystemShockSmoke(targetId) {
  const particles = [];
  const particleCount = 14;
  for (let i = 0; i < particleCount; i += 1) {
    const puff = new THREE.Sprite(
      new THREE.SpriteMaterial({
        color: 0x9ca3af,
        transparent: true,
        opacity: 0.58,
        depthWrite: false
      })
    );
    puff.scale.set(0.22 + Math.random() * 0.1, 0.22 + Math.random() * 0.1, 0.22);
    effectsGroup.add(puff);
    particles.push({
      sprite: puff,
      angle: (Math.PI * 2 * i) / particleCount,
      radius: 0.05 + Math.random() * 0.16,
      rise: 0.24 + Math.random() * 0.24,
      drift: (Math.random() - 0.5) * 0.34,
      phase: Math.random() * Math.PI * 2
    });
  }

  activeEffects.push({
    duration: 2,
    elapsed: 0,
    update(effect, delta) {
      effect.elapsed += delta;
      const t = Math.min(effect.elapsed / effect.duration, 1);
      const head = getUnitHeadWorldPosition(targetId);
      for (const particle of particles) {
        const swirl = effect.elapsed * 1.35 + particle.phase;
        particle.sprite.position.set(
          head.x + Math.cos(particle.angle + swirl) * particle.radius + particle.drift * t,
          head.y + 0.05 + particle.rise * t,
          head.z + Math.sin(particle.angle + swirl) * particle.radius
        );
        const grow = 1 + t * 1.85;
        particle.sprite.scale.setScalar((0.2 + particle.radius * 0.9) * grow);
        particle.sprite.material.opacity = 0.58 * (1 - t);
      }
    },
    complete() {
      for (const particle of particles) {
        effectsGroup.remove(particle.sprite);
      }
    }
  });
}

function handleBuildingPlacementClick(hit) {
  const currentPlayer = getCurrentPlayer();
  if (!state.placingBuildingType) {
    clearSelection();
    renderUI();
    return;
  }

  if (hit.userData.type !== 'square' && hit.userData.type !== 'base') {
    addLog('Select one of your base squares to place the building.');
    return;
  }

  const squareKey = hit.userData.squareKey;
  if (!squareKey) {
    addLog('Select one of your base squares to place the building.');
    return;
  }
  if (!isPlayerBaseSquare(currentPlayer.id, squareKey)) {
    addLog('Building can only be placed on your base squares.');
    return;
  }

  const square = fromSquareKey(squareKey);
  if (getUnitAt(square.x, square.z)) {
    addLog('Building cannot be placed on an occupied square.');
    return;
  }

  if (getBuildingAtSquare(currentPlayer.id, squareKey)) {
    addLog('A building is already active on that base square.');
    return;
  }

  const buildingCard = BUILD_CARD_LIBRARY[state.placingBuildingType];
  if (!buildingCard) {
    clearSelection();
    renderUI();
    return;
  }
  const statusPool = BUILDING_PERK_DRAFT_POOL[buildingCard.buildingType] ?? [];

  if (currentPlayer.supply < buildingCard.supplyCost) {
    addLog('Not enough Supply to build this structure.');
    return;
  }

  if (buildingCard.id === BUILD_CARD_LIBRARY.ARMORY.id) {
    if (statusPool.length > 0) {
      state.mode = 'armory_status_pick';
      state.pendingArmorySquareKey = squareKey;
      state.pendingArmoryStatusId = null;
      state.pendingArmoryDraftStatusIds = [];
      renderUI();
      return;
    }
  }

  if (buildingCard.id === BUILD_CARD_LIBRARY.REPLICATOR.id) {
    if (statusPool.length > 0) {
      state.mode = 'replicator_status_pick';
      state.pendingReplicatorSquareKey = squareKey;
      state.pendingReplicatorStatusId = null;
      renderUI();
      return;
    }
  }

  if (buildingCard.id === BUILD_CARD_LIBRARY.WORKSHOP.id) {
    if (statusPool.length > 0) {
      state.mode = 'workshop_status_pick';
      state.pendingWorkshopSquareKey = squareKey;
      state.pendingWorkshopStatusId = null;
      renderUI();
      return;
    }
  }

  if (buildingCard.id === BUILD_CARD_LIBRARY.DATACENTER.id) {
    if (statusPool.length > 0) {
      state.mode = 'datacenter_status_pick';
      state.pendingDatacenterSquareKey = squareKey;
      state.pendingDatacenterStatusId = null;
      renderUI();
      return;
    }
  }

  if (buildingCard.id === BUILD_CARD_LIBRARY.GEAR_STATION.id) {
    if (statusPool.length > 0) {
      state.mode = 'gear_station_status_pick';
      state.pendingGearStationSquareKey = squareKey;
      state.pendingGearStationStatusId = null;
      renderUI();
      return;
    }
  }

  if (buildingCard.id === BUILD_CARD_LIBRARY.ASSEMBLY_LINE.id) {
    if (statusPool.length > 0) {
      state.mode = 'assembly_line_status_pick';
      state.pendingAssemblyLineSquareKey = squareKey;
      state.pendingAssemblyLineStatusId = null;
      renderUI();
      return;
    }
  }

  currentPlayer.supply -= buildingCard.supplyCost;
  const building = createBuilding(currentPlayer.id, buildingCard.buildingType, squareKey);
  if (building.type === 'DATACENTER') {
    addLog(`Datacenter built: Player ${currentPlayer.id} max Energy increased by 5 (now ${getPlayerMaxEnergy(currentPlayer)}).`);
  }
  currentPlayer.buildingsPlayedThisTurn += 1;
  state.mode = 'idle';
  state.placingBuildingType = null;
  addLog(`Player ${currentPlayer.id} built ${getBuildingDisplayName(building)} on ${squareKey}.`);
  syncBoardVisualState();
  renderUI();
}

function activateFoundationTargeting() {
  const currentPlayer = getCurrentPlayer();
  if (currentPlayer.supply < BUILD_CARD_LIBRARY.FOUNDATION.supplyCost) {
    addLog('Not enough Supply to play Foundation.');
    return;
  }
  if ((currentPlayer.buildings ?? []).length === 0) {
    addLog('No buildings available to destroy with Foundation.');
    return;
  }
  state.mode = 'foundation_targeting';
  state.pendingFoundationTargetBuildingId = null;
  state.selectedCardHandIndex = null;
  state.selectedUnitId = null;
  state.placingBuildingType = null;
  addLog('Foundation: select one of your buildings to destroy.');
  syncBoardVisualState();
  renderUI();
}

function handleFoundationTargetClick(hit) {
  const currentPlayer = getCurrentPlayer();
  const squareKey = hit.userData.squareKey;
  if (!squareKey) {
    addLog('Select a building on your base.');
    return;
  }
  const targetBuilding = getBuildingAtSquare(currentPlayer.id, squareKey);
  if (!targetBuilding) {
    addLog('Select one of your existing buildings to destroy.');
    return;
  }
  state.pendingFoundationTargetBuildingId = targetBuilding.id;
  state.mode = 'foundation_confirm';
  renderUI();
}

function confirmFoundationUse() {
  const currentPlayer = getCurrentPlayer();
  const targetBuildingId = state.pendingFoundationTargetBuildingId;
  const targetBuilding = targetBuildingId ? getBuildingById(currentPlayer.id, targetBuildingId) : null;
  if (!targetBuilding) {
    addLog('Selected building is no longer available.');
    clearSelection();
    renderUI();
    return;
  }
  const foundationCost = BUILD_CARD_LIBRARY.FOUNDATION.supplyCost;
  if (currentPlayer.supply < foundationCost) {
    addLog('Not enough Supply to play Foundation.');
    clearSelection();
    renderUI();
    return;
  }

  currentPlayer.supply -= foundationCost;

  // 1) Remove all building abilities by removing the building from player's building list.
  currentPlayer.buildings = currentPlayer.buildings.filter((building) => building.id !== targetBuilding.id);
  // 2) Remove adjacency bonuses provided by destroyed building to adjacent building drone cards.
  refreshAdjacencyBonusesForPlayerCards(currentPlayer.id);
  // Keep other derived caps in sync after building removal (e.g., Datacenter bonus).
  refreshPlayerMaxEnergy(currentPlayer.id, true);
  // 3/4) Visual removal and square vacancy are driven by absence in player.buildings.
  // 5) Add 5 to player's maximum base HP.
  currentPlayer.baseMaxHitPoints = Math.max(1, (currentPlayer.baseMaxHitPoints ?? BASE_MAX_HIT_POINTS) + 5);
  // 6) Add 5 to current base HP.
  currentPlayer.baseHitPoints = Math.min(currentPlayer.baseMaxHitPoints, currentPlayer.baseHitPoints + 5);
  // 7) Refund 50% of destroyed building supply cost.
  const destroyedSupplyCost = getBuildingSupplyCostByType(targetBuilding.type);
  const refund = Math.floor(destroyedSupplyCost * 0.5);
  currentPlayer.supply += refund;

  addLog(
    `Foundation destroyed ${getBuildingDisplayName(targetBuilding)}. Refunded ${refund} Supply and increased Player ${currentPlayer.id} base HP cap by 5.`
  );

  clearSelection();
  syncBoardVisualState();
  renderUI();
}

function createBuilding(owner, buildingType, squareKey, options = {}) {
  const player = state.players[owner];
  const companyName = getRandomCompanyName();
  const baseName = getBuildingBaseName(buildingType);
  const building = {
    id: `b_${owner}_${buildingType}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    owner,
    type: buildingType,
    squareKey,
    companyName,
    displayName: `${baseName} ${companyName}`,
    assignedStatusId: options.assignedStatusId ?? null,
    upgradeStatusIds: [],
    upgraded: false,
    createTankDroneCooldown: 0,
    createPawnDroneCooldown: 0,
    createSupportDroneCooldown: 0,
    createSpecialistCooldown: 0,
    createGhostbladeCooldown: 0,
    createArtilleryCooldown: 0,
    obtainUsedThisTurn: false,
    overloadUsedThisTurn: false
  };

  player.buildings.push(building);
  refreshAdjacencyBonusesForPlayerCards(owner);
  refreshPlayerMaxEnergy(owner, true);
  return building;
}

function activateArmoryProduction(buildingId) {
  const currentPlayer = getCurrentPlayer();
  const building = currentPlayer.buildings.find((candidate) => candidate.id === buildingId);
  if (!building || building.type !== 'ARMORY') {
    return;
  }

  if (building.createTankDroneCooldown > 0) {
    addLog('Create Tank Drone is on cooldown.');
    return;
  }

  const supplyCost = 15;
  if (currentPlayer.supply < supplyCost) {
    addLog('Not enough Supply to create a Tank Drone card.');
    return;
  }

  currentPlayer.supply -= supplyCost;
  const producedAt = getBuildingDisplayName(building);
  const grantedStatusIds = getBuildingGrantedStatusIds(building);
  const createdCard = {
    cardId: CARD_LIBRARY.TANK_DRONE.id,
    producedAt,
    producedByBuildingId: building.id,
    grantedStatusIds
  };
  applyAdjacencyBonusesToCard(currentPlayer.id, createdCard);
  currentPlayer.deck.push(createdCard);
  building.createTankDroneCooldown = 1;
  addLog(
    `Player ${currentPlayer.id} used ${producedAt} and added Tank Drone to deck.`
  );
  renderUI();
}

function activateReplicatorProduction(buildingId) {
  const currentPlayer = getCurrentPlayer();
  const building = currentPlayer.buildings.find((candidate) => candidate.id === buildingId);
  if (!building || building.type !== 'REPLICATOR') {
    return;
  }

  if (building.createPawnDroneCooldown > 0) {
    addLog('Create Pawn Drone is on cooldown.');
    return;
  }

  const supplyCost = 10;
  if (currentPlayer.supply < supplyCost) {
    addLog('Not enough Supply to create a Pawn Drone card.');
    return;
  }

  currentPlayer.supply -= supplyCost;
  const producedAt = getBuildingDisplayName(building);
  const grantedStatusIds = getBuildingGrantedStatusIds(building);
  const createdCard = {
    cardId: CARD_LIBRARY.PAWN_DRONE.id,
    producedAt,
    producedByBuildingId: building.id,
    grantedStatusIds
  };
  applyAdjacencyBonusesToCard(currentPlayer.id, createdCard);
  currentPlayer.deck.push(createdCard);
  building.createPawnDroneCooldown = 1;
  addLog(
    `Player ${currentPlayer.id} used ${producedAt} and added Pawn Drone to deck.`
  );
  renderUI();
}

function activateWorkshopProduction(buildingId) {
  const currentPlayer = getCurrentPlayer();
  const building = currentPlayer.buildings.find((candidate) => candidate.id === buildingId);
  if (!building || building.type !== 'WORKSHOP') {
    return;
  }

  if (building.createSupportDroneCooldown > 0) {
    addLog('Create Support Drone is on cooldown.');
    return;
  }

  const supplyCost = 15;
  if (currentPlayer.supply < supplyCost) {
    addLog('Not enough Supply to create a Support Drone card.');
    return;
  }

  currentPlayer.supply -= supplyCost;
  const producedAt = getBuildingDisplayName(building);
  const grantedStatusIds = getBuildingGrantedStatusIds(building);
  const createdCard = {
    cardId: CARD_LIBRARY.SUPPORT_DRONE.id,
    producedAt,
    producedByBuildingId: building.id,
    grantedStatusIds
  };
  applyAdjacencyBonusesToCard(currentPlayer.id, createdCard);
  currentPlayer.deck.push(createdCard);
  building.createSupportDroneCooldown = 1;
  addLog(
    `Player ${currentPlayer.id} used ${producedAt} and added Support Drone to deck.`
  );
  renderUI();
}

function isWorkshopAdjacentToDatacenter(playerId, datacenterBuildingId) {
  const player = state.players[playerId];
  const datacenter = player.buildings.find((building) => building.id === datacenterBuildingId && building.type === 'DATACENTER');
  if (!datacenter) {
    return false;
  }
  return player.buildings.some(
    (building) => building.type === 'WORKSHOP' && areBuildingsSideAdjacent(datacenter, building)
  );
}

function activateDatacenterObtain(buildingId) {
  const currentPlayer = getCurrentPlayer();
  const building = currentPlayer.buildings.find((candidate) => candidate.id === buildingId);
  if (!building || building.type !== 'DATACENTER') {
    return;
  }
  if (building.obtainUsedThisTurn) {
    addLog('Obtain can be used only once per turn.');
    return;
  }
  const energyCost = 5;
  if (currentPlayer.energy < energyCost) {
    addLog('Not enough Energy to use Obtain.');
    return;
  }

  currentPlayer.energy -= energyCost;
  building.obtainUsedThisTurn = true;
  const hasAdjacentWorkshop = isWorkshopAdjacentToDatacenter(currentPlayer.id, building.id);
  const gainedSupply = hasAdjacentWorkshop ? 8 : 5;
  currentPlayer.supply += gainedSupply;
  addLog(
    `Player ${currentPlayer.id} used Obtain (${getBuildingDisplayName(building)}) and gained ${gainedSupply} Supply.`
  );
  renderUI();
}

function getOverloadBaseMoveForUnit(unit) {
  if (!unit) {
    return 0;
  }
  const current = getUnitCurrentMoveRange(unit);
  return Math.max(0, current - (unit.overloadBonusMovementThisTurn ?? 0));
}

function canTargetUnitWithOverload(unit) {
  if (!unit || unit.owner !== state.currentPlayerId) {
    return false;
  }
  if (!canPlayerDirectlyTargetUnit(state.currentPlayerId, unit)) {
    return false;
  }
  if (unit.hasMoved && unit.hasAttacked) {
    return false;
  }
  const canMoveAfterAttack = (unit.tacticalDashActiveThisTurn ?? false) || (unit.systemShockFollowUpReady ?? false);
  if (unit.hasAttacked && !canMoveAfterAttack) {
    return false;
  }
  if (isUnitMovementStunned(unit)) {
    return false;
  }
  if (isUnitPlanted(unit) && !hasBeaconCoreMagnet(unit)) {
    return false;
  }
  const baseMoveGain = getOverloadBaseMoveForUnit(unit);
  return baseMoveGain > 0;
}

function activateGearStationOverload(buildingId) {
  const currentPlayer = getCurrentPlayer();
  const building = currentPlayer.buildings.find((candidate) => candidate.id === buildingId);
  if (!building || building.type !== 'GEAR_STATION') {
    return;
  }
  if (building.overloadUsedThisTurn) {
    addLog('Overload can be used only once per turn.');
    return;
  }
  if (currentPlayer.energy < 5) {
    addLog('Not enough Energy to use Overload.');
    return;
  }
  state.mode = 'overload_targeting';
  state.overloadTargetingBuildingId = building.id;
  state.hoverSquareKey = null;
  addLog('Select a friendly drone to apply Overload.');
  syncBoardVisualState();
  renderUI();
}

function activateAssemblyLineDraw(buildingId) {
  const currentPlayer = getCurrentPlayer();
  const building = currentPlayer.buildings.find((candidate) => candidate.id === buildingId);
  if (!building || building.type !== 'ASSEMBLY_LINE') {
    return;
  }
  const energyCost = 2;
  if (currentPlayer.energy < energyCost) {
    addLog('Not enough Energy to use Draw.');
    return;
  }
  if (currentPlayer.deck.length === 0 && currentPlayer.discard.length === 0) {
    addLog('No cards available to draw.');
    return;
  }
  currentPlayer.energy -= energyCost;
  drawCards(currentPlayer, 1);
  addLog(`Player ${currentPlayer.id} used Draw (${getBuildingDisplayName(building)}) and drew 1 card.`);
  renderUI();
}

function canBuildingBeUpgraded(building) {
  if (!building) {
    return false;
  }
  return (
    building.type === 'ARMORY' ||
    building.type === 'REPLICATOR' ||
    building.type === 'WORKSHOP' ||
    building.type === 'DATACENTER' ||
    building.type === 'GEAR_STATION' ||
    building.type === 'ASSEMBLY_LINE'
  );
}

function getBuildingUpgradeSupplyCost(building) {
  if (!building) {
    return BUILDING_UPGRADE_SUPPLY_COST;
  }
  if (building.type === 'ARMORY' || building.type === 'REPLICATOR' || building.type === 'WORKSHOP') {
    return 65;
  }
  return BUILDING_UPGRADE_SUPPLY_COST;
}

function getBuildingGrantedStatusIds(building) {
  if (!building) {
    return [];
  }
  const ids = new Set();
  if (building.assignedStatusId) {
    ids.add(building.assignedStatusId);
  }
  for (const statusId of building.upgradeStatusIds ?? []) {
    ids.add(statusId);
  }
  return [...ids];
}

function applyBuildingStatusUpgradeToExistingCards(playerId, buildingId, statusId) {
  const player = state.players[playerId];
  if (!player || !statusId) {
    return;
  }
  const touchPile = (pile) => {
    for (const card of pile ?? []) {
      if (!card || card.producedByBuildingId !== buildingId) {
        continue;
      }
      if (!card.grantedStatusIds) {
        card.grantedStatusIds = [];
      }
      if (!card.grantedStatusIds.includes(statusId)) {
        card.grantedStatusIds.push(statusId);
      }
      applyAdjacencyBonusesToCard(playerId, card);
    }
  };
  touchPile(player.hand);
  touchPile(player.deck);
  touchPile(player.discard);
  if (player.processEcho) {
    touchPile(Object.values(player.processEcho).filter(Boolean));
  }
}

function activateBuildingUpgrade(buildingId) {
  const currentPlayer = getCurrentPlayer();
  const building = currentPlayer.buildings.find((candidate) => candidate.id === buildingId);
  if (!building || !canBuildingBeUpgraded(building)) {
    return;
  }
  if (building.upgraded) {
    addLog(`${getBuildingDisplayName(building)} is already upgraded.`);
    return;
  }
  const upgradeCost = getBuildingUpgradeSupplyCost(building);
  if (currentPlayer.supply < upgradeCost) {
    addLog('Not enough Supply to upgrade this building.');
    return;
  }
  const supportsStatusUpgradeChoice =
    building.type === 'ARMORY' || building.type === 'REPLICATOR' || building.type === 'WORKSHOP';
  if (supportsStatusUpgradeChoice) {
    const alreadyGranted = new Set(getBuildingGrantedStatusIds(building));
    const options = (BUILDING_PERK_DRAFT_POOL[building.type] ?? []).filter((statusId) => !alreadyGranted.has(statusId)).slice(0, 8);
    if (options.length === 0) {
      currentPlayer.supply -= upgradeCost;
      building.upgraded = true;
      addLog(`Player ${currentPlayer.id} upgraded ${getBuildingDisplayName(building)} for ${upgradeCost} Supply.`);
      renderUI();
      return;
    }
    state.mode = 'building_upgrade_status_pick';
    state.pendingUpgradeBuildingId = building.id;
    state.pendingUpgradeStatusId = null;
    state.pendingUpgradeStatusOptions = options;
    renderUI();
    return;
  }

  currentPlayer.supply -= upgradeCost;
  building.upgraded = true;
  addLog(`Player ${currentPlayer.id} upgraded ${getBuildingDisplayName(building)} for ${upgradeCost} Supply.`);
  renderUI();
}

function confirmBuildingUpgradeStatusSelection() {
  const currentPlayer = getCurrentPlayer();
  const buildingId = state.pendingUpgradeBuildingId;
  const selectedStatusId = state.pendingUpgradeStatusId;
  if (!buildingId || !selectedStatusId) {
    return;
  }
  const building = currentPlayer.buildings.find((candidate) => candidate.id === buildingId);
  if (!building || building.upgraded) {
    clearSelection();
    renderUI();
    return;
  }
  const upgradeCost = getBuildingUpgradeSupplyCost(building);
  if (currentPlayer.supply < upgradeCost) {
    addLog('Not enough Supply to upgrade this building.');
    clearSelection();
    renderUI();
    return;
  }
  const allowedOptions = new Set(state.pendingUpgradeStatusOptions ?? []);
  if (!allowedOptions.has(selectedStatusId)) {
    addLog('Selected upgrade status is not valid.');
    return;
  }
  currentPlayer.supply -= upgradeCost;
  building.upgraded = true;
  if (!building.upgradeStatusIds) {
    building.upgradeStatusIds = [];
  }
  if (!building.upgradeStatusIds.includes(selectedStatusId)) {
    building.upgradeStatusIds.push(selectedStatusId);
    applyBuildingStatusUpgradeToExistingCards(currentPlayer.id, building.id, selectedStatusId);
  }
  refreshAdjacencyBonusesForPlayerCards(currentPlayer.id);
  addLog(
    `Player ${currentPlayer.id} upgraded ${getBuildingDisplayName(building)} for ${upgradeCost} Supply and added ${DRONE_STATUS_LIBRARY[selectedStatusId]?.statusName ?? selectedStatusId}.`
  );
  state.mode = 'idle';
  state.pendingUpgradeBuildingId = null;
  state.pendingUpgradeStatusId = null;
  state.pendingUpgradeStatusOptions = [];
  renderUI();
}

function createProducedDroneCardFromBuilding(playerId, building, cardId) {
  const producedAt = getBuildingDisplayName(building);
  const grantedStatusIds = new Set();
  for (const statusId of getBuildingGrantedStatusIds(building)) {
    grantedStatusIds.add(statusId);
  }
  if (building.type === 'DATACENTER' && cardId === CARD_LIBRARY.SPECIALIST.id) {
    const repairStatusIds = getWorkshopRepairStatusIdsForPlayer(playerId);
    for (const statusId of repairStatusIds) {
      grantedStatusIds.add(statusId);
    }
  }
  const createdCard = {
    cardId,
    producedAt,
    producedByBuildingId: building.id,
    grantedStatusIds: [...grantedStatusIds]
  };
  applyAdjacencyBonusesToCard(playerId, createdCard);
  return createdCard;
}

function activateDatacenterProduction(buildingId) {
  const currentPlayer = getCurrentPlayer();
  const building = currentPlayer.buildings.find((candidate) => candidate.id === buildingId);
  if (!building || building.type !== 'DATACENTER') {
    return;
  }
  if (!building.upgraded) {
    addLog('Upgrade Datacenter first to unlock Specialist production.');
    return;
  }
  if (building.createSpecialistCooldown > 0) {
    addLog('Create Specialist Drone is on cooldown.');
    return;
  }
  const supplyCost = CARD_LIBRARY.SPECIALIST.energyCost;
  if (currentPlayer.supply < supplyCost) {
    addLog('Not enough Supply to create a Specialist card.');
    return;
  }
  currentPlayer.supply -= supplyCost;
  const createdCard = createProducedDroneCardFromBuilding(currentPlayer.id, building, CARD_LIBRARY.SPECIALIST.id);
  currentPlayer.deck.push(createdCard);
  building.createSpecialistCooldown = 1;
  addLog(`Player ${currentPlayer.id} used ${getBuildingDisplayName(building)} and added Specialist to deck.`);
  renderUI();
}

function activateGearStationProduction(buildingId) {
  const currentPlayer = getCurrentPlayer();
  const building = currentPlayer.buildings.find((candidate) => candidate.id === buildingId);
  if (!building || building.type !== 'GEAR_STATION') {
    return;
  }
  if (!building.upgraded) {
    addLog('Upgrade Gear Station first to unlock Ghostblade production.');
    return;
  }
  if (building.createGhostbladeCooldown > 0) {
    addLog('Create Ghostblade is on cooldown.');
    return;
  }
  const supplyCost = CARD_LIBRARY.CREATE_GHOSTBLADE.energyCost;
  if (currentPlayer.supply < supplyCost) {
    addLog('Not enough Supply to create a Ghostblade card.');
    return;
  }
  currentPlayer.supply -= supplyCost;
  const createdCard = createProducedDroneCardFromBuilding(currentPlayer.id, building, CARD_LIBRARY.CREATE_GHOSTBLADE.id);
  currentPlayer.deck.push(createdCard);
  building.createGhostbladeCooldown = 1;
  addLog(`Player ${currentPlayer.id} used ${getBuildingDisplayName(building)} and added Ghostblade to deck.`);
  renderUI();
}

function activateAssemblyLineProduction(buildingId) {
  const currentPlayer = getCurrentPlayer();
  const building = currentPlayer.buildings.find((candidate) => candidate.id === buildingId);
  if (!building || building.type !== 'ASSEMBLY_LINE') {
    return;
  }
  if (!building.upgraded) {
    addLog('Upgrade Assembly Line first to unlock Artillery production.');
    return;
  }
  if (building.createArtilleryCooldown > 0) {
    addLog('Create Artillery is on cooldown.');
    return;
  }
  const supplyCost = CARD_LIBRARY.ARTILLERY.energyCost;
  if (currentPlayer.supply < supplyCost) {
    addLog('Not enough Supply to create an Artillery card.');
    return;
  }
  currentPlayer.supply -= supplyCost;
  const createdCard = createProducedDroneCardFromBuilding(currentPlayer.id, building, CARD_LIBRARY.ARTILLERY.id);
  currentPlayer.deck.push(createdCard);
  building.createArtilleryCooldown = 1;
  addLog(`Player ${currentPlayer.id} used ${getBuildingDisplayName(building)} and added Artillery to deck.`);
  renderUI();
}

function handleOverloadTargetClick(hit) {
  const currentPlayer = getCurrentPlayer();
  const buildingId = state.overloadTargetingBuildingId;
  const building = currentPlayer.buildings.find((candidate) => candidate.id === buildingId);
  if (!building || building.type !== 'GEAR_STATION') {
    clearSelection();
    renderUI();
    return;
  }
  if (hit.userData.type !== 'unit') {
    addLog('Select a friendly drone target for Overload.');
    return;
  }
  const target = getUnitById(hit.userData.unitId);
  if (!canTargetUnitWithOverload(target)) {
    addLog('This drone is not a valid Overload target.');
    return;
  }
  if (building.overloadUsedThisTurn) {
    addLog('Overload can be used only once per turn.');
    clearSelection();
    renderUI();
    return;
  }
  if (currentPlayer.energy < 5) {
    addLog('Not enough Energy to use Overload.');
    clearSelection();
    renderUI();
    return;
  }

  const movementGain = getOverloadBaseMoveForUnit(target);
  if (movementGain <= 0) {
    addLog('This drone cannot receive movement from Overload.');
    return;
  }

  currentPlayer.energy -= 5;
  building.overloadUsedThisTurn = true;
  target.overloadBonusMovementThisTurn = (target.overloadBonusMovementThisTurn ?? 0) + movementGain;
  addLog(
    `Player ${currentPlayer.id} used Overload (${getBuildingDisplayName(building)}) on ${target.unitName}: +${movementGain} Movement this turn.`
  );
  state.mode = 'idle';
  state.overloadTargetingBuildingId = null;
  syncBoardVisualState();
  renderUI();
}

function getBuildingBaseName(buildingType) {
  if (buildingType === 'ARMORY') {
    return 'The Armory';
  }
  if (buildingType === 'REPLICATOR') {
    return 'The Replicator';
  }
  if (buildingType === 'WORKSHOP') {
    return 'The Workshop';
  }
  if (buildingType === 'DATACENTER') {
    return 'Datacenter';
  }
  if (buildingType === 'GEAR_STATION') {
    return 'Gear Station';
  }
  if (buildingType === 'ASSEMBLY_LINE') {
    return 'Assembly Line';
  }
  return buildingType;
}

function getRandomCompanyName() {
  const index = Math.floor(Math.random() * COMPANY_NAMES.length);
  return COMPANY_NAMES[index];
}

function getBuildingDisplayName(building) {
  if (building.displayName) {
    return building.displayName;
  }
  const baseName = getBuildingBaseName(building.type);
  if (building.companyName) {
    return `${baseName} ${building.companyName}`;
  }
  return baseName;
}

function getBuildingAdjacencyBadge(buildingType) {
  if (buildingType === 'ARMORY') {
    return { glyph: '+HP', tooltip: 'Adjacency: +1 HP to drone cards produced by adjacent buildings.' };
  }
  if (buildingType === 'REPLICATOR') {
    return { glyph: '+ATT', tooltip: 'Adjacency: +1 ATT to drone cards produced by adjacent buildings.' };
  }
  if (buildingType === 'WORKSHOP') {
    return { glyph: '$', tooltip: 'Adjacency: +50% Supply yield for drone cards produced by adjacent buildings.' };
  }
  if (buildingType === 'GEAR_STATION') {
    return { glyph: '+MOV', tooltip: 'Adjacency: +1 MOV to drone cards produced by adjacent buildings.' };
  }
  if (buildingType === 'ASSEMBLY_LINE') {
    return { glyph: '-ENG', tooltip: 'Adjacency: Drone cards produced by adjacent buildings cost 3 less Energy.' };
  }
  return null;
}

function getBuildingEffectBadge(building) {
  const grantedStatusIds = getBuildingGrantedStatusIds(building);
  if (grantedStatusIds.length > 0 && DRONE_STATUS_LIBRARY[grantedStatusIds[0]]) {
    const status = DRONE_STATUS_LIBRARY[grantedStatusIds[0]];
    return { glyph: status.iconGlyph, tooltip: `Effect: ${status.statusName}` };
  }
  if (building.type === 'DATACENTER') {
    return { glyph: '⚡', tooltip: 'Effect: +5 Max Energy' };
  }
  if (building.type === 'GEAR_STATION') {
    return { glyph: '⏩', tooltip: 'Effect: Overload ability' };
  }
  if (building.type === 'ASSEMBLY_LINE') {
    return { glyph: '🃏', tooltip: 'Effect: Draw ability' };
  }
  return null;
}

function getBuildingAdjacencyIconGlyph(building) {
  const badge = getBuildingAdjacencyBadge(building.type);
  if (!badge) {
    return null;
  }
  return {
    glyph: badge.glyph,
    tooltip: badge.tooltip
  };
}

function getBuildingCardUpgradeIconsHtml(playerId, building) {
  const icons = [];
  const adjacency = getAdjacencyBonusesForProducedCard(playerId, building.id);
  if (adjacency?.statuses?.length) {
    for (const status of adjacency.statuses) {
      icons.push({ glyph: status.glyph, tooltip: status.tooltip });
    }
  }
  for (const statusId of getBuildingGrantedStatusIds(building)) {
    if (DRONE_STATUS_LIBRARY[statusId]) {
      const status = DRONE_STATUS_LIBRARY[statusId];
      icons.push({ glyph: status.iconGlyph, tooltip: status.description });
    }
  }
  if (icons.length === 0) {
    return '<span class="building-upgrade-empty">—</span>';
  }
  return icons
    .map(
      (item) => `
        <span class="building-upgrade-icon large">
          ${item.glyph}
          <span class="building-upgrade-tooltip">${item.tooltip}</span>
        </span>
      `
    )
    .join('');
}

function getBuildingAbilityCardsHtml(building, currentPlayer, overloadTargetingActive) {
  if (building.type === 'ARMORY') {
    const onCooldown = building.createTankDroneCooldown > 0;
    const disabled = currentPlayer.supply < 15 || onCooldown;
    return `
      <button class="ability-card building-ability-card" data-armory-id="${building.id}" ${disabled ? 'disabled' : ''}>
        <span class="ability-name">Create Tank Drone</span>
        <span class="ability-line">15 SUP • ${onCooldown ? `CD ${building.createTankDroneCooldown}` : 'Ready'}</span>
      </button>
    `;
  }
  if (building.type === 'REPLICATOR') {
    const onCooldown = building.createPawnDroneCooldown > 0;
    const disabled = currentPlayer.supply < 10 || onCooldown;
    return `
      <button class="ability-card building-ability-card" data-replicator-id="${building.id}" ${disabled ? 'disabled' : ''}>
        <span class="ability-name">Create Pawn Drone</span>
        <span class="ability-line">10 SUP • ${onCooldown ? `CD ${building.createPawnDroneCooldown}` : 'Ready'}</span>
      </button>
    `;
  }
  if (building.type === 'WORKSHOP') {
    const onCooldown = building.createSupportDroneCooldown > 0;
    const disabled = currentPlayer.supply < 15 || onCooldown;
    return `
      <button class="ability-card building-ability-card" data-workshop-id="${building.id}" ${disabled ? 'disabled' : ''}>
        <span class="ability-name">Create Support Drone</span>
        <span class="ability-line">15 SUP • ${onCooldown ? `CD ${building.createSupportDroneCooldown}` : 'Ready'}</span>
      </button>
    `;
  }
  if (building.type === 'DATACENTER') {
    const onCooldown = Boolean(building.obtainUsedThisTurn);
    const hasAdjacentWorkshop = isWorkshopAdjacentToDatacenter(currentPlayer.id, building.id);
    const disabled = currentPlayer.energy < 5 || onCooldown;
    const specialistCost = CARD_LIBRARY.SPECIALIST.energyCost;
    const createSpecialistOnCooldown = building.createSpecialistCooldown > 0;
    const createSpecialistDisabled = !building.upgraded || currentPlayer.supply < specialistCost || createSpecialistOnCooldown;
    return `
      <button class="ability-card building-ability-card" data-datacenter-id="${building.id}" ${disabled ? 'disabled' : ''}>
        <span class="ability-name">Obtain</span>
        <span class="ability-line">5 ENG • +${hasAdjacentWorkshop ? 8 : 5} SUP • ${onCooldown ? 'Used' : 'Ready'}</span>
      </button>
      <button class="ability-card building-ability-card" data-datacenter-create-id="${building.id}" ${createSpecialistDisabled ? 'disabled' : ''}>
        <span class="ability-name">Create Specialist Drone</span>
        <span class="ability-line">${specialistCost} SUP • ${!building.upgraded ? 'Need Upgrade' : createSpecialistOnCooldown ? `CD ${building.createSpecialistCooldown}` : 'Ready'}</span>
      </button>
    `;
  }
  if (building.type === 'GEAR_STATION') {
    const onCooldown = Boolean(building.overloadUsedThisTurn);
    const disabled = currentPlayer.energy < 5 || onCooldown || overloadTargetingActive;
    const ghostbladeCost = CARD_LIBRARY.CREATE_GHOSTBLADE.energyCost;
    const createGhostbladeOnCooldown = building.createGhostbladeCooldown > 0;
    const createGhostbladeDisabled = !building.upgraded || currentPlayer.supply < ghostbladeCost || createGhostbladeOnCooldown;
    return `
      <button class="ability-card building-ability-card" data-gear-station-id="${building.id}" ${disabled ? 'disabled' : ''}>
        <span class="ability-name">Overload</span>
        <span class="ability-line">5 ENG • ${overloadTargetingActive ? 'Targeting' : onCooldown ? 'Used' : 'Ready'}</span>
      </button>
      <button class="ability-card building-ability-card" data-gear-station-create-id="${building.id}" ${createGhostbladeDisabled ? 'disabled' : ''}>
        <span class="ability-name">Create Ghostblade</span>
        <span class="ability-line">${ghostbladeCost} SUP • ${!building.upgraded ? 'Need Upgrade' : createGhostbladeOnCooldown ? `CD ${building.createGhostbladeCooldown}` : 'Ready'}</span>
      </button>
    `;
  }
  if (building.type === 'ASSEMBLY_LINE') {
    const disabled = currentPlayer.energy < 2;
    const artilleryCost = CARD_LIBRARY.ARTILLERY.energyCost;
    const createArtilleryOnCooldown = building.createArtilleryCooldown > 0;
    const createArtilleryDisabled = !building.upgraded || currentPlayer.supply < artilleryCost || createArtilleryOnCooldown;
    return `
      <button class="ability-card building-ability-card" data-assembly-line-id="${building.id}" ${disabled ? 'disabled' : ''}>
        <span class="ability-name">Draw</span>
        <span class="ability-line">2 ENG • ${disabled ? 'Need 2' : 'Ready'}</span>
      </button>
      <button class="ability-card building-ability-card" data-assembly-line-create-id="${building.id}" ${createArtilleryDisabled ? 'disabled' : ''}>
        <span class="ability-name">Create Artillery</span>
        <span class="ability-line">${artilleryCost} SUP • ${!building.upgraded ? 'Need Upgrade' : createArtilleryOnCooldown ? `CD ${building.createArtilleryCooldown}` : 'Ready'}</span>
      </button>
    `;
  }
  return `<div class="improvement-empty">No abilities.</div>`;
}

function createStatusInstance(statusId) {
  const template = DRONE_STATUS_LIBRARY[statusId];
  if (!template) {
    return null;
  }
  return {
    key: `status_${template.id.toLowerCase()}`,
    statusId: template.id,
    glyph: template.iconGlyph,
    label: template.statusName,
    tooltip: template.description
  };
}

function rollBuildingDraftStatuses(buildingType, count = 3) {
  const pool = BUILDING_PERK_DRAFT_POOL[buildingType] ?? [];
  return shuffle([...pool]).slice(0, Math.min(count, pool.length));
}

function confirmArmoryBuildPlacement() {
  const currentPlayer = getCurrentPlayer();
  const squareKey = state.pendingArmorySquareKey;
  const statusId = state.pendingArmoryStatusId;
  const armoryCard = BUILD_CARD_LIBRARY.ARMORY;

  if (!squareKey || !statusId || !DRONE_STATUS_LIBRARY[statusId]) {
    addLog('Select a Drone Status before confirming The Armory build.');
    return;
  }

  if (currentPlayer.supply < armoryCard.supplyCost) {
    addLog('Not enough Supply to build this structure.');
    clearSelection();
    renderUI();
    return;
  }

  if (!isPlayerBaseSquare(currentPlayer.id, squareKey)) {
    addLog('Building can only be placed on your base squares.');
    clearSelection();
    renderUI();
    return;
  }

  const square = fromSquareKey(squareKey);
  if (getUnitAt(square.x, square.z) || getBuildingAtSquare(currentPlayer.id, squareKey)) {
    addLog('Selected base square is no longer available.');
    clearSelection();
    renderUI();
    return;
  }

  currentPlayer.supply -= armoryCard.supplyCost;
  const building = createBuilding(currentPlayer.id, armoryCard.buildingType, squareKey, {
    assignedStatusId: statusId
  });
  currentPlayer.buildingsPlayedThisTurn += 1;
  state.mode = 'idle';
  state.placingBuildingType = null;
  state.pendingArmorySquareKey = null;
  state.pendingArmoryStatusId = null;
  state.pendingArmoryDraftStatusIds = [];
  state.pendingReplicatorSquareKey = null;
  state.pendingReplicatorStatusId = null;
  addLog(`Player ${currentPlayer.id} built ${getBuildingDisplayName(building)} on ${squareKey}.`);
  syncBoardVisualState();
  renderUI();
}

function confirmReplicatorBuildPlacement() {
  const currentPlayer = getCurrentPlayer();
  const squareKey = state.pendingReplicatorSquareKey;
  const statusId = state.pendingReplicatorStatusId;
  const replicatorCard = BUILD_CARD_LIBRARY.REPLICATOR;

  if (!squareKey || !statusId || !DRONE_STATUS_LIBRARY[statusId]) {
    addLog('Select a Drone Status before confirming The Replicator build.');
    return;
  }

  if (currentPlayer.supply < replicatorCard.supplyCost) {
    addLog('Not enough Supply to build this structure.');
    clearSelection();
    renderUI();
    return;
  }

  if (!isPlayerBaseSquare(currentPlayer.id, squareKey)) {
    addLog('Building can only be placed on your base squares.');
    clearSelection();
    renderUI();
    return;
  }

  const square = fromSquareKey(squareKey);
  if (getUnitAt(square.x, square.z) || getBuildingAtSquare(currentPlayer.id, squareKey)) {
    addLog('Selected base square is no longer available.');
    clearSelection();
    renderUI();
    return;
  }

  currentPlayer.supply -= replicatorCard.supplyCost;
  const building = createBuilding(currentPlayer.id, replicatorCard.buildingType, squareKey, {
    assignedStatusId: statusId
  });
  currentPlayer.buildingsPlayedThisTurn += 1;
  state.mode = 'idle';
  state.placingBuildingType = null;
  state.pendingArmorySquareKey = null;
  state.pendingArmoryStatusId = null;
  state.pendingArmoryDraftStatusIds = [];
  state.pendingReplicatorSquareKey = null;
  state.pendingReplicatorStatusId = null;
  state.pendingWorkshopSquareKey = null;
  state.pendingWorkshopStatusId = null;
  addLog(`Player ${currentPlayer.id} built ${getBuildingDisplayName(building)} on ${squareKey}.`);
  syncBoardVisualState();
  renderUI();
}

function confirmWorkshopBuildPlacement() {
  const currentPlayer = getCurrentPlayer();
  const squareKey = state.pendingWorkshopSquareKey;
  const statusId = state.pendingWorkshopStatusId;
  const workshopCard = BUILD_CARD_LIBRARY.WORKSHOP;

  if (!squareKey || !statusId || !DRONE_STATUS_LIBRARY[statusId]) {
    addLog('Select a Drone Status before confirming The Workshop build.');
    return;
  }

  if (currentPlayer.supply < workshopCard.supplyCost) {
    addLog('Not enough Supply to build this structure.');
    clearSelection();
    renderUI();
    return;
  }

  if (!isPlayerBaseSquare(currentPlayer.id, squareKey)) {
    addLog('Building can only be placed on your base squares.');
    clearSelection();
    renderUI();
    return;
  }

  const square = fromSquareKey(squareKey);
  if (getUnitAt(square.x, square.z) || getBuildingAtSquare(currentPlayer.id, squareKey)) {
    addLog('Selected base square is no longer available.');
    clearSelection();
    renderUI();
    return;
  }

  currentPlayer.supply -= workshopCard.supplyCost;
  const building = createBuilding(currentPlayer.id, workshopCard.buildingType, squareKey, {
    assignedStatusId: statusId
  });
  currentPlayer.buildingsPlayedThisTurn += 1;
  state.mode = 'idle';
  state.placingBuildingType = null;
  state.pendingArmorySquareKey = null;
  state.pendingArmoryStatusId = null;
  state.pendingArmoryDraftStatusIds = [];
  state.pendingReplicatorSquareKey = null;
  state.pendingReplicatorStatusId = null;
  state.pendingWorkshopSquareKey = null;
  state.pendingWorkshopStatusId = null;
  addLog(`Player ${currentPlayer.id} built ${getBuildingDisplayName(building)} on ${squareKey}.`);
  syncBoardVisualState();
  renderUI();
}

function confirmDatacenterBuildPlacement() {
  const currentPlayer = getCurrentPlayer();
  const squareKey = state.pendingDatacenterSquareKey;
  const statusId = state.pendingDatacenterStatusId;
  const datacenterCard = BUILD_CARD_LIBRARY.DATACENTER;

  if (!squareKey || !statusId || !DRONE_STATUS_LIBRARY[statusId]) {
    addLog('Select a Drone Status before confirming Datacenter build.');
    return;
  }
  if (currentPlayer.supply < datacenterCard.supplyCost) {
    addLog('Not enough Supply to build this structure.');
    clearSelection();
    renderUI();
    return;
  }
  if (!isPlayerBaseSquare(currentPlayer.id, squareKey)) {
    addLog('Building can only be placed on your base squares.');
    clearSelection();
    renderUI();
    return;
  }
  const square = fromSquareKey(squareKey);
  if (getUnitAt(square.x, square.z) || getBuildingAtSquare(currentPlayer.id, squareKey)) {
    addLog('Selected base square is no longer available.');
    clearSelection();
    renderUI();
    return;
  }

  currentPlayer.supply -= datacenterCard.supplyCost;
  const building = createBuilding(currentPlayer.id, datacenterCard.buildingType, squareKey, {
    assignedStatusId: statusId
  });
  currentPlayer.buildingsPlayedThisTurn += 1;
  state.mode = 'idle';
  state.placingBuildingType = null;
  state.pendingDatacenterSquareKey = null;
  state.pendingDatacenterStatusId = null;
  addLog(`Datacenter built: Player ${currentPlayer.id} max Energy increased by 5 (now ${getPlayerMaxEnergy(currentPlayer)}).`);
  addLog(`Player ${currentPlayer.id} built ${getBuildingDisplayName(building)} on ${squareKey}.`);
  syncBoardVisualState();
  renderUI();
}

function confirmGearStationBuildPlacement() {
  const currentPlayer = getCurrentPlayer();
  const squareKey = state.pendingGearStationSquareKey;
  const statusId = state.pendingGearStationStatusId;
  const card = BUILD_CARD_LIBRARY.GEAR_STATION;

  if (!squareKey || !statusId || !DRONE_STATUS_LIBRARY[statusId]) {
    addLog('Select a Drone Status before confirming Gear Station build.');
    return;
  }
  if (currentPlayer.supply < card.supplyCost) {
    addLog('Not enough Supply to build this structure.');
    clearSelection();
    renderUI();
    return;
  }
  if (!isPlayerBaseSquare(currentPlayer.id, squareKey)) {
    addLog('Building can only be placed on your base squares.');
    clearSelection();
    renderUI();
    return;
  }
  const square = fromSquareKey(squareKey);
  if (getUnitAt(square.x, square.z) || getBuildingAtSquare(currentPlayer.id, squareKey)) {
    addLog('Selected base square is no longer available.');
    clearSelection();
    renderUI();
    return;
  }

  currentPlayer.supply -= card.supplyCost;
  const building = createBuilding(currentPlayer.id, card.buildingType, squareKey, {
    assignedStatusId: statusId
  });
  currentPlayer.buildingsPlayedThisTurn += 1;
  state.mode = 'idle';
  state.placingBuildingType = null;
  state.pendingGearStationSquareKey = null;
  state.pendingGearStationStatusId = null;
  addLog(`Player ${currentPlayer.id} built ${getBuildingDisplayName(building)} on ${squareKey}.`);
  syncBoardVisualState();
  renderUI();
}

function confirmAssemblyLineBuildPlacement() {
  const currentPlayer = getCurrentPlayer();
  const squareKey = state.pendingAssemblyLineSquareKey;
  const statusId = state.pendingAssemblyLineStatusId;
  const card = BUILD_CARD_LIBRARY.ASSEMBLY_LINE;

  if (!squareKey || !statusId || !DRONE_STATUS_LIBRARY[statusId]) {
    addLog('Select a Drone Status before confirming Assembly Line build.');
    return;
  }
  if (currentPlayer.supply < card.supplyCost) {
    addLog('Not enough Supply to build this structure.');
    clearSelection();
    renderUI();
    return;
  }
  if (!isPlayerBaseSquare(currentPlayer.id, squareKey)) {
    addLog('Building can only be placed on your base squares.');
    clearSelection();
    renderUI();
    return;
  }
  const square = fromSquareKey(squareKey);
  if (getUnitAt(square.x, square.z) || getBuildingAtSquare(currentPlayer.id, squareKey)) {
    addLog('Selected base square is no longer available.');
    clearSelection();
    renderUI();
    return;
  }

  currentPlayer.supply -= card.supplyCost;
  const building = createBuilding(currentPlayer.id, card.buildingType, squareKey, {
    assignedStatusId: statusId
  });
  currentPlayer.buildingsPlayedThisTurn += 1;
  state.mode = 'idle';
  state.placingBuildingType = null;
  state.pendingAssemblyLineSquareKey = null;
  state.pendingAssemblyLineStatusId = null;
  addLog(`Player ${currentPlayer.id} built ${getBuildingDisplayName(building)} on ${squareKey}.`);
  syncBoardVisualState();
  renderUI();
}

function applyAdjacencyBonusesToCard(playerId, card) {
  if (!card) {
    return;
  }
  const cardTemplate = CARD_LIBRARY[card.cardId];
  if (!cardTemplate || cardTemplate.cardType !== 'unit_summon') {
    card.adjacencyBonuses = null;
    return;
  }
  if (!card.producedByBuildingId) {
    card.adjacencyBonuses = null;
    return;
  }
  const player = state.players[playerId];
  const sourceBuilding = player?.buildings?.find((building) => building.id === card.producedByBuildingId) ?? null;
  if (!sourceBuilding) {
    card.adjacencyBonuses = null;
    return;
  }
  const cardMatchesFactory =
    (sourceBuilding.type === 'ARMORY' && card.cardId === CARD_LIBRARY.TANK_DRONE.id) ||
    (sourceBuilding.type === 'REPLICATOR' && card.cardId === CARD_LIBRARY.PAWN_DRONE.id) ||
    (sourceBuilding.type === 'WORKSHOP' && card.cardId === CARD_LIBRARY.SUPPORT_DRONE.id) ||
    (sourceBuilding.type === 'DATACENTER' && card.cardId === CARD_LIBRARY.SPECIALIST.id) ||
    (sourceBuilding.type === 'GEAR_STATION' && card.cardId === CARD_LIBRARY.CREATE_GHOSTBLADE.id) ||
    (sourceBuilding.type === 'ASSEMBLY_LINE' && card.cardId === CARD_LIBRARY.ARTILLERY.id);
  if (!cardMatchesFactory) {
    card.adjacencyBonuses = null;
    return;
  }
  card.adjacencyBonuses = getAdjacencyBonusesForProducedCard(playerId, card.producedByBuildingId);
}

function getCardEnergyCost(card) {
  if (!card) {
    return 0;
  }
  const template = CARD_LIBRARY[card.cardId];
  if (!template) {
    return 0;
  }
  const delta = card.adjacencyBonuses?.energyCostDelta ?? 0;
  return Math.max(0, template.energyCost + delta);
}

function refreshAdjacencyBonusesForPlayerCards(playerId) {
  const player = state.players[playerId];
  if (!player) {
    return;
  }
  for (const zone of [player.hand, player.deck, player.discard]) {
    for (const card of zone) {
      applyAdjacencyBonusesToCard(playerId, card);
    }
  }
}

function getAdjacencyBonusesForProducedCard(playerId, sourceBuildingId) {
  const player = state.players[playerId];
  const sourceBuilding = player.buildings.find((building) => building.id === sourceBuildingId);
  if (!sourceBuilding) {
    return null;
  }

  let hpBonus = 0;
  let attackBonus = 0;
  let supplyBonusMultiplier = 0;
  let moveBonus = 0;
  let energyCostDelta = 0;
  const statuses = [];

  for (const building of player.buildings) {
    if (building.id === sourceBuilding.id) {
      continue;
    }
    if (!areBuildingsSideAdjacent(sourceBuilding, building)) {
      continue;
    }

    if (building.type === 'ARMORY') {
      hpBonus += 1;
    } else if (building.type === 'REPLICATOR') {
      attackBonus += 1;
    } else if (building.type === 'WORKSHOP') {
      supplyBonusMultiplier += 0.5;
    } else if (building.type === 'GEAR_STATION') {
      moveBonus += 1;
    } else if (building.type === 'ASSEMBLY_LINE') {
      energyCostDelta -= 3;
    }
  }

  if (hpBonus > 0) {
    statuses.push({
      key: 'adj_armory_hp',
      glyph: '&#10133;',
      label: '+HP',
      tooltip: 'Adjacency bonus from The Armory, +1 HP'
    });
  }
  if (attackBonus > 0) {
    statuses.push({
      key: 'adj_replicator_att',
      glyph: '&#128165;',
      label: '+ATT',
      tooltip: 'Adjacency bonus from The Replicator, +1 ATT'
    });
  }
  if (supplyBonusMultiplier > 0) {
    statuses.push({
      key: 'adj_workshop_supply',
      glyph: '&#36;',
      label: '+Supply',
      tooltip: 'Adjacency bonus from The Workshop, +50% SUP'
    });
  }
  if (moveBonus > 0) {
    statuses.push({
      key: 'adj_gear_station_mov',
      glyph: '&#128736;',
      label: '+MOV',
      tooltip: 'Adjacency bonus from Gear Station, +1 MOV'
    });
  }
  if (energyCostDelta < 0) {
    statuses.push({
      key: 'adj_assembly_line_cost',
      glyph: '&#9881;',
      label: '-ENG',
      tooltip: 'Adjacency bonus from Assembly Line, -3 Energy Cost'
    });
  }

  if (hpBonus === 0 && attackBonus === 0 && supplyBonusMultiplier === 0 && moveBonus === 0 && energyCostDelta === 0) {
    return null;
  }

  return {
    hpBonus,
    attackBonus,
    supplyBonusMultiplier,
    moveBonus,
    energyCostDelta,
    statuses
  };
}

function areBuildingsSideAdjacent(buildingA, buildingB) {
  const a = fromSquareKey(buildingA.squareKey);
  const b = fromSquareKey(buildingB.squareKey);
  const dx = Math.abs(a.x - b.x);
  const dz = Math.abs(a.z - b.z);
  return dx + dz === 1;
}

function clearSelection() {
  state.mode = 'idle';
  state.hoverSquareKey = null;
  state.selectedCardHandIndex = null;
  state.selectedUnitId = null;
  state.coreMagnetPreviewUnitId = null;
  state.coreMagnetBulwarkTargetSquareKey = null;
  state.repairTargetingCasterId = null;
  state.systemShockCasterId = null;
  state.ghostbladeTeleportCasterId = null;
  state.specialistEmpCasterId = null;
  state.pendingSystemShockLevel = null;
  state.pendingSystemShockSourceSlot = null;
  state.pendingShieldingLevel = null;
  state.pendingShieldingSourceSlot = null;
  state.pendingShimmeringLevel = null;
  state.pendingShimmeringSourceSlot = null;
  state.pendingShimmeringSquares = [];
  state.placingBuildingType = null;
  state.pendingArmorySquareKey = null;
  state.pendingArmoryStatusId = null;
  state.pendingReplicatorSquareKey = null;
  state.pendingReplicatorStatusId = null;
  state.pendingWorkshopSquareKey = null;
  state.pendingWorkshopStatusId = null;
  state.pendingDatacenterSquareKey = null;
  state.pendingDatacenterStatusId = null;
  state.pendingGearStationSquareKey = null;
  state.pendingGearStationStatusId = null;
  state.pendingAssemblyLineSquareKey = null;
  state.pendingAssemblyLineStatusId = null;
  state.pendingUpgradeBuildingId = null;
  state.pendingUpgradeStatusId = null;
  state.pendingUpgradeStatusOptions = [];
  state.pendingFoundationTargetBuildingId = null;
}

function getSummonSquares(playerId) {
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];

  const valid = new Set();
  for (const baseSquareKey of BASE_SQUARES[playerId]) {
    const baseSquare = fromSquareKey(baseSquareKey);
    for (const [dx, dz] of directions) {
      const x = baseSquare.x + dx;
      const z = baseSquare.z + dz;
      if (!isInsideBoard(x, z)) {
        continue;
      }

      const candidate = toSquareKey(x, z);
      if (isActiveBaseSquare(candidate)) {
        continue;
      }

      if (getUnitAt(x, z)) {
        continue;
      }

      valid.add(candidate);
    }
  }

  return [...valid];
}

function isSquareWalkable(squareKey) {
  if (isActiveBaseSquare(squareKey)) {
    return false;
  }

  const square = fromSquareKey(squareKey);
  return !getUnitAt(square.x, square.z);
}

function consumeSystemShockFollowUp(unit, actionType) {
  if (!unit?.systemShockFollowUpReady) {
    return false;
  }
  unit.systemShockFollowUpReady = false;
  if (actionType === 'move') {
    addLog(`${unit.unitName} used System Shock momentum to move once after overloading.`);
  } else if (actionType === 'attack') {
    unit.hasAttacked = false;
    addLog(`${unit.unitName} used System Shock momentum to attack once after overloading.`);
  }
  return true;
}

function applyShieldToUnit(unit, shieldAmount, options = {}) {
  let value = Math.max(0, Math.floor(shieldAmount));
  if (!unit || value <= 0) {
    return;
  }
  if (unitHasStatus(unit, DRONE_STATUS_LIBRARY.SALVO.id)) {
    return;
  }
  if (unitHasStatus(unit, DRONE_STATUS_LIBRARY.KNIGHT.id)) {
    value *= 2;
  }
  if (options.allowStack) {
    unit.shieldHitPoints = (unit.shieldHitPoints ?? 0) + value;
  } else {
    unit.shieldHitPoints = Math.max(unit.shieldHitPoints ?? 0, value);
  }
}

function removeUnitShield(unit) {
  if (!unit) {
    return 0;
  }
  const removed = Math.max(0, unit.shieldHitPoints ?? 0);
  unit.shieldHitPoints = 0;
  return removed;
}

function isUnitMovementStunned(unit) {
  return (unit?.empStunnedTurns ?? 0) > 0;
}

function getSpecialistEmpCooldownTurns(unit) {
  if (!unit || unit.unitTypeId !== 'SPECIALIST_UNIT') {
    return 2;
  }
  let bonus = 0;
  for (const statusId of unit.grantedStatusIds ?? []) {
    bonus += DRONE_STATUS_LIBRARY[statusId]?.effects?.specialistEmpCooldownBonus ?? 0;
  }
  return Math.max(0, 2 + bonus);
}

function addShimmeringCloak(owner, squareKeys, turnsLeft) {
  const validSquares = [...new Set(squareKeys)].filter((squareKey) => {
    const square = fromSquareKey(squareKey);
    return isInsideBoard(square.x, square.z);
  });
  if (validSquares.length === 0) {
    return;
  }
  state.shimmeringCloaks.push({
    id: `cloak_${owner}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    owner,
    squares: validSquares,
    turnsLeft: Math.max(1, turnsLeft)
  });
}

function tickShimmeringCloaksForPlayer(playerId) {
  let removedCount = 0;
  state.shimmeringCloaks = state.shimmeringCloaks.filter((cloak) => {
    if (cloak.owner !== playerId) {
      return true;
    }
    cloak.turnsLeft -= 1;
    if (cloak.turnsLeft <= 0) {
      removedCount += 1;
      return false;
    }
    return true;
  });
  if (removedCount > 0) {
    addLog(`Player ${playerId} Shimmering Cloak expired on ${removedCount} area(s).`);
  }
}

function getShimmeringCloaksOnSquare(squareKey) {
  return state.shimmeringCloaks.filter((cloak) => cloak.squares.includes(squareKey));
}

function removeShimmeringCloakFromSquare(squareKey) {
  let removedFromAreas = 0;
  const nextCloaks = [];
  for (const cloak of state.shimmeringCloaks) {
    if (!cloak.squares.includes(squareKey)) {
      nextCloaks.push(cloak);
      continue;
    }
    removedFromAreas += 1;
    const remainingSquares = cloak.squares.filter((sq) => sq !== squareKey);
    if (remainingSquares.length > 0) {
      nextCloaks.push({
        ...cloak,
        squares: remainingSquares
      });
    }
  }
  state.shimmeringCloaks = nextCloaks;
  return removedFromAreas;
}

function canPlayerDirectlyTargetSquare(playerId, squareKey) {
  const cloaks = getShimmeringCloaksOnSquare(squareKey);
  if (cloaks.length === 0) {
    return true;
  }
  return cloaks.some((cloak) => cloak.owner === playerId);
}

function canPlayerDirectlyTargetUnit(playerId, unit) {
  if (!unit) {
    return false;
  }
  return canPlayerDirectlyTargetSquare(playerId, toSquareKey(unit.x, unit.z));
}

function getDistance(x1, z1, x2, z2) {
  return Math.max(Math.abs(x1 - x2), Math.abs(z1 - z2));
}

function toSquareKey(x, z) {
  return `${WIDTH_LABELS[x]}${z + 1}`;
}

function fromSquareKey(squareKey) {
  const letter = squareKey[0];
  const number = Number.parseInt(squareKey.slice(1), 10);
  return {
    x: WIDTH_LABELS.indexOf(letter),
    z: number - 1
  };
}

function isInsideBoard(x, z) {
  return x >= 0 && x < BOARD_WIDTH && z >= 0 && z < BOARD_LENGTH;
}

function getBaseOwnerAtSquare(squareKey) {
  if (BASE_SQUARES.A.has(squareKey)) {
    return 'A';
  }
  if (BASE_SQUARES.B.has(squareKey)) {
    return 'B';
  }
  return null;
}

function isActiveBaseSquare(squareKey) {
  const isA = BASE_SQUARES.A.has(squareKey) && !state.players.A.baseDestroyed;
  const isB = BASE_SQUARES.B.has(squareKey) && !state.players.B.baseDestroyed;
  return isA || isB;
}

function isPlayerBaseSquare(playerId, squareKey) {
  return BASE_SQUARES[playerId].has(squareKey) && !state.players[playerId].baseDestroyed;
}

function getBuildingAtSquare(playerId, squareKey) {
  return state.players[playerId].buildings.find((building) => building.squareKey === squareKey) ?? null;
}

function getBuildingById(playerId, buildingId) {
  return state.players[playerId].buildings.find((building) => building.id === buildingId) ?? null;
}

function getBuildingSupplyCostByType(buildingType) {
  const card = Object.values(BUILD_CARD_LIBRARY).find((entry) => entry.buildingType === buildingType);
  return card?.supplyCost ?? 0;
}

function getUnitById(unitId) {
  return state.units.find((unit) => unit.id === unitId);
}

function getUnitAt(x, z) {
  return state.units.find((unit) => unit.x === x && unit.z === z);
}

function getCurrentPlayer() {
  return state.players[state.currentPlayerId];
}

function getSelectedUnit() {
  if (!state.selectedUnitId) {
    return null;
  }
  return getUnitById(state.selectedUnitId) || null;
}

function gridToWorld(x, z) {
  const worldX = (x - (BOARD_WIDTH - 1) / 2) * TILE_SIZE;
  const worldZ = (z - (BOARD_LENGTH - 1) / 2) * TILE_SIZE;
  return new THREE.Vector3(worldX, 0, worldZ);
}

function syncBoardVisualState() {
  const summonSquares = state.mode === 'play_card' ? getSummonSquares(state.currentPlayerId) : [];
  const foundationTargetSquares =
    state.mode === 'foundation_targeting'
      ? new Set(getCurrentPlayer().buildings.map((building) => building.squareKey))
      : new Set();
  const buildingPlacementSquares =
    state.mode === 'place_building' && state.placingBuildingType
      ? [...BASE_SQUARES[state.currentPlayerId]].filter((squareKey) => {
          if (!isPlayerBaseSquare(state.currentPlayerId, squareKey)) {
            return false;
          }
          if (getBuildingAtSquare(state.currentPlayerId, squareKey)) {
            return false;
          }
          const square = fromSquareKey(squareKey);
          return !getUnitAt(square.x, square.z);
        })
      : [];
  const selectedUnit = getSelectedUnit();
  const selectedUnitSquareKey = selectedUnit ? toSquareKey(selectedUnit.x, selectedUnit.z) : null;
  const previewUnit = state.coreMagnetPreviewUnitId ? getUnitById(state.coreMagnetPreviewUnitId) : null;
  const bulwarkPreviewActive =
    state.mode === 'core_magnet_bulwark_targeting' &&
    previewUnit &&
    unitHasStatus(previewUnit, DRONE_STATUS_LIBRARY.BULWARK.id);
  const bulwarkOptionSquares = bulwarkPreviewActive ? new Set(getBulwarkAdjacentSquareKeys(previewUnit)) : new Set();
  const bulwarkPreviewCenterSquareKey = bulwarkPreviewActive
    ? state.hoverSquareKey && bulwarkOptionSquares.has(state.hoverSquareKey)
      ? state.hoverSquareKey
      : state.coreMagnetBulwarkTargetSquareKey && bulwarkOptionSquares.has(state.coreMagnetBulwarkTargetSquareKey)
        ? state.coreMagnetBulwarkTargetSquareKey
        : null
    : null;
  const previewSquares = previewUnit
    ? bulwarkPreviewCenterSquareKey
      ? getBulwarkCoverageSquareKeys(previewUnit, bulwarkPreviewCenterSquareKey)
      : !bulwarkPreviewActive
        ? getCoreMagnetCoverageSquareKeys(previewUnit)
        : new Set()
    : new Set();
  const previewOwnerColor = previewUnit?.owner === 'A' ? 0x2f72ff : 0xd73a49;
  const repairCaster =
    state.mode === 'repair_targeting' ? getUnitById(state.repairTargetingCasterId) : null;
  const repairTargetableIds = new Set(
    repairCaster ? getRepairTargetableUnits(repairCaster).map((unit) => unit.id) : []
  );
  const overloadTargetableIds = new Set(
    state.mode === 'overload_targeting'
      ? state.units.filter((unit) => canTargetUnitWithOverload(unit)).map((unit) => unit.id)
      : []
  );
  const attackTargetingActive =
    state.mode === 'attack_targeting' &&
    selectedUnit &&
    selectedUnit.owner === state.currentPlayerId &&
    canUnitAttackAfterMoving(selectedUnit) &&
    (!selectedUnit.hasAttacked || selectedUnit.systemShockFollowUpReady) &&
    !isUnitPlanted(selectedUnit);
  const selectedAttackRange = selectedUnit ? getUnitCurrentAttackRange(selectedUnit) : 0;
  const systemShockTargetingActive =
    state.mode === 'system_shock_card' || state.mode === 'system_shock_targeting_echo';
  const shimmeringTargetingActive =
    state.mode === 'shimmering_targeting_instant' || state.mode === 'shimmering_targeting_echo';
  const selectedShimmeringSquares = new Set(state.pendingShimmeringSquares ?? []);
  const teleportCaster =
    state.mode === 'ghostblade_teleport_targeting' ? getUnitById(state.ghostbladeTeleportCasterId) : null;
  const teleportTargetingActive =
    Boolean(teleportCaster) && teleportCaster.owner === state.currentPlayerId && teleportCaster.unitTypeId === 'GHOSTBLADE_UNIT';
  const artilleryPreviewSquares = (() => {
    if (state.mode !== 'artillery_attack_targeting' || !state.hoverSquareKey) {
      return new Set();
    }
    const artillery = getSelectedUnit();
    if (!artillery || artillery.unitTypeId !== 'ARTILLERY_UNIT' || artillery.owner !== state.currentPlayerId) {
      return new Set();
    }
    if (hasBallisticStatus(artillery)) {
      return new Set();
    }
    if (unitHasStatus(artillery, DRONE_STATUS_LIBRARY.GAUSS.id)) {
      return new Set(getGaussLineSquareKeysFromTarget(artillery, state.hoverSquareKey));
    }
    return new Set(getArtilleryAreaSquareKeys(state.hoverSquareKey));
  })();
  const artilleryPreviewInRange = (() => {
    if (state.mode !== 'artillery_attack_targeting' || !state.hoverSquareKey) {
      return true;
    }
    const artillery = getSelectedUnit();
    if (!artillery || artillery.unitTypeId !== 'ARTILLERY_UNIT' || artillery.owner !== state.currentPlayerId) {
      return false;
    }
    if (hasBallisticStatus(artillery)) {
      return true;
    }
    if (unitHasStatus(artillery, DRONE_STATUS_LIBRARY.GAUSS.id)) {
      return getGaussLineSquareKeysFromTarget(artillery, state.hoverSquareKey).length > 0;
    }
    const areaKeys = getArtilleryAreaSquareKeys(state.hoverSquareKey);
    const nearestDistance = getMinDistanceToAreaFromUnit(artillery.x, artillery.z, areaKeys);
    const maxRange = getUnitCurrentAttackRange(artillery);
    return nearestDistance >= 2 && nearestDistance <= maxRange;
  })();
  const specialistEmpPreviewSquares =
    state.mode === 'specialist_emp_targeting' && state.hoverSquareKey
      ? new Set(getArtilleryAreaSquareKeys(state.hoverSquareKey))
      : new Set();
  const specialistEmpPreviewInRange = (() => {
    if (state.mode !== 'specialist_emp_targeting' || !state.hoverSquareKey) {
      return true;
    }
    const specialist = getUnitById(state.specialistEmpCasterId);
    if (!specialist || specialist.unitTypeId !== 'SPECIALIST_UNIT' || specialist.owner !== state.currentPlayerId) {
      return false;
    }
    const areaKeys = getArtilleryAreaSquareKeys(state.hoverSquareKey);
    const nearestDistance = getMinDistanceToAreaFromUnit(specialist.x, specialist.z, areaKeys);
    const maxRange = getUnitCurrentAttackRange(specialist);
    return nearestDistance <= maxRange;
  })();
  const attackTargetableUnitIds = new Set(
    attackTargetingActive
      ? state.units
          .filter(
            (unit) =>
              unit.owner !== selectedUnit.owner &&
              canPlayerDirectlyTargetUnit(state.currentPlayerId, unit) &&
              getDistance(selectedUnit.x, selectedUnit.z, unit.x, unit.z) <= selectedAttackRange
          )
          .map((unit) => unit.id)
      : []
  );
  const artilleryBallisticTargetableUnitIds = new Set(
    state.mode === 'artillery_attack_targeting' &&
      selectedUnit &&
      selectedUnit.owner === state.currentPlayerId &&
      hasBallisticStatus(selectedUnit)
      ? state.units
          .filter(
            (unit) =>
              unit.owner !== selectedUnit.owner &&
              getDistance(selectedUnit.x, selectedUnit.z, unit.x, unit.z) <= getUnitCurrentAttackRange(selectedUnit)
          )
          .map((unit) => unit.id)
      : []
  );
  const artilleryBallisticTargetableBaseSquares = new Set(
    state.mode === 'artillery_attack_targeting' &&
      selectedUnit &&
      selectedUnit.owner === state.currentPlayerId &&
      hasBallisticStatus(selectedUnit)
      ? ['A', 'B']
          .filter((baseOwner) => baseOwner !== selectedUnit.owner)
          .flatMap((baseOwner) =>
            [...(BASE_ARTILLERY_FRONT_SQUARES[baseOwner] ?? [])].filter((squareKey) => {
              const sq = fromSquareKey(squareKey);
              return getDistance(selectedUnit.x, selectedUnit.z, sq.x, sq.z) <= getUnitCurrentAttackRange(selectedUnit);
            })
          )
      : []
  );
  const systemShockTargetableUnitIds = new Set(
    systemShockTargetingActive
      ? getSystemShockTargetableEnemyUnits(state.currentPlayerId).map((unit) => unit.id)
      : []
  );
  const selectedMoveRange = selectedUnit ? getUnitCurrentMoveRange(selectedUnit) : 0;
  const canMoveAfterAttack =
    (selectedUnit?.tacticalDashActiveThisTurn ?? false) ||
    (selectedUnit?.systemShockFollowUpReady ?? false);
  const selectedMoveRemaining =
    selectedUnit ? selectedMoveRange - (selectedUnit.movementUsedThisTurn ?? 0) : 0;
  const moveTargetSquares = new Set();
  if (
    selectedUnit &&
    selectedMoveRemaining > 0 &&
    !isUnitMovementStunned(selectedUnit) &&
    (!selectedUnit.hasAttacked || canMoveAfterAttack)
  ) {
    for (const [squareKey, squareMesh] of squareMeshesByKey.entries()) {
      if (!isSquareWalkable(squareKey)) {
        continue;
      }
      if (getDistance(selectedUnit.x, selectedUnit.z, squareMesh.userData.x, squareMesh.userData.z) <= selectedMoveRemaining) {
        moveTargetSquares.add(squareKey);
      }
    }
  }
  const moveBorderColor = selectedUnit?.owner === 'A' ? 0x4da3ff : 0xff6b7a;
  updateMoveRangeBorder(moveTargetSquares, moveBorderColor);

  for (const [, mesh] of squareMeshesByKey) {
    const squareKey = mesh.userData.squareKey;
    const isSelectedSummonTarget = summonSquares.includes(squareKey);
    const isFoundationTargetSquare = foundationTargetSquares.has(squareKey);
    const isBuildingPlacementTarget = buildingPlacementSquares.includes(squareKey);
    const shimmeringCloaks = getShimmeringCloaksOnSquare(squareKey);
    const hasShimmeringCloak = shimmeringCloaks.length > 0;
    const activeCoreMagnetOwner = getCoreMagnetOwnerCoveringSquare(squareKey);
    const isCoreMagnetPreview = previewSquares.has(squareKey);
    const isBulwarkOptionSquare = bulwarkOptionSquares.has(squareKey);

    const isAttackRangeSquare =
      attackTargetingActive &&
      getDistance(selectedUnit.x, selectedUnit.z, mesh.userData.x, mesh.userData.z) <= selectedAttackRange;
    const isArtilleryBallisticBaseSquare = artilleryBallisticTargetableBaseSquares.has(squareKey);
    const isShockRangeSquare =
      systemShockTargetingActive &&
      systemShockTargetableUnitIds.size > 0 &&
      state.units.some(
        (unit) =>
          systemShockTargetableUnitIds.has(unit.id) && toSquareKey(unit.x, unit.z) === mesh.userData.squareKey
      );
    const isShimmeringTargetSquare = shimmeringTargetingActive;
    const isSelectedShimmeringSquare = selectedShimmeringSquares.has(squareKey);
    const isArtilleryPreviewSquare = artilleryPreviewSquares.has(squareKey);
    const isSpecialistEmpPreviewSquare = specialistEmpPreviewSquares.has(squareKey);
    const isOutOfRangeAreaPreviewSquare =
      (isArtilleryPreviewSquare && !artilleryPreviewInRange) ||
      (isSpecialistEmpPreviewSquare && !specialistEmpPreviewInRange);
    const isTeleportTargetSquare =
      teleportTargetingActive &&
      !getUnitAt(mesh.userData.x, mesh.userData.z) &&
      (!getBaseOwnerAtSquare(squareKey) || getBaseOwnerAtSquare(squareKey) === teleportCaster.owner) &&
      !getBuildingAtSquare('A', squareKey) &&
      !getBuildingAtSquare('B', squareKey);
    const isSelectedUnitSquare = selectedUnitSquareKey === squareKey;
    const selectedUnitColor = selectedUnit?.owner === 'A' ? 0x2f72ff : 0xd73a49;

    if (isSelectedUnitSquare) {
      mesh.material.emissive = new THREE.Color(selectedUnitColor);
      mesh.material.emissiveIntensity = 0.55;
    } else if (isCoreMagnetPreview) {
      mesh.material.emissive = new THREE.Color(previewUnit.owner === 'A' ? 0x2f72ff : 0xd73a49);
      mesh.material.emissiveIntensity = 0.58;
    } else if (isBulwarkOptionSquare) {
      const blink = 0.26 + ((Math.sin(Date.now() * 0.012) + 1) / 2) * 0.26;
      mesh.material.emissive = new THREE.Color(0x9ca3af);
      mesh.material.emissiveIntensity = blink;
    } else if (activeCoreMagnetOwner) {
      mesh.material.emissive = new THREE.Color(activeCoreMagnetOwner === 'A' ? 0x2f72ff : 0xd73a49);
      mesh.material.emissiveIntensity = 0.3;
    } else {
      mesh.material.emissive = new THREE.Color(
        isSelectedShimmeringSquare
          ? 0x93c5fd
          : isOutOfRangeAreaPreviewSquare
            ? 0x9ca3af
          : isSpecialistEmpPreviewSquare
            ? 0xa855f7
          : isArtilleryPreviewSquare
            ? 0xf97316
          : isTeleportTargetSquare
            ? 0x22d3ee
          : isSelectedSummonTarget
          ? 0x2f9e44
            : isAttackRangeSquare
              ? 0xb91c1c
            : isArtilleryBallisticBaseSquare
              ? 0xf97316
            : isShockRangeSquare
              ? 0x7c3aed
            : isFoundationTargetSquare
              ? 0xf59e0b
            : isBuildingPlacementTarget
              ? 0x14b8a6
              : hasShimmeringCloak
                ? 0x60a5fa
              : 0x000000
      );
      mesh.material.emissiveIntensity =
        isSelectedShimmeringSquare ||
        isOutOfRangeAreaPreviewSquare ||
        isSpecialistEmpPreviewSquare ||
        isArtilleryPreviewSquare ||
        isSelectedSummonTarget ||
        isAttackRangeSquare ||
        isArtilleryBallisticBaseSquare ||
        isShockRangeSquare ||
        isFoundationTargetSquare ||
        isTeleportTargetSquare ||
        isBuildingPlacementTarget ||
        hasShimmeringCloak ||
        isShimmeringTargetSquare
          ? 0.45
          : 0;
    }

    if (mesh.userData.isBaseSquare) {
      const baseOwner = mesh.userData.owner;
      const hp = state.players[baseOwner].baseHitPoints;
      const baseMax = Math.max(1, state.players[baseOwner].baseMaxHitPoints ?? BASE_MAX_HIT_POINTS);
      const damageFactor = 1 - hp / baseMax;
      const originalColor = new THREE.Color(baseOwner === 'A' ? 0x294889 : 0x7a2730);
      const damagedColor = new THREE.Color(0x2b1b1b);
      mesh.material.color.copy(originalColor).lerp(damagedColor, damageFactor * 0.9);
      mesh.material.roughness = 0.82 + damageFactor * 0.16;
      mesh.material.metalness = 0.05;
    } else {
      if (mesh.userData.isPurpleSquare) {
        mesh.material.color.setHex(mesh.userData.isDark ? 0x5a2f8a : 0x6d3fa8);
      } else if (mesh.userData.isHarvestSquare) {
        mesh.material.color.setHex(mesh.userData.isDark ? 0xa48012 : 0xbe9719);
      } else {
        mesh.material.color.setHex(mesh.userData.isDark ? 0x22303e : 0x2c3d4f);
      }
      mesh.material.roughness = 0.85;
      mesh.material.metalness = 0.05;
    }
  }

  for (const [owner, baseMeshes] of baseMeshesByPlayer.entries()) {
    const hp = state.players[owner].baseHitPoints;
    const baseMax = Math.max(1, state.players[owner].baseMaxHitPoints ?? BASE_MAX_HIT_POINTS);
    const damageFactor = 1 - hp / baseMax;
    const start = new THREE.Color(BASE_COLORS[owner]);
    const end = new THREE.Color(0x281314);
    for (const baseMesh of baseMeshes) {
      baseMesh.material.color.copy(start).lerp(end, damageFactor * 0.9);
      baseMesh.material.emissive = new THREE.Color(0xff3b30);
      baseMesh.material.emissiveIntensity = damageFactor * 0.45;
      baseMesh.material.roughness = 0.66 + damageFactor * 0.22;
    }
  }

  const aliveIds = new Set(state.units.map((unit) => unit.id));

  for (const [unitId, visual] of unitVisualsById.entries()) {
    if (!aliveIds.has(unitId)) {
      boardGroup.remove(visual.root);
      const idx = clickableMeshes.indexOf(visual.clickableMesh);
      if (idx >= 0) {
        clickableMeshes.splice(idx, 1);
      }
      unitVisualsById.delete(unitId);
    }
  }

  for (const unit of state.units) {
    let visual = unitVisualsById.get(unit.id);
    if (!visual) {
      visual = createUnitVisual(unit);
      boardGroup.add(visual.root);
      clickableMeshes.push(visual.clickableMesh);
      unitVisualsById.set(unit.id, visual);
    }

    if (!movementAnimations.has(unit.id)) {
      const position = gridToWorld(unit.x, unit.z);
      visual.root.position.set(position.x, visual.baseY ?? 0.3, position.z);
      resetWalkCycle(visual);
    }
    updateUnitFacing(visual, unit);

    visual.bodyMaterial.emissive.setHex(state.selectedUnitId === unit.id ? 0x74c0fc : 0x000000);
    visual.bodyMaterial.emissiveIntensity = state.selectedUnitId === unit.id ? 0.45 : 0;

    const unitSquareKey = toSquareKey(unit.x, unit.z);
    if (previewUnit && previewSquares.has(unitSquareKey)) {
      visual.bodyMaterial.emissive.setHex(previewOwnerColor);
      visual.bodyMaterial.emissiveIntensity = 0.55;
    } else if (overloadTargetableIds.has(unit.id)) {
      visual.bodyMaterial.emissive.setHex(0xf59e0b);
      visual.bodyMaterial.emissiveIntensity = 0.58;
    } else if (repairTargetableIds.has(unit.id)) {
      visual.bodyMaterial.emissive.setHex(0x22c55e);
      visual.bodyMaterial.emissiveIntensity = 0.55;
    } else if (attackTargetableUnitIds.has(unit.id)) {
      visual.bodyMaterial.emissive.setHex(0xef4444);
      visual.bodyMaterial.emissiveIntensity = 0.6;
    } else if (artilleryBallisticTargetableUnitIds.has(unit.id)) {
      visual.bodyMaterial.emissive.setHex(0xf97316);
      visual.bodyMaterial.emissiveIntensity = 0.62;
    } else if (systemShockTargetableUnitIds.has(unit.id)) {
      visual.bodyMaterial.emissive.setHex(0xa855f7);
      visual.bodyMaterial.emissiveIntensity = 0.62;
    }

    updateUnitStatusIcon(visual, unit);
    updateUnitStatusBadges(visual, unit);
    updateUnitHealthBars(visual, unit);
    updateArtillerySetUpPose(visual, unit);
    updateGhostbladeTangoPose(visual, unit);
    if (visual.shellGuardRing) {
      visual.shellGuardRing.visible =
        unit.unitTypeId === 'GHOSTBLADE_UNIT' &&
        unitHasStatus(unit, DRONE_STATUS_LIBRARY.SHELL.id) &&
        !!unit.shellGuardActive;
    }
    if (visual.coreMagnetDome) {
      const showBulwarkShield =
        unit.unitTypeId === 'TANK_DRONE_UNIT' &&
        unit.coreMagnetTurnsLeft > 0 &&
        unitHasStatus(unit, DRONE_STATUS_LIBRARY.BULWARK.id) &&
        !!unit.coreMagnetBulwarkCenterSquareKey;
      visual.coreMagnetDome.visible = unit.coreMagnetTurnsLeft > 0 && !showBulwarkShield;
      if (visual.bulwarkShield) {
        visual.bulwarkShield.visible = showBulwarkShield;
        if (showBulwarkShield) {
          const center = fromSquareKey(unit.coreMagnetBulwarkCenterSquareKey);
          const dx = center.x - unit.x;
          const dz = center.z - unit.z;
          const shieldWorld = gridToWorld(center.x, center.z);
          const shieldLocal = visual.root.worldToLocal(new THREE.Vector3(shieldWorld.x, 1.66, shieldWorld.z));
          visual.bulwarkShield.position.copy(shieldLocal);
          // Keep shield parallel to covered board area in world-space (independent from unit facing).
          const desiredWorldY = Math.abs(dx) === 1 ? Math.PI / 2 : 0;
          visual.bulwarkShield.rotation.y = desiredWorldY - visual.root.rotation.y;
        }
      }
    }
  }

  const activeBuildings = [...state.players.A.buildings, ...state.players.B.buildings];
  const activeBuildingIds = new Set(activeBuildings.map((building) => building.id));

  for (const [buildingId, visual] of buildingVisualsById.entries()) {
    if (!activeBuildingIds.has(buildingId)) {
      boardGroup.remove(visual.root);
      buildingVisualsById.delete(buildingId);
    }
  }

  for (const building of activeBuildings) {
    let visual = buildingVisualsById.get(building.id);
    if (!visual) {
      visual = createBuildingVisual(building);
      boardGroup.add(visual.root);
      buildingVisualsById.set(building.id, visual);
    }

    const square = fromSquareKey(building.squareKey);
    const worldPos = gridToWorld(square.x, square.z);
    visual.root.position.set(worldPos.x, 0.28, worldPos.z);
  }
}

function createBuildingVisual(building) {
  if (building.type === 'ARMORY') {
    return createArmoryVisual(building);
  }
  if (building.type === 'REPLICATOR') {
    return createReplicatorVisual(building);
  }
  if (building.type === 'WORKSHOP') {
    return createWorkshopVisual(building);
  }
  if (building.type === 'DATACENTER') {
    return createDatacenterVisual(building);
  }
  if (building.type === 'GEAR_STATION') {
    return createGearStationVisual(building);
  }
  if (building.type === 'ASSEMBLY_LINE') {
    return createAssemblyLineVisual(building);
  }

  const root = new THREE.Group();
  return { root, owner: building.owner };
}

function createArmoryVisual(building) {
  const root = new THREE.Group();
  const ownerColor = building.owner === 'A' ? 0x477fe0 : 0xbf4652;
  const darkSteel = new THREE.MeshStandardMaterial({
    color: 0x2f3c49,
    roughness: 0.62,
    metalness: 0.42
  });
  const ownerSteel = new THREE.MeshStandardMaterial({
    color: ownerColor,
    roughness: 0.44,
    metalness: 0.48
  });

  const platform = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE * 0.72, 0.5, TILE_SIZE * 0.72), darkSteel);
  platform.position.y = 0.25;
  platform.castShadow = true;
  platform.receiveShadow = true;
  root.add(platform);

  const mainBody = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE * 0.5, 0.9, TILE_SIZE * 0.44), ownerSteel);
  mainBody.position.set(0, 0.92, 0);
  mainBody.castShadow = true;
  root.add(mainBody);

  const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.7, 10), darkSteel);
  tower.position.set(TILE_SIZE * 0.16, 1.58, 0);
  tower.castShadow = true;
  root.add(tower);

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 10), darkSteel);
  barrel.rotation.z = Math.PI / 2;
  barrel.position.set(TILE_SIZE * 0.32, 1.6, 0);
  barrel.castShadow = true;
  root.add(barrel);

  const ventL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.3, 0.16), ownerSteel);
  ventL.position.set(-TILE_SIZE * 0.18, 1.42, TILE_SIZE * 0.12);
  ventL.castShadow = true;
  root.add(ventL);

  const ventR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.3, 0.16), ownerSteel);
  ventR.position.set(-TILE_SIZE * 0.18, 1.42, -TILE_SIZE * 0.12);
  ventR.castShadow = true;
  root.add(ventR);

  if (building.assignedStatusId) {
    const statusIcon = createBuildingStatusIcon(building.assignedStatusId);
    if (statusIcon) {
      statusIcon.position.set(0, 2.05, 0);
      root.add(statusIcon);
    }
  }

  return { root, owner: building.owner };
}

function createReplicatorVisual(building) {
  const root = new THREE.Group();
  const ownerColor = building.owner === 'A' ? 0x4d8dff : 0xd85b66;
  const darkSteel = new THREE.MeshStandardMaterial({
    color: 0x2a353f,
    roughness: 0.58,
    metalness: 0.46
  });
  const ownerSteel = new THREE.MeshStandardMaterial({
    color: ownerColor,
    roughness: 0.42,
    metalness: 0.52
  });
  const glowMaterial = new THREE.MeshStandardMaterial({
    color: 0x79d4ff,
    emissive: 0x2d9bf0,
    emissiveIntensity: 0.75,
    roughness: 0.2,
    metalness: 0.08
  });

  const platform = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE * 0.76, 0.46, TILE_SIZE * 0.76), darkSteel);
  platform.position.y = 0.24;
  platform.castShadow = true;
  platform.receiveShadow = true;
  root.add(platform);

  const hall = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE * 0.58, 0.72, TILE_SIZE * 0.5), ownerSteel);
  hall.position.set(0, 0.78, 0);
  hall.castShadow = true;
  root.add(hall);

  const leftStack = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.66, 10), darkSteel);
  leftStack.position.set(-TILE_SIZE * 0.2, 1.2, -TILE_SIZE * 0.14);
  leftStack.castShadow = true;
  root.add(leftStack);

  const rightStack = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.66, 10), darkSteel);
  rightStack.position.set(TILE_SIZE * 0.2, 1.2, -TILE_SIZE * 0.14);
  rightStack.castShadow = true;
  root.add(rightStack);

  const conveyor = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE * 0.42, 0.12, TILE_SIZE * 0.24), darkSteel);
  conveyor.position.set(0, 1.06, TILE_SIZE * 0.08);
  conveyor.castShadow = true;
  root.add(conveyor);

  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.3, 14), glowMaterial);
  core.rotation.x = Math.PI / 2;
  core.position.set(0, 1.12, TILE_SIZE * 0.2);
  core.castShadow = true;
  root.add(core);

  const frame = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.04, 10, 22), ownerSteel);
  frame.rotation.x = Math.PI / 2;
  frame.position.set(0, 1.12, TILE_SIZE * 0.2);
  frame.castShadow = true;
  root.add(frame);

  if (building.assignedStatusId) {
    const statusIcon = createBuildingStatusIcon(building.assignedStatusId);
    if (statusIcon) {
      statusIcon.position.set(0, 1.9, 0);
      root.add(statusIcon);
    }
  }

  return { root, owner: building.owner };
}

function createWorkshopVisual(building) {
  const root = new THREE.Group();
  const ownerColor = building.owner === 'A' ? 0x6f9eff : 0xe06a74;
  const steel = new THREE.MeshStandardMaterial({
    color: 0x2d3a45,
    roughness: 0.6,
    metalness: 0.44
  });
  const ownerSteel = new THREE.MeshStandardMaterial({
    color: ownerColor,
    roughness: 0.45,
    metalness: 0.5
  });
  const accent = new THREE.MeshStandardMaterial({
    color: 0xf6c66f,
    emissive: 0x8f6b24,
    emissiveIntensity: 0.5,
    roughness: 0.26,
    metalness: 0.2
  });

  const base = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE * 0.72, 0.44, TILE_SIZE * 0.72), steel);
  base.position.y = 0.22;
  base.castShadow = true;
  base.receiveShadow = true;
  root.add(base);

  const body = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE * 0.52, 0.72, TILE_SIZE * 0.52), ownerSteel);
  body.position.set(0, 0.8, 0);
  body.castShadow = true;
  root.add(body);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(TILE_SIZE * 0.26, 0.34, 4), steel);
  roof.position.set(0, 1.32, 0);
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  root.add(roof);

  const gantry = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE * 0.46, 0.08, 0.1), steel);
  gantry.position.set(0, 1.0, TILE_SIZE * 0.18);
  gantry.castShadow = true;
  root.add(gantry);

  const hook = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 8, 14, Math.PI * 1.4), accent);
  hook.position.set(0, 0.9, TILE_SIZE * 0.18);
  hook.rotation.z = 0.3;
  hook.castShadow = true;
  root.add(hook);

  const sideTank = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 12), ownerSteel);
  sideTank.position.set(-TILE_SIZE * 0.24, 0.9, -TILE_SIZE * 0.08);
  sideTank.castShadow = true;
  root.add(sideTank);

  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 10), accent);
  lamp.position.set(TILE_SIZE * 0.2, 1.08, TILE_SIZE * 0.12);
  lamp.castShadow = true;
  root.add(lamp);

  return { root, owner: building.owner };
}

function createDatacenterVisual(building) {
  const root = new THREE.Group();
  const ownerColor = building.owner === 'A' ? 0x68a0ff : 0xe36b77;
  const steel = new THREE.MeshStandardMaterial({
    color: 0x2a3642,
    roughness: 0.58,
    metalness: 0.46
  });
  const ownerSteel = new THREE.MeshStandardMaterial({
    color: ownerColor,
    roughness: 0.42,
    metalness: 0.48
  });
  const glow = new THREE.MeshStandardMaterial({
    color: 0x9be0ff,
    emissive: 0x3595e8,
    emissiveIntensity: 0.72,
    roughness: 0.2,
    metalness: 0.12
  });

  const base = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE * 0.74, 0.44, TILE_SIZE * 0.74), steel);
  base.position.y = 0.22;
  base.castShadow = true;
  base.receiveShadow = true;
  root.add(base);

  const tower = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE * 0.34, 1.1, TILE_SIZE * 0.34), ownerSteel);
  tower.position.set(0, 0.98, 0);
  tower.castShadow = true;
  root.add(tower);

  const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.22, 12), steel);
  topCap.position.set(0, 1.62, 0);
  topCap.castShadow = true;
  root.add(topCap);

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.62, 10), steel);
  mast.position.set(0, 2.02, 0);
  mast.castShadow = true;
  root.add(mast);

  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), glow);
  beacon.position.set(0, 2.38, 0);
  beacon.castShadow = true;
  root.add(beacon);

  const sideModuleA = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE * 0.18, 0.32, TILE_SIZE * 0.22), ownerSteel);
  sideModuleA.position.set(TILE_SIZE * 0.19, 0.72, 0);
  sideModuleA.castShadow = true;
  root.add(sideModuleA);

  const sideModuleB = sideModuleA.clone();
  sideModuleB.position.set(-TILE_SIZE * 0.19, 0.72, 0);
  root.add(sideModuleB);

  return { root, owner: building.owner };
}

function createGearStationVisual(building) {
  const root = new THREE.Group();
  const ownerColor = building.owner === 'A' ? 0x70a9ff : 0xe97682;
  const steel = new THREE.MeshStandardMaterial({
    color: 0x2b3743,
    roughness: 0.6,
    metalness: 0.44
  });
  const ownerSteel = new THREE.MeshStandardMaterial({
    color: ownerColor,
    roughness: 0.44,
    metalness: 0.5
  });
  const amber = new THREE.MeshStandardMaterial({
    color: 0xf8c96a,
    emissive: 0xa46f1a,
    emissiveIntensity: 0.48,
    roughness: 0.28,
    metalness: 0.2
  });

  const base = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE * 0.74, 0.42, TILE_SIZE * 0.74), steel);
  base.position.y = 0.22;
  base.castShadow = true;
  base.receiveShadow = true;
  root.add(base);

  const body = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE * 0.5, 0.76, TILE_SIZE * 0.5), ownerSteel);
  body.position.set(0, 0.8, 0);
  body.castShadow = true;
  root.add(body);

  const gearCore = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.2, 14), steel);
  gearCore.rotation.x = Math.PI / 2;
  gearCore.position.set(0, 1.1, TILE_SIZE * 0.2);
  gearCore.castShadow = true;
  root.add(gearCore);

  const gearTeeth = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.05, 10, 20), ownerSteel);
  gearTeeth.rotation.x = Math.PI / 2;
  gearTeeth.position.set(0, 1.1, TILE_SIZE * 0.2);
  gearTeeth.castShadow = true;
  root.add(gearTeeth);

  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.56, 10), steel);
  antenna.position.set(-TILE_SIZE * 0.16, 1.5, -TILE_SIZE * 0.1);
  antenna.castShadow = true;
  root.add(antenna);

  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 10), amber);
  lamp.position.set(-TILE_SIZE * 0.16, 1.82, -TILE_SIZE * 0.1);
  lamp.castShadow = true;
  root.add(lamp);

  return { root, owner: building.owner };
}

function createAssemblyLineVisual(building) {
  const root = new THREE.Group();
  const ownerColor = building.owner === 'A' ? 0x6ea4ff : 0xe87380;
  const steel = new THREE.MeshStandardMaterial({
    color: 0x2b3844,
    roughness: 0.6,
    metalness: 0.44
  });
  const ownerSteel = new THREE.MeshStandardMaterial({
    color: ownerColor,
    roughness: 0.44,
    metalness: 0.5
  });
  const beltMat = new THREE.MeshStandardMaterial({
    color: 0x70859a,
    roughness: 0.35,
    metalness: 0.38
  });

  const base = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE * 0.76, 0.42, TILE_SIZE * 0.76), steel);
  base.position.y = 0.22;
  base.castShadow = true;
  base.receiveShadow = true;
  root.add(base);

  const line = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE * 0.58, 0.18, TILE_SIZE * 0.2), beltMat);
  line.position.set(0, 0.58, TILE_SIZE * 0.14);
  line.castShadow = true;
  root.add(line);

  const leftRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, TILE_SIZE * 0.22, 12), ownerSteel);
  leftRoller.rotation.z = Math.PI / 2;
  leftRoller.position.set(-TILE_SIZE * 0.24, 0.58, TILE_SIZE * 0.14);
  leftRoller.castShadow = true;
  root.add(leftRoller);

  const rightRoller = leftRoller.clone();
  rightRoller.position.set(TILE_SIZE * 0.24, 0.58, TILE_SIZE * 0.14);
  root.add(rightRoller);

  const module = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE * 0.42, 0.64, TILE_SIZE * 0.36), ownerSteel);
  module.position.set(0, 0.98, -TILE_SIZE * 0.05);
  module.castShadow = true;
  root.add(module);

  const rail = new THREE.Mesh(new THREE.BoxGeometry(TILE_SIZE * 0.5, 0.06, 0.08), steel);
  rail.position.set(0, 1.34, -TILE_SIZE * 0.05);
  rail.castShadow = true;
  root.add(rail);

  return { root, owner: building.owner };
}

function createBuildingStatusIcon(statusId) {
  const template = DRONE_STATUS_LIBRARY[statusId];
  if (!template) {
    return null;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  ctx.clearRect(0, 0, 128, 128);
  ctx.fillStyle = 'rgba(16, 26, 36, 0.92)';
  ctx.beginPath();
  ctx.arc(64, 64, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(129, 169, 208, 0.95)';
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.font = '54px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f0f7ff';
  ctx.fillText(template.iconSymbol ?? '+', 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.9, 0.9, 0.9);
  return sprite;
}

function decodeHtmlGlyphToText(glyph) {
  if (!glyph) {
    return '';
  }
  const el = document.createElement('span');
  el.innerHTML = glyph;
  return (el.textContent ?? '').trim();
}

function getUnitStatusBadgeSymbol(status) {
  if (!status) {
    return '';
  }
  if (status.statusId && DRONE_STATUS_LIBRARY[status.statusId]?.iconSymbol) {
    return DRONE_STATUS_LIBRARY[status.statusId].iconSymbol;
  }
  const decoded = decodeHtmlGlyphToText(status.glyph);
  if (decoded) {
    return decoded;
  }
  return (status.label ?? '?').slice(0, 3);
}

function getUnitStatusBadgeTexture(symbol) {
  const safeSymbol = symbol || '?';
  if (unitStatusBadgeTextureCache.has(safeSymbol)) {
    return unitStatusBadgeTextureCache.get(safeSymbol);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 96;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }
  ctx.clearRect(0, 0, 96, 96);
  ctx.fillStyle = 'rgba(16, 26, 36, 0.88)';
  ctx.beginPath();
  ctx.arc(48, 48, 38, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(129, 169, 208, 0.95)';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.font = '44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f0f7ff';
  ctx.fillText(safeSymbol, 48, 49);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  unitStatusBadgeTextureCache.set(safeSymbol, texture);
  return texture;
}

function collectUnitBoardStatuses(unit) {
  const items = [];
  if (unit?.passiveStatuses?.length) {
    const filtered =
      unit.unitTypeId === 'TANK_DRONE_UNIT'
        ? unit.passiveStatuses.filter((status) => status.statusId !== DRONE_STATUS_LIBRARY.ATAKK.id)
        : unit.passiveStatuses;
    items.push(...filtered);
  }
  if (unit?.adjacencyStatuses?.length) {
    const filtered = unit.adjacencyStatuses.filter((status) => status.key !== 'adj_assembly_line_cost');
    items.push(...filtered);
  }
  if (unit?.unitTypeId === 'PAWN_DRONE_UNIT' && unit.tacticalDashActiveThisTurn) {
    items.push({ key: 'tactical_dash', glyph: '&#127939;', label: '+1 Move' });
  }
  if (unit?.unitTypeId === 'TANK_DRONE_UNIT' && unit.coreMagnetTurnsLeft > 0) {
    items.push({ key: 'planted', glyph: '&#129408;', label: 'Planted' });
  }
  if (unit?.unitTypeId === 'TANK_DRONE_UNIT' && unitHasStatus(unit, DRONE_STATUS_LIBRARY.ATAKK.id)) {
    const atFullHp = unit.hitPoints >= unit.maxHitPoints;
    items.push({
      key: 'atakk_dynamic',
      glyph: DRONE_STATUS_LIBRARY.ATAKK.iconGlyph,
      label: atFullHp ? 'Atakk' : 'Atakk (Deact)'
    });
  }
  if (unit?.unitTypeId === 'ARTILLERY_UNIT' && unit.artillerySetUpActive) {
    items.push({ key: 'artillery_setup', glyph: '&#128736;', label: 'Set Up' });
  }
  if (unit && isUnitMovementStunned(unit)) {
    items.push({ key: 'dazzled', glyph: '&#9889;', label: 'Dazzled' });
  }
  if (unit && (unit.shieldHitPoints ?? 0) > 0) {
    items.push({ key: 'shield', glyph: '&#128737;&#65039;', label: 'Shield' });
  }
  if (unit && (unit.augmentedAttackBonus ?? 0) > 0) {
    items.push({ key: 'augmented', glyph: '&#9881;', label: 'Augmented' });
  }
  if (unit && ((unit.virusDebuffPendingTurns ?? 0) > 0 || (unit.virusDebuffActiveTurns ?? 0) > 0)) {
    items.push({
      key: 'virus',
      glyph: '<span style="color:#ef4444;">&#128027;&#65038;</span>',
      label: 'Virus',
      badgeColor: 0xef4444
    });
  }
  return items;
}

function updateUnitStatusBadges(visual, unit) {
  if (!visual || !unit) {
    return;
  }
  if (!visual.statusBadgesGroup) {
    visual.statusBadgesGroup = new THREE.Group();
    visual.root.add(visual.statusBadgesGroup);
  }
  const group = visual.statusBadgesGroup;
  while (group.children.length) {
    const child = group.children.pop();
    group.remove(child);
  }

  const statuses = collectUnitBoardStatuses(unit);
  if (!statuses.length) {
    group.visible = false;
    return;
  }

  const iconScale = 0.42;
  const spacing = 0.46;
  const startX = -((statuses.length - 1) * spacing) / 2;
  statuses.forEach((status, idx) => {
    const symbol = getUnitStatusBadgeSymbol(status);
    const texture = getUnitStatusBadgeTexture(symbol);
    if (!texture) {
      return;
    }
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        color: status.badgeColor ?? 0xffffff
      })
    );
    sprite.scale.set(iconScale, iconScale, iconScale);
    sprite.position.set(startX + idx * spacing, 0, 0);
    group.add(sprite);
  });

  group.position.set(0, (visual.statusIcon?.position?.y ?? 1.7) + 0.48, 0);
  group.visible = group.children.length > 0;
}

function createSegmentedBarTexture(currentValue, maxValue, options = {}) {
  const current = Math.max(0, Math.floor(currentValue ?? 0));
  const max = Math.max(1, Math.floor(maxValue ?? 1));
  const fillColor = options.fillColor ?? '#34d399';
  const emptyColor = options.emptyColor ?? 'rgba(20, 28, 38, 0.9)';
  const borderColor = options.borderColor ?? '#d7e8fb';
  const segmentColor = options.segmentColor ?? 'rgba(8, 14, 22, 0.95)';

  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 36;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const innerX = 2;
  const innerY = 6;
  const innerW = canvas.width - 4;
  const innerH = canvas.height - 12;
  const gap = Math.max(1, Math.floor(innerW / (max * 14)));
  const segW = Math.max(1, (innerW - gap * (max - 1)) / max);

  for (let i = 0; i < max; i += 1) {
    const x = Math.round(innerX + i * (segW + gap));
    const w = Math.max(1, Math.round(segW));
    ctx.fillStyle = i < current ? fillColor : emptyColor;
    ctx.fillRect(x, innerY, w, innerH);
  }

  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(1.5, 5.5, canvas.width - 3, canvas.height - 11);
  ctx.strokeStyle = segmentColor;
  ctx.lineWidth = 1;
  for (let i = 1; i < max; i += 1) {
    const x = Math.round(innerX + i * (segW + gap) - gap / 2);
    ctx.beginPath();
    ctx.moveTo(x + 0.5, innerY + 1);
    ctx.lineTo(x + 0.5, innerY + innerH - 1);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function updateUnitHealthBars(visual, unit) {
  if (!visual || !unit) {
    return;
  }
  if (!visual.healthBarsGroup) {
    visual.healthBarsGroup = new THREE.Group();
    visual.root.add(visual.healthBarsGroup);
    visual.healthBarHp = new THREE.Sprite(
      new THREE.SpriteMaterial({
        transparent: true,
        depthWrite: false
      })
    );
    visual.healthBarHp.scale.set(0.9, 0.22, 1);
    visual.healthBarsGroup.add(visual.healthBarHp);

    visual.healthBarShield = new THREE.Sprite(
      new THREE.SpriteMaterial({
        transparent: true,
        depthWrite: false
      })
    );
    visual.healthBarShield.scale.set(0.9, 0.22, 1);
    visual.healthBarsGroup.add(visual.healthBarShield);
    visual.healthBarsState = {
      hp: null,
      maxHp: null,
      shield: null
    };
  }

  const hpNow = Math.max(0, Math.floor(unit.hitPoints ?? 0));
  const maxHpNow = Math.max(1, Math.floor(unit.maxHitPoints ?? 1));
  if (visual.healthBarsState.hp !== hpNow || visual.healthBarsState.maxHp !== maxHpNow) {
    const hpTexture = createSegmentedBarTexture(hpNow, maxHpNow, {
      fillColor: '#22c55e',
      emptyColor: 'rgba(18, 24, 34, 0.95)',
      borderColor: '#d4fce3',
      segmentColor: 'rgba(6, 12, 20, 0.95)'
    });
    if (hpTexture) {
      if (visual.healthBarHp.material.map) {
        visual.healthBarHp.material.map.dispose();
      }
      visual.healthBarHp.material.map = hpTexture;
      visual.healthBarHp.material.needsUpdate = true;
    }
    visual.healthBarsState.hp = hpNow;
    visual.healthBarsState.maxHp = maxHpNow;
  }
  visual.healthBarHp.position.set(0, 0, 0);
  visual.healthBarHp.visible = true;

  const shieldValue = Math.max(0, Math.floor(unit.shieldHitPoints ?? 0));
  if (shieldValue > 0) {
    if (visual.healthBarsState.shield !== shieldValue) {
      const shieldTexture = createSegmentedBarTexture(shieldValue, shieldValue, {
        fillColor: '#3b82f6',
        emptyColor: 'rgba(15, 25, 42, 0.9)',
        borderColor: '#bfdbfe',
        segmentColor: 'rgba(7, 13, 24, 0.95)'
      });
      if (shieldTexture) {
        if (visual.healthBarShield.material.map) {
          visual.healthBarShield.material.map.dispose();
        }
        visual.healthBarShield.material.map = shieldTexture;
        visual.healthBarShield.material.needsUpdate = true;
      }
      visual.healthBarsState.shield = shieldValue;
    }
    visual.healthBarShield.visible = true;
    visual.healthBarShield.position.set(0, 0.26, 0);
  } else {
    if (visual.healthBarsState.shield !== 0 && visual.healthBarShield.material.map) {
      visual.healthBarShield.material.map.dispose();
      visual.healthBarShield.material.map = null;
      visual.healthBarShield.material.needsUpdate = true;
    }
    visual.healthBarsState.shield = 0;
    visual.healthBarShield.visible = false;
  }

  visual.healthBarsGroup.position.set(0, (visual.statusIcon?.position?.y ?? 1.7) + 1.0, 0);
  visual.healthBarsGroup.visible = true;
}

function getCoreMagnetOwnerCoveringSquare(squareKey) {
  for (const unit of state.units) {
    if (unit.unitTypeId !== 'TANK_DRONE_UNIT' || unit.coreMagnetTurnsLeft <= 0) {
      continue;
    }
    const coveredSquares = getCoreMagnetCoverageSquareKeys(unit);
    if (coveredSquares.has(squareKey)) {
      return unit.owner;
    }
  }
  return null;
}

function startUnitMoveAnimation(unitId, fromX, fromZ, toX, toZ) {
  const start = gridToWorld(fromX, fromZ);
  const end = gridToWorld(toX, toZ);
  const steps = Math.max(1, getDistance(fromX, fromZ, toX, toZ));
  movementAnimations.set(unitId, {
    start,
    end,
    elapsed: 0,
    duration: 0.2 + steps * 0.1,
    stepCount: steps,
    prevX: start.x,
    prevZ: start.z
  });
}

function clearMoveRangeBorder() {
  if (!moveRangeBorderLines) {
    return;
  }
  boardGroup.remove(moveRangeBorderLines);
  moveRangeBorderLines.geometry.dispose();
  moveRangeBorderLines.material.dispose();
  moveRangeBorderLines = null;
}

function updateMoveRangeBorder(moveTargetSquares, colorHex) {
  clearMoveRangeBorder();
  if (!moveTargetSquares || moveTargetSquares.size === 0) {
    return;
  }

  const half = TILE_SIZE * 0.475;
  const y = 0.24;
  const positions = [];
  const dirs = [
    { dx: 0, dz: -1, edge: 'top' },
    { dx: 1, dz: 0, edge: 'right' },
    { dx: 0, dz: 1, edge: 'bottom' },
    { dx: -1, dz: 0, edge: 'left' }
  ];

  for (const squareKey of moveTargetSquares) {
    const sq = fromSquareKey(squareKey);
    const center = gridToWorld(sq.x, sq.z);
    for (const dir of dirs) {
      const nx = sq.x + dir.dx;
      const nz = sq.z + dir.dz;
      const neighborKey = isInsideBoard(nx, nz) ? toSquareKey(nx, nz) : null;
      if (neighborKey && moveTargetSquares.has(neighborKey)) {
        continue;
      }
      if (dir.edge === 'top') {
        positions.push(center.x - half, y, center.z - half, center.x + half, y, center.z - half);
      } else if (dir.edge === 'right') {
        positions.push(center.x + half, y, center.z - half, center.x + half, y, center.z + half);
      } else if (dir.edge === 'bottom') {
        positions.push(center.x - half, y, center.z + half, center.x + half, y, center.z + half);
      } else if (dir.edge === 'left') {
        positions.push(center.x - half, y, center.z - half, center.x - half, y, center.z + half);
      }
    }
  }

  if (positions.length === 0) {
    return;
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const mat = new THREE.LineBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.95
  });
  moveRangeBorderLines = new THREE.LineSegments(geom, mat);
  boardGroup.add(moveRangeBorderLines);
}

function updateUnitFacing(visual, unit) {
  const enemyUnits = state.units.filter((candidate) => candidate.owner !== unit.owner);

  let targetWorld = null;
  if (enemyUnits.length > 0) {
    let closestEnemy = enemyUnits[0];
    let minDistance = getDistance(unit.x, unit.z, closestEnemy.x, closestEnemy.z);

    for (let i = 1; i < enemyUnits.length; i += 1) {
      const candidate = enemyUnits[i];
      const distance = getDistance(unit.x, unit.z, candidate.x, candidate.z);
      if (distance < minDistance) {
        minDistance = distance;
        closestEnemy = candidate;
      }
    }

    targetWorld = gridToWorld(closestEnemy.x, closestEnemy.z);
  } else {
    const fallbackEnemy = unit.owner === 'A' ? 'B' : 'A';
    const baseCenter = getBaseCenterSquare(fallbackEnemy);
    if (baseCenter) {
      targetWorld = gridToWorld(baseCenter.x, baseCenter.z);
    }
  }

  if (!targetWorld) {
    return;
  }

  const unitWorld = gridToWorld(unit.x, unit.z);
  const deltaX = targetWorld.x - unitWorld.x;
  const deltaZ = targetWorld.z - unitWorld.z;
  if (Math.abs(deltaX) < 0.0001 && Math.abs(deltaZ) < 0.0001) {
    return;
  }

  visual.root.rotation.y = Math.atan2(deltaZ, deltaX) + (Math.PI * 3) / 2;
}

function getBaseCenterSquare(playerId) {
  const squares = [...BASE_SQUARES[playerId]];
  if (squares.length === 0) {
    return null;
  }

  let sumX = 0;
  let sumZ = 0;
  for (const squareKey of squares) {
    const square = fromSquareKey(squareKey);
    sumX += square.x;
    sumZ += square.z;
  }

  return {
    x: sumX / squares.length,
    z: sumZ / squares.length
  };
}

function getPlayerMaxEnergy(player) {
  return player?.maxEnergy ?? MAX_ENERGY;
}

function refreshPlayerMaxEnergy(playerId, clampEnergy = true) {
  const player = state.players[playerId];
  if (!player) {
    return MAX_ENERGY;
  }
  const datacenterCount = (player.buildings ?? []).filter((building) => building.type === 'DATACENTER').length;
  const computedMaxEnergy = MAX_ENERGY + datacenterCount * 5;
  player.maxEnergy = computedMaxEnergy;
  if (clampEnergy) {
    player.energy = Math.min(player.energy, computedMaxEnergy);
  }
  return computedMaxEnergy;
}

function renderUI() {
  refreshPlayerMaxEnergy('A', true);
  refreshPlayerMaxEnergy('B', true);
  const currentPlayer = getCurrentPlayer();
  const opponentId = currentPlayer.id === 'A' ? 'B' : 'A';
  const playerA = state.players.A;
  const playerB = state.players.B;
  const aHp = state.players.A.baseHitPoints;
  const bHp = state.players.B.baseHitPoints;
  const aMaxHp = Math.max(1, state.players.A.baseMaxHitPoints ?? BASE_MAX_HIT_POINTS);
  const bMaxHp = Math.max(1, state.players.B.baseMaxHitPoints ?? BASE_MAX_HIT_POINTS);
  const aPct = Math.max(0, Math.min(100, (aHp / aMaxHp) * 100));
  const bPct = Math.max(0, Math.min(100, (bHp / bMaxHp) * 100));
  const currentPlayerMaxEnergy = getPlayerMaxEnergy(currentPlayer);
  const playerAMaxEnergy = getPlayerMaxEnergy(playerA);
  const playerBMaxEnergy = getPlayerMaxEnergy(playerB);
  const energyPct = Math.max(0, Math.min(100, (currentPlayer.energy / currentPlayerMaxEnergy) * 100));

  turnStatusEl.innerHTML = `
    <div class="status-main">Player ${currentPlayer.id} Turn</div>
    <div class="base-hp-row">
      <div class="base-hp a">
        <div class="base-hp-head">A Base <span>${aHp}</span></div>
        <div class="base-hp-track"><div class="base-hp-fill a" style="width: ${aPct}%"></div></div>
      </div>
      <div class="base-hp b">
        <div class="base-hp-head">B Base <span>${bHp}</span></div>
        <div class="base-hp-track"><div class="base-hp-fill b" style="width: ${bPct}%"></div></div>
      </div>
    </div>
    <div class="energy-panel">
      <div class="energy-head">Energy <span>${currentPlayer.energy}/${currentPlayerMaxEnergy}</span></div>
      <div class="energy-track"><div class="energy-fill" style="width: ${energyPct}%"></div></div>
    </div>
    <div class="status-help">
      Left click: select card/unit/target. Right mouse hold: rotate camera.
    </div>
  `;

  const selectedUnit = getSelectedUnit();
  const selectedOwnedUnit =
    selectedUnit && selectedUnit.owner === currentPlayer.id ? selectedUnit : null;
  const selectedPawnUnit =
    selectedOwnedUnit && selectedOwnedUnit.unitTypeId === 'PAWN_DRONE_UNIT' ? selectedOwnedUnit : null;
  const selectedSupportUnit =
    selectedOwnedUnit && selectedOwnedUnit.unitTypeId === 'SUPPORT_DRONE_UNIT' ? selectedOwnedUnit : null;
  const selectedGhostbladeUnit =
    selectedOwnedUnit && selectedOwnedUnit.unitTypeId === 'GHOSTBLADE_UNIT' ? selectedOwnedUnit : null;
  const selectedArtilleryUnit =
    selectedOwnedUnit && selectedOwnedUnit.unitTypeId === 'ARTILLERY_UNIT' ? selectedOwnedUnit : null;
  const selectedSpecialistUnit =
    selectedOwnedUnit && selectedOwnedUnit.unitTypeId === 'SPECIALIST_UNIT' ? selectedOwnedUnit : null;
  const selectedUnitText = selectedUnit
    ? `Selected Unit: ${selectedUnit.unitName} (${toSquareKey(selectedUnit.x, selectedUnit.z)}) HP ${selectedUnit.hitPoints}/${selectedUnit.maxHitPoints}`
    : 'Selected Unit: none';

  const selectedMoveRange = selectedOwnedUnit ? getUnitCurrentMoveRange(selectedOwnedUnit) : 0;
  const selectedAttackRange = selectedOwnedUnit ? getUnitCurrentAttackRange(selectedOwnedUnit) : 0;
  const selectedAttackDamage = selectedOwnedUnit ? getUnitCurrentAttackDamage(selectedOwnedUnit) : 0;
  const selectedTankUnit =
    selectedOwnedUnit && selectedOwnedUnit.unitTypeId === 'TANK_DRONE_UNIT' ? selectedOwnedUnit : null;
  const dashOnCooldown = selectedPawnUnit ? selectedPawnUnit.tacticalDashCooldown > 0 : false;
  const dashButtonDisabled =
    !selectedPawnUnit || dashOnCooldown || selectedPawnUnit.tacticalDashActiveThisTurn;
  const dashStatus = selectedPawnUnit
    ? selectedPawnUnit.tacticalDashActiveThisTurn
      ? 'Active this turn'
      : dashOnCooldown
        ? 'On cooldown'
        : 'Ready'
    : 'Select your Pawn Drone';
  const coreMagnetOnCooldown = selectedTankUnit ? selectedTankUnit.coreMagnetCooldown > 0 : false;
  const selectedTankBeacon = selectedTankUnit ? hasBeaconCoreMagnet(selectedTankUnit) : false;
  const selectedTankHasBulwark = selectedTankUnit ? unitHasStatus(selectedTankUnit, DRONE_STATUS_LIBRARY.BULWARK.id) : false;
  const coreMagnetPreviewActive =
    selectedTankUnit && state.coreMagnetPreviewUnitId === selectedTankUnit.id;
  const coreMagnetBulwarkTargetingActive =
    selectedTankUnit &&
    selectedTankHasBulwark &&
    state.mode === 'core_magnet_bulwark_targeting' &&
    state.coreMagnetPreviewUnitId === selectedTankUnit.id;
  const coreMagnetButtonDisabled =
    !selectedTankUnit ||
    isUnitMovementStunned(selectedTankUnit) ||
    (!selectedTankBeacon && coreMagnetOnCooldown) ||
    (!selectedTankBeacon && selectedTankUnit.coreMagnetTurnsLeft > 0) ||
    coreMagnetPreviewActive;
  const coreMagnetStatus = selectedTankUnit
    ? isUnitMovementStunned(selectedTankUnit)
      ? 'Unavailable while Dazzled'
      : selectedTankUnit.coreMagnetTurnsLeft > 0
      ? selectedTankBeacon
        ? 'Channeled (Beacon active, click ability to cancel)'
        : `Channeled (${selectedTankUnit.coreMagnetTurnsLeft} turn left)`
      : !selectedTankBeacon && coreMagnetOnCooldown
        ? 'On cooldown'
        : selectedTankBeacon
          ? 'Ready (Beacon: no cooldown)'
          : 'Ready'
    : 'Select your Tank Drone';
  const selectedSpecialistHasScholar =
    selectedSpecialistUnit ? unitHasStatus(selectedSpecialistUnit, DRONE_STATUS_LIBRARY.SCHOLAR.id) : false;
  const selectedRepairCaster = selectedSupportUnit ?? (selectedSpecialistHasScholar ? selectedSpecialistUnit : null);
  const selectedRepairCasterHasSmart = selectedRepairCaster ? unitHasStatus(selectedRepairCaster, DRONE_STATUS_LIBRARY.SMART.id) : false;
  const repairEnergyCost = selectedRepairCasterHasSmart ? 0 : 5;
  const repairOnCooldown = selectedRepairCaster ? selectedRepairCaster.repairCooldown > 0 : false;
  const repairTargetingActive =
    selectedRepairCaster && state.mode === 'repair_targeting' && state.repairTargetingCasterId === selectedRepairCaster.id;
  const repairButtonDisabled =
    !selectedRepairCaster || repairOnCooldown || getCurrentPlayer().energy < repairEnergyCost || repairTargetingActive;
  const repairStatus = selectedRepairCaster
    ? repairTargetingActive
      ? 'Targeting'
      : repairOnCooldown
        ? 'On cooldown'
        : getCurrentPlayer().energy < repairEnergyCost
          ? `Need ${repairEnergyCost} Energy`
          : 'Ready'
    : 'Select Support Drone or Scholar Specialist';
  const ghostTeleportOnCooldown = selectedGhostbladeUnit ? selectedGhostbladeUnit.ghostbladeTeleportCooldown > 0 : false;
  const ghostTeleportTargetingActive =
    selectedGhostbladeUnit &&
    state.mode === 'ghostblade_teleport_targeting' &&
    state.ghostbladeTeleportCasterId === selectedGhostbladeUnit.id;
  const ghostTeleportButtonDisabled =
    !selectedGhostbladeUnit || ghostTeleportOnCooldown || getCurrentPlayer().energy < 10 || ghostTeleportTargetingActive;
  const ghostTeleportStatus = selectedGhostbladeUnit
    ? ghostTeleportTargetingActive
      ? 'Targeting'
      : ghostTeleportOnCooldown
        ? `On cooldown (${selectedGhostbladeUnit.ghostbladeTeleportCooldown})`
        : getCurrentPlayer().energy < 10
          ? 'Need 10 Energy'
          : 'Ready'
    : 'Select your Ghostblade';
  const artillerySetUpTargeting =
    selectedArtilleryUnit &&
    state.mode === 'artillery_attack_targeting' &&
    state.selectedUnitId === selectedArtilleryUnit.id;
  const artilleryAttackUnlocked = selectedArtilleryUnit ? selectedArtilleryUnit.artillerySetUpActive : false;
  const artillerySetUpOnCooldown = selectedArtilleryUnit ? selectedArtilleryUnit.artillerySetUpCooldown > 0 : false;
  const artillerySetUpDisabled =
    !selectedArtilleryUnit ||
    selectedArtilleryUnit.artillerySetUpUsedThisTurn ||
    (!selectedArtilleryUnit.artillerySetUpActive && artillerySetUpOnCooldown);
  const artillerySetUpStatus = selectedArtilleryUnit
    ? selectedArtilleryUnit.artillerySetUpActive
      ? 'Active'
      : selectedArtilleryUnit.artillerySetUpUsedThisTurn
        ? 'Used this turn'
        : artillerySetUpOnCooldown
          ? `On cooldown (${selectedArtilleryUnit.artillerySetUpCooldown})`
          : 'Ready'
    : 'Select your Artillery';
  const specialistEmpOnCooldown = selectedSpecialistUnit ? selectedSpecialistUnit.specialistEmpCooldown > 0 : false;
  const specialistEmpCooldownTurns = selectedSpecialistUnit ? getSpecialistEmpCooldownTurns(selectedSpecialistUnit) : 2;
  const selectedSpecialistHasSalvo = selectedSpecialistUnit ? hasSalvoEmpStatus(selectedSpecialistUnit) : false;
  const specialistEmpUsesThisTurn = selectedSpecialistUnit ? selectedSpecialistUnit.specialistEmpUsesThisTurn ?? 0 : 0;
  const specialistEmpUsesLimit = selectedSpecialistHasSalvo ? 2 : 1;
  const specialistCanEmpAfterAttack = selectedSpecialistHasSalvo && specialistEmpUsesThisTurn < specialistEmpUsesLimit;
  const specialistEmpTargetingActive =
    selectedSpecialistUnit &&
    state.mode === 'specialist_emp_targeting' &&
    state.specialistEmpCasterId === selectedSpecialistUnit.id;
  const specialistEmpButtonDisabled =
    !selectedSpecialistUnit ||
    specialistEmpOnCooldown ||
    (selectedSpecialistUnit.hasAttacked && !specialistCanEmpAfterAttack) ||
    (selectedSpecialistHasSalvo && specialistEmpUsesThisTurn >= specialistEmpUsesLimit) ||
    getCurrentPlayer().energy < 5 ||
    specialistEmpTargetingActive;
  const specialistEmpStatus = selectedSpecialistUnit
    ? specialistEmpTargetingActive
      ? 'Targeting'
      : specialistEmpOnCooldown
        ? `On cooldown (${selectedSpecialistUnit.specialistEmpCooldown})`
        : selectedSpecialistHasSalvo && specialistEmpUsesThisTurn >= specialistEmpUsesLimit
          ? 'Salvo limit reached'
        : selectedSpecialistUnit.hasAttacked && !specialistCanEmpAfterAttack
          ? 'Unavailable after attack'
        : getCurrentPlayer().energy < 5
          ? 'Need 5 Energy'
          : selectedSpecialistHasSalvo
            ? `Ready (${specialistEmpUsesThisTurn}/${specialistEmpUsesLimit})`
            : 'Ready'
    : 'Select your Specialist';
  const attackTargetingActive =
    selectedOwnedUnit &&
    (state.mode === 'attack_targeting' || state.mode === 'artillery_attack_targeting') &&
    state.selectedUnitId === selectedOwnedUnit.id;
  const tankFaceEaterCooldown =
    selectedTankUnit && unitHasStatus(selectedTankUnit, DRONE_STATUS_LIBRARY.FACE_EATER.id)
      ? selectedTankUnit.tankFaceEaterAttackCooldown ?? 0
      : 0;
  const attackButtonDisabled =
    !selectedOwnedUnit ||
    (selectedArtilleryUnit && !artilleryAttackUnlocked) ||
    isUnitMovementStunned(selectedOwnedUnit) ||
    tankFaceEaterCooldown > 0 ||
    (selectedOwnedUnit.hasMoved && !canUnitAttackAfterMoving(selectedOwnedUnit)) ||
    (selectedOwnedUnit.hasAttacked && !selectedOwnedUnit.systemShockFollowUpReady) ||
    (isUnitPlanted(selectedOwnedUnit) && !hasBeaconCoreMagnet(selectedOwnedUnit));
  const attackStatus = selectedOwnedUnit
    ? isUnitPlanted(selectedOwnedUnit) && !hasBeaconCoreMagnet(selectedOwnedUnit)
      ? 'Unavailable while Planted'
      : isUnitMovementStunned(selectedOwnedUnit)
        ? 'Unavailable while Dazzled'
      : tankFaceEaterCooldown > 0
        ? `On cooldown (${tankFaceEaterCooldown})`
      : selectedArtilleryUnit && !artilleryAttackUnlocked
        ? 'Need Set Up status'
      : selectedOwnedUnit.hasMoved && !canUnitAttackAfterMoving(selectedOwnedUnit)
        ? 'Unavailable after moving'
      : selectedOwnedUnit.hasAttacked
        ? selectedOwnedUnit.systemShockFollowUpReady
          ? 'Ready (System Shock follow-up)'
          : 'Already attacked'
        : attackTargetingActive
          ? 'Targeting'
          : 'Ready'
    : 'Select your drone';
  const builtBuildings = [...currentPlayer.buildings];

  const statusItems = [];
  if (selectedOwnedUnit?.passiveStatuses?.length) {
    const filteredPassiveStatuses =
      selectedOwnedUnit.unitTypeId === 'TANK_DRONE_UNIT'
        ? selectedOwnedUnit.passiveStatuses.filter((status) => status.statusId !== DRONE_STATUS_LIBRARY.ATAKK.id)
        : selectedOwnedUnit.passiveStatuses;
    statusItems.push(...filteredPassiveStatuses);
  }
  if (selectedOwnedUnit?.adjacencyStatuses?.length) {
    const visibleAdjacencyStatuses = selectedOwnedUnit.adjacencyStatuses.filter(
      (status) => status.key !== 'adj_assembly_line_cost'
    );
    statusItems.push(...visibleAdjacencyStatuses);
  }
  if (selectedPawnUnit?.tacticalDashActiveThisTurn) {
    statusItems.push({
      key: 'tactical_dash',
      glyph: '&#127939;',
      label: '+1 Move',
      tooltip: 'This drone has +1 Movement until the end of Turn'
    });
  }
  if (selectedTankUnit?.coreMagnetTurnsLeft > 0) {
    statusItems.push({
      key: 'planted',
      glyph: '&#129408;',
      label: hasBeaconCoreMagnet(selectedTankUnit) ? 'Planted' : `Planted: ${selectedTankUnit.coreMagnetTurnsLeft}`,
      tooltip: hasBeaconCoreMagnet(selectedTankUnit)
        ? 'Tank Drone is Planted until canceled, channel is broken, or Drone is destroyed. It attracts all shots made through the Covered Area.'
        : `Tank Drone is Planted and cannot move for ${selectedTankUnit.coreMagnetTurnsLeft} turns. It attracts all shots made through the Covered Area`
    });
  }
  if (selectedTankUnit && unitHasStatus(selectedTankUnit, DRONE_STATUS_LIBRARY.ATAKK.id)) {
    const atFullHp = selectedTankUnit.hitPoints >= selectedTankUnit.maxHitPoints;
    statusItems.push({
      key: 'atakk_dynamic',
      glyph: DRONE_STATUS_LIBRARY.ATAKK.iconGlyph,
      label: atFullHp ? 'Atakk' : 'Atakk (Deact)',
      tooltip: atFullHp
        ? 'Atakk gives +2 MOV at Full HP.'
        : 'Atakk will give +2MOV, when this Drone is at Full HP.'
    });
  }
  if (selectedArtilleryUnit?.artillerySetUpActive) {
    statusItems.push({
      key: 'artillery_setup',
      glyph: '&#128736;',
      label: 'Set Up',
      tooltip: 'Artillery is deployed and can use its bombard attack.'
    });
  }
  if (selectedOwnedUnit && isUnitMovementStunned(selectedOwnedUnit)) {
    statusItems.push({
      key: 'dazzled',
      glyph: '&#9889;',
      label: `Dazzled: ${selectedOwnedUnit.empStunnedTurns}`,
      tooltip: `This Drone is Stunned for ${selectedOwnedUnit.empStunnedTurns} turns`
    });
  }
  if (selectedOwnedUnit && (selectedOwnedUnit.shieldHitPoints ?? 0) > 0) {
    statusItems.push({
      key: 'shield',
      glyph: '&#128737;&#65039;',
      label: 'Shield',
      tooltip: `This unit is Shielded and has ${(selectedOwnedUnit.shieldHitPoints ?? 0)} bonus HP`
    });
  }
  if (selectedOwnedUnit && (selectedOwnedUnit.augmentedAttackBonus ?? 0) > 0) {
    const bonusAttack = selectedOwnedUnit.augmentedAttackBonus ?? 0;
    statusItems.push({
      key: 'augmented',
      glyph: '&#9881;',
      label: 'Augmented',
      tooltip: `${bonusAttack} DMG increased by the Engineers.`
    });
  }
  if (selectedOwnedUnit && ((selectedOwnedUnit.virusDebuffPendingTurns ?? 0) > 0 || (selectedOwnedUnit.virusDebuffActiveTurns ?? 0) > 0)) {
    const isActive = (selectedOwnedUnit.virusDebuffActiveTurns ?? 0) > 0;
    const penalty = isActive
      ? (selectedOwnedUnit.virusAttackPenaltyActive ?? 0)
      : (selectedOwnedUnit.virusAttackPenaltyPending ?? 0);
    statusItems.push({
      key: 'virus',
      glyph: '<span style="color:#ef4444;">&#128027;&#65038;</span>',
      label: 'Virus',
      tooltip: isActive
        ? `Virus active: -${penalty} ATT during this turn.`
        : `Virus queued: -${penalty} ATT on next turn.`
    });
  }
  const statusesHtml =
    statusItems.length > 0
      ? statusItems
          .map(
            (status) => `
        <div class="improvement-icon" aria-label="${status.label}">
          <span class="improvement-glyph">${status.glyph}</span>
          <span class="improvement-label">${status.label}</span>
          <span class="improvement-tooltip">${status.tooltip}</span>
        </div>
      `
          )
          .join('')
      : `<div class="improvement-empty">No active statuses.</div>`;
  const overloadTargetingActive = state.mode === 'overload_targeting';
  const buildingSegmentsHtml = (() => {
    const segments = [];
    for (const building of builtBuildings.slice(0, 6)) {
      const adjacencyBonus = getBuildingAdjacencyIconGlyph(building);
      const upgradesIconsHtml = getBuildingCardUpgradeIconsHtml(currentPlayer.id, building);
      const abilityCardsHtml = getBuildingAbilityCardsHtml(building, currentPlayer, overloadTargetingActive);
      const canUpgrade = canBuildingBeUpgraded(building);
      const upgradeCost = getBuildingUpgradeSupplyCost(building);
      const canAffordUpgrade = currentPlayer.supply >= upgradeCost;
      const upgradeLabel = canUpgrade
        ? building.upgraded
          ? 'Upgraded'
          : `Upgrade: ${upgradeCost} SUP`
        : 'Upgrade: —';
      segments.push(`
        <div class="building-segment">
          <div class="building-segment-head" title="${getBuildingDisplayName(building)}">${getBuildingDisplayName(building)}</div>
          <div class="building-segment-meta">
            <div class="building-segment-meta-line">
              <span class="building-meta-label">Adj. Bonus</span>
              <span class="building-upgrade-icons">
                ${
                  adjacencyBonus
                    ? `<span class="building-upgrade-icon large">${adjacencyBonus.glyph}<span class="building-upgrade-tooltip">${adjacencyBonus.tooltip}</span></span>`
                    : '<span class="building-upgrade-empty">—</span>'
                }
              </span>
            </div>
            <div class="building-segment-meta-line">
              <span class="building-meta-label">Card Upgrades</span>
              <span class="building-upgrade-icons">${upgradesIconsHtml}</span>
            </div>
          </div>
          <div class="building-segment-abilities">
            ${abilityCardsHtml}
          </div>
          <button class="building-upgrade-btn" type="button" data-upgrade-building-id="${building.id}" ${!canUpgrade || building.upgraded || !canAffordUpgrade ? 'disabled' : ''}>${upgradeLabel}</button>
        </div>
      `);
    }
    while (segments.length < 6) {
      segments.push(`
        <div class="building-segment empty">
          <div class="building-segment-head">Empty Slot</div>
          <div class="building-segment-meta">
            <div class="building-segment-meta-line"><span class="building-meta-label">Adj. Bonus</span><span class="building-upgrade-icons"><span class="building-upgrade-empty">—</span></span></div>
            <div class="building-segment-meta-line"><span class="building-meta-label">Card Upgrades</span><span class="building-upgrade-icons"><span class="building-upgrade-empty">—</span></span></div>
          </div>
          <div class="building-segment-abilities"><div class="improvement-empty">Build a structure.</div></div>
          <button class="building-upgrade-btn" type="button" disabled>Upgrade: —</button>
        </div>
      `);
    }
    return `<div class="building-abilities-grid">${segments.join('')}</div>`;
  })();

  const droneSectionsHtml = selectedOwnedUnit
    ? `
      <div class="drone-sections">
        <div class="drone-section">
          <div class="drone-section-title">Drone Abilities</div>
          ${
            selectedOwnedUnit
              ? `
                <button id="abilityAttack" class="ability-card" ${attackButtonDisabled ? 'disabled' : ''}>
                  <span class="ability-name">${
                    selectedArtilleryUnit
                      ? hasBallisticStatus(selectedArtilleryUnit)
                        ? 'Attack: Ballistic'
                        : unitHasStatus(selectedArtilleryUnit, DRONE_STATUS_LIBRARY.GAUSS.id)
                          ? 'Attack: Gauss'
                          : 'Attack: Shell'
                      : 'Attack'
                  }</span>
                  <span class="ability-line">Attack damage: ${selectedAttackDamage}</span>
                  <span class="ability-line">Attack range: ${selectedAttackRange}</span>
                  <span class="ability-state">Status: ${attackStatus}</span>
                </button>
              `
              : ''
          }
          ${
            selectedPawnUnit
              ? `
                <button id="abilityTacticalDash" class="ability-card" ${dashButtonDisabled ? 'disabled' : ''}>
                  <span class="ability-name">Tactical Dash</span>
                  <span class="ability-line">Drone gets +1 Movement for this turn and can move after attacking.</span>
                  <span class="ability-line">Cooldown: 2 turns</span>
                  <span class="ability-state">Status: ${dashStatus}</span>
                </button>
              `
                : selectedTankUnit
                ? `
                <button id="abilityCoreMagnet" class="ability-card" ${coreMagnetButtonDisabled ? 'disabled' : ''}>
                  <span class="ability-name">Core Magnet</span>
                  <span class="ability-line">${
                    selectedTankBeacon
                      ? 'Repairs 5 HP on first activation each turn. Plants Tank Drone and attracts shots in covered area until canceled.'
                      : 'Repairs 5 HP and plants Tank Drone at location. Attract all shots in covered area.'
                  }</span>
                  <span class="ability-line">${
                    selectedTankBeacon
                      ? 'Cooldown: none | Duration: none (cancel manually to move) | Channeling'
                      : 'Cooldown: 2 turns | Duration: 2 turns | Channeling'
                  }</span>
                  <span class="ability-state">Status: ${coreMagnetStatus}</span>
                </button>
                ${
                  coreMagnetPreviewActive && !selectedTankHasBulwark
                    ? `
                      <div class="ability-confirm">
                        <div class="ability-confirm-text">Activate Core Magnet on this Tank Drone?</div>
                        <div class="ability-confirm-actions">
                          <button id="confirmCoreMagnet" class="ability-confirm-btn">Confirm</button>
                          <button id="cancelCoreMagnet" class="ability-cancel-btn">Cancel</button>
                        </div>
                      </div>
                    `
                    : ''
                }
                ${
                  coreMagnetBulwarkTargetingActive
                    ? `
                      <div class="ability-confirm">
                        <div class="ability-confirm-text">Bulwark active: choose one adjacent square direction.</div>
                        <div class="ability-confirm-actions">
                          <button id="cancelCoreMagnet" class="ability-cancel-btn">Cancel</button>
                        </div>
                      </div>
                    `
                    : ''
                }
              `
                : selectedSupportUnit
                  ? `
                    <button id="abilityRepair" class="ability-card" ${repairButtonDisabled ? 'disabled' : ''}>
                      <span class="ability-name">Repair</span>
                      <span class="ability-line">Restore 50% of max HP to an allied drone in range.</span>
                      <span class="ability-line">Range: ${selectedSupportUnit.attackRange} | Cooldown: 1 turn | Energy: ${repairEnergyCost}${selectedRepairCasterHasSmart ? ' (Smart)' : ''}</span>
                      <span class="ability-line">Cannot target self or enemies.</span>
                      <span class="ability-state">Status: ${repairStatus}</span>
                    </button>
                  `
                  : selectedGhostbladeUnit
                    ? `
                    <button id="abilityGhostbladeTeleport" class="ability-card" ${ghostTeleportButtonDisabled ? 'disabled' : ''}>
                      <span class="ability-name">Teleport</span>
                      <span class="ability-line">Blink to an empty square and deal AoE damage in a 3x3 area.</span>
                      <span class="ability-line">Energy: 10 | Cooldown: 4</span>
                      <span class="ability-state">Status: ${ghostTeleportStatus}</span>
                    </button>
                  `
                  : selectedArtilleryUnit
                    ? `
                    <button id="abilityArtillerySetUp" class="ability-card" ${artillerySetUpDisabled ? 'disabled' : ''}>
                      <span class="ability-name">Set Up</span>
                      <span class="ability-line">Channel artillery deployment to enable bombard attack.</span>
                      <span class="ability-line">Cooldown: 2 turns | Channeling | Once per turn</span>
                      <span class="ability-state">Status: ${artillerySetUpStatus}</span>
                    </button>
                  `
                  : selectedSpecialistUnit
                    ? `
                    ${
                      selectedSpecialistHasScholar
                        ? `
                          <button id="abilityRepair" class="ability-card" ${repairButtonDisabled ? 'disabled' : ''}>
                            <span class="ability-name">Repair</span>
                            <span class="ability-line">Restore 50% of max HP to an allied drone in range.</span>
                            <span class="ability-line">Range: ${selectedSpecialistUnit.attackRange} | Cooldown: 1 turn | Energy: ${repairEnergyCost}${selectedRepairCasterHasSmart ? ' (Smart)' : ''}</span>
                            <span class="ability-line">Cannot target self or enemies.</span>
                            <span class="ability-state">Status: ${repairStatus}</span>
                          </button>
                        `
                        : ''
                    }
                    <button id="abilitySpecialistEmp" class="ability-card" ${specialistEmpButtonDisabled ? 'disabled' : ''}>
                      <span class="ability-name">EMP</span>
                      <span class="ability-line">Target a 2x2 area. Applies EMP effect to all drones there.</span>
                      <span class="ability-line">Energy: 5 | Range: ${selectedAttackRange} | Cooldown: ${specialistEmpCooldownTurns}</span>
                      <span class="ability-state">Status: ${specialistEmpStatus}</span>
                    </button>
                  `
                  : `<div class="improvement-empty">No abilities available for this drone.</div>`
          }
        </div>
        <div class="drone-section">
          <div class="drone-section-title">Drone Statuses</div>
          <div class="improvement-row">
            ${statusesHtml}
          </div>
        </div>
      </div>
    `
    : `
      <div class="drone-sections single">
        <div class="drone-section">
          <div class="drone-section-title">Building Abilities</div>
          ${buildingSegmentsHtml}
        </div>
      </div>
    `;
  const armoryBuildCard = BUILD_CARD_LIBRARY.ARMORY;
  const replicatorBuildCard = BUILD_CARD_LIBRARY.REPLICATOR;
  const workshopBuildCard = BUILD_CARD_LIBRARY.WORKSHOP;
  const datacenterBuildCard = BUILD_CARD_LIBRARY.DATACENTER;
  const gearStationBuildCard = BUILD_CARD_LIBRARY.GEAR_STATION;
  const assemblyLineBuildCard = BUILD_CARD_LIBRARY.ASSEMBLY_LINE;
  const foundationBuildCard = BUILD_CARD_LIBRARY.FOUNDATION;
  const isArmoryPlacementSelected =
    state.mode === 'place_building' && state.placingBuildingType === armoryBuildCard.id;
  const isReplicatorPlacementSelected =
    state.mode === 'place_building' && state.placingBuildingType === replicatorBuildCard.id;
  const isWorkshopPlacementSelected =
    state.mode === 'place_building' && state.placingBuildingType === workshopBuildCard.id;
  const isDatacenterPlacementSelected =
    state.mode === 'place_building' && state.placingBuildingType === datacenterBuildCard.id;
  const isGearStationPlacementSelected =
    state.mode === 'place_building' && state.placingBuildingType === gearStationBuildCard.id;
  const isAssemblyLinePlacementSelected =
    state.mode === 'place_building' && state.placingBuildingType === assemblyLineBuildCard.id;
  const isFoundationModeSelected = state.mode === 'foundation_targeting' || state.mode === 'foundation_confirm';
  const canAffordArmory = currentPlayer.supply >= armoryBuildCard.supplyCost;
  const canAffordReplicator = currentPlayer.supply >= replicatorBuildCard.supplyCost;
  const canAffordWorkshop = currentPlayer.supply >= workshopBuildCard.supplyCost;
  const canAffordDatacenter = currentPlayer.supply >= datacenterBuildCard.supplyCost;
  const canAffordGearStation = currentPlayer.supply >= gearStationBuildCard.supplyCost;
  const canAffordAssemblyLine = currentPlayer.supply >= assemblyLineBuildCard.supplyCost;
  const canAffordFoundation = currentPlayer.supply >= foundationBuildCard.supplyCost;
  const activeBuildingsList = currentPlayer.buildings
    .map((building) => `${getBuildingDisplayName(building)} (${building.squareKey})`)
    .join(', ');

  handEl.innerHTML = `
    <div class="hand-layout">
      <div class="hand-panel">
        <div class="hand-title">Player ${currentPlayer.id} Hand (${currentPlayer.hand.length})</div>
        <div class="card-row">
          ${currentPlayer.hand
            .map((card, index) => {
              const cardTemplate = CARD_LIBRARY[card.cardId];
              const effectiveCardCost = getCardEnergyCost(card);
              const isSelected =
                (state.mode === 'play_card' ||
                  state.mode === 'harvest_absorb' ||
                  state.mode === 'system_shock_card' ||
                  state.mode === 'shielding_card') &&
                state.selectedCardHandIndex === index;
              const disabled =
                state.mode === 'harvest_absorb'
                  ? false
                  : cardTemplate.id === CARD_LIBRARY.SYSTEM_SHOCK.id ||
                    cardTemplate.id === CARD_LIBRARY.SHIELDING.id ||
                    cardTemplate.id === CARD_LIBRARY.SHIMMERING_CLOAK.id
                  ? false
                  : currentPlayer.energy < effectiveCardCost;
              const producedAtLine =
                cardTemplate.cardCategory === 'Drone'
                  ? `<span class="card-prop">Produced at: ${card.producedAt ?? 'Base'}</span>`
                  : '';
              const perkLine =
                cardTemplate.id === CARD_LIBRARY.HARVEST_DATA.id
                  ? `<span class="card-prop">Absorb 1 Drone card: gain its Energy Cost as Supply</span>`
                  : cardTemplate.id === CARD_LIBRARY.SYSTEM_SHOCK.id
                    ? `<span class="card-prop">Cast on eligible enemy drone: Level 1 (cost ${cardTemplate.energyCost} Energy), or store in Process Echo X</span>`
                    : cardTemplate.id === CARD_LIBRARY.SHIELDING.id
                      ? `<span class="card-prop">Instant: apply Shielding Level 1 (cost ${cardTemplate.energyCost} Energy), or store in Process Echo X</span>`
                      : cardTemplate.id === CARD_LIBRARY.SHIMMERING_CLOAK.id
                        ? `<span class="card-prop">Target square: Level 1 (1 square, 1 turn), or store in Process Echo X</span>`
                  : '';

              return `
                <button class="card ${isSelected ? 'selected' : ''}" data-hand-index="${index}" ${disabled ? 'disabled' : ''}>
                  <span class="card-name">${cardTemplate.cardName}</span>
                  <span class="card-prop">Type: ${cardTemplate.cardCategory}</span>
                  <span class="card-prop">Cost: ${effectiveCardCost}${effectiveCardCost !== cardTemplate.energyCost ? ` (base ${cardTemplate.energyCost})` : ''}</span>
                  ${cardTemplate.cardType === 'unit_summon' ? `<span class="card-prop">Summon: ${UNIT_LIBRARY[cardTemplate.summonUnitId].unitName}</span>` : ''}
                  ${perkLine}
                  ${producedAtLine}
                </button>
              `;
            })
            .join('')}
        </div>
      </div>
      <div class="drone-panel-slot">
        ${droneSectionsHtml}
      </div>
      <div class="build-panel">
        <div class="build-title">Build Section</div>
        <div class="build-copy">Obtain building cards by spending Supply.</div>
        <button class="build-card ${isArmoryPlacementSelected ? 'selected' : ''}" id="buildCardArmory" ${!canAffordArmory || state.winner ? 'disabled' : ''}>
          <span class="build-card-line"><span class="build-card-main"><span class="build-card-icon" aria-hidden="true">🛡️</span><span class="build-card-name">${armoryBuildCard.cardName}</span></span><span class="build-card-cost">${armoryBuildCard.supplyCost} Supply</span></span>
          <span class="build-card-tooltip">Place on your base square. Unlocks: Create Tank Drone. Adjacency bonus: +1 HP to Drone cards produced by adjacent buildings.</span>
        </button>
        <button class="build-card ${isReplicatorPlacementSelected ? 'selected' : ''}" id="buildCardReplicator" ${!canAffordReplicator || state.winner ? 'disabled' : ''}>
          <span class="build-card-line"><span class="build-card-main"><span class="build-card-icon" aria-hidden="true">🏭</span><span class="build-card-name">${replicatorBuildCard.cardName}</span></span><span class="build-card-cost">${replicatorBuildCard.supplyCost} Supply</span></span>
          <span class="build-card-tooltip">Place on your base square. Unlocks: Create Pawn Drone. Adjacency bonus: +1 ATT to Drone cards produced by adjacent buildings.</span>
        </button>
        <button class="build-card ${isWorkshopPlacementSelected ? 'selected' : ''}" id="buildCardWorkshop" ${!canAffordWorkshop || state.winner ? 'disabled' : ''}>
          <span class="build-card-line"><span class="build-card-main"><span class="build-card-icon" aria-hidden="true">🔧</span><span class="build-card-name">${workshopBuildCard.cardName}</span></span><span class="build-card-cost">${workshopBuildCard.supplyCost} Supply</span></span>
          <span class="build-card-tooltip">Place on your base square. Unlocks: Create Support Drone. Adjacency bonus: +50% Supply yield for Drone cards produced by adjacent buildings.</span>
        </button>
        <button class="build-card ${isDatacenterPlacementSelected ? 'selected' : ''}" id="buildCardDatacenter" ${!canAffordDatacenter || state.winner ? 'disabled' : ''}>
          <span class="build-card-line"><span class="build-card-main"><span class="build-card-icon" aria-hidden="true">🖥️</span><span class="build-card-name">${datacenterBuildCard.cardName}</span></span><span class="build-card-cost">${datacenterBuildCard.supplyCost} Supply</span></span>
          <span class="build-card-tooltip">Effect: +5 Max Energy. Unlocks Obtain (5 Energy to gain 5 Supply, or 8 if adjacent to Workshop), once per turn.</span>
        </button>
        <button class="build-card ${isGearStationPlacementSelected ? 'selected' : ''}" id="buildCardGearStation" ${!canAffordGearStation || state.winner ? 'disabled' : ''}>
          <span class="build-card-line"><span class="build-card-main"><span class="build-card-icon" aria-hidden="true">⚙️</span><span class="build-card-name">${gearStationBuildCard.cardName}</span></span><span class="build-card-cost">${gearStationBuildCard.supplyCost} Supply</span></span>
          <span class="build-card-tooltip">Adjacency: +1 MOV to cards produced by adjacent buildings. Unlocks Overload (5 Energy, once per turn).</span>
        </button>
        <button class="build-card ${isAssemblyLinePlacementSelected ? 'selected' : ''}" id="buildCardAssemblyLine" ${!canAffordAssemblyLine || state.winner ? 'disabled' : ''}>
          <span class="build-card-line"><span class="build-card-main"><span class="build-card-icon" aria-hidden="true">🏗️</span><span class="build-card-name">${assemblyLineBuildCard.cardName}</span></span><span class="build-card-cost">${assemblyLineBuildCard.supplyCost} Supply</span></span>
          <span class="build-card-tooltip">Adjacency: Drone cards produced by adjacent buildings cost 3 less Energy. Unlocks Draw (2 Energy: draw 1 card).</span>
        </button>
        <button class="build-card ${isFoundationModeSelected ? 'selected' : ''}" id="buildCardFoundation" ${!canAffordFoundation || state.winner ? 'disabled' : ''}>
          <span class="build-card-line"><span class="build-card-main"><span class="build-card-icon" aria-hidden="true">🧱</span><span class="build-card-name">${foundationBuildCard.cardName}</span></span><span class="build-card-cost">${foundationBuildCard.supplyCost} Supply</span></span>
          <span class="build-card-tooltip">Select one of your built structures and confirm to destroy it. Gain +5 max base HP, +5 current base HP, and refund 50% of destroyed building Supply cost.</span>
        </button>
        <div class="build-active">Active: ${activeBuildingsList || 'None'}</div>
      </div>
    </div>
    <div class="selection-info">${selectedUnitText}</div>
  `;

  if (state.winner) {
    handEl.innerHTML += `<div class="win-banner">Player ${state.winner} Wins</div>`;
  } else if (state.mode === 'play_card') {
    handEl.innerHTML += `<div class="selection-info">Select a highlighted square adjacent to Player ${currentPlayer.id} base.</div>`;
  } else if (state.mode === 'harvest_absorb') {
    handEl.innerHTML += `<div class="selection-info">Select a Drone card in hand to Absorb with Harvest Data.</div>`;
  } else if (state.mode === 'system_shock_card') {
    handEl.innerHTML += `<div class="selection-info">System Shock selected: click an eligible enemy drone to cast Level 1 (cost 5 Energy), or click Process Echo X to store.</div>`;
  } else if (state.mode === 'shielding_card') {
    handEl.innerHTML += `<div class="selection-info">Shielding selected: click your drone to apply Level 1 (cost 5 Energy), or click Process Echo X to store.</div>`;
  } else if (state.mode === 'system_shock_targeting_echo') {
    const level = Math.max(1, Math.min(3, state.pendingSystemShockLevel ?? 1));
    const damage = level >= 2 ? 8 : 5;
    handEl.innerHTML += `<div class="selection-info">System Shock Level ${level} from Process Echo: select an eligible enemy drone. Damage ${damage} (${DAMAGE_TYPES.SYSTEM}).</div>`;
  } else if (state.mode === 'shielding_equip_instant' || state.mode === 'shielding_equip_echo') {
    const sourceText = state.mode === 'shielding_equip_instant' ? 'from hand' : `from Process Echo slot ${state.pendingShieldingSourceSlot}`;
    handEl.innerHTML += `<div class="selection-info">Select one of your drones to apply Shielding ${sourceText}.</div>`;
  } else if (state.mode === 'shimmering_targeting_instant' || state.mode === 'shimmering_targeting_echo') {
    const level =
      state.mode === 'shimmering_targeting_instant'
        ? 1
        : Math.max(1, Math.min(3, state.pendingShimmeringLevel ?? 1));
    const required = level >= 3 ? 2 : 1;
    const picked = state.pendingShimmeringSquares?.length ?? 0;
    handEl.innerHTML += `<div class="selection-info">Shimmering Cloak Level ${level}: select ${required} square(s). Selected ${picked}/${required}.</div>`;
  } else if (state.mode === 'artillery_attack_targeting' && selectedArtilleryUnit) {
    const ballistic = hasBallisticStatus(selectedArtilleryUnit);
    const gauss = unitHasStatus(selectedArtilleryUnit, DRONE_STATUS_LIBRARY.GAUSS.id);
    const preview = state.hoverSquareKey
      ? (gauss
          ? getGaussLineSquareKeysFromTarget(selectedArtilleryUnit, state.hoverSquareKey).join(', ')
          : getArtilleryAreaSquareKeys(state.hoverSquareKey).join(', '))
      : 'none';
    handEl.innerHTML += ballistic
      ? `<div class="selection-info">Artillery Ballistic targeting: select an enemy drone or vulnerable enemy base square in range.</div>`
      : gauss
      ? `<div class="selection-info">Artillery Gauss targeting: choose an adjacent square direction (or one of its highlighted line squares). Preview: ${preview}</div>`
      : `<div class="selection-info">Artillery targeting: choose a 2x2 area at least 2 squares away. Preview: ${preview}</div>`;
  } else if (state.mode === 'specialist_emp_targeting' && selectedSpecialistUnit) {
    const preview = state.hoverSquareKey ? getArtilleryAreaSquareKeys(state.hoverSquareKey).join(', ') : 'none';
    handEl.innerHTML += `<div class="selection-info">Specialist EMP targeting: choose a 2x2 area. Preview: ${preview}</div>`;
  } else if (state.mode === 'core_magnet_bulwark_targeting' && selectedTankUnit) {
    handEl.innerHTML += `<div class="selection-info">Bulwark Core Magnet: hover adjacent square to preview 3-square shield, then click to confirm.</div>`;
  } else if (state.mode === 'overload_targeting') {
    handEl.innerHTML += `<div class="selection-info">Overload targeting: select a friendly drone that can receive movement.</div>`;
  } else if (state.mode === 'attack_targeting' && selectedOwnedUnit) {
    handEl.innerHTML += `<div class="selection-info">Attack targeting: select an enemy unit or enemy base in range. Damage ${selectedAttackDamage}, Range ${selectedAttackRange}.</div>`;
  } else if (state.mode === 'place_building') {
    const selectedBuildCard =
      BUILD_CARD_LIBRARY[state.placingBuildingType] ?? BUILD_CARD_LIBRARY.ARMORY;
    handEl.innerHTML += `<div class="selection-info">Select a highlighted base square to place ${selectedBuildCard.cardName}.</div>`;
  } else if (state.mode === 'foundation_targeting') {
    handEl.innerHTML += `<div class="selection-info">Foundation: select one of your existing buildings to destroy.</div>`;
  } else if (state.mode === 'foundation_confirm') {
    handEl.innerHTML += `<div class="selection-info">Foundation: confirm the selected building destruction.</div>`;
  } else if (selectedOwnedUnit) {
    handEl.innerHTML += `<div class="selection-info">Move range: ${selectedMoveRange}, Attack range: ${selectedOwnedUnit.attackRange}</div>`;
  } else {
    handEl.innerHTML += `<div class="selection-info">Enemy Player: ${opponentId}</div>`;
  }

  pileAEl.innerHTML = `
    <div class="pile-title">Player A</div>
    <div class="pile-resource">Energy: <strong>${playerA.energy}/${playerAMaxEnergy}</strong></div>
    <div class="pile-resource">Supply: <strong>${playerA.supply}</strong></div>
    <div>Deck: ${playerA.deck.length}</div>
    <div>Discard: ${playerA.discard.length}</div>
  `;

  pileBEl.innerHTML = `
    <div class="pile-title">Player B</div>
    <div class="pile-resource">Energy: <strong>${playerB.energy}/${playerBMaxEnergy}</strong></div>
    <div class="pile-resource">Supply: <strong>${playerB.supply}</strong></div>
    <div>Deck: ${playerB.deck.length}</div>
    <div>Discard: ${playerB.discard.length}</div>
  `;

  if (
    state.mode === 'armory_status_pick' ||
    state.mode === 'replicator_status_pick' ||
    state.mode === 'workshop_status_pick' ||
    state.mode === 'datacenter_status_pick' ||
    state.mode === 'gear_station_status_pick' ||
    state.mode === 'assembly_line_status_pick' ||
    state.mode === 'building_upgrade_status_pick'
  ) {
    const modeConfig = {
      armory_status_pick: {
        pool: 'ARMORY',
        title: 'Choose Armory Drone Status',
        copy: 'Select one status for all Tank Drones produced by this Armory.'
      },
      replicator_status_pick: {
        pool: 'REPLICATOR',
        title: 'Choose Replicator Drone Status',
        copy: 'Select one status for all Pawn Drones produced by this Replicator.'
      },
      workshop_status_pick: {
        pool: 'WORKSHOP',
        title: 'Choose Workshop Drone Status',
        copy: 'Select one status for all Support Drones produced by this Workshop.'
      },
      datacenter_status_pick: {
        pool: 'DATACENTER',
        title: 'Choose Datacenter Drone Status',
        copy: 'Select one status for all Specialist Drones produced by this Datacenter.'
      },
      gear_station_status_pick: {
        pool: 'GEAR_STATION',
        title: 'Choose Gear Station Drone Status',
        copy: 'Select one status for all Ghostblade Drones produced by this Gear Station.'
      },
      assembly_line_status_pick: {
        pool: 'ASSEMBLY_LINE',
        title: 'Choose Assembly Line Drone Status',
        copy: 'Select one status for all Artillery Drones produced by this Assembly Line.'
      },
      building_upgrade_status_pick: {
        pool: '',
        title: 'Choose Upgrade Drone Status',
        copy: 'Select one additional status from this building pool.'
      }
    };
    const cfg = modeConfig[state.mode];
    const draftPoolKey = cfg.pool;
    const statusOptions =
      state.mode === 'building_upgrade_status_pick'
        ? (state.pendingUpgradeStatusOptions ?? []).map((statusId) => DRONE_STATUS_LIBRARY[statusId]).filter(Boolean)
        : (BUILDING_PERK_DRAFT_POOL[draftPoolKey] ?? [])
            .map((statusId) => DRONE_STATUS_LIBRARY[statusId])
            .filter(Boolean);
    const selectedStatusId =
      state.mode === 'armory_status_pick'
        ? state.pendingArmoryStatusId
        : state.mode === 'replicator_status_pick'
          ? state.pendingReplicatorStatusId
          : state.mode === 'workshop_status_pick'
            ? state.pendingWorkshopStatusId
            : state.mode === 'datacenter_status_pick'
              ? state.pendingDatacenterStatusId
              : state.mode === 'gear_station_status_pick'
                ? state.pendingGearStationStatusId
                : state.mode === 'assembly_line_status_pick'
                  ? state.pendingAssemblyLineStatusId
                  : state.pendingUpgradeStatusId;
    const upgradeBuilding =
      state.mode === 'building_upgrade_status_pick' && state.pendingUpgradeBuildingId
        ? getBuildingById(currentPlayer.id, state.pendingUpgradeBuildingId)
        : null;
    const modalTitle =
      state.mode === 'building_upgrade_status_pick' && upgradeBuilding
        ? `Upgrade ${getBuildingDisplayName(upgradeBuilding)}`
        : cfg.title;
    const modalCopy =
      state.mode === 'building_upgrade_status_pick' && upgradeBuilding
        ? `Select one additional status (up to 8 options) from ${getBuildingDisplayName(upgradeBuilding)} pool.`
        : cfg.copy;
    overlayEl.innerHTML = `
      <div class="overlay-backdrop">
        <div class="status-modal">
          <div class="status-modal-title">${modalTitle}</div>
          <div class="status-modal-copy">${modalCopy}</div>
          <div class="status-option-row">
            ${statusOptions
              .map((status) => {
                const selected = selectedStatusId === status.id;
                return `
                  <button class="status-option ${selected ? 'selected' : ''}" data-building-status-id="${status.id}">
                    <span class="status-option-glyph">${status.iconGlyph}</span>
                    <span class="status-option-name">${status.statusName}</span>
                    <span class="status-option-tooltip">${status.description}</span>
                  </button>
                `;
              })
              .join('')}
          </div>
          <div class="status-modal-actions">
            <button id="cancelBuildingStatusBtn" class="ability-cancel-btn">Cancel</button>
            <button id="confirmBuildingStatusBtn" class="ability-confirm-btn" ${
              selectedStatusId ? '' : 'disabled'
            }>Confirm</button>
          </div>
        </div>
      </div>
    `;
  } else if (state.mode === 'foundation_confirm') {
    const targetBuilding =
      state.pendingFoundationTargetBuildingId
        ? getBuildingById(currentPlayer.id, state.pendingFoundationTargetBuildingId)
        : null;
    const targetName = targetBuilding ? getBuildingDisplayName(targetBuilding) : 'this building';
    overlayEl.innerHTML = `
      <div class="overlay-backdrop">
        <div class="status-modal">
          <div class="status-modal-title">Foundation</div>
          <div class="status-modal-copy">Do you agree to destroy ${targetName}?</div>
          <div class="status-modal-actions">
            <button id="cancelFoundationBtn" class="ability-cancel-btn">Cancel</button>
            <button id="confirmFoundationBtn" class="ability-confirm-btn">Confirm</button>
          </div>
        </div>
      </div>
    `;
  } else {
    overlayEl.innerHTML = '';
  }

  handEl.querySelectorAll('.hand-panel .card').forEach((btn) => {
    btn.addEventListener('click', () => {
      const handIndex = Number.parseInt(btn.dataset.handIndex, 10);
      const clickedCard = currentPlayer.hand[handIndex];
      const clickedTemplate = clickedCard ? CARD_LIBRARY[clickedCard.cardId] : null;
      if (!clickedTemplate) {
        return;
      }

      if (state.mode === 'harvest_absorb') {
        if (state.selectedCardHandIndex === handIndex) {
          clearSelection();
          renderUI();
          return;
        }
        executeHarvestDataAbsorb(state.selectedCardHandIndex, handIndex);
        return;
      }

      if (clickedTemplate.id === CARD_LIBRARY.HARVEST_DATA.id) {
        state.mode = 'harvest_absorb';
        state.selectedCardHandIndex = handIndex;
        state.selectedUnitId = null;
        state.coreMagnetPreviewUnitId = null;
        state.repairTargetingCasterId = null;
        state.placingBuildingType = null;
        syncBoardVisualState();
        renderUI();
        return;
      }

      if (clickedTemplate.id === CARD_LIBRARY.SYSTEM_SHOCK.id) {
        if (state.mode === 'system_shock_card' && state.selectedCardHandIndex === handIndex) {
          clearSelection();
          syncBoardVisualState();
          renderUI();
          return;
        }
        state.mode = 'system_shock_card';
        state.selectedCardHandIndex = handIndex;
        state.selectedUnitId = null;
        state.coreMagnetPreviewUnitId = null;
        state.repairTargetingCasterId = null;
        state.systemShockCasterId = null;
        state.pendingSystemShockLevel = null;
        state.pendingSystemShockSourceSlot = null;
        state.pendingShieldingLevel = null;
        state.pendingShieldingSourceSlot = null;
        state.pendingShimmeringLevel = null;
        state.pendingShimmeringSourceSlot = null;
        state.pendingShimmeringSquares = [];
        state.placingBuildingType = null;
        syncBoardVisualState();
        renderUI();
        return;
      }

      if (clickedTemplate.id === CARD_LIBRARY.SHIELDING.id) {
        if (state.mode === 'shielding_card' && state.selectedCardHandIndex === handIndex) {
          clearSelection();
          syncBoardVisualState();
          renderUI();
          return;
        }
        state.mode = 'shielding_card';
        state.selectedCardHandIndex = handIndex;
        state.selectedUnitId = null;
        state.coreMagnetPreviewUnitId = null;
        state.repairTargetingCasterId = null;
        state.systemShockCasterId = null;
        state.pendingSystemShockLevel = null;
      state.pendingSystemShockSourceSlot = null;
      state.pendingShieldingLevel = null;
      state.pendingShieldingSourceSlot = null;
      state.pendingShimmeringLevel = null;
      state.pendingShimmeringSourceSlot = null;
      state.pendingShimmeringSquares = [];
      state.placingBuildingType = null;
        syncBoardVisualState();
        renderUI();
        return;
      }

      if (clickedTemplate.id === CARD_LIBRARY.SHIMMERING_CLOAK.id) {
        if (state.mode === 'shimmering_card' && state.selectedCardHandIndex === handIndex) {
          clearSelection();
          syncBoardVisualState();
          renderUI();
          return;
        }
        state.mode = 'shimmering_card';
        state.selectedCardHandIndex = handIndex;
        state.selectedUnitId = null;
        state.coreMagnetPreviewUnitId = null;
        state.repairTargetingCasterId = null;
        state.systemShockCasterId = null;
        state.pendingSystemShockLevel = null;
        state.pendingSystemShockSourceSlot = null;
        state.pendingShieldingLevel = null;
        state.pendingShieldingSourceSlot = null;
        state.pendingShimmeringLevel = null;
        state.pendingShimmeringSourceSlot = null;
        state.pendingShimmeringSquares = [];
        state.placingBuildingType = null;
        syncBoardVisualState();
        renderUI();
        return;
      }

      state.mode = 'play_card';
      state.selectedCardHandIndex = handIndex;
      state.selectedUnitId = null;
      state.coreMagnetPreviewUnitId = null;
      state.repairTargetingCasterId = null;
      state.overloadTargetingBuildingId = null;
      state.systemShockCasterId = null;
      state.pendingSystemShockLevel = null;
      state.pendingSystemShockSourceSlot = null;
      state.pendingShieldingLevel = null;
      state.pendingShieldingSourceSlot = null;
      state.pendingShimmeringLevel = null;
      state.pendingShimmeringSourceSlot = null;
      state.pendingShimmeringSquares = [];
      state.placingBuildingType = null;
      syncBoardVisualState();
      renderUI();
    });
  });

  overlayEl.querySelectorAll('[data-building-status-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const statusId = btn.getAttribute('data-building-status-id');
      if (!statusId) {
        return;
      }
      if (state.mode === 'armory_status_pick') {
        state.pendingArmoryStatusId = statusId;
      } else if (state.mode === 'replicator_status_pick') {
        state.pendingReplicatorStatusId = statusId;
      } else if (state.mode === 'workshop_status_pick') {
        state.pendingWorkshopStatusId = statusId;
      } else if (state.mode === 'datacenter_status_pick') {
        state.pendingDatacenterStatusId = statusId;
      } else if (state.mode === 'gear_station_status_pick') {
        state.pendingGearStationStatusId = statusId;
      } else if (state.mode === 'assembly_line_status_pick') {
        state.pendingAssemblyLineStatusId = statusId;
      } else if (state.mode === 'building_upgrade_status_pick') {
        state.pendingUpgradeStatusId = statusId;
      }
      renderUI();
    });
  });

  const cancelBuildingStatusBtn = overlayEl.querySelector('#cancelBuildingStatusBtn');
  if (cancelBuildingStatusBtn) {
    cancelBuildingStatusBtn.addEventListener('click', () => {
      if (state.mode === 'building_upgrade_status_pick') {
        state.mode = 'idle';
        state.pendingUpgradeBuildingId = null;
        state.pendingUpgradeStatusId = null;
        state.pendingUpgradeStatusOptions = [];
      } else {
        state.mode = 'place_building';
        state.pendingArmorySquareKey = null;
        state.pendingArmoryStatusId = null;
        state.pendingArmoryDraftStatusIds = [];
        state.pendingReplicatorSquareKey = null;
        state.pendingReplicatorStatusId = null;
        state.pendingWorkshopSquareKey = null;
        state.pendingWorkshopStatusId = null;
        state.pendingDatacenterSquareKey = null;
        state.pendingDatacenterStatusId = null;
        state.pendingGearStationSquareKey = null;
        state.pendingGearStationStatusId = null;
        state.pendingAssemblyLineSquareKey = null;
        state.pendingAssemblyLineStatusId = null;
      }
      renderUI();
    });
  }

  const confirmBuildingStatusBtn = overlayEl.querySelector('#confirmBuildingStatusBtn');
  if (confirmBuildingStatusBtn) {
    confirmBuildingStatusBtn.addEventListener('click', () => {
      if (state.mode === 'armory_status_pick') {
        confirmArmoryBuildPlacement();
      } else if (state.mode === 'replicator_status_pick') {
        confirmReplicatorBuildPlacement();
      } else if (state.mode === 'workshop_status_pick') {
        confirmWorkshopBuildPlacement();
      } else if (state.mode === 'datacenter_status_pick') {
        confirmDatacenterBuildPlacement();
      } else if (state.mode === 'gear_station_status_pick') {
        confirmGearStationBuildPlacement();
      } else if (state.mode === 'assembly_line_status_pick') {
        confirmAssemblyLineBuildPlacement();
      } else if (state.mode === 'building_upgrade_status_pick') {
        confirmBuildingUpgradeStatusSelection();
      }
    });
  }

  const cancelFoundationBtn = overlayEl.querySelector('#cancelFoundationBtn');
  if (cancelFoundationBtn) {
    cancelFoundationBtn.addEventListener('click', () => {
      state.mode = 'idle';
      state.pendingFoundationTargetBuildingId = null;
      renderUI();
    });
  }

  const confirmFoundationBtn = overlayEl.querySelector('#confirmFoundationBtn');
  if (confirmFoundationBtn) {
    confirmFoundationBtn.addEventListener('click', () => {
      confirmFoundationUse();
    });
  }

  const buildCardArmory = handEl.querySelector('#buildCardArmory');
  if (buildCardArmory) {
    buildCardArmory.addEventListener('click', () => {
      state.mode = 'place_building';
      state.selectedCardHandIndex = null;
      state.selectedUnitId = null;
      state.coreMagnetPreviewUnitId = null;
      state.repairTargetingCasterId = null;
      state.overloadTargetingBuildingId = null;
      state.systemShockCasterId = null;
      state.pendingSystemShockLevel = null;
      state.pendingSystemShockSourceSlot = null;
      state.pendingShieldingLevel = null;
      state.pendingShieldingSourceSlot = null;
      state.pendingShimmeringLevel = null;
      state.pendingShimmeringSourceSlot = null;
      state.pendingShimmeringSquares = [];
      state.placingBuildingType = BUILD_CARD_LIBRARY.ARMORY.id;
      state.pendingArmorySquareKey = null;
      state.pendingArmoryStatusId = null;
      state.pendingArmoryDraftStatusIds = [];
      state.pendingReplicatorSquareKey = null;
      state.pendingReplicatorStatusId = null;
      state.pendingWorkshopSquareKey = null;
      state.pendingWorkshopStatusId = null;
      syncBoardVisualState();
      renderUI();
    });
  }

  const buildCardReplicator = handEl.querySelector('#buildCardReplicator');
  if (buildCardReplicator) {
    buildCardReplicator.addEventListener('click', () => {
      state.mode = 'place_building';
      state.selectedCardHandIndex = null;
      state.selectedUnitId = null;
      state.coreMagnetPreviewUnitId = null;
      state.repairTargetingCasterId = null;
      state.overloadTargetingBuildingId = null;
      state.systemShockCasterId = null;
      state.pendingSystemShockLevel = null;
      state.pendingSystemShockSourceSlot = null;
      state.pendingShieldingLevel = null;
      state.pendingShieldingSourceSlot = null;
      state.pendingShimmeringLevel = null;
      state.pendingShimmeringSourceSlot = null;
      state.pendingShimmeringSquares = [];
      state.placingBuildingType = BUILD_CARD_LIBRARY.REPLICATOR.id;
      state.pendingArmorySquareKey = null;
      state.pendingArmoryStatusId = null;
      state.pendingArmoryDraftStatusIds = [];
      state.pendingReplicatorSquareKey = null;
      state.pendingReplicatorStatusId = null;
      state.pendingWorkshopSquareKey = null;
      state.pendingWorkshopStatusId = null;
      syncBoardVisualState();
      renderUI();
    });
  }

  const buildCardWorkshop = handEl.querySelector('#buildCardWorkshop');
  if (buildCardWorkshop) {
    buildCardWorkshop.addEventListener('click', () => {
      state.mode = 'place_building';
      state.selectedCardHandIndex = null;
      state.selectedUnitId = null;
      state.coreMagnetPreviewUnitId = null;
      state.repairTargetingCasterId = null;
      state.overloadTargetingBuildingId = null;
      state.systemShockCasterId = null;
      state.pendingSystemShockLevel = null;
      state.pendingSystemShockSourceSlot = null;
      state.pendingShieldingLevel = null;
      state.pendingShieldingSourceSlot = null;
      state.pendingShimmeringLevel = null;
      state.pendingShimmeringSourceSlot = null;
      state.pendingShimmeringSquares = [];
      state.placingBuildingType = BUILD_CARD_LIBRARY.WORKSHOP.id;
      state.pendingArmorySquareKey = null;
      state.pendingArmoryStatusId = null;
      state.pendingArmoryDraftStatusIds = [];
      state.pendingReplicatorSquareKey = null;
      state.pendingReplicatorStatusId = null;
      state.pendingWorkshopSquareKey = null;
      state.pendingWorkshopStatusId = null;
      syncBoardVisualState();
      renderUI();
    });
  }

  const buildCardDatacenter = handEl.querySelector('#buildCardDatacenter');
  if (buildCardDatacenter) {
    buildCardDatacenter.addEventListener('click', () => {
      state.mode = 'place_building';
      state.selectedCardHandIndex = null;
      state.selectedUnitId = null;
      state.coreMagnetPreviewUnitId = null;
      state.repairTargetingCasterId = null;
      state.systemShockCasterId = null;
      state.pendingSystemShockLevel = null;
      state.pendingSystemShockSourceSlot = null;
      state.pendingShieldingLevel = null;
      state.pendingShieldingSourceSlot = null;
      state.pendingShimmeringLevel = null;
      state.pendingShimmeringSourceSlot = null;
      state.pendingShimmeringSquares = [];
      state.placingBuildingType = BUILD_CARD_LIBRARY.DATACENTER.id;
      state.pendingArmorySquareKey = null;
      state.pendingArmoryStatusId = null;
      state.pendingArmoryDraftStatusIds = [];
      state.pendingReplicatorSquareKey = null;
      state.pendingReplicatorStatusId = null;
      state.pendingWorkshopSquareKey = null;
      state.pendingWorkshopStatusId = null;
      syncBoardVisualState();
      renderUI();
    });
  }

  const buildCardGearStation = handEl.querySelector('#buildCardGearStation');
  if (buildCardGearStation) {
    buildCardGearStation.addEventListener('click', () => {
      state.mode = 'place_building';
      state.selectedCardHandIndex = null;
      state.selectedUnitId = null;
      state.coreMagnetPreviewUnitId = null;
      state.repairTargetingCasterId = null;
      state.overloadTargetingBuildingId = null;
      state.systemShockCasterId = null;
      state.pendingSystemShockLevel = null;
      state.pendingSystemShockSourceSlot = null;
      state.pendingShieldingLevel = null;
      state.pendingShieldingSourceSlot = null;
      state.pendingShimmeringLevel = null;
      state.pendingShimmeringSourceSlot = null;
      state.pendingShimmeringSquares = [];
      state.placingBuildingType = BUILD_CARD_LIBRARY.GEAR_STATION.id;
      state.pendingArmorySquareKey = null;
      state.pendingArmoryStatusId = null;
      state.pendingArmoryDraftStatusIds = [];
      state.pendingReplicatorSquareKey = null;
      state.pendingReplicatorStatusId = null;
      state.pendingWorkshopSquareKey = null;
      state.pendingWorkshopStatusId = null;
      syncBoardVisualState();
      renderUI();
    });
  }

  const buildCardAssemblyLine = handEl.querySelector('#buildCardAssemblyLine');
  if (buildCardAssemblyLine) {
    buildCardAssemblyLine.addEventListener('click', () => {
      state.mode = 'place_building';
      state.selectedCardHandIndex = null;
      state.selectedUnitId = null;
      state.coreMagnetPreviewUnitId = null;
      state.repairTargetingCasterId = null;
      state.overloadTargetingBuildingId = null;
      state.systemShockCasterId = null;
      state.pendingSystemShockLevel = null;
      state.pendingSystemShockSourceSlot = null;
      state.pendingShieldingLevel = null;
      state.pendingShieldingSourceSlot = null;
      state.pendingShimmeringLevel = null;
      state.pendingShimmeringSourceSlot = null;
      state.pendingShimmeringSquares = [];
      state.placingBuildingType = BUILD_CARD_LIBRARY.ASSEMBLY_LINE.id;
      state.pendingArmorySquareKey = null;
      state.pendingArmoryStatusId = null;
      state.pendingArmoryDraftStatusIds = [];
      state.pendingReplicatorSquareKey = null;
      state.pendingReplicatorStatusId = null;
      state.pendingWorkshopSquareKey = null;
      state.pendingWorkshopStatusId = null;
      syncBoardVisualState();
      renderUI();
    });
  }

  const buildCardFoundation = handEl.querySelector('#buildCardFoundation');
  if (buildCardFoundation) {
    buildCardFoundation.addEventListener('click', () => {
      activateFoundationTargeting();
    });
  }

  handEl.querySelectorAll('[data-armory-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const buildingId = btn.getAttribute('data-armory-id');
      if (!buildingId) {
        return;
      }
      activateArmoryProduction(buildingId);
    });
  });

  handEl.querySelectorAll('[data-replicator-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const buildingId = btn.getAttribute('data-replicator-id');
      if (!buildingId) {
        return;
      }
      activateReplicatorProduction(buildingId);
    });
  });

  handEl.querySelectorAll('[data-workshop-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const buildingId = btn.getAttribute('data-workshop-id');
      if (!buildingId) {
        return;
      }
      activateWorkshopProduction(buildingId);
    });
  });

  handEl.querySelectorAll('[data-datacenter-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const buildingId = btn.getAttribute('data-datacenter-id');
      if (!buildingId) {
        return;
      }
      activateDatacenterObtain(buildingId);
    });
  });

  handEl.querySelectorAll('[data-gear-station-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const buildingId = btn.getAttribute('data-gear-station-id');
      if (!buildingId) {
        return;
      }
      activateGearStationOverload(buildingId);
    });
  });

  handEl.querySelectorAll('[data-assembly-line-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const buildingId = btn.getAttribute('data-assembly-line-id');
      if (!buildingId) {
        return;
      }
      activateAssemblyLineDraw(buildingId);
    });
  });

  handEl.querySelectorAll('[data-datacenter-create-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const buildingId = btn.getAttribute('data-datacenter-create-id');
      if (!buildingId) {
        return;
      }
      activateDatacenterProduction(buildingId);
    });
  });

  handEl.querySelectorAll('[data-gear-station-create-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const buildingId = btn.getAttribute('data-gear-station-create-id');
      if (!buildingId) {
        return;
      }
      activateGearStationProduction(buildingId);
    });
  });

  handEl.querySelectorAll('[data-assembly-line-create-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const buildingId = btn.getAttribute('data-assembly-line-create-id');
      if (!buildingId) {
        return;
      }
      activateAssemblyLineProduction(buildingId);
    });
  });

  handEl.querySelectorAll('[data-upgrade-building-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const buildingId = btn.getAttribute('data-upgrade-building-id');
      if (!buildingId) {
        return;
      }
      activateBuildingUpgrade(buildingId);
    });
  });

  const tacticalDashButton = handEl.querySelector('#abilityTacticalDash');
  if (tacticalDashButton) {
    tacticalDashButton.addEventListener('click', () => {
      const unit = getSelectedUnit();
      if (!unit || unit.owner !== state.currentPlayerId) {
        return;
      }
      activateTacticalDash(unit);
    });
  }

  const attackButton = handEl.querySelector('#abilityAttack');
  if (attackButton) {
    attackButton.addEventListener('click', () => {
      const unit = getSelectedUnit();
      if (!unit || unit.owner !== state.currentPlayerId) {
        return;
      }
      if (isUnitMovementStunned(unit)) {
        addLog('This Drone is Dazzled and cannot attack this turn.');
        return;
      }
      const tankFaceEaterCooldown = getTankFaceEaterAttackCooldown(unit);
      if (tankFaceEaterCooldown > 0) {
        addLog(`Face-Eater attack cooldown: ${tankFaceEaterCooldown} turn(s) remaining.`);
        return;
      }
      if (unit.unitTypeId === 'ARTILLERY_UNIT') {
        if (!unit.artillerySetUpActive) {
          addLog('Artillery needs Set Up status before attacking.');
          return;
        }
        state.mode = 'artillery_attack_targeting';
      } else {
        state.mode = 'attack_targeting';
      }
      state.coreMagnetPreviewUnitId = null;
      state.repairTargetingCasterId = null;
      state.systemShockCasterId = null;
      syncBoardVisualState();
      renderUI();
    });
  }

  const coreMagnetButton = handEl.querySelector('#abilityCoreMagnet');
  if (coreMagnetButton) {
    coreMagnetButton.addEventListener('click', () => {
      const unit = getSelectedUnit();
      if (!unit || unit.owner !== state.currentPlayerId || unit.unitTypeId !== 'TANK_DRONE_UNIT') {
        return;
      }
      if (isUnitMovementStunned(unit)) {
        addLog('This Drone is Dazzled and cannot use abilities this turn.');
        return;
      }
      const beacon = hasBeaconCoreMagnet(unit);
      if (!beacon && unit.coreMagnetTurnsLeft > 0) {
        addLog('Core Magnet is already active on this Tank Drone.');
        return;
      }
      if (!beacon && unit.coreMagnetCooldown > 0) {
        addLog('Core Magnet is on cooldown.');
        return;
      }
      if (beacon && unit.coreMagnetTurnsLeft > 0) {
        activateCoreMagnet(unit);
        return;
      }
      state.coreMagnetPreviewUnitId = unit.id;
      if (unitHasStatus(unit, DRONE_STATUS_LIBRARY.BULWARK.id)) {
        state.mode = 'core_magnet_bulwark_targeting';
      } else {
        state.mode = 'unit_selected';
      }
      state.hoverSquareKey = null;
      state.coreMagnetBulwarkTargetSquareKey = null;
      syncBoardVisualState();
      renderUI();
    });
  }

  const confirmCoreMagnet = handEl.querySelector('#confirmCoreMagnet');
  if (confirmCoreMagnet) {
    confirmCoreMagnet.addEventListener('click', () => {
      const unit = getSelectedUnit();
      if (!unit || unit.id !== state.coreMagnetPreviewUnitId) {
        return;
      }
      if (unitHasStatus(unit, DRONE_STATUS_LIBRARY.BULWARK.id)) {
        addLog('Bulwark Core Magnet is activated by choosing an adjacent square.');
        return;
      }
      activateCoreMagnet(unit);
    });
  }

  const cancelCoreMagnet = handEl.querySelector('#cancelCoreMagnet');
  if (cancelCoreMagnet) {
    cancelCoreMagnet.addEventListener('click', () => {
      state.coreMagnetPreviewUnitId = null;
      state.coreMagnetBulwarkTargetSquareKey = null;
      if (state.mode === 'core_magnet_bulwark_targeting') {
        state.mode = 'unit_selected';
      }
      syncBoardVisualState();
      renderUI();
    });
  }

  const repairButton = handEl.querySelector('#abilityRepair');
  if (repairButton) {
    repairButton.addEventListener('click', () => {
      const unit = getSelectedUnit();
      if (!unit || unit.owner !== state.currentPlayerId || !casterHasRepairAbility(unit)) {
        return;
      }
      activateRepairTargeting(unit);
    });
  }

  const ghostbladeTeleportButton = handEl.querySelector('#abilityGhostbladeTeleport');
  if (ghostbladeTeleportButton) {
    ghostbladeTeleportButton.addEventListener('click', () => {
      const unit = getSelectedUnit();
      if (!unit || unit.owner !== state.currentPlayerId || unit.unitTypeId !== 'GHOSTBLADE_UNIT') {
        return;
      }
      if (unit.ghostbladeTeleportCooldown > 0) {
        addLog('Teleport is on cooldown.');
        return;
      }
      if (getCurrentPlayer().energy < 10) {
        addLog('Not enough Energy to use Teleport.');
        return;
      }
      state.mode = 'ghostblade_teleport_targeting';
      state.ghostbladeTeleportCasterId = unit.id;
      state.coreMagnetPreviewUnitId = null;
      state.repairTargetingCasterId = null;
      syncBoardVisualState();
      renderUI();
    });
  }

  const artillerySetUpButton = handEl.querySelector('#abilityArtillerySetUp');
  if (artillerySetUpButton) {
    artillerySetUpButton.addEventListener('click', () => {
      const unit = getSelectedUnit();
      if (!unit || unit.owner !== state.currentPlayerId || unit.unitTypeId !== 'ARTILLERY_UNIT') {
        return;
      }
      activateArtillerySetUp(unit);
    });
  }

  const specialistEmpButton = handEl.querySelector('#abilitySpecialistEmp');
  if (specialistEmpButton) {
    specialistEmpButton.addEventListener('click', () => {
      const unit = getSelectedUnit();
      if (!unit || unit.owner !== state.currentPlayerId || unit.unitTypeId !== 'SPECIALIST_UNIT') {
        return;
      }
      if (unit.specialistEmpCooldown > 0) {
        addLog('EMP is on cooldown.');
        return;
      }
      if (hasSalvoEmpStatus(unit) && (unit.specialistEmpUsesThisTurn ?? 0) >= 2) {
        addLog('Salvo: this Specialist already used EMP twice this turn.');
        return;
      }
      if (unit.hasAttacked && !hasSalvoEmpStatus(unit)) {
        addLog('Specialist cannot use EMP after attacking this turn.');
        return;
      }
      if (getCurrentPlayer().energy < 5) {
        addLog('Not enough Energy to use EMP.');
        return;
      }
      state.mode = 'specialist_emp_targeting';
      state.specialistEmpCasterId = unit.id;
      state.hoverSquareKey = null;
      syncBoardVisualState();
      renderUI();
    });
  }

  renderProcessEchoPanels(currentPlayer);

  renderSelectedUnitSideStats(selectedUnit);
  syncBoardVisualState();
}

function renderProcessEchoPanels(currentPlayer) {
  const panelConfigs = [
    { playerId: 'A', panel: document.getElementById('processEchoLeft') },
    { playerId: 'B', panel: document.getElementById('processEchoRight') }
  ];
  const orderedSlots = ['X', '1', '2', '3'];

  for (const { playerId, panel } of panelConfigs) {
    if (!panel) {
      continue;
    }
    const echo = state.players[playerId].processEcho ?? createEmptyProcessEcho();
    state.players[playerId].processEcho = echo;
    const buttons = panel.querySelectorAll('.process-echo-btn');
    buttons.forEach((btn, index) => {
      const slot = orderedSlots[index];
      if (!slot) {
        return;
      }
      const slotCard = echo[slot];
      const hasCard = Boolean(slotCard);
      const tooltipHtml = slotCard ? getProcessEchoPerkTooltipHtml(slotCard) : '';
      btn.innerHTML = hasCard
        ? `
          <span class="process-echo-slot-label">${slot}</span>
          ${getProcessEchoCardIconHtml(slotCard)}
          ${tooltipHtml}
        `
        : `<span class="process-echo-empty-label">${slot}</span>`;
      btn.classList.toggle('filled', hasCard);
      btn.disabled = false;
      btn.onclick = () => {
        if (state.winner || playerId !== state.currentPlayerId) {
          return;
        }

        if (slot === 'X') {
          if (state.mode !== 'system_shock_card' && state.mode !== 'shielding_card' && state.mode !== 'shimmering_card') {
            addLog('Cards in X cannot be played this turn unless the card says otherwise.');
            return;
          }
          const selectedCard = currentPlayer.hand[state.selectedCardHandIndex];
          if (
            !selectedCard ||
            (selectedCard.cardId !== CARD_LIBRARY.SYSTEM_SHOCK.id &&
              selectedCard.cardId !== CARD_LIBRARY.SHIELDING.id &&
              selectedCard.cardId !== CARD_LIBRARY.SHIMMERING_CLOAK.id)
          ) {
            addLog('Select a storable Perk card first.');
            return;
          }
          if (echo.X) {
            currentPlayer.discard.push(echo.X);
            addLog(`Player ${currentPlayer.id} replaced the card in Process Echo X. Old card moved to discard.`);
          }
          echo.X = selectedCard;
          currentPlayer.hand.splice(state.selectedCardHandIndex, 1);
          addLog(`Player ${currentPlayer.id} stored ${CARD_LIBRARY[selectedCard.cardId].cardName} in Process Echo X.`);
          clearSelection();
          renderUI();
          return;
        }

        if (!hasCard) {
          addLog(`Process Echo slot ${slot} is empty.`);
          return;
        }
        if (currentPlayer.processEchoPlayedThisTurn) {
          addLog('You can play only one card from Process Echo per turn.');
          return;
        }
        const level = Number.parseInt(slot, 10);
        if (!Number.isFinite(level) || level < 1 || level > 3) {
          addLog('This Process Echo slot is not playable yet.');
          return;
        }
        if (slotCard.cardId === CARD_LIBRARY.SYSTEM_SHOCK.id) {
          state.mode = 'system_shock_targeting_echo';
          state.pendingSystemShockLevel = level;
          state.pendingSystemShockSourceSlot = slot;
          state.pendingShieldingLevel = null;
          state.pendingShieldingSourceSlot = null;
          state.pendingShimmeringLevel = null;
          state.pendingShimmeringSourceSlot = null;
          state.pendingShimmeringSquares = [];
        } else if (slotCard.cardId === CARD_LIBRARY.SHIELDING.id) {
          state.mode = 'shielding_equip_echo';
          state.pendingShieldingLevel = level;
          state.pendingShieldingSourceSlot = slot;
          state.pendingSystemShockLevel = null;
          state.pendingSystemShockSourceSlot = null;
          state.pendingShimmeringLevel = null;
          state.pendingShimmeringSourceSlot = null;
          state.pendingShimmeringSquares = [];
        } else if (slotCard.cardId === CARD_LIBRARY.SHIMMERING_CLOAK.id) {
          state.mode = 'shimmering_targeting_echo';
          state.pendingShimmeringLevel = level;
          state.pendingShimmeringSourceSlot = slot;
          state.pendingShimmeringSquares = [];
          state.pendingSystemShockLevel = null;
          state.pendingSystemShockSourceSlot = null;
          state.pendingShieldingLevel = null;
          state.pendingShieldingSourceSlot = null;
        } else {
          addLog('This Process Echo card cannot be played.');
          return;
        }
        state.selectedCardHandIndex = null;
        state.selectedUnitId = null;
        state.systemShockCasterId = null;
        state.coreMagnetPreviewUnitId = null;
        state.repairTargetingCasterId = null;
        syncBoardVisualState();
        renderUI();
      };
    });
  }
}

function getProcessEchoPerkTooltipHtml(card) {
  const cardTemplate = CARD_LIBRARY[card.cardId];
  if (!cardTemplate) {
    return '';
  }
  if (cardTemplate.id === CARD_LIBRARY.SYSTEM_SHOCK.id) {
    return `
      <span class="process-echo-tooltip">
        <strong>System Shock</strong><br/>
        Target rule: enemy must be within attack range of at least one of your drones.<br/>
        Level 1: Deal 5 SYSTEM damage to an enemy drone.<br/>
        Level 2: Deal 8 SYSTEM damage to an enemy drone.<br/>
        Level 3: Deal 8 SYSTEM damage; if target is destroyed, gain 10 Energy.
      </span>
    `;
  }
  if (cardTemplate.id === CARD_LIBRARY.SHIELDING.id) {
    return `
      <span class="process-echo-tooltip">
        <strong>Shielding</strong><br/>
        Level 1: Add 2 Shield to your drone.<br/>
        Level 2: Add 5 Shield to your drone.<br/>
        Level 3: Add 5 Shield and stack with current Shield value.
      </span>
    `;
  }
  if (cardTemplate.id === CARD_LIBRARY.SHIMMERING_CLOAK.id) {
    return `
      <span class="process-echo-tooltip">
        <strong>Shimmering Cloak</strong><br/>
        Level 1: 1 Square for 1 Turn.<br/>
        Level 2: 1 Square for 2 Turns.<br/>
        Level 3: 2 Squares for 2 Turns.
      </span>
    `;
  }
  return `
    <span class="process-echo-tooltip">
      <strong>${cardTemplate.cardName}</strong><br/>
      Perk card in Process Echo.
    </span>
  `;
}

function getProcessEchoCardIconHtml(card) {
  if (!card) {
    return '';
  }
  if (card.cardId === CARD_LIBRARY.SYSTEM_SHOCK.id) {
    return `
      <span class="process-echo-system-shock" aria-hidden="true">
        <span class="palm">🖐</span>
        <span class="bolt">⚡</span>
      </span>
    `;
  }
  if (card.cardId === CARD_LIBRARY.SHIELDING.id) {
    return `
      <span class="process-echo-system-shock process-echo-icon-blue" aria-hidden="true">
        <span class="palm">🛡️</span>
      </span>
    `;
  }
  if (card.cardId === CARD_LIBRARY.SHIMMERING_CLOAK.id) {
    return `
      <span class="process-echo-system-shock process-echo-icon-blue" aria-hidden="true">
        <span class="palm">🧥</span>
      </span>
    `;
  }
  return `
    <span class="process-echo-system-shock" aria-hidden="true">
      <span class="palm">✨</span>
    </span>
  `;
}

function renderSelectedUnitSideStats(selectedUnit) {
  droneStatsLeftEl.innerHTML = '';
  droneStatsRightEl.innerHTML = '';
  droneStatsLeftEl.classList.remove('visible');
  droneStatsRightEl.classList.remove('visible');

  if (!selectedUnit) {
    return;
  }

  normalizeEnergizeSystemDamage(selectedUnit);
  const effectiveMove = getUnitCurrentMoveRange(selectedUnit);
  const effectiveAttackRange = getUnitCurrentAttackRange(selectedUnit);
  const effectiveAttackDamage = getUnitCurrentAttackDamage(selectedUnit);
  const damageType = selectedUnit.damageType ?? DAMAGE_TYPES.ATTACK;
  const shieldBonus = selectedUnit.shieldHitPoints ?? 0;
  const additionalSystemDamage = Math.max(0, selectedUnit.additionalSystemDamagePerAttack ?? 0);
  const statsHtml = `
    <div class="drone-stats-card ${selectedUnit.owner === 'A' ? 'a' : 'b'}">
      <div class="drone-stats-title">${selectedUnit.unitName}</div>
      <div class="drone-stats-row">Movement: <strong>${effectiveMove}</strong></div>
      <div class="drone-stats-row">Attack: <strong>${effectiveAttackDamage}</strong></div>
      <div class="drone-stats-row">Range: <strong>${effectiveAttackRange}</strong></div>
      <div class="drone-stats-row">Damage Type: <strong>${damageType}</strong></div>
      ${additionalSystemDamage > 0 ? `<div class="drone-stats-row">Additional Damage: <strong>${additionalSystemDamage} System Damage</strong></div>` : ''}
      ${shieldBonus > 0 ? `<div class="drone-stats-row">Shield: <strong>${shieldBonus}/${shieldBonus}</strong></div>` : ''}
      <div class="drone-stats-row">Hit Points: <strong>${selectedUnit.hitPoints}/${selectedUnit.maxHitPoints}</strong></div>
    </div>
  `;

  if (selectedUnit.owner === 'A') {
    droneStatsLeftEl.innerHTML = statsHtml;
    droneStatsLeftEl.classList.add('visible');
  } else {
    droneStatsRightEl.innerHTML = statsHtml;
    droneStatsRightEl.classList.add('visible');
  }
}

function activateTacticalDash(unit) {
  if (unit.owner !== state.currentPlayerId) {
    addLog('Only your selected drone can use this ability.');
    return;
  }

  if (unit.unitTypeId !== 'PAWN_DRONE_UNIT') {
    addLog('Only Pawn Drone can use Tactical Dash.');
    return;
  }

  if (unit.tacticalDashActiveThisTurn) {
    addLog('Tactical Dash is already active on this drone.');
    return;
  }

  if (unit.tacticalDashCooldown > 0) {
    addLog('Tactical Dash is on cooldown.');
    return;
  }

  unit.tacticalDashActiveThisTurn = true;
  unit.tacticalDashCooldown = 3;
  addLog(`${unit.owner} Pawn Drone activated Tactical Dash.`);
  renderUI();
}

function activateCoreMagnet(unit) {
  if (unit.owner !== state.currentPlayerId || unit.unitTypeId !== 'TANK_DRONE_UNIT') {
    addLog('Only your selected Tank Drone can use Core Magnet.');
    return;
  }

  const beacon = hasBeaconCoreMagnet(unit);
  if (!beacon && unit.coreMagnetTurnsLeft > 0) {
    addLog('Core Magnet is already active on this Tank Drone.');
    return;
  }
  if (!beacon && unit.coreMagnetCooldown > 0) {
    addLog('Core Magnet is on cooldown.');
    return;
  }

  if (!beacon && unitHasStatus(unit, DRONE_STATUS_LIBRARY.BULWARK.id)) {
    addLog('Bulwark Core Magnet requires selecting one adjacent direction square.');
    return;
  }

  if (beacon && unit.coreMagnetTurnsLeft > 0) {
    unit.coreMagnetTurnsLeft = 0;
    unit.coreMagnetBulwarkCenterSquareKey = null;
    unit.coreMagnetCooldown = 0;
    state.mode = 'unit_selected';
    state.hoverSquareKey = null;
    state.coreMagnetPreviewUnitId = null;
    state.coreMagnetBulwarkTargetSquareKey = null;
    addLog(`${unit.owner} Tank Drone canceled Core Magnet (Beacon).`);
    syncBoardVisualState();
    renderUI();
    return;
  }

  unit.coreMagnetTurnsLeft = beacon ? 1 : 2;
  unit.coreMagnetCooldown = beacon ? 0 : 3;
  unit.coreMagnetBulwarkCenterSquareKey = null;
  if (!beacon || canCoreMagnetHealThisTurn(unit)) {
    unit.hitPoints = Math.min(unit.maxHitPoints, unit.hitPoints + 5);
    markCoreMagnetHealedThisTurn(unit);
  }
  if (!beacon) {
    unit.hasMoved = true;
    unit.hasAttacked = true;
    unit.movementUsedThisTurn = getUnitCurrentMoveRange(unit);
  }
  state.mode = 'unit_selected';
  state.hoverSquareKey = null;
  state.coreMagnetPreviewUnitId = null;
  state.coreMagnetBulwarkTargetSquareKey = null;
  addLog(
    beacon
      ? `${unit.owner} Tank Drone activated Core Magnet (Beacon).`
      : `${unit.owner} Tank Drone activated Core Magnet and repaired 5 HP.`
  );
  syncBoardVisualState();
  renderUI();
}

function activateBulwarkCoreMagnet(unit, centerSquareKey) {
  if (unit.owner !== state.currentPlayerId || unit.unitTypeId !== 'TANK_DRONE_UNIT') {
    addLog('Only your selected Tank Drone can use Core Magnet.');
    return;
  }
  if (!unitHasStatus(unit, DRONE_STATUS_LIBRARY.BULWARK.id)) {
    addLog('This Tank Drone does not have Bulwark.');
    return;
  }
  if (unit.coreMagnetTurnsLeft > 0) {
    addLog('Core Magnet is already active on this Tank Drone.');
    return;
  }
  const beacon = hasBeaconCoreMagnet(unit);
  if (!beacon && unit.coreMagnetCooldown > 0) {
    addLog('Core Magnet is on cooldown.');
    return;
  }
  const adjacentKeys = new Set(getBulwarkAdjacentSquareKeys(unit));
  if (!adjacentKeys.has(centerSquareKey)) {
    addLog('Bulwark direction must be an adjacent square.');
    return;
  }

  unit.coreMagnetBulwarkCenterSquareKey = centerSquareKey;
  unit.coreMagnetTurnsLeft = beacon ? 1 : 2;
  unit.coreMagnetCooldown = beacon ? 0 : 3;
  if (!beacon || canCoreMagnetHealThisTurn(unit)) {
    unit.hitPoints = Math.min(unit.maxHitPoints, unit.hitPoints + 5);
    markCoreMagnetHealedThisTurn(unit);
  }
  if (!beacon) {
    unit.hasMoved = true;
    unit.hasAttacked = true;
    unit.movementUsedThisTurn = getUnitCurrentMoveRange(unit);
  }
  state.mode = 'unit_selected';
  state.hoverSquareKey = null;
  state.coreMagnetPreviewUnitId = null;
  state.coreMagnetBulwarkTargetSquareKey = null;
  addLog(
    beacon
      ? `${unit.owner} Tank Drone activated Bulwark Core Magnet (Beacon).`
      : `${unit.owner} Tank Drone activated Bulwark Core Magnet and repaired 5 HP.`
  );
  syncBoardVisualState();
  renderUI();
}

function handleCoreMagnetBulwarkTargetClick(hit) {
  if (hit.userData.type !== 'square' && hit.userData.type !== 'base') {
    addLog('Select one adjacent square to aim Bulwark Core Magnet.');
    return;
  }
  const unit = getSelectedUnit();
  if (!unit || unit.id !== state.coreMagnetPreviewUnitId || unit.owner !== state.currentPlayerId) {
    clearSelection();
    renderUI();
    return;
  }
  const targetSquareKey = hit.userData.squareKey;
  if (!targetSquareKey) {
    return;
  }
  if (hasBeaconCoreMagnet(unit) && unit.coreMagnetTurnsLeft > 0) {
    activateCoreMagnet(unit);
    return;
  }
  const validTargets = new Set(getBulwarkAdjacentSquareKeys(unit));
  if (!validTargets.has(targetSquareKey)) {
    addLog('Choose one of the 4 adjacent highlighted squares.');
    return;
  }
  activateBulwarkCoreMagnet(unit, targetSquareKey);
}

function activateRepairTargeting(unit) {
  if (unit.owner !== state.currentPlayerId || !casterHasRepairAbility(unit)) {
    addLog('Only your Support Drone or Scholar Specialist can use Repair.');
    return;
  }
  const repairEnergyCost = unitHasStatus(unit, DRONE_STATUS_LIBRARY.SMART.id) ? 0 : 5;
  if (unit.repairCooldown > 0) {
    addLog('Repair is on cooldown.');
    return;
  }
  if (getCurrentPlayer().energy < repairEnergyCost) {
    addLog('Not enough Energy to use Repair.');
    return;
  }
  state.mode = 'repair_targeting';
  state.repairTargetingCasterId = unit.id;
  state.coreMagnetPreviewUnitId = null;
  state.systemShockCasterId = null;
  addLog('Select an allied drone within range to Repair.');
  syncBoardVisualState();
  renderUI();
}

function activateArtillerySetUp(unit) {
  if (!unit || unit.owner !== state.currentPlayerId || unit.unitTypeId !== 'ARTILLERY_UNIT') {
    return;
  }
  if (unit.artillerySetUpUsedThisTurn) {
    addLog('Set Up can be used only once per turn.');
    return;
  }
  if (unit.artillerySetUpActive) {
    unit.artillerySetUpActive = false;
    unit.artillerySetUpUsedThisTurn = true;
    addLog('Artillery canceled Set Up and can move this turn.');
    syncBoardVisualState();
    renderUI();
    return;
  }
  if (unit.artillerySetUpCooldown > 0) {
    addLog('Set Up is on cooldown.');
    return;
  }
  unit.artillerySetUpActive = true;
  unit.artillerySetUpUsedThisTurn = true;
  unit.artillerySetUpCooldown = 3;
  unit.hasMoved = true;
  unit.hasAttacked = true;
  unit.movementUsedThisTurn = getUnitCurrentMoveRange(unit);
  addLog('Artillery started channeling Set Up.');
  state.mode = 'unit_selected';
  syncBoardVisualState();
  renderUI();
}

function applyRepairAbility(caster, target) {
  const currentPlayer = getCurrentPlayer();
  const repairEnergyCost = unitHasStatus(caster, DRONE_STATUS_LIBRARY.SMART.id) ? 0 : 5;
  currentPlayer.energy -= repairEnergyCost;
  caster.repairCooldown = 2;
  caster.movementUsedThisTurn = getUnitCurrentMoveRange(caster);
  caster.hasMoved = true;

  const healAmount = Math.ceil(target.maxHitPoints * 0.5);
  const before = target.hitPoints;
  target.hitPoints = Math.min(target.maxHitPoints, target.hitPoints + healAmount);
  const restored = target.hitPoints - before;
  let mechaTargetBonusApplied = 0;
  let mechaSelfBonusApplied = 0;
  if (unitHasStatus(caster, DRONE_STATUS_LIBRARY.MECHA.id)) {
    mechaTargetBonusApplied = DRONE_STATUS_LIBRARY.MECHA.effects.repairBonusToTarget ?? 1;
    mechaSelfBonusApplied = DRONE_STATUS_LIBRARY.MECHA.effects.repairBonusToSelf ?? 1;
    const targetBeforeMecha = target.hitPoints;
    target.hitPoints = Math.min(target.maxHitPoints, target.hitPoints + mechaTargetBonusApplied);
    mechaTargetBonusApplied = Math.max(0, target.hitPoints - targetBeforeMecha);
    const casterBeforeMecha = caster.hitPoints;
    caster.hitPoints = Math.min(caster.maxHitPoints, caster.hitPoints + mechaSelfBonusApplied);
    mechaSelfBonusApplied = Math.max(0, caster.hitPoints - casterBeforeMecha);
  }
  let augmentedBonusApplied = 0;
  if (unitHasStatus(caster, DRONE_STATUS_LIBRARY.ENGINEER.id)) {
    augmentedBonusApplied = DRONE_STATUS_LIBRARY.ENGINEER.effects.repairAddsPermanentAttackToTarget ?? 1;
    target.attackDamage += augmentedBonusApplied;
    target.augmentedAttackBonus = (target.augmentedAttackBonus ?? 0) + augmentedBonusApplied;
  }

  state.mode = 'idle';
  state.repairTargetingCasterId = null;

  playRepairCasterAnimation(caster.id);
  playRepairTargetAnimation(target.id);
  addLog(
    `${caster.owner} ${caster.unitName} repaired ${target.unitName} for ${restored} HP.` +
      (mechaTargetBonusApplied > 0 || mechaSelfBonusApplied > 0
        ? ` Mecha bonus: +${mechaTargetBonusApplied} HP to target, +${mechaSelfBonusApplied} HP to caster.`
        : '') +
      (augmentedBonusApplied > 0 ? ` ${target.unitName} gained +${augmentedBonusApplied} ATT (Augmented).` : '')
  );

  syncBoardVisualState();
  renderUI();
}

function isUnitPlanted(unit) {
  return unit.unitTypeId === 'TANK_DRONE_UNIT' && unit.coreMagnetTurnsLeft > 0;
}

function unitHasStatus(unit, statusId) {
  return !!unit?.grantedStatusIds?.includes(statusId);
}

function canUnitAttackAfterMoving(unit) {
  if (!unit) {
    return false;
  }
  if (!unit.hasMoved) {
    return true;
  }
  if (unit.canAttackAfterMove) {
    return true;
  }
  return (
    unit.unitTypeId === 'GHOSTBLADE_UNIT' &&
    unitHasStatus(unit, DRONE_STATUS_LIBRARY.RAGE.id) &&
    unit.hitPoints < unit.maxHitPoints
  );
}

function isTangoGhostbladeArmed(unit) {
  return (
    unit?.unitTypeId === 'GHOSTBLADE_UNIT' &&
    unitHasStatus(unit, DRONE_STATUS_LIBRARY.TANGO.id) &&
    !!unit.tangoGuardActive
  );
}

function getTangoReactorForPosition(movingUnit, targetX, targetZ) {
  if (!movingUnit) {
    return null;
  }
  const reactors = state.units.filter(
    (candidate) =>
      candidate.owner !== movingUnit.owner &&
      isTangoGhostbladeArmed(candidate)
  );
  if (!reactors.length) {
    return null;
  }
  const sorted = reactors
    .map((candidate) => ({
      unit: candidate,
      distance: getDistance(candidate.x, candidate.z, targetX, targetZ)
    }))
    .filter((entry) => entry.distance <= getUnitCurrentAttackRange(entry.unit))
    .sort((a, b) => a.distance - b.distance || a.unit.id.localeCompare(b.unit.id));
  return sorted.length ? sorted[0].unit : null;
}

function triggerTangoReaction(reactor, movingUnit) {
  if (!reactor || !movingUnit) {
    return false;
  }
  reactor.tangoGuardActive = false;
  applyUnitAttack(reactor, movingUnit, { skipAttackVisual: false });
  addLog(`${reactor.owner} ${reactor.unitName} triggered Tango reaction attack.`);
  return true;
}

function applyGhostbladeShellGuard(unit, damageAmount, damageType) {
  const damage = Math.max(0, damageAmount ?? 0);
  if (
    !unit ||
    damage <= 0 ||
    unit.unitTypeId !== 'GHOSTBLADE_UNIT' ||
    !unitHasStatus(unit, DRONE_STATUS_LIBRARY.SHELL.id) ||
    !unit.shellGuardActive
  ) {
    return { damage, consumed: false, reduced: false };
  }

  unit.shellGuardActive = false;
  if (damageType === DAMAGE_TYPES.ATTACK) {
    const reduced = Math.max(0, Math.ceil(damage * 0.25));
    return { damage: reduced, consumed: true, reduced: reduced < damage };
  }
  return { damage, consumed: true, reduced: false };
}

function getWorkshopRepairStatusIdsForPlayer(playerId) {
  const player = state.players[playerId];
  if (!player) {
    return [];
  }
  const repairAffecting = new Set([
    DRONE_STATUS_LIBRARY.MECHA.id,
    DRONE_STATUS_LIBRARY.ENGINEER.id,
    DRONE_STATUS_LIBRARY.SMART.id
  ]);
  const result = new Set();
  for (const building of player.buildings ?? []) {
    if (building.type !== 'WORKSHOP') {
      continue;
    }
    for (const statusId of getBuildingGrantedStatusIds(building)) {
      if (repairAffecting.has(statusId)) {
        result.add(statusId);
      }
    }
  }
  return [...result];
}

function casterHasRepairAbility(unit) {
  if (!unit) {
    return false;
  }
  if (unit.unitTypeId === 'SUPPORT_DRONE_UNIT') {
    return true;
  }
  return unit.unitTypeId === 'SPECIALIST_UNIT' && unitHasStatus(unit, DRONE_STATUS_LIBRARY.SCHOLAR.id);
}

function hasSalvoEmpStatus(unit) {
  return unit?.unitTypeId === 'SPECIALIST_UNIT' && unitHasStatus(unit, DRONE_STATUS_LIBRARY.SALVO.id);
}

function hasEnergizeStatus(unit) {
  return unit?.unitTypeId === 'PAWN_DRONE_UNIT' && unitHasStatus(unit, DRONE_STATUS_LIBRARY.ENERGIZE.id);
}

function normalizeEnergizeSystemDamage(unit) {
  if (!hasEnergizeStatus(unit)) {
    return;
  }
  const baseAttack = unit.baseAttackDamage ?? unit.attackDamage ?? 0;
  const currentAttack = unit.attackDamage ?? baseAttack;
  if (currentAttack > baseAttack) {
    const gainedBonus = currentAttack - baseAttack;
    unit.additionalSystemDamagePerAttack = (unit.additionalSystemDamagePerAttack ?? 0) + gainedBonus;
    unit.attackDamage = baseAttack;
  }
}

function droneHasPlusSupplyStatus(unit) {
  if (!unit) {
    return false;
  }
  return (unit.adjacencyStatuses ?? []).some((status) => status.key === 'adj_workshop_supply');
}

function droneHasProviderStatus(unit) {
  return unitHasStatus(unit, DRONE_STATUS_LIBRARY.PROVIDER.id);
}

function awardSupplyFromDrone(player, unit, baseSupply, reason = 'gain') {
  if (!player || !unit || baseSupply <= 0) {
    return 0;
  }
  const plusSupplyBonus = droneHasPlusSupplyStatus(unit) ? Math.floor(baseSupply * 0.5) : 0;
  const providerBonus = droneHasProviderStatus(unit) ? 3 : 0;
  const total = baseSupply + plusSupplyBonus + providerBonus;
  player.supply += total;
  if (plusSupplyBonus > 0 || providerBonus > 0) {
    addLog(
      `${unit.unitName} ${reason} supply: ${baseSupply}` +
        `${plusSupplyBonus > 0 ? ` +${plusSupplyBonus} (+Supply)` : ''}` +
        `${providerBonus > 0 ? ` +${providerBonus} (Provider)` : ''}` +
        ` = ${total}.`
    );
  }
  return total;
}

function getEnergyCostForUnitType(unitTypeId) {
  const card = Object.values(CARD_LIBRARY).find(
    (entry) => entry.cardType === 'unit_summon' && entry.summonUnitId === unitTypeId
  );
  return card?.energyCost ?? 0;
}

function hasBeaconCoreMagnet(unit) {
  return unit?.unitTypeId === 'TANK_DRONE_UNIT' && unitHasStatus(unit, DRONE_STATUS_LIBRARY.BEACON.id);
}

function getCurrentTurnTag() {
  const currentPlayer = getCurrentPlayer();
  return `${currentPlayer.id}:${currentPlayer.turnCounter ?? 0}`;
}

function canCoreMagnetHealThisTurn(unit) {
  return unit?.coreMagnetLastHealTurnTag !== getCurrentTurnTag();
}

function markCoreMagnetHealedThisTurn(unit) {
  unit.coreMagnetLastHealTurnTag = getCurrentTurnTag();
}

function getTankFaceEaterAttackCooldown(unit) {
  if (!unit || unit.unitTypeId !== 'TANK_DRONE_UNIT') {
    return 0;
  }
  if (!unitHasStatus(unit, DRONE_STATUS_LIBRARY.FACE_EATER.id)) {
    return 0;
  }
  return unit.tankFaceEaterAttackCooldown ?? 0;
}

function hasActiveChannelingAbility(unit) {
  if (!unit) {
    return false;
  }
  return isUnitPlanted(unit) || (unit.unitTypeId === 'ARTILLERY_UNIT' && unit.artillerySetUpActive);
}

function breakCoreMagnetChannel(unit, reason = 'BREAK') {
  if (unit.unitTypeId !== 'TANK_DRONE_UNIT' || unit.coreMagnetTurnsLeft <= 0) {
    // Continue to check other channeling effects below.
  } else {
    unit.coreMagnetTurnsLeft = 0;
    unit.coreMagnetBulwarkCenterSquareKey = null;
    if (hasBeaconCoreMagnet(unit)) {
      unit.coreMagnetCooldown = 0;
      addLog(`${unit.owner} Tank Drone Core Magnet channel was broken by ${reason}.`);
    } else if (reason === 'EMP') {
      unit.coreMagnetCooldown = Math.max(unit.coreMagnetCooldown, 3);
      addLog(`${unit.owner} Tank Drone Core Magnet channel was broken by EMP. Cooldown restarted.`);
    } else {
      unit.coreMagnetCooldown += 2;
      addLog(`${unit.owner} Tank Drone Core Magnet channel was broken by ${reason}. Cooldown extended by 2 turns.`);
    }
  }
  if (unit.unitTypeId === 'ARTILLERY_UNIT' && unit.artillerySetUpActive) {
    unit.artillerySetUpActive = false;
    unit.artillerySetUpUsedThisTurn = true;
    if (reason === 'EMP') {
      unit.artillerySetUpCooldown = Math.max(unit.artillerySetUpCooldown, 3);
      addLog(`${unit.owner} Artillery Set Up channel was broken by EMP. Cooldown restarted.`);
    } else {
      addLog(`${unit.owner} Artillery Set Up channel was broken by ${reason}.`);
    }
  }
}

function getRepairTargetableUnits(caster) {
  if (!caster || !casterHasRepairAbility(caster)) {
    return [];
  }
  return state.units.filter(
    (unit) =>
      unit.owner === caster.owner &&
      unit.id !== caster.id &&
      canPlayerDirectlyTargetUnit(state.currentPlayerId, unit) &&
      getDistance(caster.x, caster.z, unit.x, unit.z) <= caster.attackRange
  );
}

function playRepairCasterAnimation(casterId) {
  const visual = unitVisualsById.get(casterId);
  if (!visual?.repairArms?.length) {
    return;
  }

  activeEffects.push({
    duration: 0.45,
    elapsed: 0,
    update(effect, delta) {
      effect.elapsed += delta;
      const t = Math.min(effect.elapsed / effect.duration, 1);
      const lift = Math.sin(t * Math.PI);
      for (const arm of visual.repairArms) {
        arm.node.rotation.x = arm.baseX + (arm.raiseX - arm.baseX) * lift;
      }
    },
    complete() {
      for (const arm of visual.repairArms) {
        arm.node.rotation.x = arm.baseX;
      }
    }
  });
}

function playRepairTargetAnimation(targetId) {
  const targetPos = getUnitHeadWorldPosition(targetId);
  for (let i = 0; i < 3; i += 1) {
    const plus = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: healPlusTexture,
        transparent: true,
        depthWrite: false
      })
    );
    plus.scale.set(0.38, 0.38, 0.38);
    plus.position.set(targetPos.x + (i - 1) * 0.18, targetPos.y + 0.2 + i * 0.1, targetPos.z);
    effectsGroup.add(plus);

    const baseY = plus.position.y;
    activeEffects.push({
      duration: 0.55,
      elapsed: 0,
      update(effect, delta) {
        effect.elapsed += delta;
        const t = Math.min(effect.elapsed / effect.duration, 1);
        plus.position.y = baseY + t * 0.4;
        plus.material.opacity = 1 - t;
        plus.scale.setScalar(0.36 + t * 0.12);
      },
      complete() {
        effectsGroup.remove(plus);
      }
    });
  }
}

function getUnitHeadWorldPosition(unitId) {
  const visual = unitVisualsById.get(unitId);
  if (!visual) {
    return getUnitWorldPosition(unitId);
  }

  // Use rendered bounds so the effect always starts above the current model's head/top.
  const bounds = new THREE.Box3().setFromObject(visual.root);
  const center = new THREE.Vector3();
  bounds.getCenter(center);
  return new THREE.Vector3(center.x, bounds.max.y + 0.08, center.z);
}

function createHealPlusTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 64, 64);
  ctx.fillStyle = 'rgba(29, 191, 99, 0.95)';
  ctx.fillRect(28, 10, 8, 44);
  ctx.fillRect(10, 28, 44, 8);
  ctx.strokeStyle = 'rgba(216, 255, 230, 0.9)';
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 28, 44, 8);
  ctx.strokeRect(28, 10, 8, 44);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createCoinTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 64, 64);
  ctx.fillStyle = '#f5c542';
  ctx.beginPath();
  ctx.arc(32, 32, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fff0a6';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = '#7a5a07';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('$', 32, 33);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createHexShieldTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(107, 114, 128, 0.22)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const radius = 13;
  const hStep = radius * 1.73;
  const vStep = radius * 1.5;
  ctx.strokeStyle = 'rgba(203, 213, 225, 0.8)';
  ctx.lineWidth = 1.4;
  for (let row = 0; row < 12; row += 1) {
    const y = 8 + row * vStep;
    const offset = row % 2 === 0 ? 12 : 12 + hStep / 2;
    for (let col = 0; col < 16; col += 1) {
      const x = offset + col * hStep;
      ctx.beginPath();
      for (let i = 0; i < 6; i += 1) {
        const a = (Math.PI / 3) * i + Math.PI / 6;
        const px = x + Math.cos(a) * radius;
        const py = y + Math.sin(a) * radius;
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.needsUpdate = true;
  return texture;
}

function playSupplyHarvestCoins(unitId) {
  const origin = getUnitHeadWorldPosition(unitId);
  const coins = [];
  const coinCount = 8;
  for (let i = 0; i < coinCount; i += 1) {
    const coin = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: coinTexture,
        transparent: true,
        depthWrite: false
      })
    );
    const angle = (i / coinCount) * Math.PI * 2;
    const radius = 0.08 + Math.random() * 0.18;
    coin.position.set(
      origin.x + Math.cos(angle) * radius,
      origin.y + Math.random() * 0.25,
      origin.z + Math.sin(angle) * radius
    );
    coin.scale.set(0.26, 0.26, 0.26);
    effectsGroup.add(coin);
    coins.push({
      sprite: coin,
      driftX: (Math.random() - 0.5) * 0.7,
      driftZ: (Math.random() - 0.5) * 0.7,
      rise: 0.45 + Math.random() * 0.5
    });
  }

  activeEffects.push({
    duration: 2,
    elapsed: 0,
    update(effect, delta) {
      effect.elapsed += delta;
      const t = Math.min(effect.elapsed / effect.duration, 1);
      for (const coin of coins) {
        coin.sprite.position.x += coin.driftX * delta;
        coin.sprite.position.z += coin.driftZ * delta;
        coin.sprite.position.y += coin.rise * delta;
        coin.sprite.material.opacity = 0.9 * (1 - t);
        const pulse = 0.24 + Math.sin((effect.elapsed + coin.driftX) * 8) * 0.03;
        coin.sprite.scale.set(pulse, pulse, pulse);
      }
    },
    complete() {
      for (const coin of coins) {
        effectsGroup.remove(coin.sprite);
      }
    }
  });
}

function flashSupplyHarvested() {
  if (!centerFlashEl) {
    return;
  }
  centerFlashEl.textContent = 'Supply Harvested';
  centerFlashEl.classList.remove('show');
  // Force reflow so repeated flashes still animate.
  void centerFlashEl.offsetWidth;
  centerFlashEl.classList.add('show');
  setTimeout(() => {
  centerFlashEl.classList.remove('show');
  }, 1400);
}

function createUnitVisual(unit) {
  if (unit.unitTypeId === 'ARTILLERY_UNIT') {
    return createArtilleryVisual(unit);
  }
  if (unit.unitTypeId === 'GHOSTBLADE_UNIT') {
    return createGhostbladeVisual(unit);
  }
  if (unit.unitTypeId === 'SUPPORT_DRONE_UNIT') {
    return createSupportDroneVisual(unit);
  }
  if (unit.unitTypeId === 'TANK_DRONE_UNIT') {
    return createTankDroneVisual(unit);
  }
  if (unit.unitTypeId === 'SPECIALIST_UNIT') {
    return createSpecialistDroneVisual(unit);
  }
  return createPawnDroneVisual(unit);
}

function createArtilleryVisual(unit) {
  const root = new THREE.Group();
  root.scale.setScalar(UNIT_MODEL_SCALE * 1.4);

  const bodyMat = new THREE.MeshStandardMaterial({
    color: UNIT_COLORS[unit.owner],
    roughness: 0.36,
    metalness: 0.62,
    emissive: 0x000000
  });
  const darkMetal = new THREE.MeshStandardMaterial({
    color: 0x1f2732,
    roughness: 0.45,
    metalness: 0.7
  });

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.22, 0.62), bodyMat);
  chassis.position.set(0, 0.38, 0);
  chassis.castShadow = true;
  chassis.userData = { type: 'unit', unitId: unit.id };
  root.add(chassis);

  const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.3, 14), darkMetal);
  turret.position.set(0, 0.62, 0);
  turret.castShadow = true;
  root.add(turret);

  const barrelBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.58, 12), darkMetal);
  barrelBase.rotation.z = Math.PI / 2;
  barrelBase.rotation.y = -0.16;
  barrelBase.position.set(0.36, 0.8, 0);
  barrelBase.castShadow = true;
  root.add(barrelBase);

  const barrelTip = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.45, 12), darkMetal);
  barrelTip.rotation.z = Math.PI / 2;
  barrelTip.rotation.y = -0.16;
  barrelTip.position.set(0.78, 1.0, 0);
  barrelTip.castShadow = true;
  root.add(barrelTip);

  const trackL = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.2, 0.16), darkMetal);
  trackL.position.set(0, 0.19, -0.31);
  trackL.castShadow = true;
  root.add(trackL);
  const trackR = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.2, 0.16), darkMetal);
  trackR.position.set(0, 0.19, 0.31);
  trackR.castShadow = true;
  root.add(trackR);

  const muzzle = new THREE.Object3D();
  muzzle.position.set(1.02, 1.08, 0);
  root.add(muzzle);

  const statusBulbMaterial = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.95,
    roughness: 0.3,
    metalness: 0.15
  });
  const statusIcon = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 16), statusBulbMaterial);
  statusIcon.scale.set(1.2, 1.2, 1.2);
  statusIcon.position.set(0, 1.48, 0);
  statusIcon.castShadow = true;
  statusIcon.visible = false;
  root.add(statusIcon);

  return {
    root,
    clickableMesh: chassis,
    bodyMaterial: bodyMat,
    rifleMaterial: darkMetal,
    muzzle,
    statusIcon,
    coreMagnetDome: null,
    repairArms: null,
    walkParts: [],
    baseY: 0.3,
    setUpPose: {
      barrelBase,
      barrelTip,
      barrelBaseDefault: { x: barrelBase.position.x, y: barrelBase.position.y, z: barrelBase.position.z, ry: barrelBase.rotation.y },
      barrelTipDefault: { x: barrelTip.position.x, y: barrelTip.position.y, z: barrelTip.position.z, ry: barrelTip.rotation.y }
    }
  };
}

function createGhostbladeVisual(unit) {
  const root = new THREE.Group();
  root.scale.setScalar(UNIT_MODEL_SCALE * 1.35);

  const armorMaterial = new THREE.MeshStandardMaterial({
    color: UNIT_COLORS[unit.owner],
    roughness: 0.3,
    metalness: 0.6,
    emissive: 0x000000
  });
  const darkMetal = new THREE.MeshStandardMaterial({
    color: 0x1b2430,
    roughness: 0.42,
    metalness: 0.72
  });
  const glowColor = unit.owner === 'A' ? 0x60a5fa : 0xfb7185;
  const glowMat = new THREE.MeshStandardMaterial({
    color: glowColor,
    emissive: glowColor,
    emissiveIntensity: 0.95,
    roughness: 0.12,
    metalness: 0.05
  });

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 0.5, 8, 14), armorMaterial);
  torso.position.y = 0.82;
  torso.castShadow = true;
  torso.userData = { type: 'unit', unitId: unit.id };
  root.add(torso);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.26, 0.24), darkMetal);
  head.position.set(0, 1.26, 0.03);
  head.castShadow = true;
  root.add(head);

  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 10), glowMat);
  eyeL.position.set(-0.055, 1.27, 0.16);
  root.add(eyeL);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 10), glowMat);
  eyeR.position.set(0.055, 1.27, 0.16);
  root.add(eyeR);

  const hip = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.14, 0.22), darkMetal);
  hip.position.set(0, 0.46, 0);
  hip.castShadow = true;
  root.add(hip);

  const leftThigh = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.3, 0.13), darkMetal);
  leftThigh.position.set(-0.11, 0.24, 0);
  leftThigh.castShadow = true;
  root.add(leftThigh);
  const rightThigh = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.3, 0.13), darkMetal);
  rightThigh.position.set(0.11, 0.24, 0);
  rightThigh.castShadow = true;
  root.add(rightThigh);

  const leftShin = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.26, 0.11), darkMetal);
  leftShin.position.set(-0.11, 0.03, 0.01);
  leftShin.castShadow = true;
  root.add(leftShin);
  const rightShin = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.26, 0.11), darkMetal);
  rightShin.position.set(0.11, 0.03, 0.01);
  rightShin.castShadow = true;
  root.add(rightShin);

  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.34, 12), armorMaterial);
  leftArm.position.set(-0.24, 0.82, 0.08);
  leftArm.rotation.z = 0.25;
  leftArm.castShadow = true;
  root.add(leftArm);
  const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.34, 12), armorMaterial);
  rightArm.position.set(0.25, 0.82, 0.12);
  rightArm.rotation.z = -0.35;
  rightArm.rotation.x = -0.2;
  rightArm.castShadow = true;
  root.add(rightArm);

  const swordHilt = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.26, 10), darkMetal);
  swordHilt.position.set(0.4, 0.67, 0.24);
  swordHilt.rotation.z = Math.PI / 2;
  swordHilt.castShadow = true;
  root.add(swordHilt);
  const swordGuard = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.16, 0.05), darkMetal);
  swordGuard.position.set(0.29, 0.67, 0.24);
  swordGuard.castShadow = true;
  root.add(swordGuard);
  const swordBlade = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.05, 0.1), glowMat);
  swordBlade.position.set(0.68, 0.67, 0.24);
  swordBlade.castShadow = true;
  root.add(swordBlade);

  const muzzle = new THREE.Object3D();
  muzzle.position.set(0.83, 0.67, 0.24);
  root.add(muzzle);

  const statusBulbMaterial = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.95,
    roughness: 0.3,
    metalness: 0.15
  });
  const statusIcon = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 16), statusBulbMaterial);
  statusIcon.scale.set(1.2, 1.2, 1.2);
  statusIcon.position.set(0, 1.95, 0);
  statusIcon.castShadow = true;
  statusIcon.visible = false;
  root.add(statusIcon);

  const shellRingMaterial = new THREE.MeshStandardMaterial({
    color: 0xfb923c,
    emissive: 0xdc2626,
    emissiveIntensity: 1.15,
    roughness: 0.22,
    metalness: 0.18,
    transparent: true,
    opacity: 0.84,
    side: THREE.DoubleSide
  });
  const shellGuardRing = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.045, 16, 36), shellRingMaterial);
  shellGuardRing.rotation.x = Math.PI / 2;
  shellGuardRing.position.set(0, 0.94, 0);
  shellGuardRing.castShadow = false;
  shellGuardRing.visible = false;
  root.add(shellGuardRing);

  return {
    root,
    clickableMesh: torso,
    bodyMaterial: armorMaterial,
    rifleMaterial: glowMat,
    muzzle,
    statusIcon,
    shellGuardRing,
    coreMagnetDome: null,
    repairArms: null,
    walkParts: [
      { node: leftThigh, axis: 'x', base: 0, amplitude: 0.4, offset: 0 },
      { node: rightThigh, axis: 'x', base: 0, amplitude: 0.4, offset: Math.PI },
      { node: leftShin, axis: 'x', base: 0, amplitude: 0.26, offset: Math.PI },
      { node: rightShin, axis: 'x', base: 0, amplitude: 0.26, offset: 0 },
      { node: leftArm, axis: 'x', base: 0, amplitude: 0.22, offset: Math.PI },
      { node: rightArm, axis: 'x', base: -0.2, amplitude: 0.22, offset: 0 }
    ],
    tangoPose: {
      leftArm,
      rightArm,
      swordHilt,
      swordGuard,
      swordBlade,
      defaults: {
        leftArmRotation: { x: leftArm.rotation.x, y: leftArm.rotation.y, z: leftArm.rotation.z },
        rightArmRotation: { x: rightArm.rotation.x, y: rightArm.rotation.y, z: rightArm.rotation.z },
        swordHiltPosition: { x: swordHilt.position.x, y: swordHilt.position.y, z: swordHilt.position.z },
        swordHiltRotation: { x: swordHilt.rotation.x, y: swordHilt.rotation.y, z: swordHilt.rotation.z },
        swordGuardPosition: { x: swordGuard.position.x, y: swordGuard.position.y, z: swordGuard.position.z },
        swordBladePosition: { x: swordBlade.position.x, y: swordBlade.position.y, z: swordBlade.position.z }
      },
      applied: false
    },
    baseY: 0.3,
    recoilX: 0
  };
}

function createSupportDroneVisual(unit) {
  const root = new THREE.Group();
  root.scale.setScalar(UNIT_MODEL_SCALE * 1.1);

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x9aa8b8,
    roughness: 0.34,
    metalness: 0.56,
    emissive: 0x000000
  });
  const darkMetal = new THREE.MeshStandardMaterial({
    color: 0x36414d,
    roughness: 0.4,
    metalness: 0.7
  });
  const helmetMaterial = new THREE.MeshStandardMaterial({
    color: UNIT_COLORS[unit.owner],
    roughness: 0.3,
    metalness: 0.48
  });

  const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.085, 16, 28), darkMetal);
  wheel.rotation.x = Math.PI / 2;
  wheel.position.set(0, 0.405, 0);
  wheel.castShadow = true;
  root.add(wheel);

  const wheelCore = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.18, 14), frameMaterial);
  wheelCore.rotation.z = Math.PI / 2;
  wheelCore.position.set(0, 0.405, 0);
  wheelCore.castShadow = true;
  root.add(wheelCore);

  const lowerBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.18, 6, 12), frameMaterial);
  lowerBody.position.set(0, 0.78, 0);
  lowerBody.castShadow = true;
  root.add(lowerBody);

  const frameBack = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.14, 0.2), darkMetal);
  frameBack.position.set(0, 0.66, -0.02);
  frameBack.castShadow = true;
  root.add(frameBack);

  const frameFront = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.1, 0.12), darkMetal);
  frameFront.position.set(0.06, 0.72, 0.18);
  frameFront.castShadow = true;
  root.add(frameFront);

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.34, 6, 12), frameMaterial);
  body.position.set(0, 1.02, 0);
  body.castShadow = true;
  body.userData = {
    type: 'unit',
    unitId: unit.id
  };
  root.add(body);

  const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.2, 0.14), frameMaterial);
  chestPlate.position.set(0, 1.01, 0.11);
  chestPlate.castShadow = true;
  root.add(chestPlate);

  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.2, 8), darkMetal);
  antenna.position.set(0.02, 1.34, -0.08);
  antenna.castShadow = true;
  root.add(antenna);

  const helmet = new THREE.Mesh(
    new THREE.SphereGeometry(0.19, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
    helmetMaterial
  );
  helmet.position.set(0, 1.26, 0.02);
  helmet.castShadow = true;
  root.add(helmet);

  const helmetBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.03, 20), helmetMaterial);
  helmetBrim.position.set(0, 1.16, 0.03);
  helmetBrim.castShadow = true;
  root.add(helmetBrim);

  const helmetFrontLip = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.025, 0.09), helmetMaterial);
  helmetFrontLip.position.set(0, 1.14, 0.13);
  helmetFrontLip.castShadow = true;
  root.add(helmetFrontLip);

  const helmetRidge = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.18), helmetMaterial);
  helmetRidge.position.set(0, 1.29, 0.02);
  helmetRidge.castShadow = true;
  root.add(helmetRidge);

  const visor = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.05, 0.03),
    new THREE.MeshStandardMaterial({ color: 0x8be9fd, emissive: 0x205f76, emissiveIntensity: 0.7 })
  );
  visor.position.set(0, 1.22, 0.2);
  root.add(visor);

  const armLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.28, 12), frameMaterial);
  armLeft.position.set(-0.2, 0.99, 0.08);
  armLeft.rotation.z = 0.75;
  armLeft.rotation.x = -0.15;
  armLeft.castShadow = true;
  root.add(armLeft);

  const armRight = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.28, 12), frameMaterial);
  armRight.position.set(0.22, 0.96, 0.08);
  armRight.rotation.z = -0.95;
  armRight.rotation.x = -0.2;
  armRight.castShadow = true;
  root.add(armRight);

  const wrenchHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.26, 10), darkMetal);
  wrenchHandle.position.set(0.34, 0.9, 0.2);
  wrenchHandle.rotation.z = -1.1;
  wrenchHandle.rotation.x = 0.15;
  wrenchHandle.castShadow = true;
  root.add(wrenchHandle);

  const wrenchHead = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.012, 10, 16, Math.PI * 1.45), darkMetal);
  wrenchHead.position.set(0.43, 0.98, 0.22);
  wrenchHead.rotation.z = 0.18;
  wrenchHead.castShadow = true;
  root.add(wrenchHead);

  const muzzle = new THREE.Object3D();
  muzzle.position.set(0.34, 0.97, 0.2);
  root.add(muzzle);

  const statusBulbMaterial = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.95,
    roughness: 0.3,
    metalness: 0.15
  });
  const statusIcon = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 16), statusBulbMaterial);
  statusIcon.scale.set(1.2, 1.2, 1.2);
  statusIcon.position.set(0, 1.82, 0);
  statusIcon.castShadow = true;
  statusIcon.visible = false;
  root.add(statusIcon);

  return {
    root,
    clickableMesh: body,
    bodyMaterial: frameMaterial,
    rifleMaterial: darkMetal,
    muzzle,
    statusIcon,
    coreMagnetDome: null,
    walkParts: [
      { node: armLeft, axis: 'x', base: 0, amplitude: 0.2, offset: 0 },
      { node: armRight, axis: 'x', base: 0, amplitude: 0.2, offset: Math.PI },
      { node: body, axis: 'x', base: 0, amplitude: 0.08, offset: 0 }
    ],
    repairArms: [
      { node: armLeft, baseX: armLeft.rotation.x, raiseX: -1.25 },
      { node: armRight, baseX: armRight.rotation.x, raiseX: -1.25 }
    ],
    wheel,
    wheelRadiusWorld: (0.32 + 0.085) * UNIT_MODEL_SCALE * 1.1,
    baseY: 0.0
  };
}

function createTankDroneVisual(unit) {
  const root = new THREE.Group();
  const tankScale = UNIT_MODEL_SCALE * 1.25;
  root.scale.setScalar(tankScale);

  const armorMaterial = new THREE.MeshStandardMaterial({
    color: UNIT_COLORS[unit.owner],
    roughness: 0.35,
    metalness: 0.58,
    emissive: 0x000000
  });
  const darkMetal = new THREE.MeshStandardMaterial({
    color: 0x1d2730,
    roughness: 0.42,
    metalness: 0.68
  });
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0xa8bfd8,
    roughness: 0.28,
    metalness: 0.5
  });

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.46, 8, 18), armorMaterial);
  torso.rotation.z = Math.PI / 2;
  torso.position.set(0, 0.72, 0.02);
  torso.castShadow = true;
  torso.userData = {
    type: 'unit',
    unitId: unit.id
  };
  root.add(torso);

  const topShell = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.26, 0.54), armorMaterial);
  topShell.position.set(0, 0.88, 0.02);
  topShell.castShadow = true;
  root.add(topShell);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.2), accentMaterial);
  head.position.set(0.18, 0.98, 0.2);
  head.castShadow = true;
  root.add(head);

  const eyeStrip = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.03, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x8be9fd, emissive: 0x205f76, emissiveIntensity: 0.7 })
  );
  eyeStrip.position.set(0.2, 0.98, 0.31);
  root.add(eyeStrip);

  const armLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.44, 0.2), darkMetal);
  armLeft.position.set(-0.48, 0.72, 0.08);
  armLeft.rotation.z = 0.22;
  armLeft.castShadow = true;
  root.add(armLeft);

  const armRight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.44, 0.2), darkMetal);
  armRight.position.set(0.48, 0.72, 0.08);
  armRight.rotation.z = -0.22;
  armRight.castShadow = true;
  root.add(armRight);

  const muzzleMount = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.1, 0.1), darkMetal);
  muzzleMount.position.set(0.38, 0.69, 0.26);
  muzzleMount.castShadow = true;
  root.add(muzzleMount);

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.42, 12), darkMetal);
  barrel.rotation.z = Math.PI / 2;
  barrel.position.set(0.66, 0.69, 0.26);
  barrel.castShadow = true;
  root.add(barrel);

  const muzzle = new THREE.Object3D();
  muzzle.position.set(0.9, 0.69, 0.26);
  root.add(muzzle);

  const crabLegFL = createTankLeg(darkMetal);
  crabLegFL.position.set(0.28, 0.36, 0.28);
  crabLegFL.rotation.z = -0.95;
  root.add(crabLegFL);

  const crabLegFR = createTankLeg(darkMetal);
  crabLegFR.position.set(0.28, 0.36, -0.28);
  crabLegFR.rotation.z = -0.95;
  root.add(crabLegFR);

  const crabLegBL = createTankLeg(darkMetal);
  crabLegBL.position.set(-0.28, 0.36, 0.28);
  crabLegBL.rotation.z = 0.95;
  root.add(crabLegBL);

  const crabLegBR = createTankLeg(darkMetal);
  crabLegBR.position.set(-0.28, 0.36, -0.28);
  crabLegBR.rotation.z = 0.95;
  root.add(crabLegBR);

  const statusBulbMaterial = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.95,
    roughness: 0.3,
    metalness: 0.15
  });
  const statusIcon = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 16), statusBulbMaterial);
  statusIcon.scale.set(1.2, 1.2, 1.2);
  statusIcon.position.set(0, 1.8, 0);
  statusIcon.castShadow = true;
  statusIcon.visible = false;
  root.add(statusIcon);

  const coreMagnetDome = new THREE.Mesh(
    new THREE.SphereGeometry(1.75, 28, 20, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({
      color: unit.owner === 'A' ? 0x57a8ff : 0xff8894,
      emissive: unit.owner === 'A' ? 0x2f72ff : 0xd73a49,
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0.2,
      roughness: 0.1,
      metalness: 0.05,
      depthWrite: false,
      side: THREE.DoubleSide
    })
  );
  coreMagnetDome.position.set(0, 0.25, 0);
  coreMagnetDome.visible = false;
  root.add(coreMagnetDome);

  const bulwarkShield = new THREE.Mesh(
    // Compensate for tank root scale so world-space shield matches covered board area.
    new THREE.PlaneGeometry((TILE_SIZE * 2.92) / tankScale, 3.135 / tankScale),
    new THREE.MeshStandardMaterial({
      map: bulwarkShieldTexture,
      color: unit.owner === 'A' ? 0x8fb4ff : 0xffb0b8,
      emissive: unit.owner === 'A' ? 0x3a66bf : 0xad4453,
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0.44,
      depthWrite: false,
      side: THREE.DoubleSide,
      roughness: 0.16,
      metalness: 0.08
    })
  );
  bulwarkShield.position.set(0, 1.66, 0);
  bulwarkShield.visible = false;
  root.add(bulwarkShield);

  return {
    root,
    clickableMesh: torso,
    bodyMaterial: armorMaterial,
    rifleMaterial: darkMetal,
    muzzle,
    statusIcon,
    coreMagnetDome,
    bulwarkShield,
    repairArms: null,
    walkParts: [
      { node: crabLegFL, axis: 'x', base: 0, amplitude: 0.42, offset: 0 },
      { node: crabLegBR, axis: 'x', base: 0, amplitude: 0.42, offset: 0 },
      { node: crabLegFR, axis: 'x', base: 0, amplitude: 0.42, offset: Math.PI },
      { node: crabLegBL, axis: 'x', base: 0, amplitude: 0.42, offset: Math.PI },
      { node: armLeft, axis: 'x', base: 0, amplitude: 0.2, offset: Math.PI },
      { node: armRight, axis: 'x', base: 0, amplitude: 0.2, offset: 0 }
    ],
    baseY: 0.3
  };
}

function createSpecialistDroneVisual(unit) {
  const root = new THREE.Group();
  root.scale.setScalar(UNIT_MODEL_SCALE * 1.18);

  const armorMaterial = new THREE.MeshStandardMaterial({
    color: UNIT_COLORS[unit.owner],
    roughness: 0.28,
    metalness: 0.62,
    emissive: 0x000000
  });
  const darkMetal = new THREE.MeshStandardMaterial({
    color: 0x131a23,
    roughness: 0.36,
    metalness: 0.76,
    emissive: 0x000000
  });
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0xafbfd1,
    roughness: 0.32,
    metalness: 0.54
  });
  const visorMaterial = new THREE.MeshStandardMaterial({
    color: 0x8be9fd,
    emissive: 0x1f5f76,
    emissiveIntensity: 0.72,
    roughness: 0.14,
    metalness: 0.2
  });

  const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.14, 0.24), darkMetal);
  pelvis.position.set(0, 0.43, 0);
  pelvis.castShadow = true;
  root.add(pelvis);

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.46, 0.28), armorMaterial);
  torso.position.set(0, 0.86, 0);
  torso.castShadow = true;
  torso.userData = { type: 'unit', unitId: unit.id };
  root.add(torso);

  const chestCore = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.2, 0.05), visorMaterial);
  chestCore.position.set(0, 0.86, 0.17);
  root.add(chestCore);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.24, 0.24), frameMaterial);
  head.position.set(0, 1.25, 0.04);
  head.castShadow = true;
  root.add(head);

  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 0.03), visorMaterial);
  visor.position.set(0, 1.24, 0.17);
  root.add(visor);

  const shoulderL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.16), frameMaterial);
  shoulderL.position.set(-0.34, 0.95, 0.05);
  shoulderL.castShadow = true;
  root.add(shoulderL);

  const shoulderR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.16), frameMaterial);
  shoulderR.position.set(0.34, 0.95, 0.05);
  shoulderR.castShadow = true;
  root.add(shoulderR);

  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.36, 12), frameMaterial);
  leftArm.position.set(-0.41, 0.74, 0.12);
  leftArm.rotation.z = 0.28;
  leftArm.castShadow = true;
  root.add(leftArm);

  const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.36, 12), frameMaterial);
  rightArm.position.set(0.41, 0.74, 0.12);
  rightArm.rotation.z = -0.28;
  rightArm.castShadow = true;
  root.add(rightArm);

  const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.36, 0.14), darkMetal);
  leftLeg.position.set(-0.13, 0.17, 0.01);
  leftLeg.castShadow = true;
  root.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.36, 0.14), darkMetal);
  rightLeg.position.set(0.13, 0.17, 0.01);
  rightLeg.castShadow = true;
  root.add(rightLeg);

  const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.22), darkMetal);
  leftFoot.position.set(-0.13, -0.08, 0.06);
  leftFoot.castShadow = true;
  root.add(leftFoot);

  const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.22), darkMetal);
  rightFoot.position.set(0.13, -0.08, 0.06);
  rightFoot.castShadow = true;
  root.add(rightFoot);

  const rightGunBody = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.1, 0.1), darkMetal);
  rightGunBody.position.set(0.28, 0.58, 0.22);
  rightGunBody.castShadow = true;
  root.add(rightGunBody);

  const rightBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.35, 12), darkMetal);
  rightBarrel.rotation.z = Math.PI / 2;
  rightBarrel.position.set(0.56, 0.58, 0.22);
  rightBarrel.castShadow = true;
  root.add(rightBarrel);

  const leftGunBody = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.1, 0.1), darkMetal);
  leftGunBody.position.set(-0.28, 0.58, 0.22);
  leftGunBody.castShadow = true;
  root.add(leftGunBody);

  const leftBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.35, 12), darkMetal);
  leftBarrel.rotation.z = Math.PI / 2;
  leftBarrel.position.set(-0.56, 0.58, 0.22);
  leftBarrel.castShadow = true;
  root.add(leftBarrel);

  const muzzle = new THREE.Object3D();
  muzzle.position.set(0.74, 0.58, 0.22);
  root.add(muzzle);

  const statusBulbMaterial = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.95,
    roughness: 0.3,
    metalness: 0.15
  });
  const statusIcon = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 16), statusBulbMaterial);
  statusIcon.scale.set(1.2, 1.2, 1.2);
  statusIcon.position.set(0, 1.95, 0);
  statusIcon.castShadow = true;
  statusIcon.visible = false;
  root.add(statusIcon);

  return {
    root,
    clickableMesh: torso,
    bodyMaterial: armorMaterial,
    rifleMaterial: darkMetal,
    muzzle,
    statusIcon,
    coreMagnetDome: null,
    repairArms: null,
    walkParts: [
      { node: leftLeg, axis: 'x', base: 0, amplitude: 0.33, offset: 0 },
      { node: rightLeg, axis: 'x', base: 0, amplitude: 0.33, offset: Math.PI },
      { node: leftArm, axis: 'x', base: 0, amplitude: 0.16, offset: Math.PI },
      { node: rightArm, axis: 'x', base: 0, amplitude: 0.16, offset: 0 }
    ],
    baseY: 0.3,
    recoilX: 0
  };
}

function createTankLeg(material) {
  const leg = new THREE.Group();
  const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.28, 10), material);
  upper.rotation.z = Math.PI / 2;
  upper.castShadow = true;
  leg.add(upper);

  const lower = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.08), material);
  lower.position.set(0.2, -0.08, 0);
  lower.castShadow = true;
  leg.add(lower);

  const foot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.12), material);
  foot.position.set(0.32, -0.14, 0);
  foot.castShadow = true;
  leg.add(foot);
  return leg;
}

function createPawnDroneVisual(unit) {
  const root = new THREE.Group();
  root.scale.setScalar(UNIT_MODEL_SCALE);

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: UNIT_COLORS[unit.owner],
    roughness: 0.33,
    metalness: 0.56,
    emissive: 0x000000
  });

  const darkMetal = new THREE.MeshStandardMaterial({
    color: 0x1f2732,
    roughness: 0.4,
    metalness: 0.7
  });

  const shoulderMaterial = new THREE.MeshStandardMaterial({
    color: 0xadc4df,
    roughness: 0.32,
    metalness: 0.54
  });

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.36, 6, 12), bodyMaterial);
  torso.position.y = 0.64;
  torso.castShadow = true;
  torso.userData = {
    type: 'unit',
    unitId: unit.id
  };
  root.add(torso);

  const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.26, 0.14), shoulderMaterial);
  chestPlate.position.set(0, 0.68, 0.11);
  chestPlate.castShadow = true;
  root.add(chestPlate);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.2, 0.23), shoulderMaterial);
  head.position.set(0, 1.03, 0.02);
  head.castShadow = true;
  root.add(head);

  const eye = new THREE.Mesh(
    new THREE.BoxGeometry(0.13, 0.04, 0.03),
    new THREE.MeshStandardMaterial({ color: 0x8be9fd, emissive: 0x1a5f75, emissiveIntensity: 0.55 })
  );
  eye.position.set(0, 1.04, 0.14);
  root.add(eye);

  const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.34, 0.13), darkMetal);
  backpack.position.set(0, 0.69, -0.16);
  backpack.castShadow = true;
  root.add(backpack);

  const antennaL = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18, 8), darkMetal);
  antennaL.position.set(-0.07, 1.24, -0.18);
  antennaL.castShadow = true;
  root.add(antennaL);

  const antennaR = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18, 8), darkMetal);
  antennaR.position.set(0.07, 1.24, -0.18);
  antennaR.castShadow = true;
  root.add(antennaR);

  const hip = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.18), darkMetal);
  hip.position.set(0, 0.42, 0);
  hip.castShadow = true;
  root.add(hip);

  const leftHipPlate = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.16), shoulderMaterial);
  leftHipPlate.position.set(-0.19, 0.42, 0.02);
  leftHipPlate.castShadow = true;
  root.add(leftHipPlate);

  const rightHipPlate = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.16), shoulderMaterial);
  rightHipPlate.position.set(0.19, 0.42, 0.02);
  rightHipPlate.castShadow = true;
  root.add(rightHipPlate);

  const leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.22, 12), darkMetal);
  leftThigh.position.set(-0.12, 0.29, 0);
  leftThigh.castShadow = true;
  root.add(leftThigh);

  const rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.22, 12), darkMetal);
  rightThigh.position.set(0.12, 0.29, 0);
  rightThigh.castShadow = true;
  root.add(rightThigh);

  const leftKnee = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), shoulderMaterial);
  leftKnee.position.set(-0.12, 0.18, 0.01);
  leftKnee.castShadow = true;
  root.add(leftKnee);

  const rightKnee = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), shoulderMaterial);
  rightKnee.position.set(0.12, 0.18, 0.01);
  rightKnee.castShadow = true;
  root.add(rightKnee);

  const leftShin = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.26, 0.1), darkMetal);
  leftShin.position.set(-0.12, 0.07, 0.01);
  leftShin.castShadow = true;
  root.add(leftShin);

  const rightShin = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.26, 0.1), darkMetal);
  rightShin.position.set(0.12, 0.07, 0.01);
  rightShin.castShadow = true;
  root.add(rightShin);

  const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.2), darkMetal);
  leftFoot.position.set(-0.12, -0.08, 0.06);
  leftFoot.castShadow = true;
  root.add(leftFoot);

  const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.2), darkMetal);
  rightFoot.position.set(0.12, -0.08, 0.06);
  rightFoot.castShadow = true;
  root.add(rightFoot);

  const leftShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), shoulderMaterial);
  leftShoulder.position.set(-0.24, 0.75, 0.03);
  leftShoulder.castShadow = true;
  root.add(leftShoulder);

  const rightShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), shoulderMaterial);
  rightShoulder.position.set(0.24, 0.75, 0.03);
  rightShoulder.castShadow = true;
  root.add(rightShoulder);

  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 12), shoulderMaterial);
  leftArm.position.set(-0.29, 0.59, 0.08);
  leftArm.rotation.z = 0.18;
  leftArm.castShadow = true;
  root.add(leftArm);

  const leftForearmGuard = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.16, 0.08), darkMetal);
  leftForearmGuard.position.set(-0.31, 0.48, 0.1);
  leftForearmGuard.rotation.z = 0.18;
  leftForearmGuard.castShadow = true;
  root.add(leftForearmGuard);

  const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 12), shoulderMaterial);
  rightArm.position.set(0.3, 0.59, 0.12);
  rightArm.rotation.z = -0.05;
  rightArm.rotation.x = -0.2;
  rightArm.castShadow = true;
  root.add(rightArm);

  const rightForearmGuard = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.16, 0.08), darkMetal);
  rightForearmGuard.position.set(0.33, 0.49, 0.15);
  rightForearmGuard.rotation.z = -0.05;
  rightForearmGuard.rotation.x = -0.2;
  rightForearmGuard.castShadow = true;
  root.add(rightForearmGuard);

  const rifleBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x121820,
    roughness: 0.35,
    metalness: 0.7,
    emissive: 0x000000
  });

  const rifleBody = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.09, 0.09), rifleBodyMaterial);
  rifleBody.position.set(0.22, 0.58, 0.2);
  rifleBody.castShadow = true;
  root.add(rifleBody);

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.36, 12), rifleBodyMaterial);
  barrel.rotation.z = Math.PI / 2;
  barrel.position.set(0.56, 0.58, 0.2);
  barrel.castShadow = true;
  root.add(barrel);

  const stock = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.08), rifleBodyMaterial);
  stock.position.set(0.02, 0.58, 0.2);
  stock.castShadow = true;
  root.add(stock);

  const scope = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 0.05), shoulderMaterial);
  scope.position.set(0.27, 0.65, 0.2);
  scope.castShadow = true;
  root.add(scope);

  const muzzle = new THREE.Object3D();
  muzzle.position.set(0.74, 0.58, 0.2);
  root.add(muzzle);

  const statusBulbMaterial = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.95,
    roughness: 0.3,
    metalness: 0.15
  });
  const statusIcon = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 16), statusBulbMaterial);
  statusIcon.scale.set(1.2, 1.2, 1.2);
  statusIcon.position.set(0, 1.7, 0);
  statusIcon.castShadow = true;
  statusIcon.visible = false;
  root.add(statusIcon);

  return {
    root,
    clickableMesh: torso,
    bodyMaterial,
    rifleMaterial: rifleBodyMaterial,
    muzzle,
    statusIcon,
    coreMagnetDome: null,
    repairArms: null,
    walkParts: [
      { node: leftThigh, axis: 'x', base: 0, amplitude: 0.38, offset: 0 },
      { node: rightThigh, axis: 'x', base: 0, amplitude: 0.38, offset: Math.PI },
      { node: leftShin, axis: 'x', base: 0, amplitude: 0.26, offset: Math.PI },
      { node: rightShin, axis: 'x', base: 0, amplitude: 0.26, offset: 0 },
      { node: leftArm, axis: 'x', base: 0, amplitude: 0.22, offset: Math.PI },
      { node: rightArm, axis: 'x', base: -0.2, amplitude: 0.22, offset: 0 }
    ],
    baseY: 0.3,
    recoilX: 0
  };
}

function updateUnitStatusIcon(visual, unit) {
  const isRed = unit.hasMoved && unit.hasAttacked;
  const isYellow = unit.hasMoved && !unit.hasAttacked;

  if (!isRed && !isYellow) {
    visual.statusIcon.visible = false;
    return;
  }

  visual.statusIcon.visible = true;
  visual.statusIcon.material.color.setHex(isRed ? 0xef4444 : 0xfbbf24);
  visual.statusIcon.material.emissive.setHex(isRed ? 0xb91c1c : 0xf59e0b);
  visual.statusIcon.material.emissiveIntensity = isRed ? 1.15 : 0.95;
}

function updateArtillerySetUpPose(visual, unit) {
  const pose = visual?.setUpPose;
  if (!pose || unit.unitTypeId !== 'ARTILLERY_UNIT') {
    return;
  }
  const active = unit.artillerySetUpActive;
  pose.barrelBase.rotation.y = pose.barrelBaseDefault.ry + (active ? -0.48 : 0);
  pose.barrelBase.position.set(
    pose.barrelBaseDefault.x + (active ? -0.03 : 0),
    pose.barrelBaseDefault.y + (active ? 0.12 : 0),
    pose.barrelBaseDefault.z
  );
  pose.barrelTip.rotation.y = pose.barrelTipDefault.ry + (active ? -0.48 : 0);
  pose.barrelTip.position.set(
    pose.barrelTipDefault.x + (active ? 0.06 : 0),
    pose.barrelTipDefault.y + (active ? 0.2 : 0),
    pose.barrelTipDefault.z
  );
}

function updateGhostbladeTangoPose(visual, unit) {
  const pose = visual?.tangoPose;
  if (!pose || unit.unitTypeId !== 'GHOSTBLADE_UNIT') {
    return;
  }
  const active = isTangoGhostbladeArmed(unit);
  if (!active) {
    if (!pose.applied) {
      return;
    }
    const defaults = pose.defaults;
    pose.leftArm.rotation.set(defaults.leftArmRotation.x, defaults.leftArmRotation.y, defaults.leftArmRotation.z);
    pose.rightArm.rotation.set(defaults.rightArmRotation.x, defaults.rightArmRotation.y, defaults.rightArmRotation.z);
    pose.swordHilt.position.set(defaults.swordHiltPosition.x, defaults.swordHiltPosition.y, defaults.swordHiltPosition.z);
    pose.swordHilt.rotation.set(defaults.swordHiltRotation.x, defaults.swordHiltRotation.y, defaults.swordHiltRotation.z);
    pose.swordGuard.position.set(defaults.swordGuardPosition.x, defaults.swordGuardPosition.y, defaults.swordGuardPosition.z);
    pose.swordBlade.position.set(defaults.swordBladePosition.x, defaults.swordBladePosition.y, defaults.swordBladePosition.z);
    pose.applied = false;
    return;
  }

  pose.leftArm.rotation.x = -1.45;
  pose.leftArm.rotation.z = 0.12;
  pose.rightArm.rotation.x = -1.52;
  pose.rightArm.rotation.z = -0.08;
  pose.swordHilt.position.set(0.02, 1.46, 0.08);
  pose.swordHilt.rotation.set(0, 0, 0);
  pose.swordGuard.position.set(0.02, 1.6, 0.08);
  pose.swordBlade.position.set(0.02, 1.95, 0.08);
  pose.applied = true;
}

function getUnitCurrentMoveRange(unit) {
  let move = unit.moveRange + (unit.tacticalDashActiveThisTurn ? 1 : 0) + (unit.overloadBonusMovementThisTurn ?? 0);
  if (
    unit?.unitTypeId === 'TANK_DRONE_UNIT' &&
    unitHasStatus(unit, DRONE_STATUS_LIBRARY.ATAKK.id) &&
    unit.hitPoints >= unit.maxHitPoints
  ) {
    move += DRONE_STATUS_LIBRARY.ATAKK.effects.moveBonusAtFullHp ?? 2;
  }
  return move;
}

function getUnitCurrentAttackRange(unit) {
  if (unit?.isMeleeLocked) {
    return 1;
  }
  let bonus = 0;
  if (unitHasStatus(unit, DRONE_STATUS_LIBRARY.STEADY.id) && !unit.hasMoved) {
    bonus += DRONE_STATUS_LIBRARY.STEADY.effects.rangeBonusIfDidNotMove ?? 1;
  }
  return Math.max(1, (unit.attackRange ?? 1) + bonus);
}

function getUnitCurrentAttackDamage(unit) {
  if (!unit) {
    return 0;
  }
  const base = Math.max(0, unit.attackDamage ?? 0);
  if ((unit.virusDebuffActiveTurns ?? 0) > 0) {
    return Math.max(0, base - (unit.virusAttackPenaltyActive ?? 0));
  }
  return base;
}

function getUnitWorldPosition(unitId) {
  const visual = unitVisualsById.get(unitId);
  if (!visual) {
    return new THREE.Vector3();
  }
  const pos = new THREE.Vector3();
  visual.root.getWorldPosition(pos);
  pos.y += 0.58 * UNIT_MODEL_SCALE;
  return pos;
}

function playRifleShot(attackerId, targetPosition) {
  const visual = unitVisualsById.get(attackerId);
  if (!visual) {
    return;
  }

  const startPos = new THREE.Vector3();
  visual.muzzle.getWorldPosition(startPos);
  const endPos = targetPosition.clone();

  const projectile = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffd166 })
  );
  projectile.position.copy(startPos);
  effectsGroup.add(projectile);

  visual.rifleMaterial.emissive.setHex(0xffbf66);
  visual.rifleMaterial.emissiveIntensity = 0.7;

  activeEffects.push({
    duration: 0.18,
    elapsed: 0,
    update(effect, delta) {
      effect.elapsed += delta;
      const t = Math.min(effect.elapsed / effect.duration, 1);
      projectile.position.lerpVectors(startPos, endPos, t);
      projectile.scale.setScalar(1 - t * 0.55);
    },
    complete() {
      effectsGroup.remove(projectile);
      visual.rifleMaterial.emissive.setHex(0x000000);
      visual.rifleMaterial.emissiveIntensity = 0;
    }
  });

  const startRecoil = visual.root.position.x;
  activeEffects.push({
    duration: 0.16,
    elapsed: 0,
    update(effect, delta) {
      effect.elapsed += delta;
      const t = effect.elapsed / effect.duration;
      const offset = Math.sin(Math.PI * Math.min(t, 1)) * -0.16;
      visual.root.position.x = startRecoil + offset;
    },
    complete() {
      visual.root.position.x = startRecoil;
    }
  });
}

function playHitEffect(unitId) {
  const visual = unitVisualsById.get(unitId);
  if (!visual) {
    return;
  }

  const startY = visual.root.position.y;
  const baseColor = UNIT_COLORS[getUnitById(unitId)?.owner ?? 'A'];

  activeEffects.push({
    duration: 0.28,
    elapsed: 0,
    update(effect, delta) {
      effect.elapsed += delta;
      const t = Math.min(effect.elapsed / effect.duration, 1);
      const bounce = Math.sin(t * Math.PI * 4) * (1 - t) * 0.14;
      visual.root.position.y = startY + bounce;
      visual.bodyMaterial.emissive.setHex(0xff4d6d);
      visual.bodyMaterial.emissiveIntensity = 0.95 * (1 - t);
    },
    complete() {
      visual.root.position.y = startY;
      visual.bodyMaterial.color.setHex(baseColor);
      visual.bodyMaterial.emissive.setHex(0x000000);
      visual.bodyMaterial.emissiveIntensity = 0;
    }
  });
}

function playExplosionAt(position, options = {}) {
  const particleCount = options.particleCount ?? 12;
  const duration = options.duration ?? 0.5;
  const speedMin = options.speedMin ?? 1.5;
  const speedMax = options.speedMax ?? 2.4;
  const particles = [];

  for (let i = 0; i < particleCount; i += 1) {
    const particle = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 6, 6),
      new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xff8c42 : 0xff4d00,
        transparent: true,
        opacity: 0.9
      })
    );

    particle.position.copy(position);
    effectsGroup.add(particle);

    const direction = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 1.2 + 0.2,
      Math.random() * 2 - 1
    ).normalize();

    particles.push({
      mesh: particle,
      direction,
      speed: speedMin + Math.random() * (speedMax - speedMin)
    });
  }

  activeEffects.push({
    duration,
    elapsed: 0,
    update(effect, delta) {
      effect.elapsed += delta;
      const t = Math.min(effect.elapsed / effect.duration, 1);

      for (const particle of particles) {
        particle.mesh.position.addScaledVector(particle.direction, particle.speed * delta);
        particle.mesh.scale.setScalar(1 - t * 0.75);
        particle.mesh.material.opacity = 0.9 * (1 - t);
      }
    },
    complete() {
      for (const particle of particles) {
        effectsGroup.remove(particle.mesh);
      }
    }
  });
}

function updateEffects(delta) {
  for (let i = activeEffects.length - 1; i >= 0; i -= 1) {
    const effect = activeEffects[i];
    effect.update(effect, delta);

    if (effect.elapsed >= effect.duration) {
      effect.complete?.();
      activeEffects.splice(i, 1);
    }
  }
}

function addLog(message) {
  const row = document.createElement('div');
  row.className = 'log-row';
  row.textContent = message;
  logEl.prepend(row);

  while (logEl.children.length > 8) {
    logEl.removeChild(logEl.lastChild);
  }
}

function onResize() {
  const width = boardEl.clientWidth;
  const height = boardEl.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function onKeyDown(event) {
  if (event.code === 'Space') {
    event.preventDefault();
    endTurn();
    return;
  }

  if (event.code === 'Escape') {
    clearSelection();
    renderUI();
    return;
  }

  const code = event.code;
  if (code === 'KeyW' || code === 'KeyA' || code === 'KeyS' || code === 'KeyD') {
    pressedKeys.add(code);
  }
}

function onKeyUp(event) {
  const code = event.code;
  if (code === 'KeyW' || code === 'KeyA' || code === 'KeyS' || code === 'KeyD') {
    pressedKeys.delete(code);
  }
}

function animate() {
  const delta = Math.min(clock.getDelta(), 0.033);
  const elapsedTime = clock.elapsedTime;
  updateCameraWASD(delta);
  controls.update();
  updateMovementAnimations(delta);
  updateCoreMagnetDomes(elapsedTime);
  updateEffects(delta);
  renderer.render(scene, camera);
}

function updateCoreMagnetDomes(elapsedTime) {
  for (const [, visual] of unitVisualsById.entries()) {
    if (visual.coreMagnetDome && visual.coreMagnetDome.visible) {
      const pulse = 0.17 + Math.sin(elapsedTime * 5.8) * 0.06;
      visual.coreMagnetDome.material.opacity = pulse;
      visual.coreMagnetDome.rotation.y += 0.005;
    }
    if (visual.bulwarkShield && visual.bulwarkShield.visible) {
      const shieldPulse = 0.4 + Math.sin(elapsedTime * 6.8) * 0.08;
      visual.bulwarkShield.material.opacity = shieldPulse;
    }
    if (visual.shellGuardRing && visual.shellGuardRing.visible) {
      const ringPulse = 0.82 + Math.sin(elapsedTime * 8.4) * 0.16;
      visual.shellGuardRing.material.opacity = Math.max(0.62, Math.min(0.98, ringPulse));
      visual.shellGuardRing.material.emissiveIntensity = 1.05 + Math.sin(elapsedTime * 6.4) * 0.28;
      const flare = 0.92 + Math.sin(elapsedTime * 9.3) * 0.06;
      visual.shellGuardRing.scale.set(flare, flare, 1);
      visual.shellGuardRing.rotation.z += 0.018;
    }
  }
}

function updateMovementAnimations(delta) {
  if (movementAnimations.size === 0) {
    return;
  }

  for (const [unitId, animation] of movementAnimations.entries()) {
    const visual = unitVisualsById.get(unitId);
    if (!visual) {
      movementAnimations.delete(unitId);
      continue;
    }

    animation.elapsed += delta;
    const t = Math.min(animation.elapsed / animation.duration, 1);
    const eased = t * (2 - t);

    const x = animation.start.x + (animation.end.x - animation.start.x) * eased;
    const z = animation.start.z + (animation.end.z - animation.start.z) * eased;
    const bob = Math.sin(t * Math.PI) * 0.12;
    const gaitPhase = t * Math.PI * 2 * (animation.stepCount + 0.35);
    applyWalkCycle(visual, gaitPhase);
    if (visual.wheel) {
      const dx = x - animation.prevX;
      const dz = z - animation.prevZ;
      const distance = Math.hypot(dx, dz);
      const wheelRadius = visual.wheelRadiusWorld ?? 0.7;
      if (distance > 0) {
        visual.wheel.rotation.z -= distance / wheelRadius;
      }
    }
    visual.root.position.set(x, (visual.baseY ?? 0.3) + bob, z);
    animation.prevX = x;
    animation.prevZ = z;

    if (t >= 1) {
      resetWalkCycle(visual);
      visual.root.position.set(animation.end.x, visual.baseY ?? 0.3, animation.end.z);
      movementAnimations.delete(unitId);
    }
  }
}

function applyWalkCycle(visual, phase) {
  if (!visual.walkParts?.length) {
    return;
  }
  for (const part of visual.walkParts) {
    const value = part.base + Math.sin(phase + part.offset) * part.amplitude;
    part.node.rotation[part.axis] = value;
  }
}

function resetWalkCycle(visual) {
  if (!visual.walkParts?.length) {
    return;
  }
  for (const part of visual.walkParts) {
    part.node.rotation[part.axis] = part.base;
  }
}

function updateCameraWASD(delta) {
  if (pressedKeys.size === 0) {
    return;
  }

  const moveSpeed = 16 * delta;
  const move = new THREE.Vector3();

  if (pressedKeys.has('KeyW')) {
    move.z -= moveSpeed;
  }
  if (pressedKeys.has('KeyS')) {
    move.z += moveSpeed;
  }
  if (pressedKeys.has('KeyA')) {
    move.x -= moveSpeed;
  }
  if (pressedKeys.has('KeyD')) {
    move.x += moveSpeed;
  }

  camera.position.add(move);
  controls.target.add(move);
}

function shuffle(cards) {
  const arr = [...cards];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

