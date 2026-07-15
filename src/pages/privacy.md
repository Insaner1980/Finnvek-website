---
layout: ../layouts/PolicyLayout.astro
title: Privacy Policy for Finnvek Apps
description: Privacy policy for the KnitTools, runcheck, and dBcheck Android apps published by Finnvek.
---

<p class="prose-kicker">Privacy Policy</p>

# Privacy policy for Finnvek apps.

**Last updated:** 16 July 2026

## At a glance

I am an independent Android developer based in Finland. I publish KnitTools, runcheck, and dBcheck under the Finnvek brand name.

- I do not use advertising SDKs, ad networks, behavioral profiling, or cross-app advertising tracking in these apps.
- I do not sell or rent personal data, and I do not share it with data brokers.
- Most app data stays in private storage on your device.
- Automatic Android cloud backup and device transfer are disabled for all three apps.
- All three apps use Firebase Crashlytics to collect crash and diagnostic reports so I can find and fix stability problems.
- The apps do not use a separate app-usage analytics service. External services are limited to the specific purposes described below, such as crash diagnostics, Ravelry access, Google Play purchases, M-Lab network tests, and optional Health Connect integration.
- None of the apps requires a Finnvek profile account. KnitTools creates a technical anonymous Firebase identifier only when its Ravelry integration needs the Finnvek backend.

---

## Who I am

The apps covered by this policy are operated by **Emma Hotakainen**, a private individual based in Finland.

I publish independent app development work under the **Finnvek** brand name. Finnvek is not a separate legal company, business name, or trade name.

For privacy questions or data requests, email [contact@finnvek.com](mailto:contact@finnvek.com).

---

## Apps covered

This policy applies to these Android apps:

- **KnitTools**, a knitting project and pattern companion
- **runcheck**, a device health, storage, battery, thermal, and network utility
- **dBcheck**, a sound awareness and personal hearing baseline app

If I publish another app under the Finnvek name, I will add its actual data practices to this policy before referring users to it.

---

## Principles applying to all three apps

### No advertising or behavioral tracking

The apps do not contain advertising SDKs, ad networks, remarketing tools, fingerprinting, or cross-app advertising tracking. I do not build advertising profiles from app activity.

### Local storage and backups

Each app stores its normal working data in Android app-private storage. Android's automatic cloud backup and device-to-device transfer are disabled for the apps.

Clearing an app's storage or uninstalling it removes its app-private data. It does not necessarily remove:

- files you exported, saved, or shared outside the app
- data written to another service, such as Health Connect
- purchase records held by Google Play
- Ravelry connection data held by the KnitTools backend if you uninstall KnitTools without disconnecting Ravelry first

Those exceptions and their deletion controls are described in the relevant app sections.

### Security

The apps use Android app-private storage for local data, disable cleartext network traffic, and restrict shared files to narrowly defined FileProvider paths with temporary read access. External connections use encrypted HTTPS or the secure protocol provided by the relevant platform service.

### Google Play

The paid Pro versions are one-time purchases handled by Google Play Billing. I do not receive or store your card details. Google Play tells the app whether the relevant Pro purchase is valid.

Google Play may also process technical, purchase, update, and review information under [Google's Privacy Policy](https://policies.google.com/privacy).

### Crash diagnostics

KnitTools, runcheck, and dBcheck use Firebase Crashlytics, a crash-reporting service provided by Google Firebase. Crashlytics can automatically send a report when an app crashes or encounters a serious error.

A report may include:

- crash stack traces, thread state, and the time of the crash
- app identifier and version
- Android version, device model, CPU architecture, available memory, and disk space
- whether the device appears to be rooted
- a Crashlytics installation identifier, Firebase installation identifier, and random session identifier used to group related reports and estimate how many installations are affected

I use this information only to diagnose crashes, fix bugs, and improve app stability. I do not use it for advertising, behavioral profiling, or tracking what you do across apps. The apps do not intentionally attach your projects, notes, photos, measurement history, audio recordings, hearing-test results, Health Connect data, media files, or precise location to Crashlytics reports.

Google states that Firebase Crashlytics keeps crash stack traces and associated identifiers for 90 days before starting their removal from live and backup systems. Firebase may process this data on Google's global infrastructure. See [Firebase Privacy and Security](https://firebase.google.com/support/privacy).

---

## KnitTools

KnitTools is a knitting companion app for Android.

### Data stored on your device

KnitTools stores the following data locally:

- knitting projects and project settings
- row, stitch, and custom counters
- project notes and reminders
- knitting session history
- progress photos and yarn photos
- yarn stash cards
- saved pattern files and Ravelry pattern metadata
- pattern annotations
- app settings, language, units, trial state, and cached Pro status

This local content is not uploaded to Finnvek. Images captured or selected for projects remain in the app's local storage unless you explicitly share or export them.

### Permissions

- **Camera**: used when you choose to capture a pattern, yarn label, progress photo, or other supported image. The camera is not used in the background.
- **Internet**: used for the optional Ravelry integration, Finnvek's Firebase backend, and Google Play features.
- **Notifications and vibration**: used for reminders, counters, and related app feedback where supported.

### Ravelry and the Finnvek backend

Ravelry integration is optional. KnitTools uses Firebase Authentication and Cloud Functions to connect to a Finnvek-operated backend in Google Firebase. The backend keeps Ravelry credentials out of the Android app and makes the necessary Ravelry API requests on the user's behalf.

When you first use this integration, Firebase creates a technical anonymous user identifier. It is not a Finnvek profile and is not based on your name or email address.

When you connect Ravelry:

- the sign-in page is provided by Ravelry, and KnitTools does not receive your Ravelry password
- the backend stores your Ravelry access token and, when provided, refresh token
- the backend also stores your Ravelry user ID, username, token timestamps, and the anonymous Firebase identifier used to associate the connection
- temporary OAuth security records are created to complete and protect the sign-in flow
- searches, pattern imports, and requests for Ravelry account information are sent through the backend to Ravelry when you use those features
- Firebase and the backend necessarily process technical connection data such as IP addresses to deliver and protect the service

Your knitting projects, counters, notes, photos, pattern annotations, and local session history are not uploaded to this backend.

Selecting **Disconnect Ravelry** in KnitTools deletes the stored Ravelry token record from the Finnvek backend and prevents unused sign-in records for that anonymous identifier from being used. It does not delete your separate Ravelry account or the locally saved patterns you chose to keep in KnitTools.

If you uninstall KnitTools before disconnecting Ravelry, email [contact@finnvek.com](mailto:contact@finnvek.com) and include your Ravelry username so I can handle a deletion request for the remaining backend connection data.

Firebase Authentication, Cloud Functions, and Cloud Firestore are provided by Google. See [Firebase Privacy and Security](https://firebase.google.com/support/privacy). Ravelry's own processing is described in the [Ravelry Privacy Policy](https://www.ravelry.com/about/privacy).

### Retention and deletion

- **Local app data**: kept until you delete it in the app, clear app storage, or uninstall KnitTools.
- **Ravelry backend token data**: kept while the Ravelry connection is active and deleted when you use Disconnect Ravelry.
- **Temporary sign-in records**: contain an expiry time and cannot be used after expiry; disconnecting also invalidates unused records associated with the connection.
- **Google Play purchase records**: retained by Google under Google's policies.

---

## runcheck

runcheck is an Android utility for understanding device health, battery behavior, thermal state, storage use, app usage, and network performance.

### Data stored on your device

Depending on the features and permissions you use, runcheck may store:

- battery readings, charging sessions, and user-defined charger labels
- thermal readings and throttling events
- storage readings and device storage information
- network type, signal strength, latency, Wi-Fi details, and speed-test history
- app usage and estimated per-app battery usage snapshots
- device profile information needed for the app's local analysis
- locally generated insights and their seen or dismissed state
- app preferences, notification settings, trial state, and cached Pro status

This history is stored in the app's private local database. It is not uploaded to Finnvek and is not used for advertising.

### Permissions and Android access

- **Network and Wi-Fi state**: used to show connection type, capabilities, signal information, and network health.
- **Internet**: used for latency measurements, user-initiated M-Lab NDT7 speed tests, and Google Play Billing.
- **Approximate and precise location permission**: Android requires location permission for access to Wi-Fi SSID and BSSID information on supported versions. runcheck uses it for Wi-Fi connection details, not to collect or store geographic GPS location.
- **Media access**: used only when you open the media breakdown or cleanup features. It lets runcheck categorize eligible images, videos, and audio and present user-selected cleanup actions.
- **Usage access**: optional special Android access used for the per-app usage and battery feature and aggregate app or cache storage information.
- **Basic phone state**: used on supported Android versions to identify the cellular network generation when Android does not provide it through the normal network APIs.
- **Notifications, foreground service, and boot completed**: used for alerts, periodic monitoring, rescheduling monitoring, and the optional live monitoring notification.

runcheck can show the names and icons of launchable apps and, with usage access, locally calculate app-usage information. This information stays on the device.

Media deletion occurs only after you choose items and confirm the operation. On newer Android versions, Android's own system deletion confirmation is used where required.

### M-Lab network measurements

runcheck uses Measurement Lab's NDT7 service for speed tests. Starting a speed test sends network traffic to an M-Lab server and exposes your public IP address to M-Lab. M-Lab collects the IP address and measurement results and publishes NDT results as open measurement data for Internet research.

runcheck stores a local copy of the test result, including download and upload speed, ping, jitter, server information, connection type, and optional signal strength. Finnvek does not receive a separate copy.

runcheck may also make a short TCP connection to an M-Lab discovery host to estimate latency. This necessarily exposes your IP address and connection metadata to the remote server but does not upload runcheck's locally stored device history.

Read [M-Lab's Privacy Policy](https://www.measurementlab.net/privacy/) and [NDT7 information](https://www.measurementlab.net/tests/ndt/ndt7/) before using the test.

### Export, retention, and deletion

runcheck can create CSV exports when you request them. Exported files are handed to the Android share or document destination you select. Files saved outside runcheck are then controlled by you and the receiving app or storage provider.

The default history retention period is three months. Available settings are three months, six months, one year, or forever. The app periodically removes locally stored historical readings older than the selected period.

Settings also provides controls to clear speed-test results and clear all app data. Clearing app storage or uninstalling runcheck removes its private database and preferences. Google Play purchase records and CSV files saved outside the app are not removed by those actions.

---

## dBcheck

dBcheck is an Android sound-awareness app for measuring everyday sound, following noise exposure over time, and comparing personal hearing checks with your own baseline. It is not a certified sound level meter or a clinical diagnostic tool.

### Data stored on your device

Depending on the features you use, dBcheck may store:

- sound measurement sessions, timestamps, equivalent and peak levels, and exposure calculations
- session names, tags, notes, and time-zone metadata
- optional one-time approximate session location metadata
- locally detected sound-category labels, timestamps, and confidence values
- personal hearing-test baselines and results
- sleep-monitoring session summaries
- tinnitus pitch profile values
- calibration profiles and app settings
- optional WAV recordings
- local backups created inside the app

Sound analysis and sound-category detection run on the device. Raw microphone audio is not sent to Finnvek. Raw audio is stored only when you explicitly enable WAV recording, which is off by default.

### Permissions

- **Microphone**: required for sound measurement, sound-category detection, and optional WAV recording. Microphone processing happens on the device.
- **Camera**: used only when you open the camera overlay and choose to capture a photo or silent video with the visible sound readout.
- **Approximate location**: optional and used for a one-time, foreground session-location entry when enabled. dBcheck does not request precise or background location and does not continuously track location.
- **Notifications and foreground services**: used to keep an active measurement or ambient playback visible and controllable, and for optional alerts.
- **Health Connect permissions**: requested only for the optional Health Connect features described below.

### Optional Health Connect integration

Health Connect is off unless you enable it and grant the relevant Android permissions.

With noise-session sync enabled, dBcheck writes a completed sound session to Health Connect as an `ExerciseSessionRecord` because Health Connect does not provide a dedicated noise-exposure record. The record may contain:

- session start and end times and time-zone offsets
- a dBcheck title and a technical client record identifier
- equivalent sound level, maximum level, LCpeak, and weighting information in the notes field
- phone manufacturer and model as record device metadata

dBcheck does not write hearing-test results to Health Connect.

If you separately grant heart-rate read access, dBcheck can read heart-rate samples within the selected session's time range and show them in Session Detail or include them in a PDF you create. Those samples are used for that user-facing report and are not uploaded to Finnvek.

You can stop dBcheck's Health Connect synchronization in dBcheck settings and manage or revoke permissions in Android's Health Connect settings. Records already written to Health Connect are controlled separately in Health Connect and are not automatically deleted when you clear dBcheck history or uninstall dBcheck.

See Android's [Health Connect permissions and data access guidance](https://developer.android.com/health-and-fitness/health-connect/ui/permissions).

### Exports, sharing, backups, and recordings

dBcheck creates CSV, PDF, PNG, WAV, photo, or silent-video output only when you enable or start the relevant feature. Sharing grants the receiving app temporary access to the selected file. Once you save or share a file outside dBcheck, the receiving app or storage provider controls its copy.

Local backups are stored in dBcheck's app-private storage. Clearing measurement history does not delete those backup files. Clearing app storage or uninstalling dBcheck removes app-private backups and WAV recordings, but not files already exported elsewhere or records already written to Health Connect.

### Retention and deletion

- **Measurement, hearing, sleep, settings, location, and sound-category data**: kept locally until you delete the relevant history, clear app storage, or uninstall dBcheck.
- **WAV recordings**: kept in app-private storage until the associated recording is deleted, its session is removed, app storage is cleared, or dBcheck is uninstalled.
- **Local backups**: kept until app storage is cleared or dBcheck is uninstalled.
- **Health Connect records**: managed and deleted separately through Health Connect.
- **Exported or shared files**: managed by you and the receiving app or storage provider.
- **Google Play purchase records**: retained by Google under Google's policies.

---

## Legal bases for processing

For users in the European Economic Area, the UK, or Switzerland, the relevant legal bases depend on the feature:

- **Performance of a contract**: providing the app features you request and processing Pro entitlement through Google Play.
- **Consent**: optional permissions and integrations such as camera access, location-related access, Ravelry connection, media access, usage access, and Health Connect. You can withdraw this by disabling the feature, revoking the permission, or disconnecting the service.
- **Legitimate interests**: diagnosing crashes, fixing stability problems, securing the apps and backend, preventing abuse, and maintaining reliable operation, provided those interests do not override your rights.

---

## Your choices and rights

For data kept only on your device, I do not have a server copy that I can access, correct, export, or delete for you. Use the app's deletion controls, Android's app storage controls, or uninstall the app.

You can also:

- disconnect Ravelry from KnitTools to delete the backend token record
- manage Health Connect permissions and records through Android's Health Connect settings
- clear runcheck or dBcheck history from their settings
- delete exported files from the destination where you saved them
- manage Google Play purchases through Google Play

Depending on where you live, you may have rights to access, correct, delete, restrict, object to, or receive a portable copy of personal data that I process. Email [contact@finnvek.com](mailto:contact@finnvek.com) to make a privacy request.

You also have the right to complain to a data protection authority. In Finland, the authority is the Office of the Data Protection Ombudsman at [tietosuoja.fi](https://tietosuoja.fi).

---

## Children

The apps are not designed for or directed at children under 13, or under the higher minimum age that may apply in a user's country. I do not knowingly use the apps to collect personal data from children. dBcheck's Health Connect features are not intended for children.

If you believe a child has provided personal data through an external feature described in this policy, email [contact@finnvek.com](mailto:contact@finnvek.com).

---

## Changes to this policy

I update this policy when an app's data practices change. The date at the top shows the latest revision. A significant new data flow, permission, external service, or app will be documented here before this policy is used for that release.

*Questions or privacy requests? Email [contact@finnvek.com](mailto:contact@finnvek.com).*
