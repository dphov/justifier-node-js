/*
    Input: Some text
    Output: Justified text with 80 characters line width max
*/

function justify(text : string, quota: number, callback: (errorCode: number | null, error: string | null, text: string | null, quota: number | null) => void) {

    const textWithoutMultiNewline = text.replace(/(\n+)/g, '\n');
    const tokens = textWithoutMultiNewline.toString().match(/\n+|mme\ \S+|mr\ \S+|madame\ \S+|monsieur\ \S+|((\d+\ ){1,}(\d+){1,})(?=\ )|\S+/gi);
    if (!tokens) {
        callback(400, `Incorrect request. quota: ${quota}`, null, null);
        return;
    }
    if(tokens.length === 0) {
        callback(400, `Incorrect request. Words to process: ${tokens.length}, quota: ${quota}`, null, null);
        return;
    }
    if (tokens.length > quota) {
        callback(402, `You have to pay. Words to process: ${tokens.length}, quota: ${quota}`, null, null);
        return;
    }

    const result = convertTokensToLinesFrom(tokens);
    const newQuota = (quota - tokens.length) >= 0 ? quota - tokens.length : 0;
    callback(null, null, result, newQuota);
    return;
}

function convertTokensToLinesFrom(tokens : any) {
    let line = [];
    let lineCharCounter = 0;
    let outputText = '';

    for (const value of tokens) {
        const nextCounterValue = lineCharCounter + value.length
        if (nextCounterValue <= 80) {
            if (value === '\n') {
                line.push(value);
                lineCharCounter += value.length;

                outputText += `${line.join(" ")}`;
                line = [];

                lineCharCounter = 0;
            } else {
                line.push(value);
                if (lineCharCounter + value.length === 80) {
                    lineCharCounter = 80;
                } else {
                    lineCharCounter += value.length + 1;
                }
            }
        } else {
                if (lineCharCounter < 80) {
                    let lineTokensRest : number = line.length;
                    let i : number = 0
                    while (lineTokensRest > 0 && lineCharCounter <= 80) {
                        line[i] = `${line[i]} `
                        lineCharCounter += 1;
                        lineTokensRest--;
                        i++;
                    } 
                }
                outputText += `${line.join(" ")}\n`
                line = [];
                line.push(value);
                lineCharCounter = value.length + 1;
        }       
    } 
    return outputText; 
}

export default justify;