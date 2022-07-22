import { createRoot } from 'react-dom/client';
import App from './App';
import './style/index.css';
import 'semantic-ui-css/semantic.min.css';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />)