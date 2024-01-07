'use client'
import './carousel.css'
import CarouselImg from '../CarouselImg'
import { useEffect, useState, useRef } from 'react'

export default function Carousel({ collection, audioState }) {
  const [carIndex, setCarIndex] = useState(0)
  const [step, setStep] = useState(4)
  const [yearsForImages, setYearsForImages] = useState([])
  const [stepWidth, setStepWidth] = useState(0)

  // window fadein
  const carouselContainer = useRef(null)
  useEffect(() => {
    setTimeout(() => {
      if (carouselContainer.current) {
        const container = carouselContainer.current
        container.style = 'display: flex; transition: opacity 2s;'
        setTimeout(() => {
          container.style = 'display: flex; transition: opacity 2s; opacity: 1;'
        }, 1000)
      }
    }, 500)
  }, [carouselContainer])

  //calculating initial index width window-size
  //run only one time
  useEffect(() => {
    const windowWidth = window.innerWidth
    let initialIndex = 0
    if (windowWidth < 610) {
      setStep(1)
      setStepWidth(230)
    } else if (windowWidth >= 610 && windowWidth < 1000) {
      setStep(1)
      setStepWidth(390)
    } else if (windowWidth >= 1000 && windowWidth < 1390) {
      setStep(2)
      setStepWidth(390)
    } else if (windowWidth >= 1390 && windowWidth < 1780) {
      setStep(3)
      setStepWidth(390)
    } else if (windowWidth >= 1780) {
      setStep(4)
      setStepWidth(390)
    }
    setCarIndex(0)
  }, [collection.length])

  useEffect(() => {
    const projectsContainer = document.querySelector('.projects-container')
    const prev = document.querySelector('.carousel-prev')
    const next = document.querySelector('.carousel-next')

    //Window resizing
    function handleResize(prev, next) {
      const windowWidth = window.innerWidth
      if (windowWidth < 610) {
        if (carIndex > collection.length - 1) {
          setCarIndex(collection.length - 1)
        }
        setStep(1)
        setStepWidth(230)
      } else if (windowWidth >= 610 && windowWidth < 1000) {
        setStep(1)
        setStepWidth(390)
        if (carIndex > collection.length - 1) {
          setCarIndex(collection.length - 1)
        }
      } else if (windowWidth >= 1000 && windowWidth < 1390) {
        setStep(2)
        setStepWidth(390)
        if (carIndex > collection.length - 2) {
          setCarIndex(collection.length - 2)
        }
      } else if (windowWidth >= 1390 && windowWidth < 1780) {
        setStep(3)
        setStepWidth(390)
        if (carIndex > collection.length - 3) {
          setCarIndex(collection.length - 3)
        }
      } else if (windowWidth >= 1780) {
        setStep(4)
        setStepWidth(390)
        if (carIndex > collection.length - 4) {
          setCarIndex(collection.length - 4)
        }
      }
      //handleControls(prev, next)
    }
    window.addEventListener('resize', () => {
      const resizeTimer = setTimeout(handleResize(prev, next), 1000)
      clearTimeout(resizeTimer)
    })

    //hides controls if necessary unactivated ...
    function handleControls(prev, next) {
      if (carIndex === collection.length - step) {
        next.style.display = 'none'
      } else {
        next.style.display = 'flex'
      }
      if (carIndex === 0) {
        prev.style.display = 'none'
      } else {
        prev.style.display = 'flex'
      }
    }

    handleResize(prev, next)
    //handleControls(prev, next)

    projectsContainer.style.left = `-${carIndex * stepWidth}px`

    const handleCarouselClick = (value) => {
      projectsContainer.style.transition = `1s`

      let nextIndex = 0

      if (value < 0) {
        nextIndex = carIndex + value < 0 ? 0 : carIndex + value
      } else if (value > 0) {
        nextIndex =
          carIndex + value > collection.length - step
            ? collection.length - step
            : carIndex + value
      }
      projectsContainer.style.left = `-${nextIndex * 390}px`
      setCarIndex(nextIndex)
    }

    const handlePrevClick = () => handleCarouselClick(step * -1)
    const handleNextClick = () => handleCarouselClick(step)

    prev.addEventListener('click', handlePrevClick)
    next.addEventListener('click', handleNextClick)

    return () => {
      prev.removeEventListener('click', handlePrevClick)
      next.removeEventListener('click', handleNextClick)
    }
  }, [carIndex, collection.length, step, stepWidth])

  useEffect(() => {
    setYearsForImages(
      collection.map((album) => new Date(album.date).getFullYear())
    )
  }, [collection])

  return (
    <>
      <div className="carousel-container" ref={carouselContainer}>
        <div className="carousel-prev">
          <span className="carousel-controls">&lsaquo;</span>
        </div>
        <div className="projects-container">
          {collection ? (
            collection.map((album, index) => {
              const currentYear = new Date(album.date).getFullYear()
              // Checking array for matching year and previous year
              // Indexes created width the same collection
              const yearMarker =
                yearsForImages.length > 0 &&
                (index === 0 ||
                  (index > 0 && currentYear !== yearsForImages[index - 1])) ? (
                  <>
                    <div className="angle"></div>
                    <div key={`year-marker-${index}`} className="year-marker">
                      {currentYear}
                    </div>
                  </>
                ) : (
                  ''
                )
              return (
                <div
                  className={`project-card project-card-${index}`}
                  data-albumid={album.id}
                  data-album-date={album.date}
                  data-album-year={album.date}
                  key={`album-${index}`}
                  data-img-url={album.img_url}
                >
                  {yearMarker}
                  <CarouselImg
                    album={album}
                    featured={album.featured_media}
                    albumIndex={index}
                  />
                </div>
              )
            })
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className="carousel-next">
          <span className="carousel-controls">&rsaquo;</span>
        </div>
      </div>
      <div className="projects-portal"></div>
    </>
  )
}