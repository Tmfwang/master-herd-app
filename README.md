# Fordypningsprosjekt

Sau-app i forbindelse med fordypningsprosjekt på Datateknologi

### Installasjon

Installer Ionic CLI, native-run, og cordova-res med:

- npm install -g @ionic/cli native-run cordova-res

Sjekk at man har filen "local.properties" i frontend/Beite/android/, og at den har filstien til Android SDK-en (sdk.dir=<filsti>).

### Kjøre appen

Kjøre appen i nettleseren på PC-en:

- ionic serve

Kjøre appen i Android-emulator i Android studio (krever at en emulator har blitt opprettet i Android studio):

- ionic capacitor run android --target=Fordypningsprosjekt
