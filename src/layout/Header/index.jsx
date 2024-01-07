import './header.css'
import Player from '../../components/Player'
import Nav from '../../components/Nav'
import BannerSlider from '../../components/BannerSlider'
import Loader from '../../components/Loader'

export default async function Header() {
  //server component fetch
  //let error = false
  //let loading = true
  //let data = []
  //try {
  //  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  //  const response = await fetch(`${apiUrl}/wp-json/wp/v2/banner/133`)
  //  if (!response.ok) {
  //    throw new Error('Network response was not ok')
  //  }
  //  data = await response.json()
  //  error = false
  //  loading = false
  //} catch (err) {
  //  error = err
  //  loading = false
  //}

  //let banners = data.acf_data
  //let error2 = false
  //let loading2 = false
  //let defaultPlaylist = []

  //try {
  //  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  //  const response = await fetch(`${apiUrl}/wp-json/wp/v2/default_playlist/64`)
  //  if (!response.ok) {
  //    throw new Error('Network response was not ok')
  //  }
  //  defaultPlaylist = await response.json()
  //  error2 = false
  //  loading2 = false
  //} catch (err) {
  //  error2 = err
  //  loading2 = false
  //}

  return (
    <header>
      <section className="banner-container">
        <BannerSlider />
        <div className="top-bar-container">
          <div className="top-bar">
            <h1>Antoine Cahurel</h1>
            <Player />
          </div>
        </div>
        <Nav />
      </section>
    </header>
  )
}
