'use client'
import { useEffect, useState } from 'react'
import { useAudioDispatch } from '../../hooks/useAudio'
import Banner from '../../classes/Banner'

export default function MenuItems({ items }) {
  const [datas, setDatas] = useState(null)
  const [load, setLoad] = useState(false)
  const [error, setError] = useState(false)
  const [dpDatas, setDpDatas] = useState(null)
  const [dpLoad, setDpLoad] = useState(false)
  const [dpLoaded, setDpLoaded] = useState(false)
  const [dpError, setDpError] = useState(false)
  const [pageId, setPageId] = useState(0)
  const audioDispatch = useAudioDispatch()

  const titleArray = [
    'Home',
    'About',
    'Music',
    'SoundDesign',
    'TechReel',
    'Contact',
  ]

  //handling menu btn clicks
  const handleClick = (title, item) => {
    //updating banners width class Banner with array
    const defaultBanners = document.querySelectorAll('.default-banners img')
    const currentBanners = document.querySelectorAll('.banners-wrapper img')
    //console.log('Comparing', defaultBanners, currentBanners)
    if (defaultBanners !== currentBanners) {
      const BannerUpdate = new Banner(null, defaultBanners)
      BannerUpdate.updateBannersWithArray()
    }

    //hidding potential contents
    titleArray.forEach((t) => {
      const titleDiv = document.querySelector(`#${t}`)
      if (titleDiv) {
        titleDiv.style.display = 'none'
      }
    })
    // Hidding projects
    const projects = document.querySelectorAll('[id^="Project-"]')
    //console.log('Projects : ', projects)
    projects.forEach((projet) => {
      projet.style = ''
    })

    //page fadein
    const newTitle = title.replace(' ', '')
    const titleDiv = document.querySelector(`#${newTitle}`)
    if (titleDiv) {
      titleDiv.style = 'display: flex; transition: opacity 2s;'
      setTimeout(() => {
        titleDiv.style = 'display: flex; transition: opacity 2s; opacity: 1;'
      }, 200)
    }

    //carousel fadein
    if (title === 'Home') {
      const carousel = document.querySelector('.carousel-container')
      //console.log(carousel)
      carousel.style = 'display: flex; transition: opacity 2s;'
      setTimeout(() => {
        carousel.style = 'display: flex; transition: opacity 2s; opacity: 1;'
      }, 200)
    }

    // loading playlists
    if (
      title === 'Music' ||
      title === 'Sound Design' ||
      title === 'Tech Reel'
    ) {
      const pid = parseInt(item.object_id)
      //setLoad(true)
      setPageId(pid)
    } else if (title === 'Home') {
      //setDpLoad(true)
    }
  }

  //getting default playlist datas
  useEffect(() => {
    const fetchDpDatas = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const response = await fetch(
          `${apiUrl}/wp-json/wp/v2/default_playlist/64`
        )
        if (!response.ok) {
          throw new Error(`Erreur HTTP! Statut : ${response.status}`)
        }
        const jsonData = await response.json()
        setDpDatas(jsonData)
        setDpLoad(false)
        setDpLoaded(true)
      } catch (error) {
        setDpError(error)
      }
    }
    if (dpLoad && !dpLoaded) {
      fetchDpDatas()
    }
  }, [dpLoad, dpLoaded])

  //updating default playlist
  useEffect(() => {
    if (dpDatas) {
      //preparing playlist values
      const musicFields = Object.entries(dpDatas.acf_data)
        .filter(([key, value]) => key.startsWith('titre_') && value !== false)
        .reduce((result, [key, value]) => {
          result[key] = value
          return result
        }, {})
      const mf = Object.values(musicFields)
      if (mf && mf.length > 0) {
        audioDispatch({ type: 'PAUSE' })
        audioDispatch({
          type: 'SET_PLAYLIST',
          payload: mf,
        })
      }
    }
    setDpDatas(null)
  }, [dpDatas, audioDispatch])

  return (
    <>
      <ul className="bottom-nav">
        {items
          ? items.map((item) => (
              <li
                className="nav-item"
                key={item.slug}
                data-slug={item.slug}
                onClick={() => handleClick(item.title, item)}
              >
                {item.title}
              </li>
            ))
          : ''}
      </ul>
    </>
  )
}
/* testing tools

{load ? ' | Load : true' : ' | Load : false'} {pageId}
        {datas ? ' | datas : ' + datas.length : ' | No datas'}
        {dpLoad ? ' | dpLoad : true' : ' | dpLoad : false'} {pageId}
        {dpDatas ? ' | dpDatas : ' + dpDatas.length : ' | No dpDatas'}
*/
