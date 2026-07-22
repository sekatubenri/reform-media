import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  metadataBase: new URL('https://reformselect.com'),
  title: { default: 'リフォームナビ | 費用・業者比較・事例', template: '%s | リフォームナビ' },
  description: 'キッチン・浴室・外壁などリフォームの費用相場・業者選び・事例を詳しく解説。失敗しないリフォームガイド。',
  verification: { google: 'XcyMImXtiMlMj5NBeiKQBcD_Vqrw3EDW0TDFBVTAtaA' },
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50 text-gray-800">
        <header className="bg-orange-600 text-white shadow">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-tight">🏠 リフォームナビ</a>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <a href="/category/kitchen" className="hover:text-orange-200">キッチン</a>
              <a href="/category/bathroom" className="hover:text-orange-200">浴室・トイレ</a>
              <a href="/category/exterior" className="hover:text-orange-200">外装・屋根</a>
              <a href="/category/beginner" className="hover:text-orange-200">リフォーム入門</a>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <footer className="bg-gray-800 text-gray-400 text-sm mt-16">
          <div className="max-w-5xl mx-auto px-4 py-8 text-center">
            <p>© 2025 リフォームナビ | 費用・業者比較・事例</p>
            <p className="mt-1 text-xs">※本サイトにはアフィリエイト広告が含まれます</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
