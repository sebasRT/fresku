import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';

type BarMode = "default" | "agent";
interface SearchbarState {
    query: string;
    mode: BarMode;
    actions: {
        setMode: (mode: BarMode) => void;
        setQuery: (query: string) => void;
    };
}

const useSearchbarStore = create<SearchbarState>((set) => ({
    query: '',
    mode: 'default',
    actions: {
        setMode: (mode) => set({ mode }),
        setQuery: (query) => set({ query }),
    },
}));

const useBarMode = () => useSearchbarStore(useShallow((state) => ({
    mode: state.mode,
    setMode: state.actions.setMode,
}))
);

const useQuery = () => useSearchbarStore((useShallow((state) => ({
    query: state.query,
    setQuery: state.actions.setQuery,
}))));

export { useBarMode, useQuery, useSearchbarStore, type BarMode };

