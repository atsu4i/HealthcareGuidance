# Synology NAS デプロイ手順書

## 前提条件

### Synology NAS要件
- DSM 7.0 以上
- Container Manager（Docker）がインストールされている
- 最低 2GB RAM推奨
- ネットワーク接続

### 必要な権限
- 管理者権限またはDocker実行権限

## デプロイ手順

### 方法1: Container Manager GUI使用

#### ステップ1: Container Managerの準備
1. Package CenterからContainer Managerをインストール
2. Container Managerを起動

#### ステップ2: プロジェクトファイルのアップロード
1. File Stationでアプリフォルダを作成（例: `/docker/gemini-assistant/`）
2. プロジェクトファイル一式をアップロード

#### ステップ3: Docker Composeでデプロイ
1. Container Manager > プロジェクト > 作成
2. プロジェクト名: `gemini-assistant`
3. パス: `/docker/gemini-assistant/`
4. ソース: `docker-compose.yml`を選択
5. ビルドして起動

### 方法2: SSH経由でのデプロイ

#### ステップ1: SSHでNASにアクセス
```bash
ssh admin@[NAS_IP_ADDRESS]
```

#### ステップ2: プロジェクトディレクトリ作成
```bash
sudo mkdir -p /volume1/docker/gemini-assistant
cd /volume1/docker/gemini-assistant
```

#### ステップ3: ファイル転送
ローカルからファイルを転送（Windows PowerShell）:
```powershell
scp -r C:\MyProject\gemini-personal-assistant\* admin@[NAS_IP]:\/volume1\/docker\/gemini-assistant\/
```

#### ステップ4: Docker Composeでビルド・実行
```bash
cd /volume1/docker/gemini-assistant
sudo docker-compose up -d --build
```

## アクセス確認

### 内部ネットワークアクセス
- URL: `http://[NAS_IP]:3001`
- 例: `http://192.168.1.100:3001`

### 外部アクセス設定（オプション）
1. Control Panel > 外部アクセス > ルーター設定
2. ポート3001を転送設定
3. DDNS設定（推奨）

## 管理コマンド

### ログ確認
```bash
sudo docker-compose logs -f
```

### 再起動
```bash
sudo docker-compose restart
```

### 停止
```bash
sudo docker-compose down
```

### アップデート
```bash
sudo docker-compose down
sudo docker-compose up -d --build
```

## トラブルシューティング

### よくある問題

#### ポート3001が使用中
```bash
# 他のコンテナを確認
sudo docker ps
# ポート変更（docker-compose.yml）
ports:
  - "3002:3000"  # 左側を変更
```

#### メモリ不足
- Container Managerでメモリ制限を確認
- 不要なコンテナを停止

#### API接続エラー
- Gemini APIキーが正しく設定されているか確認
- ネットワーク接続を確認

## セキュリティ考慮事項

### 内部ネットワークのみ使用（推奨）
- 外部ポート転送は行わない
- VPN経由でアクセス

### HTTPS化（上級者向け）
- Reverse Proxy（Nginx等）の使用
- SSL証明書の設定

## バックアップ

### 設定とデータ
```bash
# 設定バックアップ
sudo docker-compose exec gemini-assistant npm run export-data

# コンテナボリュームバックアップ
sudo cp -r /volume1/docker/gemini-assistant /volume1/backups/
```