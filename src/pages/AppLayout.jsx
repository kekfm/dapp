import { Outlet} from 'react-router-dom'
import  Navbar  from '../components/Navbar'


function AppLayout() {

  return (
    <div className="bg-base-1">
      <Navbar />
      <main style={{
        flexGrow: '1',
        padding: '10px',
        width: '100%',
        maxWidth: '800px',
        margin: '5px auto',
      }}>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout