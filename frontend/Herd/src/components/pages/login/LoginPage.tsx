import { useState } from "react";

import { Storage } from "@capacitor/storage";

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonItem,
  IonLabel,
  IonListHeader,
  IonButton,
  IonList,
  IonInput,
  IonToggle,
  IonIcon,
  useIonViewWillEnter,
} from "@ionic/react";

import { logInOutline } from "ionicons/icons";

import MainHamburgerMenu from "../../shared/MainHamburgerMenu";

import "./LoginPage.css";

interface LoginPageProps {}

// This is the main component for the login page; it provides inputs for logging in
const LoginPage: React.FC<LoginPageProps> = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const handleLogin = () => {
    alert("YO");
  };

  return (
    <>
      <MainHamburgerMenu />

      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle size="large" className="titleStyle">
              Herd
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonList>
            <IonLabel
              style={{
                fontSize: "25px",
                textAlign: "center",
                width: "100vw",
              }}
            >
              <div style={{ marginTop: "20px" }}>Logg inn</div>
            </IonLabel>

            <IonItem style={{ marginTop: "10px" }}>
              <IonInput
                value={email}
                placeholder="E-post"
                onIonChange={(e) => setEmail(e.detail.value!)}
                clearInput
              ></IonInput>
            </IonItem>

            <IonItem style={{ marginTop: "10px" }}>
              <IonInput
                value={password}
                placeholder="Passord"
                onIonChange={(e) => setPassword(e.detail.value!)}
                clearInput
              ></IonInput>
            </IonItem>

            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <div style={{ display: "inline-block" }}>
                <IonButton fill="outline" onClick={handleLogin}>
                  <IonIcon slot="start" icon={logInOutline} />
                  Logg inn
                </IonButton>
              </div>
            </div>
          </IonList>
        </IonContent>
      </IonPage>
    </>
  );
};

export default LoginPage;
