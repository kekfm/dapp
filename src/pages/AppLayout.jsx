import { Outlet} from 'react-router-dom'
import  Navbar  from '../components/Navbar'
import Footer from '../components/Footer'


function AppLayout() {

  return (
    <div className="bg-base-1">
      <div className="w-100">
        <Navbar />

      </div>
      <main style={{
        padding: '10px',
        width: '100%',
        maxWidth: '100%',
        margin: '5px auto',
      }}>
        <Outlet />
      </main>
      <Footer />

    </div>
  )
}

export default AppLayout