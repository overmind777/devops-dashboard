import { create } from 'zustand';
import { Container } from '../types/types';
import { useState } from 'react';

type Containers = {
  containers: Container[];
}

type Actions = {
  addContainer: ( container: Container ) => void;
  clearContainers: () => void;
}

export const useTerminalStore = create<Containers & Actions>()( ( set ) => ( {
  containers: [],
  addContainer: ( container: Container ) =>
    set( ( state ) => ( {
      containers: state.containers.some( ( c ) => c.id === container.id ) ? state.containers : [...state.containers, container],
    } ) ),
  clearContainers: () => set( { containers: [] } ),
} ) );
