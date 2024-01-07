import './globals.css'

export const metadata = {
  title: 'Antoine Cahurel',
  description: 'Antoine Cahurel, Composer, Sound Designer, musician for video games and more.',
  keywords: 'Antoine Cahurel, composer, sound designer, sound design, video games, video games composer, video games sound designer, video games sound design, musician, video games musician'
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}