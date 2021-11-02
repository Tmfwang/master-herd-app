import { useState } from "react";

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
  IonList,
  IonToggle,
  useIonViewWillEnter,
} from "@ionic/react";

import MainHamburgerMenu from "../../shared/MainHamburgerMenu";

import "./SettingsPage.css";

interface SettingsPageProps {}

// This is the main component for the settings page; it provides toggleable settings as a list
const SettingsPage: React.FC<SettingsPageProps> = () => {
  const [shouldReadNumberOfSheepsToggle, setShouldReadNumberOfSheepsToggle] =
    useState<boolean>(true);

  const [shouldReadNumberOfTiesToggle, setShouldReadNumberOfTiesToggle] =
    useState<boolean>(true);

  const [shouldReadColorOfSheepsToggle, setShouldReadColorOfSheepsToggle] =
    useState<boolean>(true);

  const [shouldReadColorOfTiesToggle, setShouldReadColorOfTiesToggle] =
    useState<boolean>(true);

  useIonViewWillEnter(async () => {
    let shouldReadNumberOfSheeps = true;
    let value;

    await SecureStoragePlugin.get({
      key: "shouldReadNumberOfSheeps",
    }).then((readValue) => (value = readValue.value));

    if (value) {
      try {
        shouldReadNumberOfSheeps = JSON.parse(value);
      } catch (err) {}
    }

    await SecureStoragePlugin.set({
      key: "shouldReadNumberOfSheeps",
      value: JSON.stringify(shouldReadNumberOfSheeps),
    });

    setShouldReadNumberOfSheepsToggle(shouldReadNumberOfSheeps);
  });

  useIonViewWillEnter(async () => {
    let shouldReadNumberOfTies = true;
    let value;

    await SecureStoragePlugin.get({
      key: "shouldReadNumberOfTies",
    }).then((readValue) => (value = readValue.value));

    if (value) {
      try {
        shouldReadNumberOfTies = JSON.parse(value);
      } catch (err) {}
    }

    await SecureStoragePlugin.set({
      key: "shouldReadNumberOfTies",
      value: JSON.stringify(shouldReadNumberOfTies),
    });

    setShouldReadNumberOfTiesToggle(shouldReadNumberOfTies);
  });

  useIonViewWillEnter(async () => {
    let shouldReadColorOfSheeps = true;
    let value;

    await SecureStoragePlugin.get({
      key: "shouldReadColorOfSheeps",
    }).then((readValue) => (value = readValue.value));

    if (value) {
      try {
        shouldReadColorOfSheeps = JSON.parse(value);
      } catch (err) {}
    }

    await SecureStoragePlugin.set({
      key: "shouldReadColorOfSheeps",
      value: JSON.stringify(shouldReadColorOfSheeps),
    });

    setShouldReadColorOfSheepsToggle(shouldReadColorOfSheeps);
  });

  useIonViewWillEnter(async () => {
    let shouldReadColorOfTies = true;
    let value;

    await SecureStoragePlugin.get({
      key: "shouldReadColorOfTies",
    }).then((readValue) => (value = readValue.value));

    if (value) {
      try {
        shouldReadColorOfTies = JSON.parse(value);
      } catch (err) {}
    }

    await SecureStoragePlugin.set({
      key: "shouldReadColorOfTies",
      value: JSON.stringify(shouldReadColorOfTies),
    });

    setShouldReadColorOfTiesToggle(shouldReadColorOfTies);
  });

  const setToggleValue = async (key: string, isChecked: boolean) => {
    await SecureStoragePlugin.set({
      key: key,
      value: JSON.stringify(isChecked),
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
            <IonItem>
              <IonLabel>
                <h2>Høytlesing av antall sau</h2>
                <p>Lyd ved registrering av sau</p>
              </IonLabel>
              <IonToggle
                slot="end"
                checked={shouldReadNumberOfSheepsToggle}
                onIonChange={(e) => {
                  setShouldReadNumberOfSheepsToggle(e.detail.checked);
                  setToggleValue("shouldReadNumberOfSheeps", e.detail.checked);
                }}
              ></IonToggle>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Høytlesing av antall bjelleslips</h2>
                <p>Lyd ved registrering av bjelleslips</p>
              </IonLabel>
              <IonToggle
                slot="end"
                checked={shouldReadNumberOfTiesToggle}
                onIonChange={(e) => {
                  setShouldReadNumberOfTiesToggle(e.detail.checked);
                  setToggleValue("shouldReadNumberOfTies", e.detail.checked);
                }}
              ></IonToggle>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Høytlesing av sauefarge</h2>
                <p>Lyd når aktiv farge byttes ved sveiping</p>
              </IonLabel>
              <IonToggle
                slot="end"
                checked={shouldReadColorOfSheepsToggle}
                onIonChange={(e) => {
                  setShouldReadColorOfSheepsToggle(e.detail.checked);
                  setToggleValue("shouldReadColorOfSheeps", e.detail.checked);
                }}
              ></IonToggle>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Høytlesing av bjelleslipsfarge</h2>
                <p>Lyd når aktiv farge byttes ved sveiping</p>
              </IonLabel>
              <IonToggle
                slot="end"
                checked={shouldReadColorOfTiesToggle}
                onIonChange={(e) => {
                  setShouldReadColorOfTiesToggle(e.detail.checked);
                  setToggleValue("shouldReadColorOfTies", e.detail.checked);
                }}
              ></IonToggle>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPage>
    </>
  );
};

export default SettingsPage;
