import { Terminal } from 'xterm';
import { pluginName } from './constants';
import { debug } from './notice';
import { nodepkg } from './constants';

export function loadXterm() {
    // 添加<link>
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `./plugins/${pluginName}/static/xterm.css`;
    document.head.appendChild(link);

    // 添加<script>
    const script = document.createElement('script');
    script.src = `./plugins/${pluginName}/static/xterm.js`;
    document.head.appendChild(script);
}

export function initXterm() {
    var term = new Terminal({
        cursorBlink: true,
    });
    term.open(document.getElementById('terminal'));
    term.writeln('SiYuan XTerm [Ver 0.0.1]');
    term.write('SY \x1B[1;3;31m~\x1B[0m $ ');

    window.sython.ws.onmessage = (event) => {
        term.write(event.data);
    }

    var cmd = ''
    term.onKey(e =>{
        let code = e.domEvent.code;
        if (code === 'Enter'){
            console.log('cmd:',cmd);
            window.sython.ws.send(cmd);
            cmd = '';
            term.write(e.key + '\nSY \x1B[1;3;31m~\x1B[0m $ ');
        }else if (code === 'Backspace') {
            term.write('\b \b');
            cmd = cmd.substring(0, cmd.length-1);
        } else{
            cmd = cmd + e.key;
            term.write(e.key);
        }
    }) 
}

export function shellRun(command: string, cwd: string, shell: boolean = true, detached: boolean = false,  windowsHide: boolean = true, logfile: string = 'ignore') {
    const {spawn}  = (window as any).require('child_process');

    let stdio = ['pipe', 'pipe', 'pipe'];
    if (detached) {
        if (logfile !== 'ignore') {
            const out = nodepkg.fs.openSync(logfile, "a");
            stdio = ['ignore', out, out];
        } else {
            stdio = ['ignore', 'ignore', 'ignore'];
        }
    }

    // windowsHide not workding
    // https://github.com/nodejs/node/issues/21825#issuecomment-503766781
    let spawnObj = spawn(command, {cwd: cwd, shell: shell, detached: detached, windowsHide: windowsHide, stdio: stdio});

    debug(`[shellRun][pid: ${spawnObj.pid}] ${command} @ ${cwd}`);

    let stdout: string = '';
    let stderr: string = '';
    
    if (!detached) {
        spawnObj.stdout.on('data', function(data: any) {
            let outStr = data.toString()
            stdout += `\n${outStr}`
            debug(`[Shell][Info]${outStr}`);
        });
        spawnObj.stderr.on('data', (data: any) => {
            let outStr = data.toString()
            stderr += `\n${outStr}`
            debug(`[Shell][Error]${outStr}`);
        });
        spawnObj.on('close', function(code: string) {
            console.log('close code : ' + code);
            window.sython.ws.send('exit');
        })
        spawnObj.on('exit', (code: any, signal:any) => {
            console.log(`child process exited with code ${code}, and get signal ${signal}`);
        });
    }


    if (detached) {
        spawnObj.unref();
    }

    return [stdout, stderr];
}