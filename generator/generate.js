const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const SITE = { name: 'リフォームナビ', url: 'https://reformselect.com' };
const AFFILIATE_TOP = `
<div style="background:#fff7ed;border:2px solid #ea580c;border-radius:8px;padding:16px;margin:24px 0;">
  <p style="font-weight:bold;color:#c2410c;margin:0 0 8px;">【PR】リフォーム無料一括見積もり</p>
  <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;">
    <li><a href="https://px.a8.net/svt/ejp?a8mat=REFORM_PLACEHOLDER_1" rel="nofollow" style="display:inline-block;background:#ea580c;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">▶ ホームプロ（無料一括見積もり）</a></li>
    <li><a href="https://px.a8.net/svt/ejp?a8mat=REFORM_PLACEHOLDER_2" rel="nofollow" style="display:inline-block;background:#c2410c;color:#fff;padding:8px 16px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px;">▶ リショップナビ（優良業者を厳選）</a></li>
  </ul>
</div>`;
const AFFILIATE_BOTTOM = `
<div style="background:#fffbeb;border:2px solid #d97706;border-radius:8px;padding:16px;margin:24px 0;">
  <p style="font-weight:bold;color:#92400e;margin:0 0 12px;">📚 リフォームの参考書</p>
  <ul style="list-style:none;padding:0;margin:0;">
    <li><a href="https://www.amazon.co.jp/s?k=%E3%83%AA%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A0&linkCode=ll2&tag=mirainikibouw-22" rel="nofollow" target="_blank" style="color:#1d4ed8;text-decoration:underline;">▶ リフォーム関連書籍【Amazon】</a></li>
    <li><a href="//ck.jp.ap.valuecommerce.com/servlet/referral?sid=3774934&pid=892653514" rel="nofollow" style="color:#ff0033;text-decoration:underline;">▶ リフォーム資材・DIY用品【Yahoo!ショッピング】</a><img src="//ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3774934&pid=892653514" height="1" width="1" border="0" alt=""></li>
  </ul>
</div>`;
async function generateArticle() {
  const topicsPath = path.join(__dirname, '..', 'unused-topics.json');
  const contentDir = path.join(__dirname, '..', 'content');
  fs.mkdirSync(contentDir, { recursive: true });
  const topics = JSON.parse(fs.readFileSync(topicsPath, 'utf-8').replace(/^﻿/, ''));
  const existingFiles = new Set(fs.readdirSync(contentDir));
  const topic = topics.find(t => !existingFiles.has(t.filename));
  if (!topic) { console.log('全トピック生成完了'); process.exit(0); }
  console.log(`生成中: ${topic.title}`);
  const today = new Date().toISOString().split('T')[0];
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001', max_tokens: 6000,
    messages: [{ role: 'user', content: `あなたはリフォームメディア「${SITE.name}」の専門ライターです。以下のJSON形式のみで出力してください:\n{"title":"タイトル(40〜60文字)","description":"説明(120文字以内)","category":"${topic.category}","date":"${today}","content":"HTMLコンテンツ"}\nトピック:${topic.title}\ncontent要件:1500文字程度のHTML、h2×3〜5個、ul/table活用、具体的な費用・業者選び含む、JSON全体を必ず完結させる` }],
  });
  const text = message.content[0].text.trim();
  console.log('レスポンス先頭200文字:', text.slice(0, 200));
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('レスポンスにJSONが見つかりません');
  const article = JSON.parse(jsonMatch[0]);
  article.content = article.content.includes('<h2') ? article.content.replace('<h2', AFFILIATE_TOP + '<h2') : AFFILIATE_TOP + article.content;
  article.content = article.content + AFFILIATE_BOTTOM;
  fs.writeFileSync(path.join(contentDir, topic.filename), JSON.stringify(article, null, 2));
  fs.writeFileSync(topicsPath, JSON.stringify(topics.filter(t => t.filename !== topic.filename), null, 2));
  console.log(`完了: ${topic.filename}`);
}
async function run() {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await generateArticle();
      break;
    } catch (err) {
      console.error(`試行${attempt}回目失敗: ${err.message}`);
      if (attempt === 3) {
        console.error('3回失敗。このトピックをスキップします。');
        process.exit(0);
      }
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}
run();
