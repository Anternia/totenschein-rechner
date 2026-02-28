/**
 * GOÄ-Gebührendaten für die Leichenschau
 * Stand: Reform 01.01.2020, unverändert gültig (GOÄ-Novelle frühestens Ende 2026)
 * Punktwert: 5,82873 Cent
 */

const GOAE_DATA = {
    punktwert: 0.0582873,

    leichenschau: {
        100: {
            bezeichnung: 'Vorläufige Leichenschau',
            beschreibung: 'Untersuchung eines Toten, Feststellung des Todes, Ausstellen der vorläufigen Todesbescheinigung',
            punktzahl: 1896,
            einfachsatz: 110.51,
            mindestdauer: 20,
            reduziert: {
                satz: 66.31,
                dauerVon: 10,
                dauerBis: 20,
                prozent: 60
            },
            steigerungsfaehig: false
        },
        101: {
            bezeichnung: 'Eingehende Leichenschau',
            beschreibung: 'Vollständige Leichenschau mit Feststellung der Todesursache und vollständiger Todesbescheinigung',
            punktzahl: 2844,
            einfachsatz: 165.77,
            mindestdauer: 40,
            reduziert: {
                satz: 99.46,
                dauerVon: 20,
                dauerBis: 40,
                prozent: 60
            },
            steigerungsfaehig: false
        },
        102: {
            bezeichnung: 'Zuschlag zu Ziffer 101',
            beschreibung: 'Bei unbekanntem Verstorbenen oder besonderen Umständen (zusätzlich mind. 10 Min.)',
            punktzahl: 474,
            einfachsatz: 27.63,
            steigerungsfaehig: false,
            nurMit: [101]
        }
    },

    wegegeld: {
        tag: [
            { bis: 2, betrag: 3.58, label: 'bis 2 km' },
            { bis: 5, betrag: 6.65, label: 'über 2 bis 5 km' },
            { bis: 10, betrag: 10.23, label: 'über 5 bis 10 km' },
            { bis: 25, betrag: 15.34, label: 'über 10 bis 25 km' }
        ],
        nacht: [
            { bis: 2, betrag: 7.16, label: 'bis 2 km' },
            { bis: 5, betrag: 10.23, label: 'über 2 bis 5 km' },
            { bis: 10, betrag: 15.34, label: 'über 5 bis 10 km' },
            { bis: 25, betrag: 25.56, label: 'über 10 bis 25 km' }
        ],
        reiseentschaedigung: {
            proKm: 0.26,
            abwesenheitBis8h: 51.13,
            label: 'über 25 km (Reiseentschädigung)'
        },
        tagZeit: { von: 8, bis: 20 },
        nachtZeit: { von: 20, bis: 8 }
    },

    zuschlaege: {
        F: {
            bezeichnung: 'Zuschlag F',
            beschreibung: '20–22 Uhr oder 6–8 Uhr',
            punktzahl: 260,
            betrag: 15.15,
            zeitraeume: [
                { von: 20, bis: 22 },
                { von: 6, bis: 8 }
            ]
        },
        G: {
            bezeichnung: 'Zuschlag G',
            beschreibung: '22–6 Uhr',
            punktzahl: 450,
            betrag: 26.23,
            zeitraeume: [
                { von: 22, bis: 6 }
            ]
        },
        H: {
            bezeichnung: 'Zuschlag H',
            beschreibung: 'Samstag, Sonn- oder Feiertag',
            punktzahl: 340,
            betrag: 19.82,
            wochentage: [0, 6] // 0=Sonntag, 6=Samstag
        }
    },

    // F und G schließen sich gegenseitig aus, H ist kombinierbar
    zuschlagRegeln: {
        exklusiv: ['F', 'G'],
        kombinierbar: ['H']
    }
};
