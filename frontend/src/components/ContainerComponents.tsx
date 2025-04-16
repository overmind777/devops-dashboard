import * as React from 'react';
import { ContainerProps } from '../types/types';

const ContainerComponents = React.memo(
  function ContainerComponents( { item, handleStart, handleStop, handleRestart }: ContainerProps ): React.JSX.Element {
    const { id, name, state } = item;
    console.log(state)
    return (
      <>
        <p>{ name }</p>
        <p>{ state?.Status }</p>
        <button onClick={ () => {
          handleStart( id );
        } }>Start
        </button>
        <button onClick={ () => {
          handleStop( id );
        } }>Stop
        </button>
        <button onClick={ () => {
          handleRestart( id );
        } }>Restart
        </button>
      </>
    );
  },
  ( prevProps, nextProps ) => {
    return (
      prevProps.item.name === nextProps.item.name &&
      prevProps.item.state.Status === nextProps.item.state.Status
    );
  },
);
export default ContainerComponents;