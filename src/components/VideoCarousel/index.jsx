'use client'
import { useEffect, useState, useRef } from 'react'
import './videocarousel.css'
import Video from '../Video'

export default function VideoCarousel(props) {
  const { data, from } = props
  const [vIndex, setVIndex] = useState(0)
  const [videoWidth, setVideoWidth] = useState(null)
  const [videoHeight, setVideoHeight] = useState(null)
  const [step, setStep] = useState(null)
  const [margin, setMargin] = useState(null)
  const videoContainerRef = useRef(null)

  //generate video table width data
  const videoFields = Object.entries(data.acf_data)
    .filter(([key, value]) => key.startsWith('code_video_') && value !== '')
    .reduce((result, [key, value]) => {
      const videoNumber = key.replace('code_video_', '')
      const posterKey = `poster_${videoNumber}`
      const posterValue = data.acf_data[posterKey]
      result[`video${videoNumber}`] = {
        code: value,
        poster: posterValue,
      }
      return result
    }, {})
  //adding clones at start and beginning
  let videoFieldsArray = Object.values(videoFields)
  const nonEmptyArray = videoFieldsArray.filter((item) => item !== '')
  const firstTwoEntries = nonEmptyArray.slice(0, 2)
  const lastTwoEntries = nonEmptyArray.slice(-2)
  const newVideoFields = lastTwoEntries.concat(nonEmptyArray, firstTwoEntries)

  //run one time only
  useEffect(() => {
    const videoContainer = videoContainerRef.current
    const prev = videoContainer.previousElementSibling
    const next = videoContainer.nextElementSibling

    function handleResize() {
      const windowWidth = window.innerWidth
      let newVideoWidth, newVideoHeight, newMargin, newStep

      if (windowWidth < 700) {
        newVideoWidth = 256
        newVideoHeight = 144
        newMargin = 10
        newStep = 266
      } else if (windowWidth >= 785 && windowWidth < 1250) {
        newVideoWidth = 420
        newVideoHeight = 236
        newMargin = 10
        newStep = 430
      } else if (windowWidth >= 1250) {
        newVideoWidth = 768
        newVideoHeight = 432
        newMargin = 20
        newStep = 788
      }

      setVideoWidth(newVideoWidth)
      setVideoHeight(newVideoHeight)
      setMargin(newMargin)
      setStep(newStep)
    }

    let resizeTimer
    function handleResizeThrottled() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        handleResize()
      }, 100)
    }

    const handleCarouselClick = (value) => {
      videoContainer.style.transition = `1s`
      videoContainer.style.left = `${
        ((vIndex + value + 2) * step - videoWidth / 4) * -1
      }px`

      setTimeout(() => {
        videoContainer.style.transition = ``

        let nextIndex = 0
        if (vIndex + value < 0) {
          setVIndex(Object.values(videoFields).length - 1)
        } else if (vIndex + value === Object.values(videoFields).length) {
          setVIndex(0)
        } else {
          setVIndex(vIndex + value)
        }
      }, 1000)
    }

    const handlePrevClick = () => handleCarouselClick(-1)
    const handleNextClick = () => handleCarouselClick(1)

    prev.addEventListener('click', handlePrevClick)
    next.addEventListener('click', handleNextClick)

    // Initial setup
    handleResizeThrottled()
    videoContainer.style.left = `-${(vIndex + 2) * step - videoWidth / 4}px`

    window.addEventListener('resize', handleResizeThrottled)

    return () => {
      window.removeEventListener('resize', handleResizeThrottled)
      prev.removeEventListener('click', handlePrevClick)
      next.removeEventListener('click', handleNextClick)
    }
  }, [step, vIndex, videoWidth, videoFields])

  return (
    <>
      <div className="video-carousel">
        <div className="video-prev">
          <div className="vc-container">
            <span className="video-controls">&lsaquo;</span>
          </div>
        </div>
        <div className="videos-container" ref={videoContainerRef}>
          {newVideoFields
            ? Object.values(newVideoFields).map((video, index) => (
                <div key={`${from}-Video-${index}`} className="video">
                  <Video
                    video={video}
                    index={index}
                    active={vIndex + 2}
                    videoWidth={videoWidth}
                    videoHeight={videoHeight}
                    from={from}
                  />
                </div>
              ))
            : ''}
        </div>
        <div className="video-next">
          <div className="vc-container">
            <span className="video-controls">&rsaquo;</span>
          </div>
        </div>
      </div>
    </>
  )
}
