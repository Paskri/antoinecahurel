'use client'
import './techreel.css'
import underConstruction from '../../assets/images/Under_Construction.jpg'
import Image from 'next/image'
import VideoCarousel from '../../components/VideoCarousel'
import { useEffect, useRef } from 'react'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function TechReel() {
  // window fadein
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

  // updating player container height
  useEffect(() => {
    const mpc = document.querySelector('.music-player-container')
    if (mpc) {
      mpc.style.minHeight = '536px'
    }
  }, [])

  // getting page datas
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const { data, error } = useSWR(`${apiUrl}/wp-json/wp/v2/pages/121`, fetcher)
  if (!data) return <></>

  //preparing values
  const musicFields = Object.entries(data.acf_data)
    .filter(([key, value]) => key.startsWith('music_') && value !== false)
    .reduce((result, [key, value]) => {
      result[key] = value
      return result
    }, {})

  return (
    <>
      <div id="TechReel" className="music-container" ref={musicContainer}>
        {Object.values(musicFields).length > 0 &&
        Object.values(data).length > 0 ? (
          <>
            <VideoCarousel data={data} from={'techreel'} />
          </>
        ) : (
          <div className="construction-container">
            <Image
              src={underConstruction.src}
              width={underConstruction.width}
              height={underConstruction.height}
              alt="Under construction"
            />
          </div>
        )}
      </div>
    </>
  )
}
