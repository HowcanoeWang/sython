import { nodepkg, Response } from "./constants";
import * as cst from "./constants";
import { debug, error } from "./notice";

export const downloadFile = (url: string, dest: string) => {
    // chatgpt 生成的，能跑但是不知道为什么能跑
    return new Promise<void>((resolve, reject) => {
        // 进度条变量
        let downloadedBytes = 0;
        let totalBytes = 0;

        // 文件IO
        const file = nodepkg.fs.createWriteStream(dest);

        // 允许重定向设置
        const options = {
            followRedirect: true,
        };
  
        // 开始解析URL
        nodepkg.https.get(url, options, (response: Response) => {
            // 需要重定向
            if (response.statusCode === 302) {
                const redirectUrl = response.headers.location;
                console.log('重定向链接:', redirectUrl);
        
                downloadFile(redirectUrl, dest)
                    .then(resolve)
                    .catch(reject);

            // 有其他的状态码报错
            } else if (response.statusCode !== 200) {
                reject(new Error(`下载失败，状态码：${response.statusCode}`));
                
            // 状态码为正常200， 开始下载
            } else {
                // 获取文件最大长度
                totalBytes = parseInt(response.headers['content-length'], 10);

                // 大文件流式传输
                response.pipe(file);

                // 如果有数据进来，则更新进度条
                response.on('data', (chunk: string | any[]) => {
                    downloadedBytes += chunk.length;
          
                    const progress = (downloadedBytes  / totalBytes) * 100;
                    console.log(`下载进度：${progress.toFixed(2)}%`);
          
                    // 更新进度条元素的数值
                    // 例如：document.getElementById('progress-bar').value = progress;
                });
        
                // 结束的时候，解除文件锁
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            }
        }).on('error', (err: any) => {
            nodepkg.fs.unlink(dest, () => {
                reject(err);
                error(err)
            });
        });
    });
};

// 解压缩文件
export async function unzipFile(zipFilePath: string, extractToPath: string) {

    debug(`zipPath: ${zipFilePath}, path: ${extractToPath}`);

    let res = await fetch("/api/archive/unzip", {
        method: "POST",
        // body: data,
        body: JSON.stringify({
            "path": extractToPath,
            "zipPath": zipFilePath
        })
    });
    return await res.json();
};

export function turn2apiPath (fullPath: string, nodataheader:boolean=false) {
    let apipath = fullPath.replace(cst.dataDir, '')

    if (nodataheader) {
        apipath = apipath.replaceAll('\\', '/');
    } else {
        apipath = '/data' + apipath.replaceAll('\\', '/');
    }

    return apipath;
}

export function getToday() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}