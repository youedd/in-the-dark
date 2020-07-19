interface Window {
    Debugger: Debugger;
}

export class Debugger {
    public static isLocked = true;
    static isDebug = false;

    static on = () => Debugger.isDebug = true;

    static off = () => Debugger.isDebug = false;

    static next = () => Debugger.isLocked = false;

    static lock = () => Debugger.isLocked = true;

    static debug = (...args: any) => {
        if (!Debugger.isDebug) return

        if (Debugger.isLocked) return

        console.log(args);
    }
}

window.Debugger = Debugger;