import { spawnSync } from 'child_process';

console.log('Compiling Java 17 backend classes...');
const compileCmd = [
  '--release', '17',
  '-cp', 'server/lib/*',
  '-d', 'server/target/classes',
  'server/src/main/java/com/apnavaidya/model/*.java',
  'server/src/main/java/com/apnavaidya/storage/*.java',
  'server/src/main/java/com/apnavaidya/storage/repository/*.java',
  'server/src/main/java/com/apnavaidya/service/*.java',
  'server/src/main/java/com/apnavaidya/ApnaVaidyaServer.java'
];

const compileRes = spawnSync('javac', compileCmd, { stdio: 'inherit', shell: true });
if (compileRes.status !== 0) {
  console.error('Java compilation failed.');
  process.exit(compileRes.status || 1);
}
console.log('Java 17 backend build successful.');
