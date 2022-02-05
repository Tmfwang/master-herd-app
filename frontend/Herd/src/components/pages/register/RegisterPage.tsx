import { useState } from "react";

import axios from "axios";
import { useHistory } from "react-router";

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

import { personCircleOutline } from "ionicons/icons";

import MainHamburgerMenu from "../../shared/MainHamburgerMenu";

import "./RegisterPage.css";

interface RegisterPageProps {}

// This is the main component for the login page; it provides inputs for logging in
const RegisterPage: React.FC<RegisterPageProps> = () => {
  const [email, setEmail] = useState<string>();
  const [fullName, setFullName] = useState<string>();
  const [gaardsNumber, setGaardsNumber] = useState<string>();
  const [bruksNumber, setBruksNumber] = useState<string>();
  const [municipality, setMunicipality] = useState<string>();
  const [password1, setPassword1] = useState<string>();
  const [password2, setPassword2] = useState<string>();

  const [presentToast] = useIonToast();
  let history = useHistory();

  const handleRegistration = () => {
    axios
      .post(
        "https://master-herd-api.herokuapp.com/user/",
        {
          email: email?.toLowerCase(),
          password1: password1,
          password2: password2,
          full_name: fullName,
          gaards_number: gaardsNumber,
          bruks_number: bruksNumber,
          municipality: municipality,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (response) => {
        if (response.status === 201) {
          await SecureStoragePlugin.set({
            key: "authenticationToken",
            value: response.data.token,
          }).then(() => {
            presentToast({
              header:
                "Brukerprofil opprettet, og logget inn som " +
                email?.toLowerCase(),
              duration: 6000,
            });

            setEmail("");
            setPassword1("");
            setPassword2("");
            setFullName("");
            setBruksNumber("");
            setGaardsNumber("");
            setMunicipality("");
            history.push("/");
          });
        } else {
          presentToast({
            header: "Noe gikk galt",
            message: "Prøv igjen senere",
            duration: 5000,
          });
        }
      })
      .catch((e) => {
        presentToast({
          header: "Noe gikk galt",
          message: e.response.data.error,
          duration: 7500,
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
              <div style={{ marginTop: "20px" }}>Registrer ny bruker</div>
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
                value={fullName}
                placeholder="Fullt navn"
                onIonChange={(e) => setFullName(e.detail.value!)}
                clearInput
              ></IonInput>
            </IonItem>

            <IonItem style={{ marginTop: "10px" }}>
              <IonInput
                value={gaardsNumber}
                placeholder="Gårdsnummer"
                onIonChange={(e) => setGaardsNumber(e.detail.value!)}
                clearInput
              ></IonInput>
            </IonItem>

            <IonItem style={{ marginTop: "10px" }}>
              <IonInput
                value={bruksNumber}
                placeholder="Bruksnummer"
                onIonChange={(e) => setBruksNumber(e.detail.value!)}
                clearInput
              ></IonInput>
            </IonItem>

            <IonItem style={{ marginTop: "10px" }}>
              <IonInput
                value={municipality}
                placeholder="Kommune"
                onIonChange={(e) => setMunicipality(e.detail.value!)}
                clearInput
              ></IonInput>
            </IonItem>

            <IonItem style={{ marginTop: "10px" }}>
              <IonInput
                value={password1}
                placeholder="Passord"
                onIonChange={(e) => setPassword1(e.detail.value!)}
                type="password"
                clearInput
              ></IonInput>
            </IonItem>

            <IonItem style={{ marginTop: "10px" }}>
              <IonInput
                value={password2}
                placeholder="Gjenta passord"
                onIonChange={(e) => setPassword2(e.detail.value!)}
                type="password"
                clearInput
              ></IonInput>
            </IonItem>

            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <div style={{ display: "inline-block" }}>
                <IonButton fill="outline" onClick={handleRegistration}>
                  <IonIcon slot="start" icon={personCircleOutline} />
                  Registrer bruker
                </IonButton>
              </div>
            </div>
          </IonList>
        </IonContent>
      </IonPage>
    </>
  );
};

export default RegisterPage;
