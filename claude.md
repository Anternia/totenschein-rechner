# Totenschein-Abrechnungsprüfer

## Projektübersicht

Web-Tool für Kunden der **anternia** (www.anternia-bestattungen.de), einem bundesweiten Bestattungsunternehmen. Das Tool ermöglicht die schnelle und einfache Überprüfung der Abrechnung für die **erste Leichenschau** (Todesfeststellung / Totenschein) nach der Gebührenordnung für Ärzte (GOÄ).

## Ziel

Angehörige und Bestattungskunden sollen nachvollziehen können, ob die ärztliche Rechnung für die Leichenschau korrekt und angemessen ist. Das Tool schafft Transparenz und stärkt das Vertrauen in anternia als kompetenten Partner.

## Zielgruppe

- Angehörige von Verstorbenen (Laien, keine medizinischen Vorkenntnisse)
- Bestattungsberater von anternia, die Kunden unterstützen
- Einfache, verständliche Sprache – kein Fachjargon ohne Erklärung

## Fachlicher Hintergrund

### Erste Leichenschau (vorläufige Todesfeststellung)

Die erste Leichenschau wird von einem Arzt durchgeführt und umfasst:
- Feststellung des Todes
- Feststellung der Todesart (natürlich / nicht natürlich / ungeklärt)
- Feststellung der Todesursache (soweit möglich)
- Ausstellen der Todesbescheinigung (Totenschein)

### Abrechnungsgrundlage: GOÄ (Gebührenordnung für Ärzte)

Die Abrechnung erfolgt nach der GOÄ. Relevante Positionen:

#### Kernpositionen (Stand: Reform 01.01.2020, unverändert gültig)

| GOÄ-Ziffer | Beschreibung | Punktzahl | Einfachsatz | Steigerung |
|-------------|-------------|-----------|-------------|------------|
| **100** | Vorläufige Leichenschau (Untersuchung eines Toten, Feststellung des Todes, Ausstellen der vorläufigen Todesbescheinigung, Mindestdauer 20 Min.) | 1.896 | **110,51 EUR** | NICHT steigerungsfähig |
| **100 (60%)** | Wie Ziffer 100, aber Dauer nur 10–20 Minuten | — | **66,31 EUR** | NICHT steigerungsfähig |
| **101** | Eingehende Leichenschau (vollständige Leichenschau mit Feststellung der Todesursache, Mindestdauer 40 Min.) | 2.844 | **165,77 EUR** | NICHT steigerungsfähig |
| **101 (60%)** | Wie Ziffer 101, aber Dauer nur 20–40 Minuten | — | **99,46 EUR** | NICHT steigerungsfähig |
| **102** | Zuschlag zu Ziffer 101 bei unbekanntem Verstorbenen oder besonderen Umständen (zusätzlich 10 Min.) | 474 | **27,63 EUR** | NICHT steigerungsfähig |

**Wichtig**: Neben Ziffer 100/101 sind die Ziffern 4, 48–52 (Besuchsgebühren) NICHT abrechnungsfähig, da das Aufsuchen bereits in der Leichenschau-Ziffer enthalten ist. Ziffer 100 und 101 schließen sich gegenseitig aus.

#### Wegegeld (§ 8 GOÄ) — abrechnungsfähig neben Ziffer 100/101

| Entfernung | Tag (8–20 Uhr) | Nacht (20–8 Uhr) |
|------------|-----------------|-------------------|
| bis 2 km | 3,58 EUR | 7,16 EUR |
| über 2–5 km | 6,65 EUR | 10,23 EUR |
| über 5–10 km | 10,23 EUR | 15,34 EUR |
| über 10–25 km | 15,34 EUR | 25,56 EUR |
| über 25 km | Reiseentschädigung nach § 9 GOÄ (0,26 EUR/km + Abwesenheitsentschädigung) |

**Hinweis**: Wegegeld ist NICHT steigerungsfähig (Festbetrag). Bei mehreren Patienten in derselben häuslichen Gemeinschaft nur einmal anteilig.

#### Zuschläge für ungünstige Zeiten (Besuchszuschläge E–H, abrechnungsfähig bei Leichenschau)

| Zuschlag | Beschreibung | Punktzahl | Betrag (Festbetrag) |
|----------|-------------|-----------|---------------------|
| **F** | 20–22 Uhr oder 6–8 Uhr | 260 | **15,15 EUR** |
| **G** | 22–6 Uhr | 450 | **26,23 EUR** |
| **H** | Samstag, Sonn- oder Feiertag | 340 | **19,82 EUR** |

**Kombinationsregeln**:
- F und G schließen sich gegenseitig aus (nur einer möglich)
- H ist mit F oder G kombinierbar (z.B. Sonntagnacht = H + G)
- Alle Zuschläge sind NICHT steigerungsfähig (Festbeträge)

#### Steigerungsfaktoren

**Sonderregel Leichenschau**: Bei den Ziffern 100, 101 und 102 ist KEINE Steigerung über den Einfachsatz hinaus möglich. Der Einfachsatz ist der Festbetrag.

**Allgemeine GOÄ-Steigerungsregeln (nur für sonstige Positionen)**:
- **1,0-fach**: Einfachsatz (Minimum)
- **2,3-fach**: Schwellenwert für persönliche Leistungen (bis hierhin keine Begründung nötig)
- **3,5-fach**: Höchstsatz (Begründung durch den Arzt erforderlich)
- **Über 3,5-fach**: Nur mit vorheriger schriftlicher Vereinbarung (§ 2 GOÄ)

**Hinweis**: Die GOÄ-Novelle (GOÄneu) wurde 2025 vom Deutschen Ärztetag beschlossen, ist aber frühestens Ende 2026/Anfang 2027 in Kraft. Bis dahin gelten die aktuellen Sätze.

### Besonderheiten nach Bundesland

Die Todesbescheinigung und deren Kosten können je nach Bundesland variieren:
- Einige Bundesländer haben eigene Bestattungsgesetze mit abweichenden Regelungen
- Die Formulare der Todesbescheinigung sind länderspezifisch
- Das Tool sollte länderspezifische Hinweise berücksichtigen

## Technische Anforderungen

### Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla oder leichtgewichtiges Framework)
- **Kein Backend erforderlich**: Reine Client-seitige Berechnung
- **Responsive Design**: Mobile-first, optimiert für Smartphone-Nutzung
- **Barrierefreiheit**: WCAG 2.1 AA-konform
- **Branding**: anternia Corporate Design (Farben, Logo, Schriftarten)

### Funktionalität

1. **Eingabemaske**: Nutzer gibt die Positionen der erhaltenen Rechnung ein
   - GOÄ-Ziffer(n) auswählen oder eingeben
   - Steigerungsfaktor eingeben
   - Zuschläge auswählen (Uhrzeit, Wochentag)
   - Wegegeld / Entfernung angeben

2. **Berechnung**: Automatische Berechnung des korrekten Gesamtbetrags

3. **Vergleich**: Gegenüberstellung der berechneten Kosten mit dem Rechnungsbetrag

4. **Ergebnis-Anzeige**:
   - Aufschlüsselung aller Einzelpositionen
   - Bewertung: "Rechnung korrekt" / "Abweichung festgestellt"
   - Bei Abweichung: Hinweis auf mögliche Gründe und Handlungsempfehlung
   - Hinweis auf anternia-Kontaktmöglichkeit bei Fragen

5. **Alternativ-Modus (vereinfacht)**:
   - Nutzer gibt nur Gesamtbetrag, Uhrzeit, Wochentag und Ort ein
   - Tool berechnet den zu erwartenden Rahmen (von–bis)
   - Anzeige ob der Betrag im üblichen Rahmen liegt

### Nicht-funktionale Anforderungen

- Ladezeit < 2 Sekunden
- Keine Speicherung personenbezogener Daten
- Keine Cookies (außer technisch notwendig)
- DSGVO-konform
- Einbettbar als Widget auf anternia.de

## UX/Design-Richtlinien

- Einfache, empathische Sprache (Zielgruppe befindet sich in einer Trauersituation)
- Klare Schritt-für-Schritt-Führung
- Tooltips/Info-Icons für Fachbegriffe
- Ergebnis visuell klar hervorgehoben (Ampelsystem: grün/gelb/rot)
- anternia-Branding dezent integriert
- Call-to-Action: "Haben Sie Fragen? Wir helfen Ihnen gerne." mit Kontaktlink

## Projektstruktur (geplant)

```
/
├── claude.md                 # Diese Datei (Projektdokumentation)
├── index.html                # Hauptseite
├── css/
│   └── styles.css            # Styling
├── js/
│   ├── app.js                # Hauptlogik / UI-Steuerung
│   ├── calculator.js         # Berechnungslogik
│   └── goae-data.js          # GOÄ-Gebührendaten
└── assets/
    └── ...                   # Bilder, Logo etc.
```

## Rechtlicher Hinweis (im Tool anzeigen)

> Dieses Tool dient ausschließlich der Information und ersetzt keine rechtliche oder medizinische Beratung. Die Berechnung basiert auf der aktuell gültigen Gebührenordnung für Ärzte (GOÄ). Abweichungen können durch individuelle Vereinbarungen zwischen Arzt und Auftraggeber entstehen. Bei Unstimmigkeiten empfehlen wir, die Rechnung durch den behandelnden Arzt erläutern zu lassen oder sich an anternia zu wenden.

## Offene Punkte / Klärungsbedarf

- [ ] anternia Corporate Design Richtlinien (Farben, Fonts, Logo) beschaffen Antwort: siehe www.anternia-bestattungen.de
- [ ] Soll das Tool direkt auf anternia.de eingebettet oder standalone betrieben werden? Antwort: Als Standalone
- [ ] Sollen länderspezifische Besonderheiten in V1 bereits berücksichtigt werden? Antwort: Nein
- [ ] Gibt es häufige Fehlabrechnungen, die besonders hervorgehoben werden sollen? Antwort: Nein
- [ ] Kontaktdaten / Telefonnummer für den CTA-Bereich Antwort: 0800 9074890 
- [ ] GOÄ-Daten auf Aktualität prüfen (letzte Änderung der GOÄ beachten) Antwort: ja, prüfen
