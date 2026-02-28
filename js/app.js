/**
 * UI-Steuerung für den Totenschein-Abrechnungsprüfer
 */

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('rechner-form');
    const ergebnisBereich = document.getElementById('ergebnis');
    const zifferSelect = document.getElementById('ziffer');
    const dauerGroup = document.getElementById('dauer-group');
    const zuschlag102Group = document.getElementById('zuschlag102-group');
    const uhrzeitSelect = document.getElementById('uhrzeit');
    const wochenendeFeiertag = document.getElementById('wochenende-feiertag');
    const entfernungInput = document.getElementById('entfernung');
    const rechnungsbetragInput = document.getElementById('rechnungsbetrag');
    const steps = document.querySelectorAll('.step');
    const weiterButtons = document.querySelectorAll('.btn-weiter');
    const zurueckButtons = document.querySelectorAll('.btn-zurueck');

    let currentStep = 0;

    // Step-Navigation
    function showStep(index) {
        steps.forEach((step, i) => {
            step.classList.toggle('active', i === index);
        });
        currentStep = index;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    weiterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            if (validateCurrentStep()) {
                showStep(currentStep + 1);
            }
        });
    });

    zurueckButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            showStep(currentStep - 1);
        });
    });

    // Ziffer-Auswahl beeinflusst sichtbare Felder
    zifferSelect.addEventListener('change', function () {
        const ziffer = parseInt(this.value);
        zuschlag102Group.style.display = ziffer === 101 ? 'block' : 'none';
        updateDauerLabel(ziffer);
    });

    function updateDauerLabel(ziffer) {
        const pos = GOAE_DATA.leichenschau[ziffer];
        if (!pos) return;
        const label = document.querySelector('#dauer-group .info-text');
        if (label) {
            label.textContent = `Mindestdauer für den vollen Satz: ${pos.mindestdauer} Minuten`;
        }
    }

    function validateCurrentStep() {
        const currentStepEl = steps[currentStep];
        const requiredFields = currentStepEl.querySelectorAll('[required]');
        let valid = true;

        requiredFields.forEach(field => {
            if (!field.value) {
                field.classList.add('error');
                valid = false;
            } else {
                field.classList.remove('error');
            }
        });

        return valid;
    }

    // Berechnung auslösen
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        berechnen();
    });

    function berechnen() {
        const ziffer = parseInt(zifferSelect.value);
        const dauerAusreichend = document.getElementById('dauer').value === 'ja';
        const zuschlag102 = ziffer === 101 && document.getElementById('zuschlag102').checked;
        const stunde = uhrzeitSelect.value !== '' ? parseInt(uhrzeitSelect.value) : null;
        const istWochenendeFeiertag = wochenendeFeiertag.checked;
        const entfernungKm = parseFloat(entfernungInput.value) || 0;
        const rechnungsbetrag = parseFloat(rechnungsbetragInput.value.replace(',', '.')) || 0;

        const ergebnis = Calculator.berechneGesamt({
            ziffer,
            dauerAusreichend,
            zuschlag102,
            stunde,
            istWochenendeFeiertag,
            entfernungKm
        });

        const vergleich = Calculator.vergleiche(ergebnis.gesamt, rechnungsbetrag);

        zeigeErgebnis(ergebnis, vergleich, rechnungsbetrag);
        showStep(steps.length - 1);
    }

    function zeigeErgebnis(ergebnis, vergleich, rechnungsbetrag) {
        let html = '<h2>Ergebnis der Abrechnungsprüfung</h2>';

        // Positionstabelle
        html += '<div class="positionen-tabelle">';
        html += '<table>';
        html += '<thead><tr><th>Position</th><th>Beschreibung</th><th class="betrag-col">Betrag</th></tr></thead>';
        html += '<tbody>';

        for (const pos of ergebnis.positionen) {
            const label = pos.ziffer ? `Ziffer ${pos.ziffer}` : (pos.zuschlag || pos.bezeichnung);
            html += `<tr>`;
            html += `<td><strong>${label}</strong></td>`;
            html += `<td>${pos.beschreibung || pos.bezeichnung}`;
            if (pos.hinweis) {
                html += `<br><small class="hinweis">${pos.hinweis}</small>`;
            }
            html += `</td>`;
            html += `<td class="betrag-col">${Calculator.formatBetrag(pos.betrag)}</td>`;
            html += `</tr>`;
        }

        html += '</tbody>';
        html += `<tfoot><tr class="gesamt-zeile"><td colspan="2"><strong>Berechneter Gesamtbetrag</strong></td><td class="betrag-col"><strong>${Calculator.formatBetrag(ergebnis.gesamt)}</strong></td></tr></tfoot>`;
        html += '</table>';
        html += '</div>';

        // Vergleich
        if (rechnungsbetrag > 0) {
            html += `<div class="vergleich vergleich-${vergleich.farbe}">`;
            html += `<div class="vergleich-header">`;
            html += `<span class="vergleich-icon">${getIcon(vergleich.farbe)}</span>`;
            html += `<span class="vergleich-titel">${getTitel(vergleich.status)}</span>`;
            html += `</div>`;
            html += `<div class="vergleich-details">`;
            html += `<div class="vergleich-zahlen">`;
            html += `<div class="zahl"><span class="label">Ihre Rechnung</span><span class="wert">${Calculator.formatBetrag(rechnungsbetrag)}</span></div>`;
            html += `<div class="zahl"><span class="label">Berechneter Betrag</span><span class="wert">${Calculator.formatBetrag(ergebnis.gesamt)}</span></div>`;
            if (vergleich.differenz !== 0) {
                html += `<div class="zahl"><span class="label">Differenz</span><span class="wert">${vergleich.differenz > 0 ? '+' : ''}${Calculator.formatBetrag(vergleich.differenz)}</span></div>`;
            }
            html += `</div>`;
            html += `<p class="vergleich-text">${vergleich.text}</p>`;
            html += `</div></div>`;
        } else {
            html += `<div class="vergleich vergleich-info">`;
            html += `<p>Sie haben keinen Rechnungsbetrag eingegeben. Die obige Aufstellung zeigt die zu erwartenden Kosten.</p>`;
            html += `</div>`;
        }

        // CTA
        html += `<div class="cta-box">`;
        html += `<p><strong>Haben Sie Fragen zu Ihrer Rechnung?</strong></p>`;
        html += `<p>Unsere Berater helfen Ihnen gerne weiter.</p>`;
        html += `<a href="tel:08009074890" class="btn btn-primary btn-cta">0800 90 74 890 (kostenfrei)</a>`;
        html += `<p class="cta-sub"><a href="https://www.anternia-bestattungen.de" target="_blank" rel="noopener">www.anternia-bestattungen.de</a></p>`;
        html += `</div>`;

        // Hinweis
        html += `<div class="rechtlicher-hinweis">`;
        html += `<p><small>Dieses Tool dient ausschließlich der Information und ersetzt keine rechtliche oder medizinische Beratung. Die Berechnung basiert auf der aktuell gültigen Gebührenordnung für Ärzte (GOÄ). Abweichungen können durch individuelle Vereinbarungen zwischen Arzt und Auftraggeber entstehen.</small></p>`;
        html += `</div>`;

        // Neu-berechnen-Button
        html += `<div class="neu-berechnen">`;
        html += `<button type="button" class="btn btn-secondary" id="btn-neu">Neue Berechnung</button>`;
        html += `</div>`;

        ergebnisBereich.innerHTML = html;

        document.getElementById('btn-neu').addEventListener('click', function () {
            form.reset();
            ergebnisBereich.innerHTML = '';
            zuschlag102Group.style.display = 'none';
            showStep(0);
        });
    }

    function getIcon(farbe) {
        switch (farbe) {
            case 'gruen': return '&#10003;';
            case 'gelb': return '&#9888;';
            case 'rot': return '&#10007;';
            default: return '&#8505;';
        }
    }

    function getTitel(status) {
        switch (status) {
            case 'korrekt': return 'Rechnung im erwarteten Rahmen';
            case 'leichte-abweichung': return 'Leichte Abweichung festgestellt';
            case 'deutliche-abweichung': return 'Deutliche Abweichung festgestellt';
            case 'unter-berechnet': return 'Rechnung unter dem erwarteten Betrag';
            default: return 'Ergebnis';
        }
    }

    // Tooltips
    document.querySelectorAll('.tooltip-trigger').forEach(trigger => {
        trigger.addEventListener('click', function (e) {
            e.preventDefault();
            const tooltip = this.nextElementSibling;
            if (tooltip && tooltip.classList.contains('tooltip-content')) {
                tooltip.classList.toggle('visible');
            }
        });
    });

    // Initialer Zustand
    showStep(0);
    updateDauerLabel(100);
});
