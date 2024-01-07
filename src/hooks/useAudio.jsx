'use client'
import { createContext, useContext, useReducer, useRef, useEffect } from 'react'

// Contexte pour le state
const AudioStateContext = createContext()

// Contexte pour la fonction de dispatch
const AudioDispatchContext = createContext()

// Actions possibles pour le reducer
const audioActions = {
  PLAY: 'PLAY',
  PAUSE: 'PAUSE',
  SET_PLAYLIST: 'SET_PLAYLIST',
  CLEAR_PLAYLIST: 'CLEAR_PLAYLIST',
  NEXT_TRACK: 'NEXT_TRACK',
  PREVIOUS_TRACK: 'PREVIOUS_TRACK',
  SEEK_TO: 'SEEK_TO',
  SET_CURRENT_TRACK: 'SET_CURRENT_TRACK',
}

// Reducer pour gérer les actions
function audioReducer(state, action) {
  switch (action.type) {
    case audioActions.PLAY:
      if (state.audioRef.current) {
        state.audioRef.current.play()
      }
      return { ...state, isPlaying: true }

    case audioActions.PAUSE:
      if (state.audioRef.current) {
        state.audioRef.current.pause()
      }
      return { ...state, isPlaying: false }
    case audioActions.SET_PLAYLIST:
      const newPlaylist = action.payload
      const newSrc = newPlaylist[0]?.url || ''

      return {
        ...state,
        playlist: action.payload,
        isPlaying: false,
        currentTrackIndex: 0,
        currentTrackTitle: action.payload[0].title,
      }
    case audioActions.CLEAR_PLAYLIST:
      return { ...state, playlist: [], currentTrackIndex: 0 }
    case audioActions.NEXT_TRACK:
      state.audioRef.current.currentTime = 0

      const nextTrackIndex =
        (state.currentTrackIndex + 1) % state.playlist.length
      const nextTrackTitle = state.playlist[nextTrackIndex].title

      return {
        ...state,
        currentTrackIndex: nextTrackIndex,
        currentTrackTitle: nextTrackTitle,
      }

    case audioActions.PREVIOUS_TRACK:
      state.audioRef.current.currentTime = 0

      const prevTrackIndex =
        (state.currentTrackIndex - 1 + state.playlist.length) %
        state.playlist.length
      const prevTrackTitle = state.playlist[prevTrackIndex].title

      return {
        ...state,
        currentTrackIndex: prevTrackIndex,
        currentTrackTitle: prevTrackTitle,
      }

    case audioActions.SEEK_TO:
      if (state.audioRef.current) {
        state.audioRef.current.currentTime = action.payload
      }
      return { ...state }
    case audioActions.SET_CURRENT_TRACK:
      return {
        ...state,
        currentTrackIndex: action.payload,
        currentTrackTitle: state.playlist[action.payload]?.title || '',
      }
    default:
      throw new Error('Unknown action: ' + action.type)
  }
}

// Composant AudioProvider
export function AudioProvider({ children }) {
  const [audioState, dispatch] = useReducer(audioReducer, {
    isPlaying: false,
    playlist: [],
    currentTrackIndex: 0,
    audioRef: useRef(),
    currentTrackTitle: '',
  })

  useEffect(() => {
    const initialAudioUrl = audioState.playlist[0]?.url
    if (initialAudioUrl) {
      audioState.audioRef.current = new Audio()

      audioState.audioRef.current.addEventListener('timeupdate', () => {
        //dispatch({
        //  type: audioActions.SET_CURRENT_TRACK,
        //  payload: { index: audioState.currentTrackIndex },
        //})
      })

      audioState.audioRef.current.addEventListener('ended', () => {
        if (audioState.currentTrackIndex < audioState.playlist.length - 1) {
          //console.log('Next title')
          dispatch({ type: 'PAUSE' })
          dispatch({ type: audioActions.NEXT_TRACK })
          setTimeout(() => {
            dispatch({ type: 'PLAY' })
          }, 200)
        } else {
          //console.log('end of playlist --> pause')
          dispatch({ type: 'PAUSE' })
          dispatch({ type: audioActions.NEXT_TRACK })
        }
      })

      return () => {
        audioState.audioRef.current.removeEventListener('timeupdate', () => {})
        audioState.audioRef.current.removeEventListener('ended', () => {})
      }
    }
  }, [
    audioState.currentTrackIndex,
    audioState.audioRef,
    audioState.playlist.length,
    audioState.playlist,
  ])

  useEffect(() => {
    if (
      audioState.audioRef.current &&
      audioState.playlist[audioState.currentTrackIndex]?.url
    ) {
      audioState.audioRef.current.src =
        audioState.playlist[audioState.currentTrackIndex]?.url
    }
  }, [audioState.playlist, audioState.currentTrackIndex, audioState.audioRef])

  //const stateValue = { ...audioState, audioRef: undefined } // On supprime la référence à l'audioRef pour éviter les problèmes de sérialisation dans le contexte.

  return (
    <AudioStateContext.Provider value={audioState}>
      <AudioDispatchContext.Provider value={dispatch}>
        {children}
      </AudioDispatchContext.Provider>
    </AudioStateContext.Provider>
  )
}

// Hook useAudioState
export function useAudioState(where) {
  const context = useContext(AudioStateContext)

  if (!context) {
    throw new Error('useAudioState must be used within an AudioProvider')
  }
  //console.log(`audioState loaded in ${where}`)
  return context
}

// Hook useAudioDispatch
export function useAudioDispatch() {
  const context = useContext(AudioDispatchContext)
  if (!context) {
    throw new Error('useAudioDispatch must be used within an AudioProvider')
  }
  return context
}
