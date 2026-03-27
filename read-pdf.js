const fs = require('fs');
const { PdfReader } = require('pdfreader');

let fullText = '';
new PdfReader().parseFileItems('./DOCUMENTACION/Caso_de_Estudio-1.pdf', (err, item) => {
    if (err) console.error(err);
    else if (!item) {
        fs.writeFileSync('pdf-content.txt', fullText);
        console.log('Finalizado, guardado en pdf-content.txt');
    }
    else if (item.text) fullText += item.text + '\n';
});
