'use client'

import Image from 'next/image'
import './socials.css'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Socials() {
  //Socials datas loading
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const { data, error } = useSWR(`${apiUrl}/wp-json/wp/v2/socials/458`, fetcher)
  if (error)
    return (
      <>
        {' '}
        <ul className="social-container">
          <li>Network Error</li>
        </ul>
      </>
    )
  if (!data) return <></>
  let iconsAndLinks = {}
  if (data && data.acf_data) {
    iconsAndLinks = Object.entries(data.acf_data)
      .filter(
        ([key, value]) => key.startsWith('social_icon_') && value !== false
      )
      .reduce((result, [key, value]) => {
        const linkKey = key.replace('social_icon_', 'social_link_')
        const linkValue = data.acf_data[linkKey]

        result.push({
          img: value,
          link: linkValue,
        })

        return result
      }, [])
  }

  return (
    <ul className="social-container">
      {iconsAndLinks
        ? Object.values(iconsAndLinks).map((linkedIcon, index) => (
            <li key={`social_link_${index}`} className="linked-icon">
              <a href={linkedIcon.link} target="_blank">
                <Image
                  src={linkedIcon.img}
                  alt={`social_link_${index}`}
                  width={24}
                  height={24}
                />
              </a>
            </li>
          ))
        : ''}
    </ul>
  )
}
