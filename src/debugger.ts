interface Window {
    Debugger: Debugger;
}

export class Debugger {
    public static _isLocked = true;
    static isDebug = false;

    static on = () => Debugger.isDebug = true;

    static off = () => Debugger.isDebug = false;

    static next = () => Debugger._isLocked = false;

    static isLocked = () => Debugger.isDebug && Debugger._isLocked;

    static lock = () => Debugger._isLocked = true;

    static debug = (...args: any) => {
        if (!Debugger.isLocked()) return
        console.log(args)
    }
}

window.Debugger = Debugger;