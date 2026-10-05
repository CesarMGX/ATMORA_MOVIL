import React, { useState, useEffect } from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import {
  IonApp, IonRouterOutlet, setupIonicReact,
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {
  homeOutline,
  personOutline,
  locationOutline,
  sparklesOutline
} from 'ionicons/icons';

/* 1. IMPORTACIONES DE PÁGINAS */
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Locations from './pages/Locations/Locations';
import CityDetails from './pages/CityDetails/CityDetails';
import History from './pages/History/History';
import Splash from './pages/Splash/Splash';
import CityDetailsToxpan from './pages/CityDetails/CityDetailsToxpan';
import CityDetailsMaltrata from './pages/CityDetails/CityDetailsMaltrata';
import PredictionSelection from './pages/Predictions/PredictionSelection';
import PredictionConfig from './pages/Predictions/PredictionConfig';
import PredictionResult from './pages/Predictions/PredictionResult';

/* CSS Obligatorio */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import './theme/variables.css';

setupIonicReact();

const MainLayout: React.FC = () => {
  const location = useLocation();
  const hideTabBar = ['/login', '/register', '/splash'].includes(location.pathname);

  return (
    <IonTabs>
      <IonRouterOutlet id="main-content">
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/locations" component={Locations} />
        <Route exact path="/city-details" component={CityDetails} />
        <Route exact path="/history" component={PredictionSelection} />
        <Route exact path="/prediction-selection" component={PredictionSelection} />
        <Route exact path="/prediction-config" component={PredictionConfig} />
        <Route exact path="/prediction-result" component={PredictionResult} />
        <Route exact path="/city-details-toxpan" component={CityDetailsToxpan} />
        <Route exact path="/city-details-maltrata" component={CityDetailsMaltrata} />

        {/* Redirección inteligente al cargar la raíz */}
        <Route exact path="/" render={() => (
          localStorage.getItem('isLoggedIn') === 'true'
            ? <Redirect to="/home" />
            : <Redirect to="/login" />
        )} />
      </IonRouterOutlet>

      {!hideTabBar && (
        <IonTabBar slot="bottom" className="custom-bottom-bar">

          <IonTabButton tab="home" href="/home">
            <IonIcon icon={homeOutline} />
            <IonLabel>Inicio</IonLabel>
          </IonTabButton>

          <IonTabButton tab="locations" href="/locations">
            <IonIcon icon={locationOutline} />
            <IonLabel>Ver ubicaciones</IonLabel>
          </IonTabButton>

          <IonTabButton tab="history" href="/history">
            <IonIcon icon={sparklesOutline} />
            <IonLabel>IA</IonLabel>
          </IonTabButton>
          
          <IonTabButton tab="profile" href="/profile">
            <IonIcon icon={personOutline} />
            <IonLabel>Tu perfil</IonLabel>
          </IonTabButton>
        </IonTabBar>
      )}
    </IonTabs>
  );
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <IonApp>
      <IonReactRouter>
        {showSplash ? <Splash onFinish={() => setShowSplash(false)} /> : <MainLayout />}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;