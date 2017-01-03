import { helloWorldState, HelloWorldState } from './pages/HelloWorld/HelloWorldState';

export interface State {
  helloWorldState: HelloWorldState
}

export const initialState = {
  helloWorldState
};