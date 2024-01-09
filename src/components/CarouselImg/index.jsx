'use client'
import Image from 'next/image'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import { useAudioDispatch } from '../../hooks/useAudio'
import Loader from '../Loader'
import Banner from '../../classes/Banner'

const fetcher2 = (...args) => fetch(...args).then((res) => res.json())

export default function CarouselImg({ album, featured, albumIndex, active }) {
  const audioDispatch = useAudioDispatch()
  const [load, setLoad] = useState(false)

  //handle img click
  const handleClick = (e, album, featured, index) => {
    e.preventDefault()
    //updating banners width class Banner
    const BannerUpdate = new Banner(album, null)
    BannerUpdate.updateBannersWithAlbum()

    // hidding other potential contents
    const home = document.querySelector('#Home')
    home.style = 'display: none;'
    const carousel = document.querySelector('.carousel-container')
    carousel.style = ''

    //project Fadein
    const project = document.querySelector(`#Project-${index}`)
    if (project) {
      project.style = 'display: flex; transition: opacity 2s;'
      setTimeout(() => {
        project.style = 'display: flex; transition: opacity 2s; opacity: 1;'
      }, 200)
    }
    setLoad(true)
  }

  // fetching featured img
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const { data, error } = useSWR(
    `${apiUrl}/wp-json/wp/v2/media/${featured}`,
    fetcher2
  )

  if (!data)
    return (
      <>
        <Loader />
      </>
    )

  function handleMouseOver(e) {
    // adding class 'dimmed'
    const items = document.querySelectorAll('.project-img')
    items.forEach((item) => {
      if (item !== e.target) {
        item.classList.add('dimmed')
      }
    })
  }

  function handleMouseOut(e) {
    // removing class
    const items = document.querySelectorAll('.project-img')
    items.forEach((item) => {
      if (item !== e.target) {
        item.classList.remove('dimmed')
      }
    })
  }

  return (
    <a
      className="project-link"
      tabIndex={active ? '0' : '-1'}
      href="#"
      onClick={(e) => handleClick(e, album, data.source_url, albumIndex)}
    >
      {data.source_url ? (
        <Image
          className="project-img"
          src={data.source_url}
          alt={album.title.rendered}
          width={270}
          height={270}
          onMouseOver={(e) => handleMouseOver(e)}
          onMouseOut={(e) => handleMouseOut(e)}
        />
      ) : (
        'Missing Image'
      )}
    </a>
  )
}
