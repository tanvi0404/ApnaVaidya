import { spawnSync } from 'child_process';
import path from 'path';

const isWin = process.platform === 'win32';
const separator = isWin ? ';' : ':';
const classPath = `server/target/classes${separator}server/lib/*`;

console.log('Compiling Java 17 backend and tests...');
const compileCmd = [
  '--release', '17',
  '-cp', 'server/lib/*',
  '-d', 'server/target/classes',
  'server/src/main/java/com/apnavaidya/model/*.java',
  'server/src/main/java/com/apnavaidya/storage/*.java',
  'server/src/main/java/com/apnavaidya/storage/repository/*.java',
  'server/src/main/java/com/apnavaidya/service/*.java',
  'server/src/main/java/com/apnavaidya/ApnaVaidyaServer.java',
  'server/src/test/java/com/apnavaidya/ApnaVaidyaTest.java'
];

const compileRes = spawnSync('javac', compileCmd, { stdio: 'inherit', shell: true });
if (compileRes.status !== 0) {
  console.error('Java compilation failed.');
  process.exit(compileRes.status || 1);
}

console.log('Running ApnaVaidya Java 17 Test Suite...');
const testRes = spawnSync('java', ['-cp', classPath, 'com.apnavaidya.ApnaVaidyaTest'], { stdio: 'inherit', shell: true });
process.exit(testRes.status || 0);
