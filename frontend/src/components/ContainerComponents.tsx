import * as React from 'react';
import { useEffect, useState } from 'react';
import { ContainerProps } from '../types/types';

const ContainerComponents = React.memo(
  function ContainerComponents( { item, handleStart, handleStop, handleRestart }: ContainerProps ): React.JSX.Element {
    const { id, name, state } = item;
    const [stateStatus, setStateStatus] = useState<string>(state.Status);

    useEffect( () => {
        setStateStatus( state.Status );
    }, [item] );


    return (
      <>
        <p>{ name }</p>
        <p>{ stateStatus }</p>
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
  // ( prevProps, nextProps ) => {
  //   return (
  //     prevProps.item.name === nextProps.item.name &&
  //     prevProps.item.state.Status === nextProps.item.state.Status
  //   );
  // },
);
export default ContainerComponents;