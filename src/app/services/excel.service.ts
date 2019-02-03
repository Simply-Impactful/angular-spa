import { Injectable } from '@angular/core';
import * as json2csv from 'json2csv'; // convert json file to csv
import { saveAs } from 'file-saver';  // save the file

@Injectable()
export class ExcelService {
    Json2csvParser = json2csv.Parser;
    constructor() {}

     public downloadFile(data: any, filename?: string) {
        const csvData = this.convertToCSV(data);
        const file = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
        saveAs(file, 'data.csv');
    }

    public convertToCSV(objArray: any, fields?) {
        const json2csvParser = new this.Json2csvParser({ opts: fields });
        const csv = json2csvParser.parse(objArray);
        return csv;
    }
}
