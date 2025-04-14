import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESModuleでの__dirnameの代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// テスト結果を保存するディレクトリの作成
const resultsDir = path.join(__dirname, '../performance-results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// 実行時間を測定する関数
function measureExecutionTime(command) {
  console.log(`実行コマンド: ${command}`);
  
  const start = Date.now();
  try {
    execSync(command, { stdio: 'inherit' });
    const end = Date.now();
    const duration = (end - start) / 1000; // 秒に変換
    
    console.log(`実行時間: ${duration.toFixed(2)}秒`);
    return duration;
  } catch (error) {
    console.error('コマンド実行中にエラーが発生しました:', error);
    return -1;
  }
}

// ビルドディレクトリをクリーンアップする関数
function cleanBuild() {
  const distPath = path.join(__dirname, '../dist');
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
    console.log('distディレクトリを削除しました');
  }
  
  // wireitのキャッシュをクリアする
  const wireitCachePath = path.join(__dirname, '../.wireit');
  if (fs.existsSync(wireitCachePath)) {
    fs.rmSync(wireitCachePath, { recursive: true, force: true });
    console.log('.wireitキャッシュを削除しました');
  }
}

// 1つのファイルを変更する関数
function modifySingleFile() {
  const filePath = path.join(__dirname, '../src/components/ExampleComponent1.tsx');
  let content = fs.readFileSync(filePath, 'utf8');
  
  // タイムスタンプを追加して変更
  content = content.replace(
    'export const ExampleComponent1',
    `// Modified at: ${new Date().toISOString()}\nexport const ExampleComponent1`
  );
  
  fs.writeFileSync(filePath, content);
  console.log('ExampleComponent1.tsxを変更しました');
}

// 結果をCSVに保存する関数
function saveResults(scenario, method, duration) {
  const resultsPath = path.join(resultsDir, 'benchmark-results.csv');
  
  // CSVファイルが存在しない場合は、ヘッダーを作成
  if (!fs.existsSync(resultsPath)) {
    fs.writeFileSync(resultsPath, 'Scenario,Method,Duration(s)\n');
  }
  
  // 結果を追加
  fs.appendFileSync(resultsPath, `${scenario},${method},${duration.toFixed(2)}\n`);
}

// テストシナリオを実行する関数
async function runTests() {
  console.log('=== Webpack vs Wireit パフォーマンス比較テスト ===\n');
  
  // シナリオ1: 初回ビルド
  console.log('\n=== シナリオ1: 初回ビルド ===');
  
  cleanBuild();
  console.log('\n> 通常のwebpack:');
  const webpackInitialTime = measureExecutionTime('npm run build');
  saveResults('初回ビルド', 'webpack', webpackInitialTime);
  
  cleanBuild();
  console.log('\n> wireit:');
  const wireitInitialTime = measureExecutionTime('npm run build:wireit');
  saveResults('初回ビルド', 'wireit', wireitInitialTime);
  
  // シナリオ2: ファイル変更なしでの2回目のビルド
  console.log('\n=== シナリオ2: ファイル変更なしでの2回目のビルド ===');
  
  console.log('\n> 通常のwebpack:');
  const webpackNoChangeTime = measureExecutionTime('npm run build');
  saveResults('変更なし再ビルド', 'webpack', webpackNoChangeTime);
  
  console.log('\n> wireit:');
  const wireitNoChangeTime = measureExecutionTime('npm run build:wireit');
  saveResults('変更なし再ビルド', 'wireit', wireitNoChangeTime);
  
  // シナリオ3: 1ファイル変更後のビルド
  console.log('\n=== シナリオ3: 1ファイル変更後のビルド ===');
  
  modifySingleFile();
  console.log('\n> 通常のwebpack:');
  const webpackOneChangeTime = measureExecutionTime('npm run build');
  saveResults('1ファイル変更', 'webpack', webpackOneChangeTime);
  
  modifySingleFile();
  console.log('\n> wireit:');
  const wireitOneChangeTime = measureExecutionTime('npm run build:wireit');
  saveResults('1ファイル変更', 'wireit', wireitOneChangeTime);
  
  // 結果の概要を表示
  console.log('\n=== テスト結果の概要 ===');
  console.log('結果はperformance-results/benchmark-results.csvに保存されました\n');
  
  console.log('初回ビルド:');
  console.log(`- webpack: ${webpackInitialTime.toFixed(2)}秒`);
  console.log(`- wireit: ${wireitInitialTime.toFixed(2)}秒`);
  console.log(`- 差分: ${(wireitInitialTime - webpackInitialTime).toFixed(2)}秒`);
  
  console.log('\n変更なし再ビルド:');
  console.log(`- webpack: ${webpackNoChangeTime.toFixed(2)}秒`);
  console.log(`- wireit: ${wireitNoChangeTime.toFixed(2)}秒`);
  console.log(`- 差分: ${(wireitNoChangeTime - webpackNoChangeTime).toFixed(2)}秒`);
  console.log(`- 高速化率: ${(webpackNoChangeTime / wireitNoChangeTime).toFixed(2)}倍`);
  
  console.log('\n1ファイル変更後のビルド:');
  console.log(`- webpack: ${webpackOneChangeTime.toFixed(2)}秒`);
  console.log(`- wireit: ${wireitOneChangeTime.toFixed(2)}秒`);
  console.log(`- 差分: ${(webpackOneChangeTime - wireitOneChangeTime).toFixed(2)}秒`);
  console.log(`- 高速化率: ${(webpackOneChangeTime / wireitOneChangeTime).toFixed(2)}倍`);
}

// テストを実行
runTests().catch(error => {
  console.error('テスト実行中にエラーが発生しました:', error);
  process.exit(1);
});
