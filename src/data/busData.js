// ─── busData.js ──────────────────────────────────────────────────────────────

export const BUS_STOPS = [
  { id: 'srinivasapura', name: 'Srinivasapura Cross', lat: 12.9240, lng: 77.5149, isMain: true },
  { id: 'rrnagar', name: 'RR Nagar Arch', lat: 12.9218, lng: 77.5196, isMain: true },
  { id: 'mysoreroad', name: 'Mysore Road Metro', lat: 12.9440, lng: 77.5305, isMain: false },
  { id: 'kengeri', name: 'Kengeri Bus Terminal', lat: 12.9101, lng: 77.4849, isMain: true },
  { id: 'banashank', name: 'Banashankari Temple', lat: 12.9255, lng: 77.5471, isMain: false },
  { id: 'nayandahalli', name: 'Nayandahalli', lat: 12.9369, lng: 77.5230, isMain: false },
  { id: 'rrt', name: 'Rajarajeshwari Temple', lat: 12.9189, lng: 77.5089, isMain: false },
  { id: 'kbs', name: 'Kempegowda Bus Station', lat: 12.9775, lng: 77.5717, isMain: true },
  { id: 'jayanagar', name: 'Jayanagar 4th Block', lat: 12.9299, lng: 77.5833, isMain: false },
  { id: 'nagarbhavi', name: 'Nagarbhavi Circle', lat: 12.9580, lng: 77.5010, isMain: false },
];

export const BUSES = [
  {
    id: 'b1',
    number: '401K',
    name: 'Srinivasapura – Nagarbhavi',
    color: '#00b3dc',
    currentStop: 0,
    route: ['srinivasapura', 'rrt', 'nagarbhavi'],
    status: 'On Time',
    crowdLevel: 'Moderate',
    ac: false,
    capacity: 60,
    currentPassengers: 34,
  },
  {
    id: 'b2',
    number: '225N',
    name: 'Kengeri – Banashankari',
    color: '#f59e0b',
    currentStop: 1,
    route: ['kengeri', 'srinivasapura', 'rrnagar', 'banashank'],
    status: 'Delayed',
    crowdLevel: 'Crowded',
    ac: false,
    capacity: 55,
    currentPassengers: 51,
  },
  {
    id: 'b3',
    number: '500D',
    name: 'RR Nagar – Jayanagar',
    color: '#10b981',
    currentStop: 0,
    route: ['rrnagar', 'rrt', 'banashank', 'jayanagar'],
    status: 'Arriving Soon',
    crowdLevel: 'Low',
    ac: false,
    capacity: 60,
    currentPassengers: 12,
  },
  {
    id: 'b4',
    number: 'KBS-9',
    name: 'KBS – Kengeri Express',
    color: '#8b5cf6',
    currentStop: 2,
    route: ['kbs', 'mysoreroad', 'nayandahalli', 'rrnagar', 'srinivasapura', 'kengeri'],
    status: 'On Time',
    crowdLevel: 'Moderate',
    ac: true,
    capacity: 45,
    currentPassengers: 28,
  },
  {
    id: 'b5',
    number: 'MF-14',
    name: 'Srinivasapura Cross – RR Nagar Arch',
    color: '#ef4444',
    currentStop: 0,
    route: ['srinivasapura', 'rrnagar'],
    status: 'Heavy Traffic',
    crowdLevel: 'Crowded',
    ac: false,
    capacity: 60,
    currentPassengers: 58,
  },
];

export const getStop = (id) => {
  return BUS_STOPS.find((s) => s.id === id);
};

export const getETA = (busId) => {
  const base = { b1: 4, b2: 11, b3: 2, b4: 7, b5: 16 };
  const jitter = Math.floor(Math.random() * 3) - 1;
  return Math.max(1, (base[busId] || 5) + jitter);
};

export const ENV_CONDITIONS = [
  { label: 'Clear', icon: '☀️', color: 'text-yellow-400' },
  { label: 'Partly Cloudy', icon: '⛅', color: 'text-sky-300' },
  { label: 'Light Rain', icon: '🌦️', color: 'text-blue-400' },
  { label: 'Overcast', icon: '☁️', color: 'text-slate-400' },
];

export const TRAFFIC_LEVELS = [
  { label: 'Smooth', color: '#10b981', pct: 20 },
  { label: 'Moderate', color: '#f59e0b', pct: 55 },
  { label: 'Heavy', color: '#ef4444', pct: 85 },
];

export const PEAK_HOURS = [
  { start: 7, end: 10, label: 'Morning Peak' },
  { start: 17, end: 20, label: 'Evening Peak' },
];

export const ALERTS = [
  { type: 'warning', msg: 'Traffic diversion near Mysore Road Flyover. Expect 10-15 min delay.' },
  { type: 'info', msg: 'Bus 401K will be partially re-routed today.' },
  { type: 'critical', msg: 'BMTC Strike: Limited services on Sundays.' },
  { type: 'info', msg: 'New AC service KBS-9X starts from RR Nagar soon.' },
];

export const STATS = [
  { label: 'Buses Tracked', value: 248, suffix: '+', icon: '🚌' },
  { label: 'Routes Active', value: 34, suffix: '', icon: '🛣️' },
  { label: 'Stops Covered', value: 1200, suffix: '+', icon: '📍' },
  { label: 'Daily Riders', value: 95000, suffix: '+', icon: '👥' },
];