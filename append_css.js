const fs = require('fs');

const cssContent = `
/* === LP予約ページ用デザイン実装ガイド追加分 === */
:root {
  --color-primary-orange: #FFB88C;
  --color-primary-green: #A8D5BA;
  --color-primary-blue: #A3C9E2;
  --color-text-primary: #8B6F47;
  --color-background-secondary: #F5EFE6;
  --color-gray-dark: #4A4A4A;
  --color-gray-light: #E8E8E8;
  --font-family-primary: 'Yu Gothic', '游ゴシック', 'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ ProN W3', 'Noto Sans JP', sans-serif;
}

/* ボタンスタイル上書き */
.btn-primary {
  background-color: var(--color-primary-orange);
  color: var(--color-white);
  font-family: var(--font-family-primary);
  border-radius: var(--radius-md);
  transition: all 300ms ease;
}
.btn-primary:hover:not(:disabled) {
  background-color: #E6A67D;
  box-shadow: 0 6px 16px rgba(255, 184, 140, 0.3);
  transform: translateY(-2px);
}
.btn-ghost {
  background: var(--color-white);
  color: var(--color-primary-orange);
  border: 2px solid var(--color-primary-orange);
  font-family: var(--font-family-primary);
  border-radius: var(--radius-md);
  transition: all 300ms ease;
}
.btn-ghost:hover:not(:disabled) {
  background-color: var(--color-primary-orange);
  color: var(--color-white);
}

/* ステップインジケーター */
.step.active .step-circle {
  background-color: var(--color-primary-orange);
  color: var(--color-white);
  border-color: var(--color-primary-orange);
}
.step.done .step-circle {
  background-color: var(--color-primary-green);
  color: var(--color-white);
  border-color: var(--color-primary-green);
}
.step-label {
  color: var(--color-text-primary);
  font-family: var(--font-family-primary);
}

/* カレンダー */
.calendar {
  background: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
}
.calendar-day.selected {
  background-color: var(--color-primary-orange);
  color: var(--color-white);
}
.calendar-day:hover:not(:disabled) {
  background-color: var(--color-background-secondary);
}
.calendar-day:disabled {
  color: var(--color-gray-light);
  cursor: not-allowed;
}

/* アラート */
.alert-error {
  background-color: rgba(232, 140, 140, 0.1);
  border-left: 4px solid #E88C8C;
  color: var(--color-text-primary);
  font-family: var(--font-family-primary);
}

/* カード */
.card {
  background: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius-lg);
}
.card-body {
  padding: var(--spacing-6);
}
`;

fs.appendFileSync('app/globals.css', cssContent, 'utf8');
console.log('Appended CSS successfully in UTF-8.');
