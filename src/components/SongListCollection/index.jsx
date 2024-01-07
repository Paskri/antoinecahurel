'use client'
import './songlist.css'
import arrow from '../../assets/images/title-arrow.webp'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useAudioDispatch } from '../../hooks/useAudio.jsx'

export default function SongListCollection({
  customFields,
  musicFields,
  background,
}) {
  const audioDispatch = useAudioDispatch()
  const [color, setColor] = useState('#ffffff')

  //player background handling
  useEffect(() => {
    const mpc = document.querySelector('.mpc-background')
    if (background) {
      mpc.style.backgroundImage = `url('${background}')`
    }
  }, [background, musicFields, customFields])

  const handleMusicClick = (index) => {
    audioDispatch({ type: 'PAUSE' })
    setTimeout(() => {
      audioDispatch({ type: 'SET_CURRENT_TRACK', payload: index })
      audioDispatch({ type: 'PAUSE' })
      setTimeout(() => {
        audioDispatch({ type: 'PLAY' })
      }, 200)
    }, 500)
  }

  return (
    <div className="music-player-container">
      <div className="mpc-background"></div>
      <div className="mpc-wrapper">
        <div className="mpc-inner">
          {musicFields
            ? Object.values(customFields).map((music) => (
                <div
                  className="music-field"
                  key={`Music - ${music.index}`}
                  data-url={music.url}
                  onClick={() => handleMusicClick(music.index)}
                >
                  <Image
                    className="project-arrow"
                    src={arrow.src}
                    width={arrow.width}
                    height={arrow.width}
                    alt={`Play Music - ${music.index}`}
                  />
                  <p style={{ color: color }}>{music.title}</p>
                </div>
              ))
            : ''}
        </div>
      </div>
    </div>
  )
}
