'use client'
import './songlist.css'
import arrow from '../../assets/images/title-arrow.webp'
import Image from 'next/image'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useAudioDispatch, useAudioState } from '../../hooks/useAudio'

export default function SongList({ musicFields, background }) {
  const playerRef = useRef(null)
  const audioState = useAudioState()
  const audioDispatch = useAudioDispatch()
  const [color, setColor] = useState('#bbbbbb')
  const [playlistLoaded, setPlaylistLoaded] = useState(false)
  const mpcInnerRef = useRef(null)

  const handleMusicClick = (index) => {
    // loading playlist
    audioDispatch({ type: 'PAUSE' })
    if (!playlistLoaded) {
      audioDispatch({
        type: 'SET_PLAYLIST',
        payload: Object.values(musicFields),
      })
      setPlaylistLoaded(true)
    }

    setTimeout(() => {
      audioDispatch({ type: 'SET_CURRENT_TRACK', payload: index })
      setTimeout(() => {
        audioDispatch({ type: 'PLAY' })
      }, 200)
    }, 200)
  }

  useEffect(() => {
    const mpcInner = mpcInnerRef.current
    if (mpcInner && Object.values(musicFields).length > 9) {
      mpcInner.classList.add('scroll-bar')
    }
  }, [musicFields])

  // Set playlistLoaded to false if changing page via menuItems
  useEffect(() => {
    const handlePlayerClick = () => {
      setPlaylistLoaded(false)
    }
    const bnc = document.querySelector('.bottom-nav-container')
    if (bnc) {
      bnc.addEventListener('click', handlePlayerClick)
    }
    return () => {
      if (bnc) {
        bnc.removeEventListener('click', handlePlayerClick)
      }
    }
  })

  return (
    <>
      <div className="music-player-container" ref={playerRef}>
        <div
          className="mpc-background"
          style={{ backgroundImage: `url('${background}')` }}
        ></div>
        <div className="mpc-wrapper">
          <div className="mpc-inner" ref={mpcInnerRef}>
            {musicFields
              ? Object.values(musicFields).map((music, index) => (
                  <div
                    className="music-field"
                    key={`Music - ${index}`}
                    data-url={music.url}
                    onClick={() => handleMusicClick(index)}
                    data-playlist="Trouver la valeur pr connexion avec lecteur"
                  >
                    <Image
                      className="project-arrow"
                      src={arrow.src}
                      width={arrow.width}
                      height={arrow.width}
                      alt={`arrow-${index}`}
                      style={{
                        filter:
                          audioState.currentTrackTitle === music.title
                            ? 'brightness(200%)'
                            : 'brightness(100%)',
                      }}
                    />
                    <p
                      style={{
                        color:
                          audioState.currentTrackTitle === music.title
                            ? '#ffffff'
                            : color,
                      }}
                    >
                      {music.title}
                    </p>
                  </div>
                ))
              : ''}
          </div>
        </div>
      </div>
    </>
  )
}
