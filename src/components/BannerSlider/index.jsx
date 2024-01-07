'use client'
import Image from 'next/image'
import './bannerslider.css'
import { useEffect, useRef, useState, useMemo } from 'react'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function BannerSlider() {
  const [index, setIndex] = useState(0)
  const [dbChange, setDbChange] = useState(false)
  //const { banners } = props
  const db = useRef(null)
  const timer1Ref = useRef(null)
  const timer2Ref = useRef(null)
  const timer3Ref = useRef(null)

  //default banners loading
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const { data, error } = useSWR(`${apiUrl}/wp-json/wp/v2/banner/133`, fetcher)

  const banners = useMemo(() => {
    if (data) {
      return Object.values(data.acf_data)
    }
    return []
  }, [data])

  useEffect(() => {
    if (Object.values(banners).length > 0) {
      // handling first image display and fade-in
      const displayedBanner = document.querySelector('.banners-wrapper .banner')
      if (displayedBanner) {
        displayedBanner.classList.add('banner-display')
        setTimeout(() => {
          displayedBanner.classList.add('banner-show')
          displayedBanner.parentNode.classList.add('display')
        }, 500)
      }
    }
  }, [banners])

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      const displayedBanners = document.querySelectorAll(
        '.banners-wrapper .banner'
      )

      setIndex(0)
      setDbChange(true)
    })
    const config = { childList: true, subtree: true }
    if (banners.length > 0) {
      observer.observe(db.current, config)
    }

    return () => {
      observer.disconnect()
    }
  }, [banners])

  useEffect(() => {
    const displayedBanners = document.querySelectorAll(
      '.banners-wrapper .banner'
    )

    function animate() {
      const displayedBanners = document.querySelectorAll(
        '.banners-wrapper .banner'
      )
      const displayedContainers = document.querySelectorAll(
        '.banners-wrapper .img-container'
      )

      if (
        banners.length > 1 &&
        displayedBanners.length > 1 &&
        displayedContainers.length > 1
      ) {
        const nextIndex = index === displayedBanners.length - 1 ? 0 : index + 1
        const currentIndex = index
        timer1Ref.current = setTimeout(() => {
          displayedContainers[nextIndex].classList.add('display')
          displayedBanners[nextIndex].classList.add('banner-display')

          timer2Ref.current = setTimeout(() => {
            displayedBanners[nextIndex].classList.add('banner-show')

            displayedBanners[currentIndex].classList.remove('banner-show')
          }, 500)

          timer3Ref.current = setTimeout(() => {
            displayedContainers[currentIndex].classList.remove('display')
            displayedBanners[currentIndex].classList.remove('banner-display')
            setIndex(nextIndex)
            setDbChange(false)
          }, 5000)
        }, 7000)
      }
    }
    if (displayedBanners.length > 1) {
      animate()
    }

    return () => {
      // Clearing timers
      clearTimeout(timer1Ref.current)
      clearTimeout(timer2Ref.current)
      clearTimeout(timer3Ref.current)
    }
  }, [index, dbChange, banners])

  //default banner error handling
  if (error)
    return (
      <>
        {' '}
        <div className="banner-wrapper">Network error</div>{' '}
      </>
    )
  if (!data) return <></>

  return (
    <>
      <div className="default-banners" style={{ display: 'none' }}>
        {banners
          ? Object.entries(banners).map(([key, banner]) => {
              return banner ? (
                <div className="img-container" key={`default-${key}`}>
                  <Image
                    className={`banner`}
                    src={banner.url}
                    width={banner.width}
                    height={banner.height}
                    alt={`Banner ${key}`}
                    loading="eager"
                    priority
                  />
                </div>
              ) : (
                ''
              )
            })
          : ''}
      </div>

      <div className="banners-wrapper" ref={db}>
        {banners
          ? Object.entries(banners).map(([key, banner]) => {
              return banner ? (
                <div className="img-container" key={`default-${key}`}>
                  <Image
                    className={`banner`}
                    src={banner.url}
                    width={banner.width}
                    height={banner.height}
                    alt={`Banner ${key}`}
                    loading="eager"
                    priority
                  />
                </div>
              ) : (
                ''
              )
            })
          : ''}
      </div>
    </>
  )
}
/* Testing tools
      <div>
        <p style={{ color: 'red' }}>.</p>
        <p style={{ color: 'red' }}>.</p>
        <p style={{ color: 'red' }}>Index : {index}</p>
        <p style={{ color: 'red' }}>dbChange : {dbChange}</p>
      </div>

*/
