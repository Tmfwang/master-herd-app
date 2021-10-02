# Fordypningsprosjekt

Sau-app i forbindelse med fordypningsprosjekt på Datateknologi

### Installasjon

Installer Ionic CLI, native-run, og cordova-res med:

- npm install -g @ionic/cli native-run cordova-res

Sjekk at man har filen "local.properties" i frontend/Beite/android/, og at den har filstien til Android SDK-en (sdk.dir=<filsti>).

### Kjøre appen

Først naviger til mappen frontend/beite.

Kjøre appen i nettleseren på PC-en:

- ionic serve

Kjøre appen på Android-mobil (bytt ut target med din mobil, eller utelatt å definere target dersom du ikke vet hva mobilen heter):

- ionic capacitor run android --target=ce021712e272022f03

### Bygge appen

Først naviger til mappen frontend/beite.

iOS:

- ionic capacitor build ios

Android

- ionic capacitor build android
