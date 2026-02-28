/**
 * Berechnungslogik für die Leichenschau-Abrechnung
 */

const Calculator = {
    /**
     * Berechnet die Gebühr für die Leichenschau-Ziffer
     */
    berechneLeichenschau(ziffer, dauerAusreichend) {
        const pos = GOAE_DATA.leichenschau[ziffer];
        if (!pos) return null;

        const reduziert = !dauerAusreichend && pos.reduziert;
        return {
            ziffer: ziffer,
            bezeichnung: pos.bezeichnung,
            beschreibung: pos.beschreibung,
            betrag: reduziert ? pos.reduziert.satz : pos.einfachsatz,
            reduziert: !!reduziert,
            hinweis: reduziert
                ? `60 %-Regelung: Dauer unter ${pos.mindestdauer} Minuten`
                : `Mindestdauer ${pos.mindestdauer} Minuten erfüllt`
        };
    },

    /**
     * Berechnet den Zuschlag für Ziffer 102
     */
    berechneZuschlag102() {
        const pos = GOAE_DATA.leichenschau[102];
        return {
            ziffer: 102,
            bezeichnung: pos.bezeichnung,
            beschreibung: pos.beschreibung,
            betrag: pos.einfachsatz
        };
    },

    /**
     * Berechnet das Wegegeld
     */
    berechneWegegeld(entfernungKm, istNacht) {
        if (entfernungKm <= 0) return null;

        const tabelle = istNacht ? GOAE_DATA.wegegeld.nacht : GOAE_DATA.wegegeld.tag;

        if (entfernungKm > 25) {
            const re = GOAE_DATA.wegegeld.reiseentschaedigung;
            const betrag = entfernungKm * re.proKm * 2; // Hin- und Rückfahrt
            return {
                bezeichnung: 'Reiseentschädigung (§ 9 GOÄ)',
                beschreibung: `${entfernungKm} km × 0,26 EUR × 2 (Hin- und Rückfahrt)`,
                betrag: Math.round(betrag * 100) / 100,
                hinweis: 'Zzgl. ggf. Abwesenheitsentschädigung (hier nicht berechnet)'
            };
        }

        for (const stufe of tabelle) {
            if (entfernungKm <= stufe.bis) {
                return {
                    bezeichnung: `Wegegeld (${istNacht ? 'Nacht' : 'Tag'})`,
                    beschreibung: `Entfernung ${stufe.label}`,
                    betrag: stufe.betrag
                };
            }
        }
        return null;
    },

    /**
     * Ermittelt die anwendbaren Zeitzuschläge
     */
    berechneZeitzuschlaege(stunde, istWochenendeFeiertag) {
        const zuschlaege = [];

        // Prüfe Zuschlag F (20-22 Uhr oder 6-8 Uhr)
        if ((stunde >= 20 && stunde < 22) || (stunde >= 6 && stunde < 8)) {
            zuschlaege.push({
                zuschlag: 'F',
                bezeichnung: GOAE_DATA.zuschlaege.F.bezeichnung,
                beschreibung: GOAE_DATA.zuschlaege.F.beschreibung,
                betrag: GOAE_DATA.zuschlaege.F.betrag
            });
        }

        // Prüfe Zuschlag G (22-6 Uhr) — exklusiv zu F
        if (stunde >= 22 || stunde < 6) {
            zuschlaege.push({
                zuschlag: 'G',
                bezeichnung: GOAE_DATA.zuschlaege.G.bezeichnung,
                beschreibung: GOAE_DATA.zuschlaege.G.beschreibung,
                betrag: GOAE_DATA.zuschlaege.G.betrag
            });
        }

        // Prüfe Zuschlag H (Wochenende/Feiertag) — kombinierbar
        if (istWochenendeFeiertag) {
            zuschlaege.push({
                zuschlag: 'H',
                bezeichnung: GOAE_DATA.zuschlaege.H.bezeichnung,
                beschreibung: GOAE_DATA.zuschlaege.H.beschreibung,
                betrag: GOAE_DATA.zuschlaege.H.betrag
            });
        }

        return zuschlaege;
    },

    /**
     * Prüft ob die Stunde als Nacht gilt (für Wegegeld)
     */
    istNacht(stunde) {
        return stunde >= 20 || stunde < 8;
    },

    /**
     * Hauptberechnung: Ermittelt alle Positionen und den Gesamtbetrag
     */
    berechneGesamt(params) {
        const {
            ziffer,           // 100 oder 101
            dauerAusreichend, // true wenn Mindestdauer erfüllt
            zuschlag102,      // true wenn Ziffer 102 anwendbar (nur bei 101)
            stunde,           // Uhrzeit der Leichenschau (0-23)
            istWochenendeFeiertag,
            entfernungKm
        } = params;

        const positionen = [];
        let gesamt = 0;

        // 1. Leichenschau-Gebühr
        const ls = this.berechneLeichenschau(ziffer, dauerAusreichend);
        if (ls) {
            positionen.push(ls);
            gesamt += ls.betrag;
        }

        // 2. Zuschlag 102 (nur bei Ziffer 101)
        if (zuschlag102 && ziffer === 101) {
            const z102 = this.berechneZuschlag102();
            positionen.push(z102);
            gesamt += z102.betrag;
        }

        // 3. Zeitzuschläge
        if (stunde !== null && stunde !== undefined) {
            const zeitzuschlaege = this.berechneZeitzuschlaege(stunde, istWochenendeFeiertag);
            for (const z of zeitzuschlaege) {
                positionen.push(z);
                gesamt += z.betrag;
            }
        }

        // 4. Wegegeld
        if (entfernungKm > 0) {
            const wg = this.berechneWegegeld(entfernungKm, this.istNacht(stunde));
            if (wg) {
                positionen.push(wg);
                gesamt += wg.betrag;
            }
        }

        gesamt = Math.round(gesamt * 100) / 100;

        return { positionen, gesamt };
    },

    /**
     * Vergleicht den berechneten Betrag mit dem Rechnungsbetrag
     */
    vergleiche(berechnet, rechnungsbetrag) {
        if (!rechnungsbetrag || rechnungsbetrag <= 0) {
            return { status: 'keine-rechnung', differenz: 0 };
        }

        const differenz = Math.round((rechnungsbetrag - berechnet) * 100) / 100;
        const toleranz = 1.00; // 1 EUR Toleranz für Rundungen

        if (Math.abs(differenz) <= toleranz) {
            return {
                status: 'korrekt',
                differenz: differenz,
                text: 'Die Rechnung entspricht dem berechneten Betrag.',
                farbe: 'gruen'
            };
        } else if (differenz > 0 && differenz <= 20) {
            return {
                status: 'leichte-abweichung',
                differenz: differenz,
                text: `Die Rechnung liegt ${this.formatBetrag(differenz)} über dem berechneten Betrag. Kleine Abweichungen können durch Rundungen oder zusätzliche Positionen entstehen.`,
                farbe: 'gelb'
            };
        } else if (differenz > 20) {
            return {
                status: 'deutliche-abweichung',
                differenz: differenz,
                text: `Die Rechnung liegt ${this.formatBetrag(differenz)} über dem berechneten Betrag. Wir empfehlen, die Rechnung prüfen zu lassen.`,
                farbe: 'rot'
            };
        } else {
            return {
                status: 'unter-berechnet',
                differenz: differenz,
                text: `Die Rechnung liegt ${this.formatBetrag(Math.abs(differenz))} unter dem berechneten Betrag.`,
                farbe: 'gruen'
            };
        }
    },

    /**
     * Formatiert einen Betrag als EUR-String
     */
    formatBetrag(betrag) {
        return betrag.toLocaleString('de-DE', {
            style: 'currency',
            currency: 'EUR'
        });
    }
};
