import { spawn } from 'child_process';

const isWin = process.platform === 'win32';
const separator = isWin ? ';' : ':';
const classPath = `server/target/classes${separator}server/lib/*`;

console.log('Starting ApnaVaidya Java 17 Server on classpath:', classPath);
const child = spawn('java', ['-cp', classPath, 'com.apnavaidya.ApnaVaidyaServer'], {
  stdio: 'inherit',
  shell: true,
  env: process.env
});

child.on('close', (code) => {
  process.exit(code || 0);
});
