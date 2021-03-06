import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupConfig } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import Home from "./components/pages/home/HomePage";
import LoginPage from "./components/pages/login/LoginPage";
import RegisterPage from "./components/pages/register/RegisterPage";
import Settings from "./components/pages/settings/SettingsPage";
import MapDownloadPage from "./components/pages/map_download/MapDownloadPage";
import SupervisionPage from "./components/pages/supervision/SupervisionPage";
import PreviousSupervisionsPage from "./components/pages/previous_supervisions/PreviousSupervisionsPage";
import "./App.css";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import SettingsPage from "./components/pages/settings/SettingsPage";

setupConfig({
  hardwareBackButton: false,
});

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/download-maps">
            <MapDownloadPage />
          </Route>
          <Route exact path="/new-supervision">
            <SupervisionPage />
          </Route>
          <Route exact path="/previous-supervisions">
            <PreviousSupervisionsPage />
          </Route>
          <Route exact path="/settings">
            <Settings />
          </Route>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/register">
            <RegisterPage />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
