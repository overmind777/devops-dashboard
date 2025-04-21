import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';

// @ts-ignore
createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
    <App />,
  </Provider>,
  // </StrictMode>,
);
