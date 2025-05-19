import { create } from 'zustand';
import { persist } from './middleware/persist';

interface MapState {
  zoom: number;
  position: { x: number, y: number };
  setZoom: (zoom: number) => void;
  setPosition: (position: { x: number, y: number }) => void;
  resetState: () => void;
}

const initialState = {
  zoom: 1,
  position: { x: 0, y: 0 }
};

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      ...initialState,
      setZoom: (zoom) => set({ zoom }),
      setPosition: (position) => set({ position }),
      resetState: () => set(initialState)
    }),
    {
      name: 'map-state'
    }
  )
);
