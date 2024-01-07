'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import YouTube from 'react-youtube'

export default function VideoProject(props) {
  const { video, index, active, videoWidth, videoHeight } = props
  const [play, setPlay] = useState(false)
  const [player, setPlayer] = useState(false)
  const playerRef = useRef(null)

  useEffect(() => {
    const videoInner = document.querySelector(`.video-inner-${index}`)
    const poster = document.querySelector(`.video-poster-${index}`)

    const handlePosterClick = () => {
      setPlay(true)
    }

    videoInner.addEventListener('click', handlePosterClick)
    return () => {
      videoInner.removeEventListener('click', handlePosterClick)
      // Cleanup: Stop and destroy the player when the component unmounts or becomes inactive
    }
  }, [index, video.code, play, active, player])

  useEffect(() => {
    const handleMpcClick = () => {
      setPlay(false)
      if (playerRef.current && playerRef.current.g) {
        playerRef.current.stopVideo()
        playerRef.current.unloadModule()
      }
    }
    //handling launching songs in audio player
    const mpc = document.querySelector('.music-player-container')
    mpc.addEventListener('click', handleMpcClick)
    const pc = document.querySelector('.player-container')
    pc.addEventListener('click', handleMpcClick)

    if (active !== index) {
      setPlay(false)
      if (playerRef.current && playerRef.current.g) {
        playerRef.current.stopVideo()
      }
    }
    return () => {
      mpc.removeEventListener('click', handleMpcClick)
    }
  }, [active, index, playerRef, play])

  function onPlayerReady(event) {
    event.target.setVolume(80)
    event.target.playVideo()
    setPlayer(event.target)
  }
  return (
    <>
      {video ? (
        <div className={`video-inner-${index}`}>
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
            <Image
              className={`video-poster-${index}`}
              src={video.poster}
              width={videoWidth ? videoWidth : 768}
              height={videoHeight ? videoHeight : 432}
              alt={`Youtube Vidéo - ${index}`}
            />
          )}
        </div>
      ) : (
        ''
      )}
    </>
  )
}
