/**
* MP3Player
* Create by xrh
*/

//% weight=9 color=#1133ff icon="\uf001" block="MP3������"
namespace dysv17f {
    let isConnected: boolean = false;

    /**
     * ö�٣�����
     */
    export enum playType {
        //% block="����"
        Play = 0x02,
        //% block="��ͣ"
        Pause = 0x03,
        //% block="ֹͣ"
        Stop = 0x04,
        //% block="��һ��"
        PlayPrevious = 0x05,
        //% block="��һ��"
        PlayNext = 0x06
    }

    /**
     * ö�٣�EQ
     */
    export enum EQ {
        //% block="����"
        Normal = 0x00,
        //% block="����"
        Pop = 0x01,
        //% block="ҡ��"
        Rock = 0x02,
        //% block="��ʿ"
        Jazz = 0x03,
        //% block="�ŵ�"
        Classic = 0x04
    }

    /**
     * ö�٣�����ģʽ
     */
    export enum playLoop {
        //% block="ȫ��ѭ��"
        AllLoop = 0x00,
        //% block="����ѭ��"
        SingLoop = 0x01,
        //% block="����ֹͣ"
        SingStop = 0x02,
        //% block="ȫ�����"
        AllRandom = 0x03,
        //% block="Ŀ¼ѭ��"
        DirLoop = 0x04,
        //% block="Ŀ¼���"
        DirRandom = 0x05,
        //% block="Ŀ¼˳��"
        DirOrder = 0x06,
        //% block="˳�򲥷�"
        AllOrder = 0x07
   }

    /**
     * ��������������
     */
    function innerCall(CMD: number, len: number, data: string): void {
        if (!isConnected) {
            connect(SerialPin.P0, SerialPin.P1)
        }

        /* [AA,CMD,len,data,checksum] */
        let dataArr = pins.createBuffer(len+4);

        //����ͷ
        dataArr[0] = 0xAA   //�̶�
        dataArr[1] = CMD    //����
        dataArr[2] = len    //����
    
        //����λ
        for (let i = 0; i < len; i++) {
            dataArr.setNumber(NumberFormat.UInt8BE, i+3, data.charCodeAt(i))
        }

        //У��λ
        let total = 0;
        for (let i = 0; i < len+3; i++) {
            total += dataArr[i]
        }
        dataArr[len+3] = total & 0xFF

        // for (let i = 0; i < len+4; i++) {
        //     basic.showNumber(dataArr[i])
        // }

        //��������
        serial.writeBuffer(dataArr)
        basic.pause(100)
    }

    /**
     * ����DY-SV17F�豸
     * @param pinRX RX�˿�, eg: SerialPin.P0
     * @param pinTX TX�˿�, eg: SerialPin.P1
     */
    //% blockId="dfplayermini_connect" block="����DY-SV17F�豸�� RX���ţ�%pinRX|TX���ţ�%pinTX"
    //% weight=96
    export function connect(pinRX: SerialPin = SerialPin.P0, pinTX: SerialPin = SerialPin.P1): void {
        serial.redirect(pinRX, pinTX, BaudRate.BaudRate9600)
        isConnected = true
        basic.pause(100)
    }

    /**
     * ���°�ť
     * @param myPlayType ��������, eg: 0
     */
    //% blockId="dfplayermini_press" block="���£�%myPlayType"
    //% weight=95
    export function press(myPlayType: playType): void {
        innerCall(myPlayType, 0x00, "")
    }

    /**
     * ����FLASH���ļ����и�����Ŀ¼Ϊ���򲥷Ÿ�Ŀ¼����
     * @param dir       Ŀ¼
     * @param fileName  �ļ���
     */
    //% blockId="dfplayermini_playMp3Folder" block="ָ������mp3�ļ����и������ļ���%fileNumber|�ظ����ţ�%setRepeat"
    //% weight=94 fileNumber.min=1 fileNumber.max=255
    export function playFlash(dir: string, fileName: string): void {
        let file
        if (dir.length>0) {
            file = "/"+ dir+"*/"+fileName+"*mp3";

        } else {
            file = "/"+fileName+"*mp3";
        }
        innerCall(0x08, file.length+1, String.fromCharCode(0x02)+strToUpperCase(file))
    }

    /**
     * ���ò�������
     * @param volume ��������, eg: 30
    //% weight=93
    */
    //% blockId="dfplayermini_setVolume" block="����������С(0~30)��%volume"
    //% weight=94 volume.min=0 volume.max=30
    export function setVolume(volume: number): void {
        innerCall(0x13, 0x01, String.fromCharCode(volume))
    }

    /**
     * ���ò���ģʽ
     * @param mPlayLoop ����ģʽ eg: 2
    */
    //% block="���ò���ģʽ��%mPlayLoop"
    //% weight=92
    export function setLoop(mPlayLoop: playLoop): void {
        innerCall(0x18, 0x01, String.fromCharCode(mPlayLoop))
     }

    /**
     * ���þ�����
     * @param eq ����EQ, eg: 0
   */
    //% blockId="dfplayermini_setEQ" block="����EQ��%eq"
    //% weight=91
    export function setEQ(eq: EQ): void {
        innerCall(0x1A, 0x01, String.fromCharCode(eq))
    }

    /**
     * �ַ���ת��Ϊ��д
    */
    function strToUpperCase(str: string): string {
        let ret = ''
        for(let i = 0; i < str.length; i++){
            let code = str.charCodeAt(i)
            if(code <= 122 && code>=97){
                ret += String.fromCharCode(code - 32)
            }else{
                ret += str[i]
            }
        }
        return ret
    }

}
