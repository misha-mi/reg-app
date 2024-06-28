import "./App.sass";
import Nav from "./components/nav/nav";
import LogsPage from "./pages/logs-page/logs-page";
import UsersPage from "./pages/users-page/users-page";

const App = () => {
  return (
    <div className="app">
      <div className="container">
        <Nav />
        <div className="app__pages">
          {/* <UsersPage />
          <LogsPage /> */}
        </div>
      </div>
    </div>
  );
};

export default App;
