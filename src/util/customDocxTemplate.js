
import createReport from 'docx-templates';

export const templateDocx = async (required_file, data, callback) => {
    const template = await readFileIntoArrayBuffer(required_file);
    const report = await createReport({
        template,
        data,
        cmdDelimiter: ['{', '}']
    });
    saveDataToFile(
        report,
        'Müqavilə.docx',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        callback
    );
}

const readFileIntoArrayBuffer = fd =>
    new Promise((resolve, reject) => {
        fetch(fd)
        .then(response => {
            return response.arrayBuffer();
        })
        .then(data => {
            resolve(data);
        })
        .catch((err) => reject(err));
    });

const saveDataToFile = (data, fileName, mimeType, callback) => {
    const blob = new Blob([data], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    downloadURL(url, fileName, callback);
    setTimeout(() => {
        window.URL.revokeObjectURL(url);
    }, 1000);
};

const downloadURL = (data, fileName, callback) => {
    const a = document.createElement('a');
    a.href = data;
    a.download = fileName;
    document.body.appendChild(a);
    a.style = 'display: none';
    a.click();
    a.remove();
    document.body.style.cursor = 'auto';
    callback(false);
};