'use client'
import Carousel from '../../components/Carousel'
import './home.css'
import useSWR from 'swr'
import { useEffect, useRef } from 'react'
import Loader from '../../components/Loader'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Home({}) {
  //fade in
  const musicContainer = useRef(null)
  useEffect(() => {
    setTimeout(() => {
      if (musicContainer.current) {
        const container = musicContainer.current
        container.style = 'transition: opacity 2s'
        setTimeout(() => {
          container.style = 'transition: opacity 2s; opacity: 1;'
        }, 1000)
      }
    }, 500)
  }, [musicContainer])

  // fetching album datas
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const { data, error } = useSWR(`${apiUrl}/wp-json/wp/v2/album`, fetcher)
  const { data: dplData, error: dplError } = useSWR(
    `${apiUrl}/wp-json/wp/v2/default_playlist/64`,
    fetcher
  )

  //if (error || dplError) return <div>Failed to load</div>
  if (!data || !dplData)
    return (
      <div>
        <Loader />
      </div>
    )

  //replacing fourth Letter for cloning/test purpose
  function replaceFourth(string, newletter) {
    if (string.length < 4) {
      return string
    }
    let characterString = string.split('')
    characterString[3] = newletter
    let newArray = characterString.join('')
    return newArray
  }
  let albums = []
  let initAlbums = []
  let collection = []
  if (data) {
    //cloning albums for testing purpose
    let previousAlbums = JSON.parse(JSON.stringify(data))
    previousAlbums.map((album) => {
      album.date = replaceFourth(album.date, '2')
    })
    initAlbums = JSON.parse(JSON.stringify(data))
    let nextAlbums = JSON.parse(JSON.stringify(data))
    nextAlbums.map((album) => {
      album.date = replaceFourth(album.date, '4')
    })
    albums = [...nextAlbums, ...initAlbums, ...previousAlbums]
    albums.map((album) => {
      album.date = new Date(album.date)
    })
    albums.sort((a, b) => b.date - a.date)
  }

  collection = initAlbums //JSON.parse(JSON.stringify(albums))

  return (
    <>
      <div id="Home" className="home-container" ref={musicContainer}>
        <Carousel collection={collection} />
      </div>
    </>
  )
}
