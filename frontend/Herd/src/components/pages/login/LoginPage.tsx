import { useState } from "react";

import axios from "axios";

import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";

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
  useIonToast,
} from "@ionic/react";

import { logInOutline } from "ionicons/icons";

import MainHamburgerMenu from "../../shared/MainHamburgerMenu";

import "./LoginPage.css";
import { request } from "https";
import { useHistory } from "react-router";

interface LoginPageProps {}

// This is the main component for the login page; it provides inputs for logging in
const LoginPage: React.FC<LoginPageProps> = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const [presentToast] = useIonToast();
  let history = useHistory();
  

  const handleLogin = async () => {
    axios
      .post(
        "https://master-herd-api.herokuapp.com/api-token-auth/",
        {
          username: email?.toLowerCase(),
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (response) => {
        if (response.status === 200) {
          await SecureStoragePlugin.set({
            key: "authenticationToken",
            value: response.data.token,
          }).then(() => {
            presentToast({
              header: "Logget inn som " + email?.toLowerCase(),
              duration: 5000,
            });

            setEmail("");
            setPassword("");
            history.push("/");
          });
        } else {
          presentToast({
            header: "Noe gikk galt",
            message:
              "Sjekk at du skrevet riktig e-post og passord, og prøv igjen",
            duration: 5000,
          });
        }
      })
      .catch((e) => {
        presentToast({
          header: "Noe gikk galt",
          message:
            "Sjekk at du skrevet riktig e-post og passord, og prøv igjen",
          duration: 5000,
        });
      });
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
                type="email"
              ></IonInput>
            </IonItem>

            <IonItem style={{ marginTop: "10px" }}>
              <IonInput
                value={password}
                placeholder="Passord"
                onIonChange={(e) => setPassword(e.detail.value!)}
                clearInput
                type="password"
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
