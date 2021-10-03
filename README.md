# Fordypningsprosjekt

Sau-app i forbindelse med fordypningsprosjekt på Datateknologi

### Installasjon

Installer Ionic CLI, native-run, og cordova-res med:

- npm install -g @ionic/cli native-run cordova-res

Sjekk at man har filen "local.properties" i frontend/Herd/android/, og at den har filstien til Android SDK-en (sdk.dir=<filsti>).

### Kjøre appen

Først naviger til mappen frontend/Herd.

Kjøre appen i nettleseren på PC-en:

- ionic serve

Kjøre appen på Android-mobil (bytt ut target med din mobil, eller utelatt å definere target dersom du ikke vet hva mobilen heter):

- ionic capacitor run android --target=ce021712e272022f03

Kjøre appen på Android-mobil med live-reload (her vil appen egentlig hostes fra PC'n og lastes inn i web-viewet på mobilen; krever at mobilen og PC'n er på samme internett):

- ionic capacitor run android --target=ce021712e272022f03 -l --external

### Bygge appen

Først naviger til mappen frontend/Herd.

iOS:

- ionic capacitor build ios

Android

- ionic capacitor build android
