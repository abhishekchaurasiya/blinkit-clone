import { Outlet } from "react-router-dom"
import { lazy, Suspense } from "react"

const Header = lazy(() => import("./components/Navbar/Header"))
const Footer = lazy(() => import("./components/Navbar/Footer"))

const App = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
        <main className="min-h-[77vh]">
          <Outlet />
        </main>
        <Footer />
      </Suspense>

    </>
  )
}

export default App
