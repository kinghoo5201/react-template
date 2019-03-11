/**
 * @author:kinghoo
 * @description:注意！！！注意！！！注意！！！publish命令将会导致build目录下资源文件强行覆盖public目录下的资源文件！！！
 * 当前命令只针对mac系统，如果系统不是mac，请手动提交代码
 */
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const arg = process.argv[2];
let arg_mess = '';
process.argv.forEach((ag, index) => {
    if (index <= 2) {
        return;
    }
    arg_mess += ag + ' ';
});

const shell_reset = 'git reset HEAD';
const shell_add = 'git add .';
const shell_commit = 'git commit -m "' + (arg_mess || ('update:shell auto commit with command ' + arg)) + '"';
const shell_pull = 'git pull';
const shell_push = 'git push';
const exclude = ['asset-manifest.json',
    'favicon.ico',
    'index.html',
    'manifest.json',
    'precache-manifest.3f49e74f1d3c601d11af66453c714e37.js',
    'service-worker.js',
    'static'];

const build_dir = path.resolve(__dirname, './build');
const public_dir = path.resolve(__dirname, './public');

const prom = (command) => {
    return new Promise(resolve => {
        return child_process.exec(command, function (err, message) {
            if (err) {
                return resolve({
                    flag: false,
                    message
                });
            }
            return resolve({
                flag: true,
                message
            });
        });
    });
};
const commit = async () => {
    if (!await prom(shell_add)) {
        return console.log(`命令：：${shell_add} 出错！`);
    }
    const commit_res = await prom(shell_commit);
    if (!commit_res.flag) {
        console.log(`
================commit message==================
${commit_res.message}
================commit message==================

重设git提交！！！
            `);
        const reset_res = await prom(shell_reset);
        return console.log(reset_res.message);
    }
    console.log(commit_res.message);
    const pull_res = await prom(shell_pull);
    if (!pull_res.flag) {
        return console.log(`
============pull message============
${pull_res.message}
============pull message============
请合并错误！
            `);
    }
    const push_res = await prom(shell_push);
    if (!push_res.flag) {
        return console.log(`
============push message============
${push_res.message}
============push message============
请检查错误！
            `);
    }
    console.log('提交成功!!');
};
const rm_dir = paths => {
    paths.forEach(dir => {
        const filePath = path.resolve(public_dir, dir);
        const sourcePath = path.resolve(build_dir, dir);
        if (!fs.existsSync(filePath)) {
            console.log('文件：：' + filePath + ' 不存在，跳过删除');
        } else {
            child_process.execSync('rm -rf ' + filePath);
            console.log(filePath + '删除成功');
        }
        console.log('正在准备从build目录拷贝文件 ' + build_dir + ' ...');
        child_process.execSync(`cp -R ${sourcePath} ${filePath}`);
        console.log('复制成功!');
    });
};
(async () => {
    switch (arg.trim()) {
        case '-commit': {
            commit();
            break;
        }
        case '-publish': {
            console.log('进行项目发布，发布将会用build文件夹下的资源文件替换public文件夹下的资源文件！！');
            console.log('文件转移中...');
            const usefull_dir = fs.readdirSync(build_dir).filter(dir => exclude.indexOf(dir) < 0);
            rm_dir(usefull_dir);// 移动文件
            console.log('正在打包文件，请等待...');
            const pub_res = await prom('npm run build');
            console.log(pub_res.message);
            if (pub_res.flag) {
                return commit();
            }
            console.log('打包错误！请检查！');
            break;
        }
        default: {
            console.log('命令错误！！命令后缀参数必须是：-commit 或者 -publish');
        }
    }
})();
