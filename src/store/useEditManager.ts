import { create } from "zustand";

type TaskSelected = {
  id: string;
  assigneeId: {
    id: string;
  };
  dueDate: Date;
  name: string;
  pointEstimate: string;
  status: string;
  tags: string[];
};

type FiltersProps = {
  dueDate: Date | null;
  assigneeId: string;
  pointEstimate: string;
  status: string;
  tags: string[];
};

type CardStore = {
  selectedCard: TaskSelected | null;
  selectCard: (card: TaskSelected) => void;
  cardId: string | null;
  selectIdCard: (id: string) => void;
  searchCardElement: string | null;
  searchCard: (search: string) => void;
  filtersElement: FiltersProps | null;
  filtersSelected: (filter: FiltersProps) => void;
};

const useCardStore = create<CardStore>((set) => ({
  selectedCard: null,

  selectCard: (card) => {
    set({ selectedCard: card });
  },

  cardId: null,

  selectIdCard: (id) => {
    set({ cardId: id });
  },

  searchCardElement: null,
  searchCard: (search) => {
    set({ searchCardElement: search });
  },

  filtersElement: null,

  filtersSelected: (filter) => {
    set({ filtersElement: filter });
  },
}));

export default useCardStore;
