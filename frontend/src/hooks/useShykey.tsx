import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { INITIAL_STATS, MODES } from '../data/mockData';
import { mockApi } from '../services';
import type { AppServices, CheckinOutcome, ModeKey, Mission, ProfileStats } from '../types';
import { buzz, todayKey } from '../utils/haptics';
import { clearStats, loadStats, saveStats } from '../utils/storage';

interface ShykeyContextValue {
  stats: ProfileStats;
  modeKey: ModeKey;
  smallMission: boolean;
  mission: Mission | null;
  assignmentId: string | null;
  doneToday: boolean;
  selectMode(mode: ModeKey): void;
  loadMission(small?: boolean, mode?: ModeKey): Promise<void>;
  setSmallMission(small: boolean): void;
  commitMission(): Promise<void>;
  checkIn(outcome: CheckinOutcome): Promise<void>;
  resetDemo(): void;
  services: AppServices;
}

const ShykeyContext = createContext<ShykeyContextValue | null>(null);

export function ShykeyProvider({ children }: PropsWithChildren) {
  const [stats, setStats] = useState(() => loadStats(INITIAL_STATS));
  const [modeKey, setModeKey] = useState<ModeKey>('flirting');
  const [smallMission, setSmallMission] = useState(false);
  const [mission, setMission] = useState<Mission | null>(null);
  const [assignmentId, setAssignmentId] = useState<string | null>(null);
  const [parentAssignmentId, setParentAssignmentId] = useState<string | null>(null);

  useEffect(() => saveStats(stats), [stats]);

  const value = useMemo<ShykeyContextValue>(() => ({
    stats,
    modeKey,
    smallMission,
    mission,
    assignmentId,
    doneToday: stats.date === todayKey(),
    services: mockApi,
    selectMode(mode) {
      setModeKey(mode);
      setSmallMission(false);
    },
    async loadMission(small = smallMission, selectedMode = modeKey) {
      const selected = MODES.find((item) => item.key === selectedMode) ?? MODES[2];
      const result = await mockApi.getMission(selected.key, small ? 'small' : 'full');
      setMission(result);
      setSmallMission(small);
    },
    setSmallMission,
    async commitMission() {
      buzz();
      setAssignmentId(await mockApi.commitMission(mission, parentAssignmentId));
      setParentAssignmentId(null);
    },
    async checkIn(outcome) {
      buzz();
      await mockApi.checkIn(assignmentId, outcome);
      if (outcome === 'not_yet') {
        setParentAssignmentId(assignmentId);
        setAssignmentId(null);
        return;
      }
      setStats((current) => {
        if (current.date === todayKey()) return current;
        return {
          ...current,
          streak: current.streak + 1,
          reps: current.reps + (outcome === 'done' ? 1 : 0),
          best: Math.max(current.best, current.streak + 1),
          date: todayKey(),
        };
      });
    },
    resetDemo() {
      clearStats();
      setStats(INITIAL_STATS);
      setModeKey('flirting');
      setSmallMission(false);
      setMission(null);
      setAssignmentId(null);
      setParentAssignmentId(null);
    },
  }), [stats, modeKey, smallMission, mission, assignmentId, parentAssignmentId]);

  return <ShykeyContext.Provider value={value}>{children}</ShykeyContext.Provider>;
}

export function useShykey(): ShykeyContextValue {
  const context = useContext(ShykeyContext);
  if (!context) throw new Error('useShykey must be used inside ShykeyProvider.');
  return context;
}
