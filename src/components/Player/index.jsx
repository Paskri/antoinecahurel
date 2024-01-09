// player.jsx
'use client'
import './player.css'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useAudioState, useAudioDispatch } from '../../hooks/useAudio'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Player() {
  const [progress, setProgress] = useState(0)
  const seekRef = useRef(null)
  const audioPlayerRef = useRef(null)
  const audioState = useAudioState('Player')
  const audioDispatch = useAudioDispatch()

  //Default playlist loading
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const { data: defaultPlaylist, error } = useSWR(
    `${apiUrl}/wp-json/wp/v2/default_playlist/64`,
    fetcher
  )

  //handling default playlist datas
  useEffect(() => {
    if (defaultPlaylist && !audioState.playlist.length > 0) {
      let musicFields = Object.entries(defaultPlaylist.acf_data)
        .filter(([key, value]) => key.startsWith('titre_') && value !== false)
        .reduce((result, [key, value]) => {
          result[key] = value
          return result
        }, {})

      if (audioState.playlist.length === 0 && musicFields) {
        audioDispatch({
          type: 'SET_PLAYLIST',
          payload: Object.values(musicFields),
        })
      }
    }
  }, [defaultPlaylist, audioDispatch, audioState.playlist.length])

  //play / pause
  const handlePlayPause = (e) => {
    if (audioState.isPlaying) {
      audioDispatch({ type: 'PAUSE' })
    } else {
      audioDispatch({ type: 'PLAY' })
    }
  }

  //next & previous
  const handleNextTrack = () => {
    audioDispatch({ type: 'PAUSE' })
    audioDispatch({ type: 'NEXT_TRACK' })
    if (audioState.isPlaying) {
      setTimeout(() => {
        audioDispatch({ type: 'PLAY' })
      }, 100)
    }
  }

  const handlePreviousTrack = () => {
    audioDispatch({ type: 'PAUSE' })
    audioDispatch({ type: 'PREVIOUS_TRACK' })
    if (audioState.isPlaying) {
      setTimeout(() => {
        audioDispatch({ type: 'PLAY' })
      }, 200)
    }
  }

  //seek and progress bars
  const updateTime = (clientX) => {
    const audioElement = audioState.audioRef.current
    const rect = seekRef.current.getBoundingClientRect()
    const offsetX = clientX - rect.left
    const seekPercentage = (offsetX / seekRef.current.offsetWidth) * 100
    const seekTime =
      (audioState.audioRef.current.duration / 100) * seekPercentage
    audioElement.currentTime = seekTime
    audioDispatch({ type: 'SEEK_TO', payload: seekTime })
    updateProgressClick()
  }
  const handleSeek = (e) => {
    updateTime(e.clientX)
  }

  const handleProgressClick = (e) => {
    updateTime(e.clientX)
  }

  //Handling progress bar when clicking
  const updateProgressClick = () => {
    const progress = parseFloat(
      (audioState.audioRef.current.currentTime /
        audioState.audioRef.current.duration) *
        100
    )
    setProgress(progress)
  }

  // progress bar Keyboard controls
  const onKeyDown = (e) => {
    const audio = audioState.audioRef.current
    const isLeft = 37
    const isRight = 39
    const isTop = 38
    const isBottom = 40
    const isHome = 36
    const isEnd = 35
    const keyList = [isLeft, isRight, isTop, isBottom, isHome, isEnd]
    if (keyList.indexOf(e.keyCode) >= 0) {
      e.preventDefault()
    }

    if (keyList.indexOf(e.keyCode) >= 0) {
      let percentage =
        (audioState.audioRef.current.currentTime /
          audioState.audioRef.current.duration) *
        100
      switch (e.keyCode) {
        case isLeft:
          percentage = parseFloat(percentage) - 1
          break
        case isRight:
          percentage = parseFloat(percentage) + 1
          break
        case isTop:
          percentage = parseFloat(percentage) + 10
          break
        case isBottom:
          percentage = parseFloat(percentage) - 10
          break
        case isHome:
          percentage = 0
          break
        case isEnd:
          percentage = 99.9 // 100 would trigger onEnd, so only 99.9
          break
        default:
          break
      }

      // add boundary for percentage, cannot be bigger than 100 or smaller than zero
      if (percentage > 100) {
        percentage = 100
      } else if (percentage < 0) {
        percentage = 0
      }

      audio.currentTime = audio.duration * (percentage / 100)
    }
  }

  //Handling progress bar
  const updateProgress = useCallback(() => {
    const progress = parseFloat(
      (audioState.audioRef.current.currentTime /
        audioState.audioRef.current.duration) *
        100
    )
    setProgress(progress)
  }, [audioState.audioRef])

  useEffect(() => {
    const audioElement = audioState.audioRef.current
    const isPlaying = audioState.isPlaying

    const handleTimeUpdate = () => {
      if (audioState.audioRef.current) {
        if (!audioState.audioRef.current.currentTime) {
          setProgress(0)
        } else {
          updateProgress()
        }
      }
    }

    if (audioElement) {
      audioElement.addEventListener('timeupdate', handleTimeUpdate)

      if (isPlaying) {
        audioElement.play()
      }
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('timeupdate', handleTimeUpdate)
      }
    }
  }, [audioState.audioRef, audioState.isPlaying, updateProgress])

  //playlist loading error/loading handling
  if (error)
    return (
      <>
        {' '}
        <section className="player-container">Network error </section>
      </>
    )
  if (!defaultPlaylist) return <></>

  return (
    <section className="player-container">
      <div
        className="player-controls-container"
        aria-label="Audio Player"
        role="region"
      >
        <div className="player-controls">
          <button
            className="previous"
            onClick={handlePreviousTrack}
            aria-controls="audioPlayer"
            aria-label="Previous track"
          />
          <button
            className={audioState.isPlaying ? 'pause' : 'play'}
            onClick={handlePlayPause}
            aria-controls="audioPlayer"
            aria-label={audioState.isPlaying ? 'pause' : 'play'}
          />
          <button
            className="next"
            onClick={handleNextTrack}
            aria-controls="audioPlayer"
            aria-label="Next track"
          />
        </div>
        <div className="seek" onClick={handleSeek} ref={seekRef}>
          <progress
            className="progress"
            value={`${progress}%`}
            max="100"
            style={{
              width: `${progress}%`,
            }}
            onClick={handleProgressClick}
            onKeyDown={(e) => onKeyDown(e)}
            tabIndex="0"
            aria-valuetext="seek audio bar"
            aria-valuemax="100"
            aria-valuemin="0"
            aria-valuenow={Math.round(progress)}
            role="slider"
          ></progress>
        </div>
      </div>

      <audio
        id="audioPlayer"
        onEnded={() => {
          handleNextTrack()
        }}
        ref={audioPlayerRef}
      >
        Your browser does not support the audio element.
      </audio>

      <p className="player-title-display">{audioState.currentTrackTitle}</p>
    </section>
  )
}
/* testing tools
  <div style={{ backgroundColor: 'black', padding: '10px' }}>
        {'| currentTrackTitle : ' + audioState.currentTrackTitle + '  ' ||
          'Aucun titre en cours'}
        {'| track index : ' + audioState.currentTrackIndex + '  ' || 'no index'}
        {'| playlist length : ' + audioState.playlist.length + '  ' ||
          'no playlist'}
        {audioState.isPlaying ? '| isPlaying : true' : '| isPlaying : false'}
        {audioState.audioRef.current && audioState.audioRef.current.currentTime
          ? ' | CurrentTime : ' + audioState.audioRef.current.currentTime
          : ' | CurrentTime : ' + audioState.audioRef.current.currentTime}
        {audioState.audioRef.current && audioState.audioRef.current.duration
          ? ' | Duration : ' + audioState.audioRef.current.duration
          : ' | Duration : ' + audioState.audioRef.current.duration}
      </div>
*/
