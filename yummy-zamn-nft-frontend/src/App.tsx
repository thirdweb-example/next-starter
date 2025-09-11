import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Marketplace from './pages/Marketplace';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={Marketplace} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;