import { Routes, Route } from 'react-router'
import CAPage from './pages/CAPage'

export default function App() {
  return (
    <Routes>
      <Route path="/ca" element={<CAPage />} />
      <Route path="/" element={<CAPage />} />
    </Routes>
  )
}
