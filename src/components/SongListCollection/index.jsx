'use client'
//import './songlist.css'
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
    <div className="music-player-container" aria-label="Project playlist">
      <div className="mpc-background"></div>
      <div className="mpc-wrapper">
        <div className="mpc-inner" tabIndex="-1">
          {musicFields
            ? Object.values(customFields).map((music) => (
                <a
                  href="#"
                  className="music-field"
                  key={`Music - ${music.index}`}
                  data-url={music.url}
                  onClick={() => handleMusicClick(music.index)}
                  role="group"
                  aria-roledescription={`play ${music.title}`}
                  aria-label={`1 of ${music.index + 1}`}
                >
                  <Image
                    className="project-arrow"
                    src={arrow.src}
                    width={arrow.width}
                    height={arrow.width}
                    alt={`Play Music - ${music.index}`}
                  />
                  <p style={{ color: color }}>{music.title}</p>
                </a>
              ))
            : ''}
        </div>
      </div>
    </div>
  )
}
