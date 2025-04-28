import { create } from 'zustand';
import { Container } from '../types/types';

type ContainerId = {
  containers: Container[];
  addContainer: ( container: Container ) => void;
  clearContainers: () => void;
}

export const useTerminalStore = create<ContainerId>()( ( set ) => ( {
  containers: [],
  addContainer: ( container ) =>
    set( ( state ) => ( {
      containers: state.containers.some( ( c ) => c.id === container.id ) ? state.containers : [...state.containers, container],
    } ) ),
  clearContainers: () => set( { containers: [] } ),
} ) );
