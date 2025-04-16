export interface State {
  Status: string,
}

export interface Container {
  id: string,
  name: string,
  image: string,
  state: State,
  status: string,
  ports: string,
}

export interface ContainerProps {
  item: Container,
  handleStart: ( id: string ) => { message: string, id: string },
  handleStop: ( id: string ) => { message: string, id: string },
  handleRestart: ( id: string ) => { message: string, id: string },
}