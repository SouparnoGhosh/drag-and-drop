import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
// import DnD_Lib from './DnD_Lib.tsx'
{/* <DnD_Lib /> */}

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
