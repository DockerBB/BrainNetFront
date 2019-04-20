/* eslint-disable */
import {EventDispatcher} from "three";

const pako = require('pako')
const DATATYPE = [
    'null',
    'miINT8',
    'miUINT8',
    'miINT16',
    'miUINT16',
    'miINT32',
    'miUINT32',
    'miSINGLE',
    'Reserved',
    'miDOUBLE',
    'Reserved',
    'Reserved',
    'miINT64',
    'miUINT64',
    'miMATRIX',
    'miCOMPRESSED',
    'miUTF8',
    'miUTF16',
    'miUTF32']
const ARRAYTYPE = [
    'null',
    'mxCELL_CLASS',
    'mxSTRUCT_CLASS',
    'mxOBJECT_CLASS',
    'mxCHAR_CLASS',
    'mxSPARSE_CLASS',
    'mxDOUBLE_CLASS',
    'mxSINGLE_CLASS',
    'mxINT8_CLASS',
    'mxUINT8_CLASS',
    'mxINT16_CLASS',
    'mxUINT16_CLASS',
    'mxINT32_CLASS',
    'mxUINT32_CLASS',
    'mxINT64_CLASS',
    'miCOMPRESSED',
    'mxUINT64_CLASS']

function MatFileLoader(buffer) {
    this.endianIndicator = null;
    this.header = null;
    this.version = null;
    this.load(buffer)
}
Object.assign( MatFileLoader.prototype , {
    constructor: MatFileLoader,
    load: function (buffer) {
        // MAT文件由一个128字节的文件头和若干个数据单元组成
        // 文件头header里有124字节的文本描述区域和4个字节的flag。flag中的前2个字节说明version，后两个字节是endian indicator的I和M。
        let headerBuffer = new Uint8Array(buffer.slice(0,128))
        let endianIndicator = String.fromCharCode(headerBuffer[126]) + String.fromCharCode(headerBuffer[127])
        let header = "";
        for (let i = 0; i < headerBuffer.length - 12; i++) {
            header += String.fromCharCode(headerBuffer[i]);
        }
        this.header = header
        this.version = parseFloat(headerBuffer[headerBuffer.length -3])
        let data = new Uint8Array(buffer.slice(128))
        let temp
        if (endianIndicator === 'IM') for (let i = 0; i < data.length / 2; i++){
            temp = data[i * 2 + 1];
            data[i * 2 + 1] = data[i * 2];
            data[i * 2] = temp;
        }
        data = buffer.slice(128)
        this.endianIndicator = endianIndicator
        this.data =  this.parse(data)
    },
    parse: function (data) {
        let data_size = 0
        let data_info
        let data_block
        let data_array = []
        for (let i = 0;i < data.byteLength;) {
            data_info = new Uint16Array(data.slice(i,i+8))
            if (data_info[1] === 0) {
                data_size = new Uint32Array(data.slice(i+4,i+8))[0]
                data_block = data.slice(i+8,i+8+data_size)
                i += data_size+8
            } else {
                data_size = data_info[1]
                data_block = data.slice(i+4,i+4+data_size)
                i += data_size+4
            }
            if (DATATYPE[data_info[0]] === 'null') break
            switch (DATATYPE[data_info[0]]){
                case 'miMATRIX':
                    data_array.push(new MatArray(data_block))
                    break;
                case 'miCOMPRESSED':
                    this.parse(pako.inflate(data_block).buffer).forEach(v=>data_array.push(v))
                    break;
                case 'miUTF8':
                    break;
                case 'miUTF16':
                    break;
                case 'miUTF32':
                    break;
                default:
                    break;
            }
        }
        return data_array
    },
    toJSON: function () {
        let data = this.data;
        if (data.length === 1) data = data[0];
        return JSON.stringify(data, function (key, value) {
            if (value instanceof Array&&typeof value[0] === 'number') {
                return '['+value.toString()+']';
            }
            if (value instanceof MatArray) {
                let obj = {};
                let data = value.data;
                if (value.type === 'mxSTRUCT_CLASS') {
                    let subobj = {};
                    data.forEach(v=>subobj[v.name] = v.data);
                    data = subobj
                }
                obj[value.name] = data;
                return obj;
            }
            return value;
        }, '\t').replace(/\"/g,'')
    }
} );

function MatObject() {}

Object.assign( MatObject.prototype , {
    constructor: MatObject,
    parseString: function(buffer) {
        let str = '';
        buffer = new Uint8Array(buffer);
        for (let i = 0; i < buffer.length; i++) str += String.fromCharCode(buffer[i])
        return str.replace(/\0/g,'')
    }
} );

function MatArray(data) {
    this.parse(data)
}
MatArray.prototype = Object.assign( Object.create( MatObject.prototype ) , {
    constructor: MatArray,
    parse: function (data) {
        // header
        let offset = 0;
        let data_size = 0;
        offset = 24;
        let ArrayFlag = new Uint8Array(data.slice(8,16));
        let DA = new Uint16Array(data.slice(16,24));
        offset += Math.ceil(DA[2] / 8) * 8;
        let temp = new Uint32Array(data.slice(24,24+DA[2]));
        DA = [];
        for (let i = 0; i < temp.length; i++) {
            DA[i] = temp[i];
        }
        let arr_name_str;
        temp = new Uint16Array(data.slice(offset,offset+8));
        if (temp[1] === 0) {
            data_size = temp[2];
            arr_name_str = this.parseString(data.slice(offset+8,offset+8+data_size));
            offset += 8+data_size
        } else {
            data_size = temp[1];
            arr_name_str = this.parseString(data.slice(offset+4,offset+4+temp[1]));
            offset += 4+data_size
        }
        offset = Math.ceil(offset/8)*8;
        // body
        this.size = '('+DA.toString()+')';
        this.type = ARRAYTYPE[ArrayFlag[0]];
        this.name = arr_name_str;
        switch (ARRAYTYPE[ArrayFlag[0]]){
            case 'mxSTRUCT_CLASS':
                this.data = this.parseStructure(data.slice(offset));
                break;
            default:
                this.data = this.parseArray(data.slice(offset), DA)
        }
    },
    parseArray: function (data, DataArray) {
        const arrayBufferToArray = function(arrayBuffer) {
            if (arrayBuffer.length === 1) return arrayBuffer[0];
            let array = [];
            let isMatrix = false;
            let isVoxel = false;
            if (DataArray !== undefined) {
                isVoxel = DataArray.length===3;
                isMatrix = DataArray[0] !== 1
            }
            if (isVoxel){
                for (let k = 0; k < DataArray[2]; k++) {
                    let page = [];
                    for (let i = 0; i < DataArray[0]; i++) {
                        let row = [];
                        for (let j = 0; j < DataArray[1]; j++) {
                            row[j] = arrayBuffer[i+j*DataArray[0]+k*DataArray[1]];
                        }
                        page[i] = row
                    }
                    array[k] = page
                }
            }else if (isMatrix) {
                for (let i = 0; i < DataArray[0]; i++) {
                    let row = [];
                    for (let j = 0; j < DataArray[1]; j++) {
                        row[j] = arrayBuffer[i+j*DataArray[0]];
                    }
                    array[i] = row;
                    console.log('matrix')
                }
            }else {
                for (let i = 0; i < arrayBuffer.length; i++) {
                    array[i] = arrayBuffer[i];
                }
            }
            return array;
        }
        let data_size = 0;
        let data_info;
        let data_block;
        let data_type;
        let offet = 0;
        data_info = new Uint16Array(data.slice(offet,offet+8));
        data_type = DATATYPE[data_info[0]];
        if (data_type === 'null') return;
        if (data_info[1] === 0) {
            data_size = new Uint32Array(data.slice(offet+4,offet+8))[0];
            data_block = data.slice(offet+8,offet+8+data_size)
        } else {
            data_size = data_info[1];
            data_block = data.slice(offet+4,offet+4+data_size)
        }
        switch (data_type){
            case 'miINT8':
                return arrayBufferToArray(new Int8Array(data_block));
            case 'miUINT8':
                return arrayBufferToArray(new Uint8Array(data_block));
            case 'miINT16':
                return arrayBufferToArray(new Int16Array(data_block));
            case 'miUINT16':
                return arrayBufferToArray(new Uint32Array(data_block));
            case 'miINT32':
                return arrayBufferToArray(new Int32Array(data_block));
            case 'miUINT32':
                return arrayBufferToArray(new Uint32Array(data_block));
            case 'miSINGLE':
                break;// 不会
            case 'miDOUBLE':
                return arrayBufferToArray(new Float64Array(data_block));
            case 'miINT64':
                return arrayBufferToArray(new BigInt64Array(data_block));
            case 'miUINT64':
                return arrayBufferToArray(new BigUint64Array(data_block));
            default:
                break;
        }
    },
    parseStructure: function (data) {
        let temp = new Int32Array(data.slice(0,16));
        let field_count = temp[3] / temp[1];
        let data_size = 0;
        let field_name;
        let field_name_size = temp[1];
        let data_array = [];
        let offset = 16+Math.ceil(temp[3]/8)*8;
        for (let i = 0; i < field_count; i++){
            field_name = this.parseString(data.slice(16+i*field_name_size,16+i*field_name_size+field_name_size));
            temp = new Uint16Array(data.slice(offset,offset+8));
            let field = new MatArray(data.slice(offset+8,offset+8+temp[2]));
            field.name = field_name;
            data_array.push(field);
            offset = offset+temp[2]+8;
        }
        return data_array;
    },
} );

export { MatFileLoader };
