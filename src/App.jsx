import Welcome from './components/Welcome.jsx';
import Form from './components/Form.jsx';
import './components/style.css'; // Fix: use lowercase 'style.css'

function App() {
  return (
    <>
      <div className="center-title">
        <h1>Welcome to Trivia!</h1>
      </div>
      <Welcome />
      <Form />
    </>
  );
}

export default App;