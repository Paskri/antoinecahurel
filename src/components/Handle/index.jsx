import { useAudioDispatch } from '../../hooks/useAudio'
import { useState, useEffect } from 'react'
export default function Handle({ musicFields, albumIndex }) {
  const [playlistLoaded, setPlaylistLoaded] = useState(false)
  const audioDispatch = useAudioDispatch()

  useEffect(() => {
    const handleTitleClick = () => {
      audioDispatch({ type: 'PAUSE' })
      if (musicFields) {
        // charger playlist
        if (!playlistLoaded) {
          audioDispatch({
            type: 'SET_PLAYLIST',
            payload: Object.values(musicFields),
          })
          setPlaylistLoaded(true)
        }
      }
    }
    setTimeout(() => {
      const project = document.querySelector(`#Project-${albumIndex}`)
      if (project) {
        const titles = project.querySelectorAll('.music-field')
        if (titles) {
          titles.forEach((title) => {
            title.addEventListener('click', handleTitleClick)
          })
        }
      }
    }, 1000)
    return () => {
      const project = document.querySelector(`#Project-${albumIndex}`)
      if (project) {
        const titles = project.querySelectorAll('.music-field')
        if (titles) {
          titles.forEach((title) => {
            title.removeEventListener('click', handleTitleClick)
          })
        }
      }
    }
  }, [musicFields, albumIndex, playlistLoaded, audioDispatch])

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
}
