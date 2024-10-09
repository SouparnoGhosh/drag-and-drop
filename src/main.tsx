import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
// import DnD_Lib from './DnD_Lib.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <DnD_Lib /> */}
  </StrictMode>,
)
