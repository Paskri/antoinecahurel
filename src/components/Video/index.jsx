'use client'
import './video.css'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import YouTube from 'react-youtube'
import { useAudioDispatch } from '../../hooks/useAudio'

export default function Video(props) {
  const {
    video,
    index,
    active,
    videoWidth,
    videoHeight,
    from,
    albumIndex,
    ariaActive,
    projectVideo,
  } = props
  const [play, setPlay] = useState(false)
  const [player, setPlayer] = useState(false)
  const playerRef = useRef(null)
  const audioDispatch = useAudioDispatch()
  const innerRef = useRef(null)

  const handlePosterClick = (e) => {
    e.preventDefault()
    setPlay(true)
    audioDispatch({ type: 'PAUSE' })
  }

  //handling stopping Video when lauching song
  useEffect(() => {
    const handleMpcClick = () => {
      setPlay(false)
      if (playerRef.current && playerRef.current.g) {
        playerRef.current.stopVideo()
        playerRef.current.unloadModule()
      }
    }
    //music in songlists for projects
    const project = document.querySelector(`#Project-${albumIndex}`)
    let mpc = ''
    if (project) {
      mpc = project.querySelector('.music-player-container')

      if (mpc) {
        mpc.addEventListener('click', handleMpcClick)
      }
    }

    //for page music
    if (innerRef.current) {
      const parentElement =
        innerRef.current.parentNode.parentNode.parentNode.parentNode
      if (parentElement && parentElement.id === 'Music') {
        let mpc2 = parentElement.querySelector('.music-player-container')
        if (mpc2) {
          mpc2.addEventListener('click', handleMpcClick)
        }
      }
    }

    //music in player
    const playBtn = document.querySelector('.play')
    if (playBtn) {
      playBtn.addEventListener('click', handleMpcClick)
    }

    //menu items
    const bnc = document.querySelector('.bottom-nav-container')
    if (bnc) {
      bnc.addEventListener('click', handleMpcClick)
    }
    if (active !== index) {
      setPlay(false)
      if (playerRef.current && playerRef.current.g) {
        playerRef.current.stopVideo()
      }
    }
    return () => {
      if (mpc) {
        mpc.removeEventListener('click', handleMpcClick)
      }
      const playBtn = document.querySelector('.play')
      if (playBtn) {
        playBtn.removeEventListener('click', handleMpcClick)
      }
      if (bnc) {
        bnc.removeEventListener('click', handleMpcClick)
      }
      const mpc2 = document.querySelector('#Music .music-player-container')
      if (mpc2) {
        mpc2.removeEventListener('click', handleMpcClick)
      }
    }
  }, [active, index, playerRef, play, albumIndex])

  function onPlayerReady(event) {
    event.target.setVolume(80)
    event.target.playVideo()
    setPlayer(event.target)
  }

  return (
    <>
      {video ? (
        <div
          className={`${from}-video-inner-${index} ${
            projectVideo
              ? 'project-video-inner-container'
              : 'video-inner-container'
          }`}
          ref={innerRef}
        >
          <div className={`player-${index}`}></div>
          {play && active === index ? (
            <YouTube
              videoId={video.code}
              opts={{
                height: videoHeight,
                width: videoWidth,
              }}
              onReady={(e) => {
                onPlayerReady(e)
                playerRef.current = e.target
              }}
            />
          ) : (
            <>
              {video && video.poster ? (
                <a
                  className="video-link"
                  href="#"
                  onClick={(e) => handlePosterClick(e)}
                  tabIndex={ariaActive ? '0' : '-1'}
                >
                  <Image
                    className={`${from}-video-poster-${index}`}
                    src={video.poster}
                    width={videoWidth ? videoWidth : 768}
                    height={videoHeight ? videoHeight : 432}
                    alt={`Youtube Vidéo - ${index}`}
                  />
                </a>
              ) : (
                ''
              )}
            </>
          )}
        </div>
      ) : (
        ''
      )}
    </>
  )
}
