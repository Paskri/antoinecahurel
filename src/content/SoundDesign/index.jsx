'use client'
import './sounddesign.css'
import VideoCarousel from '../../components/VideoCarousel'
import { useEffect, useRef } from 'react'
import Softwares from '../../components/Softwares'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function SoundDesign() {
  // window fadein
  const musicContainer = useRef(null)
  useEffect(() => {
    setTimeout(() => {
      if (musicContainer.current) {
        const container = musicContainer.current
        container.style = 'transition: opacity 2s;'
        setTimeout(() => {
          container.style = 'transition: opacity 2s; opacity: 1;'
        }, 1000)
      }
    }, 500)
  }, [musicContainer])

  useEffect(() => {
    //updating player container height
    const mpc = document.querySelector('.music-player-container')
    if (mpc) {
      mpc.style.minHeight = '536px'
    }
  }, [])

  //getting page datas
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const { data, error } = useSWR(`${apiUrl}/wp-json/wp/v2/pages/119`, fetcher)
  if (!data) return <></>
  //preparing values
  const musicFields = Object.entries(data.acf_data)
    .filter(([key, value]) => key.startsWith('music_') && value !== false)
    .reduce((result, [key, value]) => {
      result[key] = value
      return result
    }, {})

  //preparing values
  const softwareFields = Object.entries(data.acf_data)
    .filter(([key, value]) => key.startsWith('software_') && value !== false)
    .reduce((result, [key, value]) => {
      result[key] = value
      return result
    }, {})
  return (
    <>
      <div
        id="SoundDesign"
        className="sounddesign-container"
        ref={musicContainer}
      >
        <Softwares softwares={softwareFields} />
        <VideoCarousel data={data} from={'sounddesign'} />
      </div>
    </>
  )
}
