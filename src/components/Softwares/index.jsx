import Image from 'next/image'
import './softwares.css'

export default function Softwares({ softwares }) {
  return (
    <div className="software-container">
      <p>Some of the software that I use :</p>
      <div className="soft-wrapper">
        {softwares
          ? Object.values(softwares).map((soft, index) => {
              if (index < 3) {
                return (
                  <div
                    className="soft-image-container1"
                    key={`software-${index}`}
                  >
                    <Image
                      src={soft}
                      width={90}
                      height={128}
                      alt={`software-${index}`}
                    />
                  </div>
                )
              } else {
                return (
                  <div
                    className="soft-image-container2"
                    key={`software-${index}`}
                  >
                    <Image
                      src={soft}
                      width={130}
                      height={23}
                      alt={`software-${index}`}
                    />
                  </div>
                )
              }
            })
          : ''}
      </div>
    </div>
  )
}
