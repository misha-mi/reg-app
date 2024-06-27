import "./App.sass";
import Nav from "./components/nav/nav";
import UsersPage from "./pages/users-page/users-page";

const App = () => {
  return (
    <div className="app">
      <div className="container">
        <Nav />
        <div className="app__pages">
          <UsersPage />
        </div>
      </div>
    </div>
  );
};

export default App;
