
import ImcForm from './ImcForm'
import { ApiAxiosAdapter } from './api/axios.adapter'

const api = new ApiAxiosAdapter();  // instancio adapter
function App() {

  return (
    <>
     <div>
      <ImcForm api={api}/>   {/* le paso adapter, sino lo recibe como undefined en el param de la funcion y lo desacoplo */}
    </div>
    </>
  )
}

export default App
