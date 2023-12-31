import { debug } from './notice'
import packageInfo from '../plugin.json'

export const pluginName = packageInfo.name;

declare global {
    interface Window { 
        sython : {
            ws?: WebSocket;
        } 
    }
}

export const nodepkg = {
    fs: (window as any).require('fs'),
    https: (window as any).require('https'),
    path: (window as any).require('path'),
    os: (window as any).require('os'),
}

export const diyIcon =  {
    searchPeople: `<symbol id="searchPeople" viewBox="0 0 24 24">
    <path d="M6 8.016q0-1.125 0.539-2.039t1.453-1.453 1.992-0.539q1.125 0 2.039 0.539t1.453 1.453 0.539 2.039q0 1.078-0.539 1.992t-1.453 1.453-2.039 0.539q-1.078 0-1.992-0.539t-1.453-1.453-0.539-1.992zM10.359 14.016q-0.844-0.047-1.922 0.094t-2.203 0.469-2.086 0.82-1.547 1.148-0.586 1.453v2.016h9.516q-0.938-1.031-1.242-2.086t-0.281-1.922 0.164-1.406 0.188-0.586zM19.453 18q0.563-0.938 0.563-2.016t-0.539-1.992-1.453-1.453-2.039-0.539q-1.078 0-1.992 0.539t-1.453 1.453-0.539 1.992q0 1.125 0.539 2.039t1.453 1.453 1.992 0.539q0.563 0 1.078-0.164t0.938-0.398l2.578 2.531 1.406-1.406zM15.984 18q-0.797 0-1.383-0.586t-0.586-1.43q0-0.797 0.586-1.383t1.383-0.586q0.844 0 1.43 0.586t0.586 1.383q0 0.844-0.586 1.43t-1.43 0.586z"></path>
    </symbol>`,
    syterm: `<symbol id="syTerm" viewBox="0 0 32 32">
    <path d="M0 2v28h32v-28h-32zM30 28h-28v-24h28v24zM28 6h-24v20h24v-20zM14 16h-2v2h-2v2h-2v-2h2v-2h2v-2h-2v-2h-2v-2h2v2h2v2h2v2zM22 20h-6v-2h6v2z"></path>
    </symbol>`
}

export const pyURL: DownURL = {
    "windows_x86": "https://gitee.com/HowcanoeWang/python3-embeddable/releases/download/v1.0.0/python3-windows-3.10.4-win32.zip",
    "windows_x64": "https://gitee.com/HowcanoeWang/python3-embeddable/releases/download/v1.0.0/python3-windows-3.10.4-amd64.zip",
    "darwin_arm64": "https://gitee.com/HowcanoeWang/python3-embeddable/releases/download/v1.0.0/python3-macos-3.10.4-universal2.zip",
    "darwin_x64": "https://gitee.com/HowcanoeWang/python3-embeddable/releases/download/v1.0.0/python3-macos-3.10.4-x86_64.zip",
    "linux_x64": "https://gitee.com/HowcanoeWang/python3-embeddable/releases/download/v1.0.0/python3-linux-3.10.4-x86_64.zip",
    "android_arm": "https://gitee.com/HowcanoeWang/python3-embeddable/releases/download/v1.0.0/python3-android-3.10.4-arm.zip",
    "android_arm64": "https://gitee.com/HowcanoeWang/python3-embeddable/releases/download/v1.0.0/python3-android-3.10.4-arm64.zip"
}

export var dataDir = (window as any).siyuan.config.system.dataDir;
if ((window as any).siyuan.config.system.os === 'windows'){
    dataDir = dataDir.replaceAll('\\', '/')
}
            
export const pyDownDir = `${dataDir}/storage/envs/`
export const sythonLogDir = `${dataDir}/plugins/sython/.log/`

export interface Response {
    [x: string]: any 
    statusCode: number; 
    headers: { 
        'location': any; 
        'content-length': any;
    }; 
    pipe: (arg0: any) => void;
}

export interface zipFile {
    extract: () => File;
    _name:string;
    _path:string; 
    _size: number;
}

export interface DownURL {
    [key:string]: string
}