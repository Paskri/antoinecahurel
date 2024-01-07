import MenuItems from '../MenuItems'
import Socials from '../Socials'
import './nav.css'

export default async function Nav() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  let error = false
  let loading = true
  let data = []

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const response = await fetch(`${apiUrl}/wp-json/menus/v1/menus/2`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    data = await response.json()
    error = false
    loading = false
  } catch (err) {
    error = err
    loading = false
  }

  return (
    <nav className="bottom-nav-container">
      {!loading ? <MenuItems items={data.items} /> : 'Loading...'}
      <Socials />
    </nav>
  )
}
